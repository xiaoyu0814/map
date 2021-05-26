//import * as Three from "three-full";
import {LayerGroup } from './layers/layergroup.js';
import {MapComposer} from "./composer/map/mapcomposer";
import {TileCoordSys} from "./core/tilecoordsys";
import "./core/tilecoordsys";

const WORLD_SIZE = 512;

function CameraSync(map, camera, groupBack, group2D, group3D, threemap) {
    this.map = map;
    this.camera = camera;
    this.camera.matrixAutoUpdate = false;
    this.threemap = threemap;
    this.groupBack = groupBack;
    this.group2D = group2D;
    this.group3D = group3D;

    this.cameraMatrix = null;

    var _this = this;
    this.map.on('move', function() {
        _this.updateCamera();
    });
    this.updateCamera();
}

CameraSync.prototype = {

    makePerspectiveMatrix: function(fovy, aspect, near, far) {
        var out = new Three.Matrix4();
        var f = 1.0 / Math.tan(fovy / 2),
            nf = 1 / (near - far);

        var newMatrix = [
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (far + near) * nf, -1,
            0, 0, (2 * far * near) * nf, 0
        ];

        out.elements = newMatrix;
        return out;
    },

    updateCamera: function(ev) {
        // Build a projection matrix, paralleling the code found in Mapbox GL JS
        const fov = 0.6435011087932844;
        var cameraToCenterDistance = 0.5 / Math.tan(fov / 2) * this.map.transform.height;
        const halfFov = fov / 2;
        const groundAngle = Math.PI / 2 + this.map.transform._pitch;
        const topHalfSurfaceDistance = Math.sin(halfFov) * cameraToCenterDistance / Math.sin(Math.PI - groundAngle - halfFov);

        // Calculate z distance of the farthest fragment that should be rendered.
        const furthestDistance = Math.cos(Math.PI / 2 - this.map.transform._pitch) * topHalfSurfaceDistance + cameraToCenterDistance;

        // Add a bit extra to avoid precision problems when a fragment's distance is exactly `furthestDistance`
        const farZ = furthestDistance * 1.01;

        this.camera.near = 1;
        this.camera.far = farZ;
        this.camera.projectionMatrix = this.makePerspectiveMatrix(fov, this.map.transform.width / this.map.transform.height, 1, farZ);


        var cameraWorldMatrix = new Three.Matrix4();
        var cameraTranslateZ = new Three.Matrix4().makeTranslation(0,0,cameraToCenterDistance);
        var cameraRotateX = new Three.Matrix4().makeRotationX(this.map.transform._pitch);
        var cameraRotateZ = new Three.Matrix4().makeRotationZ(this.map.transform.angle);
        cameraWorldMatrix.premultiply(cameraTranslateZ).premultiply(cameraRotateX).premultiply(cameraRotateZ);

        this.camera.matrixWorld.copy(cameraWorldMatrix);


        var cameraMatrix = new Three.Matrix4();
        var modelScale = new Three.Matrix4;
        var modelTranslateCenter = new Three.Matrix4;
        var modelTranslateMap = new Three.Matrix4;
	    var modelRotateMap = new Three.Matrix4;
        //modelTranslateMap.makeTranslation(-this.map.transform.point.x, this.map.transform.point.y , 0);
        //modelScale.makeScale(this.map.transform.scale, this.map.transform.scale, this.map.transform.scale);
        //modelTranslateCenter.makeTranslation(WORLD_SIZE/2, -WORLD_SIZE/2, 0);
	    //modelRotateMap.makeRotationZ(Math.PI);
        var scale = Math.pow(2, this.map.transform.zoom);
        var worldSize = WORLD_SIZE * scale;
        var transformMapX = this.threemap.coordSys.mercatorXfromLng(this.map.transform.center.lng) * worldSize;
        var transformMapY = this.threemap.coordSys.mercatorYfromLat(this.map.transform.center.lat) * worldSize;
        modelTranslateMap.makeTranslation(-transformMapX, -transformMapY, 0);
        modelScale.makeScale(scale, scale, scale);
        cameraMatrix.premultiply(modelRotateMap).premultiply(modelTranslateCenter).premultiply(modelScale).premultiply(modelTranslateMap);
        this.cameraMatrix = cameraMatrix;
    }

};


