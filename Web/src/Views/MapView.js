import {View} from './View';
import {Map} from '../Map/Map';
import {GraphicsLayer} from '../Layer/GraphicsLayer';
import {MapMouseEvent} from './MapMouseEvent';
/***
 *
 * @author yqq
 */
  /**
 * @module Map
 */
 /**
 * MapView
 *
 * @class MapView
 * @param {Object} parameters <br/>
 * [map] — 底图PIE.Map()。<br/>
 * [container] — 地图窗口的div标签的id。<br/>
 * [center] — 地图窗口的中心值。<br/>
 * [zoom] — 地图窗口的层级。<br/>
 * [glyphs] — 地图的字体库。<br/>
 * [sprite] — 地图的图标库。<br/>
 * [projection] — 地图的投影方式。默认为墨卡托投影，在Map的type定义为2的时候有效。现支持的投影有Wgs84（EPSG:4326）、墨卡托(EPSG:3857)、兰伯特(EPSG:2700)<br/>
 * @constructor
 */
function MapView(parameters) {
    View.call(this);
    this.type = "MapView";
    parameters = parameters || {};
    var simple = {
        "version": 8,
        "name": "Klokantech Basic",
        "metadata": {
            "mapbox:autocomposite": false,
            "mapbox:type": "template",
            "maputnik:renderer": "mbgljs"
        },
        "bearing": 0,
        "pitch": 0,
        "sources": {},
        "glyphs": "fonts/{fontstack}/{range}.pbf",
        "layers": [],
    };
    this.container = parameters.container !== undefined ? parameters.container : document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
    this.map = parameters.map !== undefined ? parameters.map : new Map();
    this.graphics = parameters.graphics !== undefined ? parameters.graphics : new GraphicsLayer({map:this.map});
   /* this.center = parameters.center !== undefined ? parameters.center : [0,0];
    this.zoom = parameters.zoom !== undefined ? parameters.zoom : 0;
    this.style = parameters.style !== undefined ? parameters.style : simple;
    this.extent = parameters.extent !== undefined ? parameters.extent : "";
    this.sprite = parameters.sprite !== undefined ? parameters.sprite : "";*/
    this.initMap(parameters);
    this.listentoMouseEvent= new MapMouseEvent(this.map.defaultSettings.type,this.map);
}
MapView.prototype  = Object.assign( Object.create( View.prototype ), {
    initMap:function (options) {
      //if(this.map.defaultSettings.type ==1) {
          this.map.mapbox.changeStyles(options)
         
     // }else if(this.map.defaultSettings.type ==2) {
          this.map.openlayer.changeStyles(options)
         
     // }else if(this.map.defaultSettings.type ==3){
			this.map.pieCesium.changeStyles(options)
	//	
       // }
        this.map.initMap();
    },
    getZoom:function() {
        if(this.map.defaultSettings.type ==1)
        {
            return this.map.mapbox.getZoom()
        }
    },
    setZoom:function() {

    },
    getCenter:function() {
        if(this.map.defaultSettings.type ==1)
        {
           return this.map.mapbox.getCenter()
        }
    },
    setCenter:function() {

    },
    getVisible:function() {
        return this.visible;
    },
    setVisible:function() {

    },
    getExtent:function() {
        return this.extent;
    },
    setExtent:function() {

    },
    getStyle:function() {
        return this.style;
    },
    setStyle:function() {

    },
    getGraphics:function() {
        return this.graphics;
    },
    setGraphics:function() {

    }
});
export {MapView}