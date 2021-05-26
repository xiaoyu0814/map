import {Layer} from '../Layer/Layer';
/***
 *
 * @author yqq
 */

 /**
 * @module Layer
 */
/**
 * ThreeDTileLayer
 * 
 * @class ThreeDTileLayer
 * @extends Layer
 * @param {Object} options <br/>
 * [url] — 图层的URL，或者用于渲染图层的样式资源的URL。<br/>
 * [position] — x,y,z坐标位置。默认{x:0,y:0,z:0}
 * @constructor
 */
var tiles3DLayer = 0
function threeDTileLayer (options) {
    Layer.call(this);
    this.type = "threeDTileLayer";
    this.url = options.url !== undefined ? options.url : "";
    this.id = options.id !== undefined ? options.id : "3DTileLayer"+ tiles3DLayer++;
    this.visible = options.visible !== undefined ? options.visible : true;
    this.position = options.position !== undefined ? options.position : {x:0,y:0,z:0};
	this.rotation = options.rotation !== undefined ? options.rotation : {x:0,y:0,z:0};
};
threeDTileLayer.prototype = Object.assign( Object.create( Layer.prototype ), {
   
    innerSource:function(type){
        if(type == 1){

        }else if(type == 2){

        }else if(type == 3){

        }
    },
    innerLayer:function(type){
        if(type == 1){

        }else if(type == 2){

        }else if(type == 3){
            var translation = Cesium.Cartesian3.fromArray([this.position.x, this.position.y, this.position.z]);
            var _Matrix = Cesium.Matrix4.fromTranslation(translation);
            this._cesiumlayer = new Cesium.Cesium3DTileset({
                url: this.url,
                modelMatrix:_Matrix,
                show:this.visible,
            })
            return  this._cesiumlayer;
        }
    },
    onAdd:function(map,type){
        if(type == 1){

        }else if(type == 2){

        }else if(type == 3){
            this.entity = map.scene.primitives.add( this._cesiumlayer)
            map.zoomTo( this._cesiumlayer);
        }
        
    },
    onRemove:function(map,type){
        if(type == 1){

        }else if(type == 2){

        }else if(type == 3){
            map.entities.remove(this.entity)
			map.scene.primitives.remove(this.entity)
			this.entity = null;
        }
    },
    setHeight:function (height) {
        height = Number(height);
        var self = this;
        var cartographic = Cesium.Cartographic.fromCartesian(self.entity.boundingSphere.center);
        console.log(cartographic)
        var surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0);
        var offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, height);
        var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
        self.entity.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
        // map.map._cesiumViewer.zoomTo(self.entity);
    },
    /**
     * setPosition
     * <p>设置图层位置</p>
     * @method setPosition
     * @param {Number} position 坐标信息
     * @param {String} type 要设置的坐标轴，"x","y","z"
     */
    setPosition:function (position,type) {
        position = Number(position);
        var self = this;
        // var cartographic = Cesium.Cartographic.fromCartesian(self.entity.boundingSphere.center);
        // var surface
        // var offset
        switch (type) {
            case "x":
                self.position.x = position
                // surface = Cesium.Cartesian3.fromRadians(0.0, cartographic.latitude, cartographic.height);
                // offset = Cesium.Cartesian3.fromRadians(self.position.x, cartographic.latitude, cartographic.height);
                break;
            case "y":
                self.position.y = position
                // surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, 0.0, cartographic.height);
                // offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, self.position.y, cartographic.height);
                break;
            case "z":
                self.position.z = position
                // surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0);
                // offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, self.position.z);
                break;

            default:
                break;
        }
        // var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
        // self.entity.modelMatrix = Cesium.Matrix4.fromTranslation(translation);

        var translation = Cesium.Cartesian3.fromArray([this.position.x, this.position.y, this.position.z]);
        var m = Cesium.Matrix4.fromTranslation(translation);
        self.entity._modelMatrix = m;
        // map.map._cesiumViewer.zoomTo(self.entity);
    },
    setRotation:function (rotation) {
        rotation = Number(rotation);
        var self = this;
        var m = self.entity.modelMatrix;
        var m1 = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(rotation)); 
        var translation = Cesium.Matrix4.multiplyByMatrix3(m,m1,m);
        self.entity.modelMatrix = translation;
        // map.map._cesiumViewer.zoomTo(self.entity);
    }
});
export {threeDTileLayer}