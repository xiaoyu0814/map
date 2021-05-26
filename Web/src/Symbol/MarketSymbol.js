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
 * MarketSymbol标记符号用于在绘制Point图形或绘制单个图形。
 * <a href="../../examples/Graphics_Editor.html">Graphics_Editor.html</a>
 * 
 * @class MarketSymbol
 * @extends Symbol
 * @param {Object} options <br/>
 * [color] — 标记符号的颜色，不设置默认为白色("#ffffff")。<br/>
 * [size] — 标记符号的尺寸，不设置默认为1。<br/>
 * [opacity] — 标记符号的透明度，不设置默认为1不透明。<br/>
 * @constructor
 */
function MarketSymbol(options) {
    Symbol.call( this );
    this.type="MarketSymbol";
    options =options||{};
    this.color=options.color !== undefined ? new Color(options.color):new Color("#ffffff");
    this.size =options.size !== undefined ? options.size:1;
    this.opacity = options.opacity !== undefined ? options.opacity:1;
    this.visible = options.visible !== undefined ? options.visible : true;
}

MarketSymbol.prototype=Object.assign( Object.create( Symbol.prototype ), {
    /**
     * set
     * <p>新建一个标记符号，可赋默认值。</p>
     * @method set
     * @param{Object} options 标记符号的设置，包含color、size和opacity。
     */
    set:function (options) {
        this.color = new Color("#ffffff")||options.color;
        this.size = 1 || options.size;
        this.opacity = 1 || options.opacity;
    },
    /**
     * setColor
     * <p>根据所传参数对标记符号的color赋值</p>
     * @method setColor
     * @param{string} color 标记符号的颜色。
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
     * <p>获取标记符号的颜色</p>
     * @method getColor
     * @param{string} color 标记符号的颜色。
     */
    getColor:function () {
        return this.color;
    },
    /**
     * setSize
     * <p>根据所传参数对标记符号的Width赋值</p>
     * @method setSize
     * @param{number} Width 标记符号的尺寸。
     */
    setSize:function (number) {
        this.size = number;
    },
    /**
     * getSize
     * <p>获取标记符号的尺寸</p>
     * @method getSize
     * @param{number} Width 标记符号的尺寸。
     */
    getSize:function () {
        return this.size;
    },
    /**
     * setOpacity
     * <p>根据所传参数对opacity赋值</p>
     * @method setOpacity
     * @param{number} number 填充标记符号的透明度。
     */
    setOpacity:function (number) {
        this.opacity = number;
    },
    /**
     * getOpacity
     * <p>获取填充标记符号的透明度</p>
     * @method getOpacity
     * @retrun {number} opacity 返回的填充标记符号的透明度。
     */
    getOpacity:function () {
        return this.opacity;
    }

});
export {MarketSymbol}