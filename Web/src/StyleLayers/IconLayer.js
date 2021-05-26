import {Layer} from '../Layer/Layer';
/***
 *
 * @author yqq
 */

 /**
 * @module Layer
 */
/**
 * IconLayer
 * <a href="../../examples/Layer_GeoJsonLayer.html">Layer_GeoJsonLayer.html:54</a>
 * 
 * @class IconLayer
 * @extends Layer
 * @param {Object} options <br/>
 * [url] — 图层的URL，或者用于渲染图层的样式资源的URL。<br/>
 * [id] — 图层的唯一id。<br/>
 * [data] — 图层的geojson数据。<br/>
 * [opacity] — 图层的透明度。<br/>
 * [visible] — 图层的显示隐藏。<br/>
 * [iconUrl] — 图层的的图标url。<br/>
 * [imageUrl] — 图层的图片url。<br/>
 * [rotate] — 图层的回转。<br/>
 * [imageName] — 图层的图片名称。<br/>
 * [offset] — 图层的位置。<br/>
 * [size] — 图层的大小。<br/>
 * [anchor] — 图层的居中。"center", "left", "right", "top", "bottom", "top-left", "top-right", "bottom-left", "bottom-right"。默认为 "center"<br/>
 * [overlap] — 图层的交叠。<br/>
 * @constructor
 */
var iconLayer = 1;
function IconLayer(options) {
    Layer.call(this);
    options = options || {};
    this.url = options.url !== undefined ? options.url : "";
    this.id = options.id !== undefined ? options.id : "iconLayer"+iconLayer++;
    this.data = options.data !== undefined ? options.data : "";
    this.opacity  = options.opacity !== undefined ? options.opacity : 1;
    this.visible = options.visible !== undefined ?options.visible : "visible";
    this.iconUrl =  options.iconUrl !== undefined ? options.iconUrl : "iconUrl";//WindSpeed
    this.imageUrl =  options.imageUrl !== undefined ? options.imageUrl : false;//WindSpeed
    this.rotate = options.rotate !==undefined ? options.rotate : "angle";//WindDirection
    this.imageName =  options.imageName !==undefined ? options.imageName : "";
    this.offset =  options.offset !==undefined ? options.offset : [0,0];
    this.size = options.size !== undefined ? options.size : 1;
    this.anchor = options.anchor !== undefined ? options.anchor : "center";
    this.overlap = options.overlap !== undefined ? options.overlap : false;
    this.sourceId = options.sourceId !== undefined ? options.sourceId : false;
    this.loadImageUrl = options.loadImageUrl !== undefined ? options.loadImageUrl : false;
    this.type = "iconLayer";
    //this.symbol = options.symbol !== undefined ? options.symbol : new PIE.MarketSymbol({color:"blue",width:1});
    this.initData(options);
    //map.addLayer(layer);
};
IconLayer.prototype =  Object.assign( Object.create( Layer.prototype ), {
    /**
     * initLayer
     * <p>初始化图层，根据传参data对数据进行赋值。</p>
     * @method initLayer
     * @param{Object} data 对象
     */
    initLayer:function (data) {
        if(this.sourceId){
        }else{
            this.source= {
                "id":this.id,
                "source":{
                    "type":"geojson",
                    "data":data
                }
            };
            this.sourceId = this.id;
        }
        var _url = this.imageName+"{"+this.iconUrl+"}";
        if(this.imageUrl){_url = this.imageUrl;}
        this.layer = {
            "id":this.id,
            "source":this.sourceId,
            "type":"symbol",
            "paint":{
                "icon-opacity":this.opacity,
            },
            "layout":{
                "icon-image":_url ,
                "icon-rotate":{ "type": "identity", "property": ""+this.rotate+ ""},
                "icon-allow-overlap" : this.overlap,
                "icon-offset":this.offset,
                "icon-anchor" :  this.anchor,
                "icon-size": this.size,
                "visibility": this.visible,
            }
        };
    },
    handleData:function (self) {
        /**
         * handleData
         * <p>处理图层数据，根据传参self对数据进行赋值。</p>
         * @method handleData
         * @param{Object} self 对象
         */
        var data = self.data;
        for (var i =0 ;i<data.features.length;i++){
            if(self.data.features[i].properties){
                self.data.features[i].properties.index = i;
            }else{
                self.data.features[i].properties = {index:i};
            }
            if(data.features[i].properties.angle){
                //data.features[i].properties.angle =this.colorPath[data.features[i].properties.angle]
            }
            else{
                data.features[i].properties.angle = 0;
            }
            if(data.features[i].properties.iconUrl){
                //data.features[i].properties.angle =this.colorPath[data.features[i].properties.angle]
            }
            else{
                data.features[i].properties.iconUrl = "";
            }
        }
    },
});
export {IconLayer}