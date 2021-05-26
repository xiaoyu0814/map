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
 * WMSLayer是图片图层
 * <a href="../../examples/Cloud_mapLayer.html">Cloud_mapLayer.html:36</a>
 * 
 * @class WMSLayer
 * @extends Layer
 * @param {Object} options </br>
 * [url] — 图片图层数据的来源地址url。</br>
 * [id] — 图层的唯一id。</br>
 * [opacity] — 图层的透明度，不透明默认为1。</br>
 * [region]	— 图片图层的范围，默认范围[-180,-90,180,90]
 * @constructor
 */
var wmsLayer =1;
function WMSLayer(options) {
    Layer.call(this);
    options = options || {};
    this.type = "WMSLayer";
    this.url = options.url !== undefined ? options.url : "";
    this.id = options.id !== undefined ?options.id : "wmsLayer"+wmsLayer++;
    this.layers = options.layers !== undefined ? options.layers : "";
    this.style  = options.style  !== undefined ? options.style  : "defalut";
    this.opacity = options.opacity !== undefined ? options.opacity : 1;
    this.version = options.version !== undefined ? options.version : "1.0.0";
    this.projection = options.projection !== undefined ? options.projection : "EPSG:4326";
	this.transparent = options.transparent !== undefined ? options.transparent : true;
    this.format = options.format !== undefined ? options.format : "image/png";
    this.tileWidth = options.tileWidth !== undefined ? options.tileWidth : 256;
    this.tileHeight = options.tileHeight !== undefined ? options.tileHeight : 256;
    this.bounds = options.bounds !== undefined ? options.bounds : [ -20037508.3427892,-20037508.3427892,20037508.3427892, 20037508.3427892];
    this.cesOptions = Object.assign({},options);
   

}
WMSLayer.prototype =Object.assign(Object.create(Layer.prototype),{
    innerSource:function(type){
        if(type ==1){

            var epsg = this.projection.substr(5);
            var _url = this.url + "?SERVICE=WMS&VERSION="+this.version+"&REQUEST=GetMap&bbox={bbox-epsg-"+epsg+"}&styles="+this.style+"&layers="+this.layers+"&width="+this.tileWidth+"&height="+this.tileHeight+"&format="+this.format+"&transparent="+this.transparent+"&f=image&srs=EPSG:"+epsg+"&imageSR="+epsg;
        
            this.mapSource ={
                id:this.id,
                source:{
                    "type":"raster",
                    "tiles": [_url],
                    "bounds":this.bounds,
                    "tileSize":this.tileWidth
                }
            };
            return this.mapSource;

        }else if(type==2){
            this.olSource = new PIE.ol.source.ImageWMS({
                url: this.url,
                params: {'LAYERS': this.layers},
                ratio: 1,
                //serverType: 'geoserver'
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
                'paint':{"raster-opacity":this.opacity}
            };
            return this.layer;
        }else if(type ==2){
            this.olLayer =   new PIE.ol.layer.Image({
                //extent: [-13884991, 2870341, -7455066, 6338219],
                source: this.olSource
            })
            this.olLayer.id = this.id;
            return this.olLayer;
        }else if(type == 3){
            this.cesLayer = new Cesium.WebMapServiceImageryProvider(this.cesOptions);
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
            var _layer =  map.imageryLayers.addImageryProvider(this.cesLayer);
            _layer.id = this.id;
           return _layer;
        }
    }
});

export {WMSLayer}