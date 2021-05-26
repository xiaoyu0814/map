import { Layer } from '../Layer/Layer';
import { LineLayer } from "./LineLayer";
import { TextLayer } from "./TextLayer";
/***
 *
 * @author yqq
 */
var stationLayer = 1;

function GridLatLonLayers(options) {
    Layer.call(this);
    options = options || {};
    this.url = options.url !== undefined ? options.url : "";
    this.id = options.id !== undefined ? options.id : "stationLayer" + stationLayer++;
    this.lineData = {
        "type": "FeatureCollection",
        "features": []
    }
    this.textData = {
        "type": "FeatureCollection",
        "features": []
    }
    this.type = "GridLatLonLayers";
    this.overlap = options.overlap !== undefined ? options.overlap : false;
    this.zoom = options.zoom
    this.visible = options.visible !== undefined ? options.visible : "visible";
    this.textType = options.text !== undefined ? options.text : true
    this.Layers = [];
    // this.symbol = options.symbol !== undefined ? options.symbol : new PIE.MarketSymbol({color:"blue",width:1});
    for (var i = 0; i < 170; i += this.zoom) {
        var linePath = [
            [-180, 85 - i],
            [0,85 - i],
            [180, 85 - i]
        ]
        var features = {
            "type": "Feature",
            "properties": {
                "valueColor": "#000",
                "lineWidth": 1,
                "colorIndex": 85 - i + "°"
            },
            "geometry": {
                "type": "LineString",
                "coordinates": linePath
            }
        }
        this.lineData.features.push(features)
    }
    for (var i = 0; i < 360; i += this.zoom) {
        var linePath = [
            [-180 + i, 85],
            [-180 + i, -85]
        ]
        var features = {
            "type": "Feature",
            "properties": {
                "valueColor": "#000",
                "lineWidth": 1,
                "colorIndex": -180 + i + "°"
            },
            "geometry": {
                "type": "LineString",
                "coordinates": linePath
            }
        }
        this.lineData.features.push(features)
    }
    if(this.textType){
        for (var i = 0; i < 170; i += this.zoom) {
            var textPath =[0, 85 - i]
            var features = {
                "type": "Feature",
                "properties": {
                    "valueColor": "#000",
                    "colorIndex": 85 - i + "°"
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": textPath
                }
            }
            this.textData.features.push(features)
        }
        for (var i = 0; i < 360; i += this.zoom) {
            var textPath = [-180 + i, 0]
            var features = {
                "type": "Feature",
                "properties": {
                    "valueColor": "#000",
                    "colorIndex": -180 + i + "°"
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": textPath
                }
            }
            this.textData.features.push(features)
        }
    }

    this.LonlatLineLayer = new LineLayer({
        data:this.lineData,
        id:"lonlatLine"
    });
    this.LonlatTextLayer = new TextLayer({
        data:this.textData,
        id:"lonlatText",
        overlap:true,
    });
    this.Layers.push(this.LonlatLineLayer);
    this.Layers.push(this.LonlatTextLayer);
};
GridLatLonLayers.prototype = Object.assign(Object.create(Layer.prototype), {
    initLayer: function () {
        
    },
    handleData: function () {
        
    },
});
export { GridLatLonLayers };