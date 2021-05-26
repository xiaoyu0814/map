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
 * VideoLayer是视频图层

 * 
 * @class VideoLayer
 * @extends Layer
 * @param {Object} options </br>
 * [url] — 图片图层数据的来源地址url。</br>
 * [id] — 图层的唯一id。</br>
 * [opacity] — 图层的透明度，不透明默认为1。</br>
 * [region]	— 图片图层的范围，默认范围[-180,-90,180,90]
 * @constructor
 */
var videoLayer =1;
function VideoLayer(options) {
    Layer.call(this);
    options = options || {};
    this.type = "VideoLayer";
    this.url = options.url !== undefined ? options.url : "";
    this.id = options.id !== undefined ?options.id : "videoLayer"+videoLayer++;
    this.opacity = options.opacity !== undefined ? options.opacity : 1;
	this.region = options.region !== undefined ? options.region : [-180,-90,180,90];
    if(this.url != ""){
        this.initLayer()
    }
    else{
        this.source = false;
    }

}
VideoLayer.prototype =Object.assign(Object.create(Layer.prototype),{
    /**
     */
    initLayer:function () {

    },
    innerLayer:function(type){
        console.log(type);
        console.log(this);
        if(type==1){
            var layer = {
                "id": this.id,
                "type": "raster",
                "source":{
                    
                    "type": "video",
                    "urls": [this.url],
                    "coordinates": this.region
                }

            }
            return layer;
        }
    }
});

export {VideoLayer}