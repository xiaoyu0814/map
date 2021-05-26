import {Layer} from './Layer';

/***
 *
 * @param options
 * @author yqq
 */
 /**
 * @module Layer
 */
/**
 * ImageLayer是图片图层
 * <a href="../../examples/Cloud_mapLayer.html">Cloud_mapLayer.html:36</a>
 * 
 * @class ImageLayer
 * @extends Layer
 * @param {Object} options </br>
 * [url] — 图片图层数据的来源地址url。</br>
 * [id] — 图层的唯一id。</br>
 * [opacity] — 图层的透明度，不透明默认为1。</br>
 * [region]	— 图片图层的范围，默认范围[-180,-90,180,90]
 * @constructor
 */
var imageLayer =1;
function ImageLayer(options) {
    Layer.call(this);
    options = options || {};
    this.type = "ImageLayer";
    this.url = options.url !== undefined ? options.url : "";
    this.id = options.id !== undefined ?options.id : "imageLayer"+imageLayer++;
    this.opacity = options.opacity !== undefined ? options.opacity : 1;
    this.projection = options.projection !== undefined ? options.projection : "EPSG:4326";
    this.region = options.region !== undefined ? options.region : [-180,-90,180,90];
    this.cesOptions = Object.assign({},options);
    if(this.region.constructor.name == "Array"){
        this.cesOptions.region = Cesium.Rectangle.fromDegrees(this.region[0], this.region[1], this.region[2],this.region[3]);
    } 
    if(this.url != ""){
        this.initLayer()
    }
    else{
        this.source = false;
    }

}
ImageLayer.prototype =Object.assign(Object.create(Layer.prototype),{
    /**
     */
    initLayer:function () {
       
    },
    innerSource:function(type){
        if(type ==1){ 
            this.mapSource ={
                id:this.id,
                source:{
                    "type": "image",
                    "url": this.url,
                    "isLngLat":true,
                    "coordinates": [[this.region[0],this.region[3]],[this.region[2],this.region[3]],[this.region[2],this.region[1]],[this.region[0],this.region[1]]]
                    // "coordinates": [_leftTop,_rightTop,_rightBottom,_leftBottom]
                },
            };
            return this.mapSource;
        }else if(type==2){
            this.olSource = new PIE.ol.source.TileArcGISRest({
                params:this.params,
                url: this.url
            })
            this.olSource.id = this.id;
            return this.olSource;
        }else if(type == 3){
            return
        }
    },
    innerLayer:function(type){
       
        //"http://211.154.196.253:6080/arcgis/rest/services/EDATA/lspop2013/ImageServer/exportImage/export?bbox=98.701171875%2C31.102294921874996%2C98.71215820312499%2C31.113281250000004&size=256%2C256&format=png&transparent=true&f=image&bboxSR=4326&imageSR=4326"
       
         if(type==1){ 
            this.layer = {
                "id": this.id,
                "source":this.id,
                "type": "raster",
                "paint": {
                    "raster-opacity": this.opacity
                },
                "layout": {}
            }
            return this.layer;
        }else if(type ==2){
            this.olLayer =   new PIE.ol.layer.Tile({
                //extent: [-13884991, 2870341, -7455066, 6338219],
                source: this.olSource
            })
            this.olLayer.id = this.id;
            return this.olLayer;
        }else if(type == 3){
            this.cesLayer = new Cesium.ArcGisMapServerImageryProvider(this.cesOptions);
            return this.cesLayer;
        }
    },
    onAdd:function(map,type){
        this._map = map;
        if(type == 1){
           
            map.addLayer(this.layer);
        }else if(type==2){
            return
        }else if(type ==3){
            let layer=map.imageryLayers.addImageryProvider(this.cesLayer);
			layer.id=this.id;
            return layer;
        }
    }
});

export {ImageLayer}