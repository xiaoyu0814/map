//动态路网图层（也可以设置为静态的）

import * as Three from 'three-full';
import {MeshLine3D} from './meshline3d.js';
import {MeshLine3DMaterial,MeshLine3DShader} from './meshline3dmaterial.js';

class StreamLine3DGroup extends Three.Group {

    constructor(options,threemap) {
        super();
        if (typeof options === 'undefined') {
            throw "路网图层options参数有误！！"
        }

        this.threemap = threemap;

        this.layername = "(静/动)路网图层";
        this.state = 0;
        this.meshLineMaterials = [];

        /*
        r: 249
        b: 1
        g: 147
        lineWidth: 12
        opacity: 1
        sizeAttenuation: 0
        sumTime: 1.8192209991532597
        sycleTime: "1"
        traceTime: 10
        sycleType: "1"
        invertType: "1"
         */

        //this._color = options.color || new Three.Color( "#f99301");   //橙黄色
        //this._color = options.color || new Three.Color( "#5d9301");  //偏绿色
        this._color = options.color || new Three.Color("#2e2cb6");  //偏蓝色
        this._opacity = options.opacity || 1;
        this._sizeAttenuation = options.sizeAttenuation || 0;
        this._lineWidth = options.lineWidth || 12;
        this._sycleTime = options.sycleTime || 1819;
        this._traceTime = options.traceTime || 181.9; //sumTime / 10;
        this._dynamic = options.dynamic===undefined ?  true : options.dynamic;
        this.currentT = 0;
    }

    //定义属性 color等
    get color() {
        return this._color;
    }

    set color(value) {
        this._color = value;
        for (var i = 0; i < this.meshLineMaterials.length; i++) {
            var m = this.meshLineMaterials[i];
            m.uniforms.color.value = value;
        }
    }

    get opacity() {
        return this._opacity;
    }

    set opacity(value) {
        this._opacity = value;
        for (var i = 0; i < this.meshLineMaterials.length; i++) {
            var m = this.meshLineMaterials[i];
            m.uniforms.opacity.value = value;
        }
    }

    get sizeAttenuation() {
        return this._sizeAttenuation;
    }

    set sizeAttenuation(value) {
        this._sizeAttenuation = value;
        for (var i = 0; i < this.meshLineMaterials.length; i++) {
            var m = this.meshLineMaterials[i];
            m.uniforms.sizeAttenuation.value = value;
        }
    }

    get lineWidth() {
        return this._lineWidth;
    }

    set lineWidth(value) {
        this._lineWidth = value;
        for (var i = 0; i < this.meshLineMaterials.length; i++) {
            var m = this.meshLineMaterials[i];
            m.uniforms.lineWidth.value = value;
        }
    }

    get sycleTime() {
        return this._sycleTime;
    }

    set sycleTime(value) {
        this._sycleTime = value;
    }

    get dynamic() {
        return this._dynamic;
    }
    set dynamic(value) {
        this._dynamic = value;
    }

    get traceTime() {
        return this._traceTime;
    }

    set traceTime(value) {
        this._traceTime = value;
        for (var i = 0; i < this.meshLineMaterials.length; i++) {
            var m = this.meshLineMaterials[i];
            m.uniforms.traceTime.value = value;
        }
    }


    update() {
        this.currentT += this._sycleTime;
        for (var i = 0; i < this.meshLineMaterials.length; i++) {
            var currentTimeUniform = this.meshLineMaterials[i].uniforms.currentTime;
            if (currentTimeUniform != null) {
                currentTimeUniform.value = this.currentT;
            }
        }
    }

    remove() {

    }
    setData(geoJsonData){

        var threemap = this.threemap;
        var coordArray = [];
        var features = geoJsonData.features;
        for(var i=0,len=features.length;i<len;i++){
            var geometry = features[i].geometry;
            if( geometry.type === 'MultiPolygon' || geometry.type === 'MultiLineString')    {
                var rings = geometry.coordinates;
                for(var j=0;j<rings.length;j++){
                    var ring = rings[j];
                    if(ring.length > 0){
                        var coords = ring[0];
                        coordArray.push(coords);
                    }
                }
            }
            else if(geometry.type === 'Polygon' ){
                var ring = geometry.coordinates;
                if(ring.length > 0){
                    var coords = ring[0];
                    coordArray.push(coords);
                }
            }
            else if(geometry.type === 'LineString' ){
                var ring = geometry.coordinates;
                if(ring.length > 0){
                    var coords = ring;
                    coordArray.push(coords);
                }
            }
        }

        if(coordArray.length>0){
            this.origin = coordArray[0][0];
        }

        for(var i=0;i<coordArray.length;i++){
            var coords = coordArray[i];
            this.createStreamLines(coords,threemap);
        }
    }


    createStreamLines(coords)
    {
        var origin = this.origin;
        var threemap = this.threemap;
        var points = [];
        var center = threemap.projectToWorld([origin[0], origin[1], 0]);
        for (var i = 0; i < coords.length; i++) {
            var position = threemap.projectToWorld([coords[i][0], coords[i][1], 0]);
            points.push(new Three.Vector3(position.x-center.x, position.y-center.y, 0));
        }

        var times = [];
        var sumTime = 0;
        var pointSize = points.length;
        for (var i = 0; i < pointSize; i++) {
            if (i == 0) {
                times.push(0);
            } else {
                var x = points[i].x - points[i-1].x;
                var y = points[i].y - points[i-1].y;
                var subLength = Math.sqrt(x * x + y * y);
                sumTime += subLength * 500;

                times.push(sumTime);
            }
        }

        var geometry = new Three.Geometry();
        for( var i = 0; i < points.length; i ++ ) {
            geometry.vertices.push( points[i] );
        }

        var meshLine = new MeshLine3D();
        meshLine.setGeometry( geometry, times );

        var resolution = new Three.Vector2( window.innerWidth, window.innerHeight );
        var fragmentShader;
        if(this._dynamic !== true){
            fragmentShader = MeshLine3DShader.solidFragmentShader;
        }
        else {
            fragmentShader = undefined;
        }
        var meshLineMaterial = new MeshLine3DMaterial( {
            vertexShader: MeshLine3DShader.vertexShader,
            fragmentShader:fragmentShader ,
            dimension: 2,
            lineWidth: this._lineWidth,
            color: this.color,
            opacity: this.opacity,
            transparent: true,
            resolution: resolution,
            sizeAttenuation: false,
            near: threemap.camera.near,
            far: threemap.camera.far,
            sycleTime: sumTime+200,
            traceTime: this._traceTime,
            currentTime: 0.0,
            depthTest: false,
            depthWrite: false,
        });

        this.meshLineMaterials.push(meshLineMaterial);
        var mesh = new Three.Mesh( meshLine.geometry, meshLineMaterial );
        mesh.frustumCulled = false;

        var preGroup = threemap.createGeoGroup(origin, {preScale: 1, scaleToLatitude: false});
        preGroup.add(mesh);
        this.add(preGroup);

    }


}

export {StreamLine3DGroup};
