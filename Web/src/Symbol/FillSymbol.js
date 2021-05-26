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
 * Symbol填充符号用于绘制多边形图形。
 * <a href="../../examples/Graphics_Editor.html">Graphics_Editor.html</a>
 * 
 * @class FillSymbol
 * @extends Symbol
 * @param {Object} options </br>
 * [type] — 对于FillSymbol，类型默认是FillSymbol。<br/>
 * [color] — 填充符号的颜色，不设置默认为白色("#ffffff")。<br/>
 * [opacity] — 填充符号的透明度，不设置默认为1不透明。<br/>
 * @constructor
 */
function FillSymbol(options) {
    Symbol.call( this );
    this.type="FillSymbol";
    options = options || {};
    this.color=options.color !== undefined ? new Color(options.color):new Color("#ffffff");
    this.opacity = options.opacity !== undefined ? options.opacity:1;
    this.visible = options.visible !== undefined ? options.visible : true;
}

FillSymbol.prototype=Object.assign( Object.create( Symbol.prototype ), {
    /**
     * set
     * <p>新建一个填充符号，可赋默认值。</p>
     * @method set
     * @param{Object} options 填充图形的设置，包含color和opacity。
     */
    set:function (options) {
        this.color = new Color("#ffffff")||options.color;
        this.opacity = 1 || options.opacity;
    },
    /**
     * setColor
     * <p>根据所传参数对color赋值</p>
     * @method setColor
     * @param{string} color 填充图形的颜色。
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
     * <p>获取填充图形的颜色</p>
     * @method getColor
     * @param{string} color 填充图形的颜色。
     */
    getColor:function () {
        return this.color;
    },
    /**
     * setOpacity
     * <p>根据所传参数对opacity赋值</p>
     * @method setOpacity
     * @param{number} number 填充图形的透明度。
     */
    setOpacity:function (number) {
        this.opacity = number;
    },
    /**
     * getOpacity
     * <p>获取填充图形的透明度</p>
     * @method getOpacity
     * @retrun {number} opacity 返回的填充图形的透明度。
     */
    getOpacity:function () {
        return this.opacity;
    }

});
export {FillSymbol}