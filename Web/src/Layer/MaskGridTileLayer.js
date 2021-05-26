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
var maskGridTileLayer =1;
function MaskGridTileLayer(options) {
    Layer.call(this);
    options = options || {};
    this.type = "MaskGridTileLayer";
    this.url = options.url !== undefined ? options.url : "";
    this.tileSize = options.tileSize !== undefined ?options.tileSize : 256;
    this.id = options.id !== undefined ?options.id : "maskGridTileLayer"+maskGridTileLayer++;
    this.opacity = options.opacity !== undefined ? options.opacity : 1;
    this.projection  = options.projection !== undefined ? options.projection : "EPSG:3857";
	this.region = options.region !== undefined ? options.region : [-180,-90,180,90];
    this.bounds = options.bounds !== undefined ? options.bounds : [ -20037508.3427892,-20037508.3427892,20037508.3427892, 20037508.3427892];
    this.mask =  options.mask !== undefined ? options.mask : false;
    this.maskData = options.maskData !== undefined ? options.maskData : false;
    if(this.url != ""){
        this.initLayer()
    }
    else{
        this.source = false;
    }

}
MaskGridTileLayer.prototype =Object.assign(Object.create(Layer.prototype),{
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
        if(this.mask){
            this.layer["mask-layer"] = this.id+"mask"
            this.maskSource ={
                id:this.id + "mask-source",
                source:{
                    'type': 'geojson',
                    'data': this.maskData
                }
            },
            this.maskLayer = {
                'id': this.id+"mask",
                'type': 'fill',
                'source': this.id + "mask-source",
                "mask": true,
                'layout': {},
                'paint': {
                    'fill-color': '#ff0000',
                    'fill-opacity': 0.9999
                }
            }
        }
    }
});

export {MaskGridTileLayer}