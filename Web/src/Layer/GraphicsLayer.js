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
 * GraphicsLayer包含一个或多个客户端图形。组成GraphicsLayer的图形可能具有多种几何类型（点，线或多边形）。
 * <a href="../../examples/Measure_Area.html">Measure_Area.html</a>
 * 
 * @class GraphicsLayer
 * @extends Layer
 * @param {Object} options </br>
 * [map] — 图层的样式。</br>
 * [graphics] — 图像图层中的图形集合。。
 * @constructor
 */

var graphicsLayer = 1;

function GraphicsLayer(options) {
    Layer.call(this);
    this.type = "GraphicsLayer";
    options = options || {};
    this.map = options.map !== undefined ? options.map : "";
    this.id = options.id !== undefined ? options.id : "graphicsLayer" + graphicsLayer++;
    this.graphics = options.graphics !== undefined ? options.graphics : [];
}

GraphicsLayer.prototype = Object.assign(Object.create(Layer.prototype),{

    /**
     * add
     * <p>增加图像图层</p>
     * @method add
     * @param{Array} graphics 图层中的图形集合。
     */
    add: function(graphics) {
        this.graphics.push(graphics);
        console.log(graphics);
        //for(var i= 0;i<this.graphics.length;i++)
       //{
            if(this.map!= ""){
                this.map.add(graphics);
            }
       // }
    },

    /**
     * addMany
     * <p>增加多个图像图层的集合</p>
     * @method addMany
     * @param{Array} graphics图层中的图形集合。
     */
    addMany:function (graphics) {
        for(var i=0;i<graphics.length;i++){
            this.graphics.push(graphics[i]);
            this.map.add(graphics[i]);
        }

    },
    toJSON:function () {

    }
});
export {GraphicsLayer}