/***
 *
 * @author yqq
 */
  /**
 * @module LayerStyle
 */
/**
 * 
 * @class LayerStyle
 * @constructor
 */
import {MapboxStyle} from './MapboxStyle';
import {OpenlayerStyle} from './OpenlayerStyle';
import {CesiumStyle} from './CesiumStyle';
import {
    EventDispatcher
} from "../core/EventDispatcher";

function LayerStyle() {
    
}
Object.assign( MapboxStyle.prototype, {
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
});
export {LayerStyle}