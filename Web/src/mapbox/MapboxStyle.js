import {
    EventDispatcher
} from "../core/EventDispatcher";

import {LineLayer} from "../StyleLayers/LineLayer";
import {PointLayer} from "../StyleLayers/PointLayer";
import {TextLayer} from "../StyleLayers/TextLayer";
import {FillLayer} from "../StyleLayers/FillLayer";
import {VectorField} from '../StyleLayers/WindMap/VectorField';
import {MotionDisplay} from '../StyleLayers/WindMap/MotionDisplay';
import {Vector} from '../StyleLayers/WindMap/Vector';
import {Animator} from "../StyleLayers/WindMap/Animator";
import {WindEvent} from '../StyleLayers/WindMap/WindEvent';
import {Utils} from '../StyleLayers/WindMap/Utils';
/***
 *
 * @param options
 * @author yqq
 */
function MapboxStyle() {
    this.Utils = new Utils();
}
Object.assign( MapboxStyle.prototype, {
	// body...
	initImageStyle:function(layer){
	   var _leftTop = PIE.ol.proj.transform([layer.region[0],layer.region[3]],layer.projection, "EPSG:3857");
       var _rightTop = PIE.ol.proj.transform([layer.region[2],layer.region[3]],layer.projection, "EPSG:3857");
       var _rightBottom = PIE.ol.proj.transform([layer.region[2],layer.region[1]],layer.projection, "EPSG:3857");
       var _leftBottom = PIE.ol.proj.transform([layer.region[0],layer.region[1]],layer.projection, "EPSG:3857");
       console.log(_rightBottom)
        var _layer = {
            "id": layer.id,
            "source":{
	            "type": "image",
	            "url": layer.url,
                "isLngLat":true,
	            "coordinates": [[layer.region[0],layer.region[3]],[layer.region[2],layer.region[3]],[layer.region[2],layer.region[1]],[layer.region[0],layer.region[1]]]
                // "coordinates": [_leftTop,_rightTop,_rightBottom,_leftBottom]
	        },
            "type": "raster",
            "paint": {
                "raster-opacity": layer.opacity
            },
            "layout": {}
        }
		return _layer;
	},
    initTyphoonStyle:function(layer){
        var layers = [];
        var id = layer.id;
        var testfillLayer = new FillLayer({
            sourceId:id,
            opacity:0.2,
            id: id + "_Fill",
            filter:[ "all",
                [
                    "in",
                    "num",
                    0
                ],["==", "$type", "Polygon"]]
        });
        layers.push(testfillLayer);
        var testIsolineLayer = new LineLayer({
            sourceId:id,
            id: id + "_Line",
            color:"#000",
            width:2,
            filter: [ "all",
                [
                    "in",
                    "num",
                    0
                ],["==", "$type", "LineString"]]
        });
        layers.push(testIsolineLayer);
        var testpointLayer = new PointLayer({
            sourceId:id,
            id: id + "_Point",
            color: { "type": "identity", "property": "valueColor" },
            filter:[ "all",
                [
                    "in",
                    "num",
                    0
                ],["==", "$type", "Point"]]
        });
        layers.push(testpointLayer);


        
        return layers;

    },

    initIsoLineStyle:function(layer){
        var layers = [];
        var style = layer.symbol;
        var id = layer.id;
        var testIsolineLayer = new LineLayer({
            sourceId:id,
            id: id + "_Line",
            width:style.line.lineWidth,
            opacity:layer.opacity,
            filter: ["==", "$type", "LineString"]
        });
        layers.push(testIsolineLayer);
        var _color = { "type": "identity", "property": style.text.textColor }
        var textLayer = new TextLayer({
                sourceId:id,
                id :  id+"_Text",
                color :_color,
                opacity:layer.opacity,
                text:style.text.textName,
                overlap:true,
                filter: ["==", "$type", "Point"]
            });
        layers.push(textLayer);
        return layers;

    },
    initWindMapStyle:function(layer){
        var _canvas = this.Utils.addMapCanvas();
        var _tempLnglat = this.Utils.addCanvasLayer(this.map);
        var _tempAnimat = this.Utils.addAnimat(_canvas,layer.field,_tempLnglat);
        var windEvent = new WindEvent(this.map,_tempAnimat[1],_tempAnimat[0],this.Utils.addImage,_tempLnglat[1],_tempLnglat[2],_tempLnglat[0]);
        return windEvent;
    }

});

export {MapboxStyle}