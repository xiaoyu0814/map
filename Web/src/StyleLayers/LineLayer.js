import { Layer } from '../Layer/Layer';
import { MapboxStyle } from "../Symbol/MapboxStyle";
/***
 *
 * @author yqq
 */

/**
 * @module Layer
 */
/**
 * LineLayer
 * <a href="../../examples/Layer_GeoJsonLayer.html">Layer_GeoJsonLayer.html:36</a>
 * 
 * @class LineLayer
 * @extends Layer
 * @param {Object} options <br/>
 * [url] — 图层的URL，或者用于渲染图层的样式资源的URL。<br/>
 * [id] — 图层的唯一id。<br/>
 * [color] — 符号样式,包含线颜色。<br/>
 * [data] — 图层的geojson数据。<br/>
 * [opacity] — 图层的透明度。<br/>
 * [width] — 图层的宽度。<br/>
 * [dasharray] — 虚线数组[2,4]。<br/>
 * [visible] — 图层的隐藏可见（继承父级layer）
 * @constructor
 */
var lineLayer = 1;

function LineLayer(options) {
    Layer.call(this);
    options = options || {};
    this.url = options.url !== undefined ? options.url : "";
    this.id = options.id !== undefined ? options.id : "lineLayer" + lineLayer++;
    this.data = options.data !== undefined ? options.data : "";
    this.type = "lineLayer";
    this.symbol = options.symbol !== undefined ? options.symbol : new PIE.LineSymbol({
        color: "blue",
        width: 1
    });
    this.width = options.width !== undefined ? options.width : 1;
    this.opacity = options.opacity !== undefined ? options.opacity : 1;
    this.dasharray = options.dasharray !== undefined ? options.dasharray : false;
    this.color = options.color !== undefined ? options.color : "#000000";
    this.filter = options.filter !== undefined ? options.filter : false;
    this.sourceId = options.sourceId !== undefined ? options.sourceId : false;
    this.initData(options);
};
LineLayer.prototype = Object.assign(Object.create(Layer.prototype), {
    /**
     * initLayer
     * <p>初始化图层，根据传参data对数据进行赋值。</p>
     * @method initLayer
     * @param{Object} data 对象
     */
    initLayer: function (data) {
        if (this.sourceId) {} else {
            this.source = {
                "id": this.id,
                "source": {
                    "type": "geojson",
                    "data": data
                }
            };
            this.sourceId = this.id;
        }
       
        this.layer = new MapboxStyle().getLineStyle(this);
    },
    innerLayer: function (type) {
        this.styleDefault = {
            show: true,
            stroke: Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(this.color), this.opacity),
            fill: Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(this.color), this.opacity),
            strokeWidth: this.width,
            markerSize: 0,
            clampToGround: true
        }
        if (type == 3) {
            this.promiseLayer = Cesium.GeoJsonDataSource.load(this.data, this.styleDefault)
            return this.promiseLayer;
        }
    },
    /**
     * handleData
     * <p>处理图层数据，根据传参self对数据进行赋值。</p>
     * @method handleData
     * @param{Object} self 对象
     * @param{Object} callback
     */
    handleData: function (self, callback) {
        for (var i = 0; i < self.data.features.length; i++) {
            if (self.data.features[i].properties) {
                self.data.features[i].properties.index = i;
            } else {
                self.data.features[i].properties = {
                    index: i
                };
            }
            if (self.color != "") {
                self.data.features[i].properties.valueColor = self.color;
            } else {
                if (!self.data.features[i].properties.valueColor) {
                    self.data.features[i].properties.valueColor = "#00ffff";
                }
            }

            if (self.data.features[i].properties.lineWidth) {
                //self.data.features[i].properties.LineTypeString =self.data.features[i].properties.LineTypeString
            } else {
                self.data.features[i].properties.lineWidth = self.width;
            }
        }

    },
});
export {
    LineLayer
}