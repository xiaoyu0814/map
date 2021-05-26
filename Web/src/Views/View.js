import {Collection} from '../core/Collection'
import {Mapbox} from '../mapbox/mapbox'
/***
 *
 * @param parameters
 * @author yqq
 */
  /**
 * @module Map
 */
function View(parameters) {

    parameters = parameters || {};
    this.type = "View";
    this.container = parameters.container !== undefined ? parameters.container : document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
    this.graphics = parameters.graphics !== undefined ? parameters.graphics : new Collection();
    this.map = parameters.Map !== undefined ? parameters.Map : new Map();
}
View.prototype ={


};
export {View}