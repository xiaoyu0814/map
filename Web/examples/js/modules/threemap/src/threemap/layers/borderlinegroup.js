//
import * as Three from 'three-full';

//import {MeshLineMaterial,MeshLine} from '../../scene/materials/meshLineMaterial.js';
//import {MeshLine3D,MeshLine3DMaterial} from '../../scene/materials/line3dMaterial';
import {MeshLine3D} from '../objects/line3d/meshline3d.js';
import {MeshLine3DMaterial} from '../objects/line3d/meshline3dmaterial.js';

function BorderlineGroup(options, threemap){
    if(typeof options !== 'object'){
        return null;
    }
    //继承Three.Group属性
    Three.Group.call(this);

    this.layerName = '边界发光图层';
    this.state = 0;
    this.origin = [116.39078972717584, 39.91545554293933];
    this.minZoom = -1;
    this.maxZoom = 25;
    var instance = this;
    // var url = options.url;

    this.threemap = threemap;
    this.materials = [];
    this.uniMaterial = null;
    this._color = options.color ||  new Three.Color( 0x2e66ff );
    this._blending = options.blending ||  Three.AdditiveBlending;
    this._lineWidth = options.lineWidth || 5;

    /* 默认效果参数
    color.b: 255(ff)
    color.g: 102(66)
    color.r: 46(2e)
    radius: 0.24
    lineWidth: 5
    strength: 3
    threshold: 0
    */

    Object.defineProperties(this,{
        color:{
            get:function () {
                return this._color;
            },
            set:function (value) {
                this._color = value;
                for(var i=0;i<this.materials.length;i++){
                    var m = this.materials[i];
                    m.uniforms.color.value = value;
                }
                if(this.uniMaterial){
                    this.uniMaterial.uniforms.color.value = value;
                }
            }
        },
        blending:{},
        lineWidth:{
            get:function () {
                return this._lineWidth;
            },
            set:function (value) {
                this._lineWidth = value;
                for(var i=0;i<this.materials.length;i++){
                    var m = this.materials[i];
                    m.uniforms.lineWidth.value = value;
                }
                if(this.uniMaterial){
                    this.uniMaterial.uniforms.lineWidth.value = value;
                }

            }
        }
    })

}

BorderlineGroup.prototype = Object.assign(Object.create(Three.Group.prototype),{
    constructor:BorderlineGroup,
    isBorderLineGroup:true,

    setData(geoJsonData)   {

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

        for(var i=0;i<coordArray.length;i++){
            var coords = coordArray[i];
            this.createDynamicMeshLine(coords,threemap);
        }

    },

    setZoomRange:function(minZoom,maxZoom){
        this.minZoom = minZoom;
        this.maxZoom = maxZoom;
    },

    update:function(){
        var curZoom = this.threemap.map.transform.zoom;
        if(curZoom > this.maxZoom || curZoom<this.minZoom){

            this.visible = false;
        }
        else{
            this.visible = true;
        }
    },
    remove:function (view) {

    },
    createDynamicMeshLine:function(coords,threemap){
        var instance = this;
        var origin = this.origin;
        var resolution = new Three.Vector2( window.innerWidth, window.innerHeight );

        if(this.uniMaterial === null){
            var lineMaterial =   new MeshLine3DMaterial({
                dimension: 3,
                color: instance._color,
                opacity: 1.0,
                resolution: resolution,
                sizeAttenuation: false,
                lineWidth: instance._lineWidth,
                near: threemap.camera.near,
                far: threemap.camera.far,
                depthTest: false,
                depthWrite: false,
                transparent: true,
                blending: instance._blending,
            });

            this.uniMaterial = lineMaterial;

        }

        var center = threemap.projectToWorld([origin[0], origin[1], 0]);
        var geometry = new Three.Geometry();
        var times = [];

        for (var i = 0; i < coords.length; i++) {
            var position = threemap.projectToWorld([coords[i][0], coords[i][1], 0]);
            geometry.vertices.push(new Three.Vector3(position.x-center.x, position.y-center.y, 0.01));
            times.push(0);
        }
        var meshLine = new MeshLine3D();
        meshLine.setGeometry(geometry,times);
        //var lineMesh = new Three.LineSegments(meshLine.geometry, lineMaterial);
        var lineMesh = new Three.Mesh(meshLine.geometry, this.uniMaterial);
        lineMesh.frustumCulled = false;
        //this.materials.push(lineMaterial);

        var preGroup = threemap.createGeoGroup(origin, {preScale: 1, scaleToLatitude: false});
        preGroup.add(lineMesh);
        this.add(preGroup);
        //threemap.addSceneBack(lineMesh, origin, {preScale: 1, scaleToLatitude: false});
    }
});

export {BorderlineGroup}
