import {Layer} from '../Layer/Layer';
/***
 *
 * @author yqq
 */
 /**
 * @module Layer
 */
/**
 * 点图层
 * 
 * @class PointLayer
 * @extends Layer
 * @param {Object} options <br/>
 * [url] — 图层的URL，或者用于渲染图层的样式资源的URL。<br/>
 * [id] — 图层的唯一id。<br/>
 * [data] — 图层的geojson数据。<br/>
 * [color] — 图层的颜色。<br/>
 * [size] — 图层的大小。<br/>
 * [visible] — 控制图层的显隐性。<br/>
 * @constructor
 */
var pointLayer = 1;
function PointLayer(options) {
    PIE.Layer.call(this);
    options = options || {};
    this.url = options.url !== undefined ? options.url : "";
    this.id = options.id !== undefined ? options.id : "pointLayer"+pointLayer++;
    this.data = options.data !== undefined ? options.data : "";
    this.color =  options.color !== undefined ? options.color : "#000000";
    this.strokeColor =  options.strokeColor !== undefined ? options.strokeColor : "#000000";
    this.strokeWidth =  options.strokeWidth !== undefined ? options.strokeWidth : 0;
    this.size =  options.size !== undefined ? options.size : 5;
    this.opacity =  options.opacity !== undefined ? options.opacity : 1;
    this.sourceId = options.sourceId !== undefined ? options.sourceId : false;
    this.filter = options.filter !== undefined?options.filter:false;
    // this.visible = options.visible !== undefined ? options.visible : true
    this.type = "pointLayer";
   // this.symbol = options.symbol !== undefined ? options.symbol : new PIE.MarketSymbol({color:"blue",width:1});
    this.initData(options);

    //map.addLayer(layer);
};
PointLayer.prototype =  Object.assign( Object.create( Layer.prototype ), {
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
        
        this.layer = {
            "id":this.id,
            "source":this.sourceId,
            "type":"circle",
            "paint":{
                "circle-radius": this.size,
                "circle-stroke-color":this.strokeColor,
                "circle-stroke-width": this.strokeWidth,
                "circle-opacity":this.opacity,
                "circle-color": this.color
            },
            "layout":{
                "visibility":this.visible,
            }
        };
        if(this.filter) this.layer.filter = this.filter;
    },
    /**
     * handleData
     * <p>处理图层数据，根据传参self对数据进行赋值。</p>
     * @method handleData
     * @param {Object} self 对象
     */
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
            if(data.features[i].properties[self.text]){
                // data.features[i].properties.angle =this.colorPath[data.features[i].properties.angle]
            }
            else{
                data.features[i].properties[self.text] = "";
            }

        }
    },
});
export { PointLayer };