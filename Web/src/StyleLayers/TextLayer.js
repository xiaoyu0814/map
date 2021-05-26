import {Layer} from '../Layer/Layer';
/***
 *
 * @author yqq
 */
/**
 * TextLayer
 *
 * @class TextLayer
 * @extends Layer
 * @param {Object} options <br/>
 * [url] — 图层的URL，或者用于渲染图层的样式资源的URL。<br/>
 * [id] — 图层的唯一id。<br/>
 * [data] — 图层的geojson数据。<br/>
 * [color] — 图层的颜色。<br/>
 * [text] —文本设置  。<br/>
 * [overlap] —图层的交叠。<br/>
 * [offset] —图层的位置。<br/>
 * [size] —图层的大小。<br/>
 * [visible] — 图层的隐藏可见（继承父级layer）
  * @constructor
 */
var textLayer = 1;
 function TextLayer(options) {
    Layer.call(this);
    options = options || {};
    this.url = options.url !== undefined ? options.url : "";
    this.id = options.id !== undefined ? options.id : "textLayer"+textLayer++;
    this.data = options.data !== undefined ? options.data : "";
    this.color =  options.color !== undefined ? options.color : "#00ffff";
    this.text =  options.text !== undefined ? options.text : "colorIndex";
    this.overlap = options.overlap !== undefined ? options.overlap : false;
    this.opacity = options.opacity !== undefined ? options.opacity : 1;
    this.offset = options.offset !== undefined ? options.offset : [0,0];
    this.size = options.size !== undefined ? options.size : 16;
    this.sourceId = options.sourceId !== undefined ? options.sourceId : false;
    this.filter = options.filter !== undefined?options.filter:false;
    this.type = "textLayer";
    // this.symbol = options.symbol !== undefined ? options.symbol : new PIE.MarketSymbol({color:"blue",width:1});
    this.initData(options);
    //map.addLayer(layer);
};
TextLayer.prototype =  Object.assign( Object.create( Layer.prototype ), {
	/**
     * initLayer
     * <p>初始化图层。</p>
     * @method initLayer
     * @param{Object} options 对象
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
            this.color = { "type": "identity", "property": "valueColor" };
        }
        this.layer = {
            "id":this.id,
            "source":this.sourceId,
            "type":"symbol",
            "paint":{
                "text-color": this.color,
                "text-opacity":this.opacity,
            },
            "layout":{
                "text-field": "{"+this.text+"}",
                "text-font":["KlokanTech Noto Sans CJK Regular"],
                "text-rotate":{ "type": "identity", "property": "angle" },
                "text-allow-overlap":this.overlap,
                "text-offset":this.offset,
                "visibility":this.visible,
                "text-size":this.size/*{
                  "stops": [[0, 8], [5, 12], [11, 24]]
                }*/

            }
        };
        if(this.filter) this.layer.filter = this.filter;
    },
    handleData:function (self) {
        var data = self.data;
        for (var i =0 ;i<data.features.length;i++){
            if(self.data.features[i].properties){
                self.data.features[i].properties.index = i;
            }else{
                self.data.features[i].properties = {index:i};
            }
            if(data.features[i].properties.valueColor){
               // data.features[i].properties.valueColor =this.colorPath[data.features[i].properties.colorIndex]
            }
            else{
                data.features[i].properties.valueColor = self.color;
            }
            if(data.features[i].properties.angle){
               // data.features[i].properties.angle =this.colorPath[data.features[i].properties.angle]
            }
            else{
                data.features[i].properties.angle = 0;
            }
            if(data.features[i].properties.colorIndex){
                // data.features[i].properties.angle =this.colorPath[data.features[i].properties.angle]
            }
            else{
                data.features[i].properties.colorIndex = "";
            }
            if(data.features[i].properties[self.text] || data.features[i].properties[self.text]==0){
                // data.features[i].properties.angle =this.colorPath[data.features[i].properties.angle]
            }
            else{
                data.features[i].properties[self.text] = "";
            }

        }
    },
});
export { TextLayer };