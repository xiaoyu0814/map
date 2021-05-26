import { Layer } from '../Layer/Layer';
import { GeoJsonFormatFeilds } from '../Symbol/StyleFeilds'
import { LineLayer } from "./LineLayer";
import { TextLayer } from "./TextLayer";

/***
 *
 * @author xll
 */
/**
 * @module Layer
 */
/**
 * IsoLineLayer
 *
 *
 * @class IsoLineLayer
 * @extends Layer
 * @param {Object} options <br/>
 * [url] — 图层的URL，或者用于渲染图层的样式资源的URL。<br/>
 * [id] — 图层的唯一id。<br/>
 * [data] — 图层的geojson数据。<br/>
 * [symbol] — 图层的样式，默认为GeoJsonFormatFeilds.isoLineFeilds<br/>
 * [opacity] — 图层的透明度。<br/>
 * @constructor
 */

var isoLineLayer = 1;

function IsoLineLayer(options) {
    Layer.call(this);
    options = options || {};
    this.url = options.url !== undefined ? options.url : "";
    this.id = options.id !== undefined ? options.id : "isoLineLayer" + isoLineLayer++;
    this.data = options.data !== undefined ? options.data : "";
    this.type = "IsoLineLayer";
    this.symbol = options.symbol !== undefined ? options.symbol : GeoJsonFormatFeilds.isoLineFeilds;
    this.opacity = options.opacity !== undefined ? options.opacity : 1;
    this.initData(options);
}
IsoLineLayer.prototype = Object.assign(Object.create(Layer.prototype), {
    initLayer: function (data) {
        this.source = {
            "id": this.id,
            "source": {
                "type": "geojson",
                "data": data
            }
        };

    },
    handleData: function (self, callback) {},
    innerSource: function (type) {

        if (type == 1) {
            this.mapSource = {
                "id": this.id,
                "source": {
                    "type": "geojson",
                    "data": this.data
                }
            };
            return this.mapSource;

        } else if (type == 2) {
            this.olSource = new PIE.ol.source.ImageWMS({
                url: this.url,
                params: {
                    'LAYERS': this.layers
                },
                ratio: 1,
                //serverType: 'geoserver'
            })
            this.olSource.id = this.id;
            return this.olSource;
        } else if (type == 3) {

        }
    },
    innerLayer: function (type) {
        //"http://211.154.196.253:6080/arcgis/rest/services/EDATA/lspop2013/ImageServer/exportImage/export?bbox=98.701171875%2C31.102294921874996%2C98.71215820312499%2C31.113281250000004&size=256%2C256&format=png&transparent=true&f=image&bboxSR=4326&imageSR=4326"
        if (type == 1) {
            this.layers = [];
            var style = this.symbol;
            var testIsolineLayer = new LineLayer({
                sourceId: this.id,
                id: this.id + "_Line",
                width: style.line.lineWidth,
                opacity: this.opacity,
                filter: ["==", "$type", "LineString"]
            });
            this.layers.push(testIsolineLayer);
            var _color = {
                "type": "identity",
                "property": style.text.textColor
            }
            var textLayer = new TextLayer({
                sourceId: this.id,
                id: this.id + "_Text",
                color: _color,
                opacity: this.opacity,
                text: style.text.textName,
                overlap: true,
                filter: ["==", "$type", "Point"]
            });
            this.layers.push(textLayer);
            return this.layers;
        } else if (type == 2) {
            this.olLayer = new PIE.ol.layer.Image({
                //extent: [-13884991, 2870341, -7455066, 6338219],
                source: this.olSource
            })
            this.olLayer.id = this.id;
            return this.olLayer;
        } else if (type == 3) {
            this.cesLayer = new Cesium.WebMapTileServiceImageryProvider({
                url: this.url,
                layer: this.layers,
                style: this.style,
                format: this.format,
                //tileMatrixSetID : 'default028mm',
                // tileMatrixLabels : ['default028mm:0', 'default028mm:1', 'default028mm:2' ...],
                //maximumLevel: 19,
                //credit : new Cesium.Credit('U. S. Geological Survey')
            });
            return this.cesLayer;
        }
    },
    onAdd: function (map, type) {
        this._map = map;
        if (type == 1) {
            for (var i = 0; i < this.layers.length; i++) {
                map.addLayer(this.layers[i].layer);
            }
        } else if (type == 2) {

        } else if (type == 3) {

        }
    }
})

export { IsoLineLayer }