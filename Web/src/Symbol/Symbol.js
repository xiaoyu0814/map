/***
 *
 * @author yqq
 */
  /**
 * @module Symbol
 */
/**
 * Symbol定义了如何在GraphicLayer上显示点、线、面和文本，符号定义了集合对象的所有非地理特征方面的外观，包括图形的颜色，边框线宽度，透明度等等。PIE-MAP API for JavaScript 包含了很多符号类，每个类允许你使用唯一的方式定制一种符号。每种符号都特定于一种类型（点、线、面和文本）。
 * @class Symbol
 * @constructor
 */

 import {MapboxSymbol} from '../mapbox/MapboxSymbol'
 import {OLSymbol} from '../OpenLayer/OLSymbol'
function Symbol() {
    this.type ="Symbol";
}
Symbol.prototype={
    fromJSON:function () {
        
    },
    /**
     * toJSON
     * <p>根据mapbox和openlayer的设置不同，给矢量图层转换成json对象。</p>
     * @method toJSON
     */
    toJSON:function () {
        console.log(this)
        if(PIE.MAPTYPE == 1){
            return new MapboxSymbol(this).toJSON();
        }else if(PIE.MAPTYPE == 2){
            return new OLSymbol(this).toJSON();
        }
    },
    setColor:function (color) {
        if( color && color.isColor){
            this.color = color.copy();
        }else{
            this.color = new Color(color);
        }

    },
    getColor:function () {
        return this.color;
    },
};
export {Symbol}