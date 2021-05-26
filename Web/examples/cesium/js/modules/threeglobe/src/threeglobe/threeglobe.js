
function ThreeGlobe(viewer, threeContainer){
    this.viewer = viewer;
    this.context = this.viewer.scene.context;
    this.gl = this.context.gl;

    this.threeContainer = document.getElementById(threeContainer);
    if (this.threeContainer != null) {
        this.renderer = new Three.WebGLRenderer({ alpha: true });
        this.threeContainer.appendChild(this.renderer.domElement);

        var _this = this;
        function postRenderHandler () {
            _this.postRender();
        }
        this.viewer.scene.postRender.addEventListener(postRenderHandler);
    } else {
        var _this = this;
        function backgroundRenderHandler (scene, context, passState, frustum) {
            _this.backgroundRender(scene, context, passState, frustum);
        }
        function globeRenderHandler (scene, context, passState, frustum) {
            _this.globeRender(scene, context, passState, frustum);
        }
        function opacityRenderHandler (scene, context, passState, frustum) {
            _this.opacityRender(scene, context, passState, frustum);
        }
        function transparentRenderHandler (scene, context, passState, frustum) {
            _this.transparentRender(scene, context, passState, frustum);
        }
        this.viewer.scene.backgroundRender.addEventListener(backgroundRenderHandler);
        this.viewer.scene.globeRender.addEventListener(globeRenderHandler);
        this.viewer.scene.opacityRender.addEventListener(opacityRenderHandler);
        this.viewer.scene.transparentRender.addEventListener(transparentRenderHandler);

        this.renderer = new Three.WebGLRenderer({
            alpha: true,
            antialias: true,
            canvas: this.context.canvas,
            context: this.gl
        });
        this.renderer.state.reset();
        this.renderer.autoClear = false;
    }

    this.camera = new Three.PerspectiveCamera(45, 1, 1, 5000000000);
    this.scene = new Three.Scene();
    this.group = new Three.Group();
    this.scene.add(this.group);
}

ThreeGlobe.prototype = {

    addObject: function(obj, lnglat, options) {
        var group = this.createGeoGroup(lnglat, options);
        if (group != null) {
            group.add(obj);
            this.group.add(group);
        }
        return obj;
    },

    removeObject: function(obj) {
        if (obj != null) {
            var parent = obj.parent;
            if (parent != null) {
                this.group.remove(parent);
            }
        }
    },

    backgroundRender: function(scene, context, passState, frustum) {

    },

    globeRender: function(scene, context, passState, frustum) {
        var width = this.context.drawingBufferWidth;
        var height = this.context.drawingBufferHeight;

        var aspect = width / height;
        this.camera.aspect = aspect;
        this.camera.near = frustum.near;
        this.camera.far = frustum.far;
        this.camera.fov = Cesium.Math.toDegrees(frustum._fovy);
        this.camera.updateProjectionMatrix();

        // var aspect = width / height;
        // this.camera.aspect = aspect;
        // this.camera.far = this.viewer.camera.frustum.far;
        // this.camera.near = this.viewer.camera.frustum.near * 10000;
        // this.camera.fov = Cesium.Math.toDegrees(this.viewer.camera.frustum.fovy);
        // this.camera.updateProjectionMatrix();

        this.camera.matrixAutoUpdate = false;
        var civm = this.viewer.camera.inverseViewMatrix;
        this.camera.matrixWorld.set(
            civm[0], civm[4], civm[8], civm[12],
            civm[1], civm[5], civm[9], civm[13],
            civm[2], civm[6], civm[10], civm[14],
            civm[3], civm[7], civm[11], civm[15]
        );

        this.renderer.setSize(width, height);
        this.renderer.render(this.scene, this.camera, null, false);

        this.renderer.state.reset();
    },

    opacityRender: function(scene, context, passState, frustum) {

    },

    transparentRender: function(scene, context, passState, frustum) {

    },

    postRender: function() {
        var width = this.context.drawingBufferWidth;
        var height = this.context.drawingBufferHeight;

        var aspect = width / height;
        this.camera.aspect = aspect;
        this.camera.far = this.viewer.camera.frustum.far;
        this.camera.near = this.viewer.camera.frustum.near * 1000;
        this.camera.fov = Cesium.Math.toDegrees(this.viewer.camera.frustum.fovy);
        this.camera.updateProjectionMatrix();

        this.camera.matrixAutoUpdate = false;
        var civm = this.viewer.camera.inverseViewMatrix;
        this.camera.matrixWorld.set(
            civm[0], civm[4], civm[8], civm[12],
            civm[1], civm[5], civm[9], civm[13],
            civm[2], civm[6], civm[10], civm[14],
            civm[3], civm[7], civm[11], civm[15]
        );

        this.renderer.setSize(width, height);
        this.renderer.render(this.scene, this.camera);
    },

    createGeoGroup: function(lnglat, options) {
        var group = new Three.Group();
        if (lnglat != null) {
            this.moveToCoordinate(group, lnglat, options);
        }
        return group;
    },

    moveToCoordinate: function(obj, lnglat, options) {
        var position = Cesium.Cartesian3.fromDegrees(lnglat[0], lnglat[1]);
        obj.position.copy(position);

        /*
        var m = new Cesium.Matrix3();
        var m1 = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(lnglat[1]));
        var m2 = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(lnglat[0]));
        Cesium.Matrix3.multiply(m2, m1, m);
        var quat = new Cesium.Quaternion();
        Cesium.Quaternion.fromRotationMatrix(m, quat);
        obj.quaternion.copy(quat);
        */
        var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(position);
        var rotationMatrix = new Cesium.Matrix3();
        Cesium.Matrix4.getRotation(modelMatrix, rotationMatrix);
        var quat = new Cesium.Quaternion();
        Cesium.Quaternion.fromRotationMatrix(rotationMatrix, quat);
        obj.quaternion.copy(quat);
    },

};

export { ThreeGlobe };

