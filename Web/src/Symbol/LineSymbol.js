import {Symbol} from './Symbol.js'
import {Color} from '../math/Color.js'
/***
 *
 * @param options
 * @author yqq
 */
  /**
 * @module Symbol
 */
/**
 * LineSymbol线符号用于绘制折线要素。
 * <a href="../../examples/Graphics_Editor.html">Graphics_Editor.html</a>
 * 
 * @class LineSymbol
 * @extends Symbol
 * @param {Object} options <br/>
 * [color] — 线条符号的颜色，不设置默认为白色("#ffffff")。<br/>
 * [width] — 线条符号的宽度，不设置默认为1。<br/>
 * [opacity] — 线条符号的透明度，不设置默认为1不透明。<br/>
 * @constructor
 */
function LineSymbol(options) {
    Symbol.call( this );
    options = options || {};
    this.type="LineSymbol";
    this.color= options.color !== undefined ? new Color(options.color) : new Color("#ffffff");
    this.width =  options.width !==undefined ? options.width:1;
    this.opacity = options.opacity !== undefined ? options.opacity:1;
    this.visible = options.visible !== undefined ? options.visible : true;
}

LineSymbol.prototype=Object.assign( Object.create( Symbol.prototype ), {
    /**
     * set
     * <p>新建一个线图形，可赋默认值。</p>
     * @method set
     * @param{Object} options 填充图形的设置，包含color、width和opacity。
     */
    set:function (options) {
        this.color = new Color("#ffffff")||options.color;
        this.width = 1 || options.width;
        this.opacity = 1 || options.opacity;
    },
    /**
     * setColor
     * <p>根据所传参数对线的color赋值</p>
     * @method setColor
     * @param{string} color 线图形的颜色。
     */
    setColor:function (color) {
        if( color && color.isColor){
            this.color = color.copy();
        }else{
            this.color = new Color(color);
        }

    },
    /**
     * getColor
     * <p>获取线符号的颜色</p>
     * @method getColor
     * @param{string} color 线图形的颜色。
     */
    getColor:function () {
        return this.color;
    },
    /**
     * setWidth
     * <p>根据所传参数对线图形的Width赋值</p>
     * @method setWidth
     * @param{number} Width 线图形的宽度。
     */
    setWidth:function (number) {
        this.width = number;
    },
    /**
     * getWidth
     * <p>获取线图形的宽度</p>
     * @method getWidth
     * @param{number} Width 线图形的宽度。
     */
    getWidth:function () {
        return this.width;
    },

    /**
     * setOpacity
     * <p>根据所传参数对opacity赋值</p>
     * @method setOpacity
     * @param{number} number 填充线的透明度。
     */
    setOpacity:function (number) {
        this.opacity = number;
    },
    /**
     * getOpacity
     * <p>获取填充线的透明度</p>
     * @method getOpacity
     * @retrun {number} opacity 返回的填充线的透明度。
     */
    getOpacity:function () {
        return this.opacity;
    }
});
export {LineSymbol}