function ThreeMap(map, glContext){
    this.init(map, glContext);

    var _this = this;
    map.on('resize', function() {
        if (_this != null) {
            _this.resize();
        }
    });
    map.on('preMapRender', function() {
        if (_this != null) {
            _this.preMapRender();
        }
    });
    map.on('postBackgroundRender', function() {
        if (_this != null) {
            _this.postBackgroundRender();
        }
    });
    map.on('post2DRender', function() {
        if (_this != null) {
            _this.post2DRender();
        }
    });
    map.on('post3DRender', function() {
        if (_this != null) {
            _this.post3DRender();
        }
    });

    map.on('postSymbolRender', function() {
        if (_this != null) {
            _this.postSymbolRender();
        }
    });

    map.on('postMapRender', function() {
        if (_this != null) {
            _this.postMapRender();
        }
    });
}

ThreeMap.prototype = {

    init: function (map, glContext){
        this.map = map;

        this.renderer = new Three.WebGLRenderer( {
            alpha: true,
            antialias: true,
            canvas: map.getCanvas(),
            context: glContext
        } );

        this.renderer.state.reset();
        this.renderer.state.disable(glContext.CULL_FACE);
        //this.renderer.toneMappingExposure = params.exposure;
        //this.renderer.toneMapping = THREE.ReinhardToneMapping;
        this.renderer.autoClear = false;

        this.depthTexture = new Three.DepthTexture();

        this.renderTargetBack = new Three.WebGLRenderTarget( this.map.painter.width, this.map.painter.height );
        this.renderTargetBack.texture.format = Three.RGBAFormat;
        this.renderTargetBack.texture.minFilter = Three.NearestFilter;
        this.renderTargetBack.texture.magFilter = Three.NearestFilter;
        this.renderTargetBack.texture.generateMipmaps = false;
        this.renderTargetBack.stencilBuffer = true;
        this.renderTargetBack.depthBuffer = true;
        this.renderTargetBack.depthTexture = this.depthTexture;
        this.renderTargetBack.depthTexture.format = Three.DepthStencilFormat;
        this.renderTargetBack.depthTexture.type = Three.UnsignedInt248Type;

        this.renderTargetFore = new Three.WebGLRenderTarget( this.map.painter.width, this.map.painter.height );
        this.renderTargetFore.texture.format = Three.RGBAFormat;
        this.renderTargetFore.texture.minFilter = Three.NearestFilter;
        this.renderTargetFore.texture.magFilter = Three.NearestFilter;
        this.renderTargetFore.texture.generateMipmaps = false;
        this.renderTargetFore.stencilBuffer = true;
        this.renderTargetFore.depthBuffer = true;
        this.renderTargetFore.depthTexture = this.depthTexture;
        this.renderTargetFore.depthTexture.format = Three.DepthStencilFormat;
        this.renderTargetFore.depthTexture.type = Three.UnsignedInt248Type;

        this.layerGroupBack = new LayerGroup(this);
        this.layerGroup2D = new LayerGroup(this);
        this.layerGroup3D = new LayerGroup(this);
        this.layerGroupSymbol = new LayerGroup(this);

        this.coordSys = new TileCoordSys();
        console.log();
        this.coordSys.setEPSG(this.map.getEPSG());
        this.coordSys.setTileBounds(this.map.getTileBounds());

        this.camera = new Three.PerspectiveCamera( 45, this.map.painter.width / this.map.painter.height, 0.000001, 5000000000);
        this.cameraSynchronizer = new CameraSync(this.map, this.camera, this.layerGroupBack, this.layerGroup2D, this.layerGroup3D, this);

        this.composer = new MapComposer(this);
    },

    resize: function() {
        this.renderer.setSize(this.map.painter.width, this.map.painter.height);

        if (this.renderTargetBack != null) {
            this.renderTargetBack.setSize(this.map.painter.width, this.map.painter.height);
        }
        if (this.renderTargetFore != null) {
            this.renderTargetFore.setSize(this.map.painter.width, this.map.painter.height);
        }
        if (this.camera != null) {
            this.camera.aspect = this.map.painter.width / this.map.painter.height;
            this.camera.updateProjectionMatrix();
        }

        this.cameraSynchronizer.updateCamera();
    },

    resetRender: function() {
        this.renderer.state.reset();

        var gl = this.map.painter.context.gl;
        gl.disable(gl.CULL_FACE);
        gl.disable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        gl.disable(gl.STENCIL_TEST);
    },

    preMapRender: function() {
        this.renderer.setRenderTarget(this.renderTargetFore);
        this.renderer.clear(true, true, true);

        var renderTarget = this.renderer.properties.get(this.renderTargetFore);
        if (renderTarget != null) {
            var framebuffer = renderTarget.__webglFramebuffer;
            if (framebuffer != null) {
                this.map.painter.context.framebuffer = framebuffer;
            }
        }

        var gl = this.map.painter.context.gl;
        gl.depthMask(true);
        gl.enable(gl.DEPTH_TEST);
        this.renderer.clearDepth();

        this.resetRender();
    },

    postBackgroundRender: function() {
        var gl = this.map.painter.context.gl;
        gl.colorMask(true, true, true, true);
        gl.disable(gl.STENCIL_TEST);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        this.renderer.state.reset();

        this.layerGroupBack.notify();
        this.layerGroupBack.update();

        this.renderer.setRenderTarget(this.renderTargetFore);
        this.resetRender();
    },

    post2DRender: function() {
        var gl = this.map.painter.context.gl;
        gl.colorMask(true, true, true, true);
        gl.disable(gl.STENCIL_TEST);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        this.renderer.state.reset();

        this.layerGroup2D.notify();
        this.layerGroup2D.update();

        this.renderer.setRenderTarget(this.renderTargetFore);
        this.resetRender();
    },

    post3DRender: function() {
        var gl = this.map.painter.context.gl;
        gl.colorMask(true, true, true, true);
        gl.disable(gl.STENCIL_TEST);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        this.renderer.state.reset();

        this.layerGroup3D.notify();
        this.layerGroup3D.update();

        this.renderer.setRenderTarget(this.renderTargetFore);
        this.resetRender();
    },
    postSymbolRender: function() {
        var gl = this.map.painter.context.gl;
        gl.colorMask(true, true, true, true);
        gl.disable(gl.STENCIL_TEST);
        //gl.enable(gl.BLEND);
        gl.disable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        gl.disable(gl.DEPTH_TEST);
        this.renderer.state.reset();

        this.layerGroupSymbol.notify();
        this.layerGroupSymbol.update();

        this.renderer.setRenderTarget(this.renderTargetFore);
        this.resetRender();
    },

    postMapRender: function() {
        var gl = this.map.painter.context.gl;
        gl.colorMask(true, true, true, true);
        gl.depthMask(true);
        gl.enable(gl.DEPTH_TEST);
        this.renderer.state.reset();

        this.composer.setSize(this.map.painter.width, this.map.painter.height);
        this.composer.render();

        this.renderer.setRenderTarget(null);
        this.resetRender();
    },

    projectToWorld: function (coords){

        // Spherical mercator forward projection, re-scaling to WORLD_SIZE
        var projected = [
            this.coordSys.mercatorXfromLng(coords[0]) * WORLD_SIZE,
            this.coordSys.mercatorYfromLat(coords[1]) * WORLD_SIZE
        ];

        var pixelsPerMeter = this.coordSys.projectedUnitsPerMeter(coords[1]);

        //z dimension
        var height = coords[2] || 0;
        projected.push( height * pixelsPerMeter );

        var result = new Three.Vector3(projected[0], projected[1], projected[2]);

        return result;
    },

    unprojectFromWorld: function (pixel) {

        var unprojected = [
            this.coordSys.lngFromMercatorX(pixel.x / WORLD_SIZE),
            this.coordSys.latFromMercatorY(pixel.y / WORLD_SIZE)
        ];

        var pixelsPerMeter = this.coordSys.projectedUnitsPerMeter(unprojected[1]);

        //z dimension
        var height = pixel.z || 0;
        unprojected.push( height / pixelsPerMeter );

        return unprojected;
    },

    moveToCoordinate: function(obj, lnglat, options) {
        if (options === undefined)
            options = {};
        if (options.preScale === undefined)
            options.preScale = 1.0;
        if (options.scaleToLatitude === undefined)
            options.scaleToLatitude = true;

        if (typeof options.preScale === 'number')
            options.preScale = new Three.Vector3(options.preScale, options.preScale, options.preScale);
        else if(options.preScale.constructor === Array && options.preScale.length === 3)
            options.preScale = new Three.Vector3(options.preScale[0], options.preScale[1], options.preScale[2]);
        else if(options.preScale.constructor !== Three.Vector3) {
            options.preScale = new Three.Vector3(1, 1, 1);
        }
        var scale = options.preScale;

        // if(options.scaleToLatitude) {
        //     var pixelsPerMeter = this.coordSys.projectedUnitsPerMeter(lnglat[1]);
        //     scale.multiplyScalar(pixelsPerMeter);
        // }
        obj.scale.set(1,1,1);
        obj.position.copy(this.projectToWorld(lnglat));
    },

    worldSizePerMeter: function(size) {
        return this.coordSys.worldSizePerMeter(size);
    },

    createGeoGroup: function(lnglat, options) {
        var group = new Three.Group();
        if (lnglat != null) {
            this.moveToCoordinate(group, lnglat, options);
        }
        return group;
    },

};

export { ThreeMap };

