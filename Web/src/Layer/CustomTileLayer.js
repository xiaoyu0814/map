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
 * CustomTileLayer 自定义切片图层。
 * 
 * @class CustomTileLayer
 * @extends Layer
 * @param {Object} options </br>
 * [url] — 栅格图层数据的来源地址url。</br>
 * [tileSize] — 瓦片尺寸，如果没有设置，默认为256。</br>
 * [id] — 图层的唯一id。</br>
 * [opacity] — 图层的透明度，不透明默认为1。</br>
 * [region] - 栅格图层的范围，默认范围[-180,-90,180,90]
 * @constructor
 */
var customTileLayer =1;
function CustomTileLayer(options) {
   // Layer.call(this);
    options = options || {};
    this.type = "CustomTileLayer";
    this.url = options.url !== undefined ? options.url : "";
    this.tileSize = options.tileSize !== undefined ?options.tileSize : 256;
    this.id = options.id !== undefined ?options.id : "customTileLayer"+customTileLayer++;
    this.opacity = options.opacity !== undefined ? options.opacity : 1;
}
CustomTileLayer.prototype =Object.assign(Object.create(Layer.prototype),{
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
                "bounds":this.region,
                "tileSize":this.tileSize
            }
        };
        this.layer = {
            "id": this.id,
            "type": "raster",
            "source": this.id,
            'paint':{"raster-opacity":this.opacity}
        };
    }
});

export {CustomTileLayer}