import {Layer} from './Layer';

/**
 * @module Layer
 */
/***
* @author mhw
* GeoJson数据图层
* @class GeoJsonLayer
* @extends Layer
* @constructor
* @param {Object} options              			初始化属性字段
* @param {String} options.url					geojson数据地址或路径
* @param {String} options.id					geojson图层ID
* @param {Number} options.opacity				图层透明度，取值[0-1.0]		
* @param {Object} options.symbol				图层样式
* @param {String} [options.symbol.pointColor]	图层点颜色	
* @param {Number} [options.symbol.pointSize]	图层点大小		
* @param {String} [options.symbol.lineColor]	图层线颜色		
* @param {Number} [options.symbol.lineWidth]	图层线宽度		
* @param {String} [options.symbol.fillColor]	图层填充颜色		
* @param {Boolean} [options.symbol.show]		图层是否显示	
 */
var geoJsonLayer =1;
function GeoJSONLayer(options) {
    Layer.call(this);

    options = options || {};
    this.type = "geoJsonLayer";
    this.url = options.url !== undefined ? options.url : "";
	this.id = options.id !== undefined ? options.id : "geoJsonLayer"+geoJsonLayer++;
    this.data = options.data !== undefined ? options.data : "";
	this.opacity  = options.opacity !== undefined ? options.opacity : 1;
	let symbol=options.symbol!== undefined ?options.symbol:{};
	this.layerSymbol=this.initLayerSymbol(symbol);
    this.initData(options);
}
GeoJSONLayer.prototype =Object.assign(Object.create(Layer.prototype),{
	/**
     * GeoJSONLayer初始化图层数据赋值
     * 
     * @method initLayer

     */
    initLayer:function (data) {
         this.source= {
            "id":this.id,
            "source":{
                "type":"geojson",
                "data":data
            }
        };
		this.layer = {
            "id":this.id,
            "source":this.id,
            "type":"geojson",
            "paint":{
                "opacity":this.opacity
            },
            "layout":{
                "visibility":true
            }
        };
    },
	handleData:function (self) {
		
	},
	/**
     * GeoJSONLayer初始化地图图层样式
     * 
     * @method initLayerSymbol
     * @return {Object} layerSymbol对象
     */
	initLayerSymbol:function(symbol){
		let layerSymbol = {
			pointColor:symbol.pointColor!== undefined ?symbol.pointColor:"",
			pointSize:symbol.pointSize!== undefined ?symbol.pointSize:0,
			lineColor:symbol.lineColor!== undefined ?symbol.lineColor:"",
			lineWidth:symbol.lineWidth!== undefined ?symbol.lineWidth:0,
			fillColor:symbol.fillColor!== undefined ?symbol.fillColor:"",
			show:symbol.show!== undefined ?symbol.show:true
		}
		return layerSymbol;
	}
});

export {GeoJSONLayer}