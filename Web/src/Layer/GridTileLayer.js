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
 * GridTileLayer栅格数据是将空间看做离散的像元，由二维数组或者其他数据组织方式来进行表达。
 * 
 * @class GridTileLayer
 * @extends Layer
 * @param {Object} options </br>
 * [url] — 栅格图层数据的来源地址url。</br>
 * [tileSize] — 瓦片尺寸，如果没有设置，默认为256。</br>
 * [id] — 图层的唯一id。</br>
 * [opacity] — 图层的透明度，不透明默认为1。</br>
 * [region] - 栅格图层的范围，默认范围[-180,-90,180,90]
 * @constructor
 */
var gridTileLayer =1;
function GridTileLayer(options) {
    Layer.call(this);
    options = options || {};
    this.type = "GridTileLayer";
    this.url = options.url !== undefined ? options.url : "";
    this.tileSize = options.tileSize !== undefined ?options.tileSize : 256;
    this.id = options.id !== undefined ?options.id : "gridTileLayer"+gridTileLayer++;
    this.opacity = options.opacity !== undefined ? options.opacity : 1;
    this.projection  = options.projection !== undefined ? options.projection : "EPSG:3857";
	this.region = options.region !== undefined ? options.region : [-180,-90,180,90];
    this.bounds = options.bounds !== undefined ? options.bounds : [ -20037508.3427892,-20037508.3427892,20037508.3427892, 20037508.3427892];
    this.minimumLevel = options.minimumLevel !== undefined ? options.minimumLevel :0;
    this.maximumLevel = options.maximumLevel !== undefined ? options.maximumLevel :22;
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
GridTileLayer.prototype =Object.assign(Object.create(Layer.prototype),{
    /**
     * initLayer
     * <p>初始化图层，根据传参option对数据进行重新赋值。</p>
     */
    initLayer:function () {
 
        this.source= {
            "id":this.id,
            "source":{
                "type":"raster",
                "tiles": [this.url],
                "bounds":this.bounds,
                "tileSize":this.tileSize
            }
        };
        this.layer = {
            "id": this.id,
            "type": "raster",
            "source": this.id,
            'paint':{"raster-opacity":this.opacity}
        };

    },
    innerSource:function(type){
        if(type ==1){
            
            this.mapSource ={
                id:this.id,
                source:{
                    "type":"raster",
                    "tiles": [this.url],
                    "bounds":this.bounds,
                    "tileSize":this.tileSize
                }
            };
            return this.mapSource;
        }else if(type==2){
            this.olSource = new PIE.ol.source.XYZ({
                url: this.url,
                projection:this.projection
            });
            this.olSource.id = this.id;
            return this.olSource;
        }else if(type == 3){
            return
        }
    },
    innerLayer:function(type){
         if(type==1){ 
            this.layer = {
                "id": this.id,
                "type": "raster",
                "source": this.id,
                'paint':{"raster-opacity":this.opacity}
            };
            return this.layer;
        }else if(type ==2){
            this.olLayer =   new PIE.ol.layer.Tile({
                //extent: [-13884991, 2870341, -7455066, 6338219],
                source: this.olSource
            })
            this.olLayer.id = this.id;
            return this.olLayer;
        }else if(type == 3){
            
            var hasAlphaChannel=true;
            // if(this.opacity==1){
            //     hasAlphaChannel=false;
            // }
            this.cesLayer = new Cesium.UrlTemplateImageryProvider(this.cesOptions);
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

export {GridTileLayer}