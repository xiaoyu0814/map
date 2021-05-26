
import {VectorField} from './VectorField';
import {MotionDisplay} from './MotionDisplay';
import {Vector} from './Vector';
import {Animator} from "./Animator";
import {WindEvent} from './WindEvent';
import {Layer} from '../../Layer/Layer';

var windMapLayer = 1;

/**
 * @module Layer
 */
/**
 * WindMapLayer
 *
 * @class WindMapLayer
 * @extends Layer
 * @param {Object} options <br/>
 * [url] — 图层的URL，或者用于渲染图层的样式资源的URL。<br/>
 * [id] — 图层的唯一id。<br/>
 * [data] — 图层的geojson数据。<br/>
 * @constructor
 */
function WindMapLayer(options){
	options = options || {};
    this.url = options.url !== undefined ? options.url : "";
    this.id = options.id !== undefined ? options.id : "windMapLayer"+windMapLayer++;
    this.data = options.data !== undefined ? options.data : "";
    this.opacity  = options.opacity !== undefined ? options.opacity : 1;
    this.visible = options.visible !== undefined ?options.visible : "visible";
    this.field = null;
    this.type = "windMapLayer";
    this.initData(this.data);
    this.display = null;
	var field ;
	var mapAnimator;//map
	var _sw,_ne,mapcanvas,imageCanvas,leftbottom,_oldne,_oldsw,map;
	var boundsLeft,boundsRight,windEvent;

}
WindMapLayer.prototype =  Object.assign( Object.create( Layer.prototype ),{

	initData:function (data){

		this.field = this.getDataValue(data, true);
	
	},
	setLineWidth:function(num){
		this.mapboxLayer.display.setLineWidth(num);
	},
	setGlobalAlpha:function(num){
  		this.mapboxLayer.display.setGlobalAlpha(num);
	},
	setNumParticles:function(num){
		this.mapboxLayer.display.setNumParticles(num);
	},
	setAge:function(num){
		this.mapboxLayer.display.setAge(num);
	},
	setSpeedScale:function(num){
		this.mapboxLayer.display.setSpeedScale(num);
	},
	setOpacity:function(num){
		this.mapboxLayer.display.setOpacity(num);
	},
	getDataValue:function(data,correctForSphere) {
	    var field = [];
	    var w = data.gridWidth;
	    var h = data.gridHeight;
	    var n = 2 * w * h;
	    var i = 0;
	    // OK, "total" and "weight"
	    // are kludges that you should totally ignore,
	    // unless you are interested in the average
	    // vector length on vector field over lat/lon domain.
	    var total = 0;
	    var weight = 0;
	    for (var x = 0; x < w; x++) {
	      field[x] = [];
	      for (var y = 0; y < h; y++) {
	        var vx = data.field[i++];
	        var vy = data.field[i++];
	        var v = new Vector(vx, vy);
	        // Uncomment to test a constant field:
	        // v = new Vector(10, 0);
	        if (correctForSphere) {
	          var ux = x / (w - 1);
	          var uy = y / (h - 1);
	          var lon = data.x0 * (1 - ux) + data.x1 * ux;
	          var lat = data.y0 * (1 - uy) + data.y1 * uy;
	          var m = Math.PI * lat / 180;
	          var length = v.length();
	          if (length) {
	            total += length * m;
	            weight += m;
	          }
	          v.x /= Math.cos(m);
	          v.setLength(length);
	        }
	        field[x][y] = v;
	      }
	    }
	    var result = new VectorField(field, data.x0, data.y0, data.x1, data.y1);
	    //window.console.log('total = ' + total);
	    //window.console.log('weight = ' + weight);
	    if (total && weight) {

	      result.averageLength = total / weight;
	    }
	    return result;
  	}

})

export {WindMapLayer}