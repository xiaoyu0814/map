import {
    Layer
} from './Layer';
import {
    GeoJsonFormatFeilds
} from '../Symbol/StyleFeilds'
import {
    LineLayer
} from "../StyleLayers/LineLayer";
import {
    TextLayer
} from "../StyleLayers/TextLayer";
/***
 *
 * @param options
 * @author yqq
 */
/**
 * @module Layer
 */
/**
 * AIDistinguishLayer
 * 
 * @class AIDistinguishLayer
 * @extends Layer
 * @param {Object} options </br>
 * [url] — 栅格图层数据的来源地址url。</br>
 * [tileSize] — 瓦片尺寸，如果没有设置，默认为256。</br>
 * [id] — 图层的唯一id。</br>
 * [opacity] — 图层的透明度，不透明默认为1。</br>
 * [region] - 栅格图层的范围，默认范围[-180,-90,180,90]
 * @constructor
 */
var AIDistinguish = 1;

function AIDistinguishLayer(options, setcolor, key) {
    Layer.call(this);
    options = options || {};
    if (typeof (setcolor) == "string") {
        var test = this.get(setcolor)
    } else {
        this.setcolor = setcolor;
    }
    this.key = key;
    this.type = "AIDistinguishLayer";
    this.id = options.id ? options.id : "AIDistinguishLayer" + AIDistinguish++
    this.data = options.data ? options.data : ""
    this.url = options.url !== undefined ? options.url : "";
    this.width = options.width !== undefined ? options.width : 1;
    this.opacity = options.opacity !== undefined ? options.opacity : 1;
    this.dasharray = options.dasharray !== undefined ? options.dasharray : false;
    this.color = options.color !== undefined ? options.color : "#000000";
    this.filter = options.filter !== undefined ? options.filter : false;
    this.sourceId = options.sourceId !== undefined ? options.sourceId : false;
    this.symbol = options.symbol !== undefined ? options.symbol : GeoJsonFormatFeilds.isoLineFeilds;
    this.AIResultPrimitve = new Cesium.PrimitiveCollection()
    this.AILabelPrimitve = new Cesium.LabelCollection()
}
AIDistinguishLayer.prototype = Object.assign(Object.create(Layer.prototype), {
    innerSource: function (type) {
        if (this.setcolor) {
            for (var i = 0; i < this.data.features.length; i++) {
                for (var key in this.setcolor) {
                    if (key == this.data.features[i].properties[this.key]) {
                        this.data.features[i].properties.valueColor = this.setcolor[key];
                    }
                }
            }
        }

        function getLine(data) {
            if (data.features[0].geometry.type == "LineString" || data.features[0].geometry.type == "Point") {
                return data;
            }
            var copy = JSON.parse(JSON.stringify(data));
            for (var i = 0; i < copy.features.length; i++) {
                copy.features[i].geometry.type = "LineString";
            }
            return copy;
        }

        function getPoint(data) {
            var copy = JSON.parse(JSON.stringify(data));
            // for (var i = 0; i < copy.features.length; i++) {
            //     copy.features[i].geometry.type = "Point"
            //     copy.features[i].geometry.coordinates = copy.features[i].geometry.coordinates[0]
            // }

            for (var i = 0; i < copy.features.length; i++) {
                var minX = 20037509;
                var maxY = -20037509;
                copy.features[i].geometry.type = "Point";
                for (var j = 0; j < copy.features[i].geometry.coordinates.length; j++) {
                    if (copy.features[i].geometry.coordinates[j][0] < minX) {
                        // 获取最小经度
                        minX = copy.features[i].geometry.coordinates[j][0];
                    }
                    if (copy.features[i].geometry.coordinates[j][1] > maxY) {
                        // 获取最大纬度
                        maxY = copy.features[i].geometry.coordinates[j][1];
                    }
                }
                copy.features[i].geometry.coordinates = [minX, maxY+0.05];// 左上角的坐标
            }
            return copy;
        }
        if (type == 1) {
            this.mapSource = {
                line: {
                    id: this.id + "_AILine",
                    source: {
                        "type": "geojson",
                        "data": getLine(this.data)
                    }
                },
                text: {
                    id: this.id + "_AIText",
                    source: {
                        "type": "geojson",
                        "data": getPoint(this.data)
                    }
                }
            };
        } else if (type == 2) {
            return
        } else if (type == 3) {
            return
        }
    },
    innerLayer: function (type) {
        if (type == 1) {
            this.layers = [];
            var style = this.symbol;
            var testIsolineLayer = new LineLayer({
                sourceId: this.id + "_AILine",
                id: this.id + "_AILine",
                width: style.line.lineWidth,
                color: style.line.lineColor,
                opacity: this.opacity,
                filter: ["==", "$type", "LineString"]
            });
            this.layers.push(testIsolineLayer);
            var _color = {
                "type": "identity",
                "property": style.text.textColor
            }
            var textLayer = new TextLayer({
                sourceId: this.id + "_AIText",
                id: this.id + "_AIText",
                color: _color,
                opacity: this.opacity,
                text: this.key,
                overlap: true,
                filter: ["==", "$type", "Point"]
            });
            this.layers.push(textLayer);
            return this.layers;
        } else if (type == 2) {
            return
        } else if (type == 3) {
            let result = this.setcolor;
            let data = this.data.features;
            for (var i = 0; i < data.length; i++) {
                let curData = data[i];
                let geom = curData.geometry;
                let coord = geom.coordinates;
                let classname = curData.properties.class_name ? curData.properties.class_name : "";
                let color = result[classname];
                if (color == undefined) {
                    color = "#f00";
                }
                let confidence = parseFloat(curData.properties.confidence) * 100;
                let fontRate = confidence.toPrecision(4) + "%";
                fontRate = curData.properties.confidence ? fontRate : "";
                let type = geom.type;
                if (type.indexOf("Line") === -1) {
                    for (let j = 0; j < coord.length; j++) {
                        if (type == "MultiPolygon") {
                            //console.log(coord[j].length)
                            for (let k = 0; k < coord[j].length; k++) {
                                let _coord = coord[j][k];
                                let coordinate_TwoD = [].concat.apply([], _coord);
                                let coordinates = Cesium.Cartesian3.fromDegreesArray(coordinate_TwoD);
                                this.drawLine(coordinates, classname, fontRate, color);
                            }
                        } else {
                            let _coord = coord[j];
                            let coordinate_TwoD = [].concat.apply([], _coord);
                            let coordinates = Cesium.Cartesian3.fromDegreesArray(coordinate_TwoD);
                            this.drawLine(coordinates, classname, fontRate, color);
                        }
                    }
                } else {
                    let coordinate_TwoD = [].concat.apply([], coord);
                    let coordinates = Cesium.Cartesian3.fromDegreesArray(coordinate_TwoD);
                    this.drawLine(coordinates, classname, fontRate, color);
                }
            }
            return {
                id: this.id
            };
        }
    },
    onAdd: function (map, type) {
        this._map = map;
        if (type == 1) {
            map.addSource(this.mapSource.line.id, this.mapSource.line.source);
            map.addSource(this.mapSource.text.id, this.mapSource.text.source);
            for (var i = 0; i < this.layers.length; i++) {
                map.addLayer(this.layers[i].layer);
            }
        } else if (type == 2) {
            return
        } else if (type == 3) {
            map.scene.primitives.add(this.AIResultPrimitve);
            map.scene.primitives.add(this.AILabelPrimitve);
            return {
                id: this.id
            };
        }
    },
    onRemove: function (map, type) {
        this._map = map;
        if (type == 1) {
            for (let index = 0; index < this.layers.length; index++) {
                map.removeLayer(this.layer[index].id);
            }
        } else if (type == 2) {
            return
        } else if (type == 3) {
            this.AIResultPrimitve.removeAll();
            this.AILabelPrimitve.removeAll();
        }
    },
    drawLine: function (coordinates, classname, fontRate, color) {
        let _this = this;
        // if (_this.detectType == "ROADS_BJ" || _this.detectType == "SOLAR" || _this.detectType == "WATER") {
        var polyline = new Cesium.PolylineGeometry({
            positions: coordinates,
            width: 1.0,
            vertexFormat: Cesium.PolylineColorAppearance.VERTEX_FORMAT
        });
        var geometry = Cesium.PolylineGeometry.createGeometry(polyline);
        var instance = new Cesium.GeometryInstance({
            geometry: geometry,
            attributes: {
                color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromCssColorString(color))
            },
        });
        this.AIResultPrimitve.add(new Cesium.Primitive({
            geometryInstances: instance,
            appearance: new Cesium.PolylineColorAppearance()
        }));
        let positionData = Cesium.Rectangle.fromCartesianArray(coordinates);
        if (classname != undefined) {
            //增加飞机名 识别率
            let c = Cesium.Rectangle.northwest(positionData);
            let position0 = Cesium.Cartesian3.fromRadians(c.longitude, c.latitude, c.height);
            //新增标签到标签集合中
            this.AILabelPrimitve.add({
                position: position0,
                font: '14px Helvetica',
                fillColor: Cesium.Color.fromCssColorString(color),
                //eyeOffset: new Cesium.Cartesian3(0.0, 11.0, 0.0),
                pixelOffset: new Cesium.Cartesian2(0.0, -5.0),
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                text: classname + " " + fontRate
            });
        }
        // } else {
        //     let positionData = Cesium.Rectangle.fromCartesianArray(coordinates);
        //     //增加标识范围
        //     var rectangle = new Cesium.RectangleOutlineGeometry({
        //         ellipsoid: Cesium.Ellipsoid.WGS84,
        //         rectangle: positionData,
        //         // vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT
        //     });
        //     var geometry = Cesium.RectangleOutlineGeometry.createGeometry(rectangle);
        //     var instance = new Cesium.GeometryInstance({
        //         geometry: geometry,
        //         attributes: {
        //             color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromCssColorString(color))
        //         },
        //     });
        //     this.AIResultPrimitve.add(new Cesium.Primitive({
        //         geometryInstances: instance,
        //         appearance: new Cesium.PerInstanceColorAppearance()
        //     }));
        // }
    },
    get: function (url) {
        var self = this;
        // XMLHttpRequest对象用于在后台与服务器交换数据
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, false);
        xhr.onreadystatechange = function () {
            // readyState == 4说明请求已完成
            if (xhr.readyState == 4 && xhr.status == 200 || xhr.status == 304) {
                // 从服务器获得数据 
                self.setcolor = JSON.parse(xhr.responseText)
                // fn.call(this, xhr.responseText);
            }
        };
        xhr.send();
        return JSON.parse(xhr.responseText)
    }
});

export {
    AIDistinguishLayer
}