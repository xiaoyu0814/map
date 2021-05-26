import {
    MapboxStyle
} from "./MapboxStyle";
import {
    getFind
} from "../core/find"

//require
/***
 *
 * @author yqq
 */

/**
 * 该对象代表您网页上的地图。它公开了方法和属性，使您能够以编程方式更改地图，并在用户与其交互时触发事件<br/>
 * 您可以通过指定一个 container和其他选项来创建。然后PIE-Map JS在页面上初始化地图并返回您的Mapbox对象。
 * 
 */

function Mapbox() {
    MapboxStyle.call(this);
    this.map = null;
    this.style = {
        "version": 8,
        "name": "Klokantech Basic",
        "metadata": {
            "mapbox:autocomposite": false,
            "mapbox:type": "template",
            "maputnik:renderer": "mbgljs"
        },
        "center": [0, 0],
        "zoom": 2,
        "bearing": 0,
        "pitch": 0,
        "sources": {},
        "glyphs": "fonts/{fontstack}/{range}.pbf",
        "layers": []
    };
    var self = this;
    this.defaultSettings = {
        center: [0, 0],
        zoom: 0,
        container: 'map',
        style: self.style,
    };
    this.mapSources = [];
    this.layers = [];

}
Mapbox.prototype = Object.assign(Object.create(MapboxStyle.prototype), {

    /**
     * 转换数据渲染类型
     * 
     *
     * [container] — 1：Mapbox渲染类型，2：OpenLayer渲染类型<br/>
     * [zoom] — 缩放级别<br/>
     * [center] — 地图中心点位置<br/>
     * [type] — 渲染类型 1：Mapbox渲染类型，2：OpenLayer渲染类型<br/>
     * [sprite] — 用于检索sprite图像和元数据的基本URL。将自动附加扩展名.png、.json和scale factor@2x.png。<br/>
     * [glyphs] — 用于加载PBF格式的有符号距离字段标志符号集的URL模板
     */
    changeStyles: function (options) {
        var self = this;
        for (var pro in options) {
            if (pro == "container") {
                self.defaultSettings.container = options[pro];
            }
            if (pro == "zoom") {
                self.defaultSettings.zoom = options[pro];
            }
            if (pro == "center") {
                self.defaultSettings.center = options[pro];
            }
            if (pro == "type") {
                self.defaultSettings.type = options[pro];
            }
            if (pro == "sprite") {
                self.defaultSettings.style.sprite = options[pro];
            }
            if (pro == "glyphs") {
                self.defaultSettings.style.glyphs = options[pro];
            }
            if (pro == "epsg") {
                self.defaultSettings.epsg = options[pro];
            }
            if (pro == "doubleClickZoom") {
                self.defaultSettings.doubleClickZoom = options[pro];
            }
            if (pro == "tileBounds") {
                self.defaultSettings.doubleClickZoom = options[pro];
            }
            if (pro == "style") {
                self.defaultSettings.style = options[pro];
            }
            if (pro == "backgroundColor") {

                var background = {
                    "id": "background",
                    "type": "background",
                    "paint": {
                        "background-color": options[pro]
                    }
                }
                self.defaultSettings.style.layers.push(background)
            }
        }
    },
    /**
     * 初始化地图
     * 
     
     */
    initMap: function () {
        var self = this;
        self.map = new mapboxgl.Map(self.defaultSettings);
        // console.log(self.style)
        return self.map;
    },

    /**
     * 将定义的source 添加到mapbox对象中。
     * 
     * 
     */
    innerSource: function (source) {
        var self = this;
        if (!source) {
            console.error("数据源错误");
            return;
        }
        if (self.map.getSource(source.id)) {
            if (!source.source.data) return
            self.map.getSource(source.id).setData(source.source.data);
        } else {
            self.map.addSource(source.id, source.source);
        }
    },

    /**
     * 监听绘制追加，如有变动则会重绘此图层
     * 
     * 
     */
    addGraphicsEvent: function (layer) {
        var self = this;
        layer.geometry.addEventListener("addPoint", function (e) {
            console.log(e);
            layer.initData();
            var source_data = layer.source.source.data;
            self.map.getSource(layer.id).setData(source_data);
        })
    },

    /**
     * 监听图层的属性，如有属性变动则会重绘此图层
     * 
     *
     */
    EventListener: function (layer) {
        var self = this;
        if (layer.type == "Graphics") this.addGraphicsEvent(layer);
        if (!layer.addEventListener) {
            return;
        }
        layer.addEventListener("source", function (e) {
            if (PIE.MAPTYPE !== 1) return;
            if (layer.type == "rasterLayer") {
                self.map.getSource(layer.source.id).url = e.data;
            } else {
                self.map.getSource(layer.source.id).setData(e.data);
                layer.source.source.data = e.data;
            }

        });

        layer.addEventListener("visible", function (e) {
            console.log(3)
            if (PIE.MAPTYPE !== 1) return;
            if (layer.type === "StationLayer") {
                for (var i = 0; i < layer.Layers.length; i++) {
                    self.map.setLayoutProperty(layer.Layers[i].id, 'visibility', e.visible);
                }
            } else {
                self.map.setLayoutProperty(layer.id, 'visibility', e.visible);
            }

        });
        layer.addEventListener("opacity", function (e) {
            if (PIE.MAPTYPE !== 1) return;
            if (layer.type === "StationLayer") {
                for (var i = 0; i < layer.Layers.length; i++) {
                    self.map.setPaintProperty(layer.Layers[i].id, layer.Layers[i].layer.type + '-opacity', e.opacity);
                }
            } else {
                self.map.setPaintProperty(layer.id, e.target.layer.type + '-opacity', e.opacity);
            }

        });
        layer.addEventListener("color", function (e) {
            if (PIE.MAPTYPE !== 1) return;
            if (layer.type === "StationLayer") {
                for (var i = 0; i < layer.Layers.length; i++) {
                    self.map.setPaintProperty(layer.Layers[i].id, layer.Layers[i].layer.type + '-color', e.color);
                }
            } else {
                self.map.setPaintProperty(layer.id, e.target.layer.type + '-color', e.color);
            }
        });
        layer.addEventListener("size", function (e) {
            if (PIE.MAPTYPE !== 1) return;
            if (layer.type === "StationLayer") {
                for (var i = 0; i < layer.Layers.length; i++) {
                    self.map.setPaintProperty(layer.Layers[i].id, layer.Layers[i].layer.type + '-radius', e.size);
                }
            } else {
                self.map.setPaintProperty(layer.id, e.target.layer.type + '-radius', e.size);
            }
        });
        layer.addEventListener("width", function (e) {
            if (PIE.MAPTYPE !== 1) return;
            if (layer.type === "StationLayer") {
                for (var i = 0; i < layer.Layers.length; i++) {
                    self.map.setPaintProperty(layer.Layers[i].id, layer.Layers[i].layer.type + '-width', e.width);
                }
            } else {
                self.map.setPaintProperty(layer.id, e.target.layer.type + '-width', e.width);
            }
        });
        var temp = getFind(this.layers, layer.id)
        if (!temp) {
            this.layers.push(layer);
        }
    },

    /**
     * 将数据源添加到地图图层
     * <p>依据传入的数据源id，添加对应的数据源属性</p>
     *
     */
    addSource: function (id, obj) {
        var self = this;
        if (self.map.getSource(id)) {
            var r = self.map.getSource(id).setData(obj);
            return r;
        } else {
            var r = self.map.addSource(id, obj);
            self.mapSources.push(id);
            return r;
        }
    },

    /**
     * 将数据图层添加到地图图层中
     * <p>依据传入的图层id，添加对应的图层属性</p>
     *
     */
    addLayer: function (layerId, obj) {
        var self = this;
        if (self.map.getLayer(obj.id)) {
            var r = self.map.addLayer(layerId, obj.id);
            this.layers.push(r);
            return r;
        } else {
            return false;
        }
    },

    /**
     * 创建新图层
     * 
     *
     */
    add: function (layer) {
        var self = this;
        console.log("add" + layer.type);
        self.EventListener(layer);
        if (layer.type == "GridLatLonLayers") {
            console.log(layer);
            for (var i = 0; i < layer.Layers.length; i++) {
                self.add(layer.Layers[i]);
            }
        } else if (layer.type == "Graphics") {
            console.log(layer);
            layer.initData();
            this.innerSource(layer.source);
            self.map.addLayer(layer.layer);
        } else if (layer.type == "MaskGridTileLayer") {
            console.log(layer.layer)
            this.innerSource(layer.source)
            self.map.addLayer(layer.layer)
            if (layer.mask) {
                this.innerSource(layer.maskSource)
                self.map.addLayer(layer.maskLayer)
            }
        } else if (layer.type == "GraphicsLayer") {
            layer.map = this;
            for (var i = 0; i < layer.graphics.length; i++) {
                self.add(layer.graphics[i])
            }
        } else if (layer.type == "windMapLayer") {
            if (layer.cesiumLayer) layer.cesiumLayer.remove();
            var test = self.initWindMapStyle(layer);
            layer.mapboxLayer = test;
            //self.map.addLayer(test)
        } else if (layer.type == "heatmap") {
            layer.initData(layer);
            if (layer.source) {

                self.innerSource(layer.source);
                self.map.addLayer(layer.layer);
            } else {
                layer.addEventListener("load", function () {
                    if (layer.layer.type == "VECTOR") return;
                    if (self.map.getLayer(layer.layer.id)) return;
                    self.innerSource(layer.source);
                    self.map.addLayer(layer.layer);
                });
            }
        } else if (layer.type == "VectorTileLayer") {
            if (layer.style == "") {
                layer.addEventListener("load", function () {
                    self.map.setStyle(layer.style);
                });
            }
        } else if (layer.type == "fillLayer" || layer.type == "iconLayer" || layer.type == "textLayer" || layer.type == "pointLayer" || layer.type == "lineLayer") {
            if (layer.source) {
                self.innerSource(layer.source);
                if (layer.type == "iconLayer" && layer.loadImageUrl) {
                    self.map.loadImage(layer.loadImageUrl, function (error, image) {
                        if (error) throw error;
                        if (!self.map.hasImage('position')) self.map.addImage('position', image);
                        layer.layer.layout["icon-image"] = "position";
                        self.map.addLayer(layer.layer);
                    })
                } else {
                    self.map.addLayer(layer.layer);
                }
            } else {
                layer.addEventListener("load", function () {
                    self.innerSource(layer.source);
                    if (layer.type == "iconLayer" && layer.loadImageUrl) {
                        self.map.loadImage(layer.loadImageUrl, function (error, image) {
                            if (error) throw error;
                            if (!self.map.hasImage('position')) self.map.addImage('position', image);
                            layer.layer.layout["icon-image"] = "position";
                            self.map.addLayer(layer.layer);
                        })
                    } else {
                        self.map.addLayer(layer.layer);
                    }
                });
            }
        } else {
            console.log("vvvv:" + layer.type);
            //source生成
            var _source = layer.innerSource(1);
            if (_source && _source.source && _source.source.type == "geojson") {
                if (_source.source.data) {
                    self.innerSource(_source);
                    //layer生成
                    var _layer = layer.innerLayer(1);
                    //添加到地图中
                    layer.onAdd(self.map, 1)
                } else {
                    layer.addEventListener("load", function () {
                        self.innerSource(layer.innerSource(1));
                        //layer生成
                        var _layer = layer.innerLayer(1);
                        //添加到地图中
                        layer.onAdd(self.map, 1)
                    });
                }
            } else {
                self.innerSource(_source);
                //layer生成
                var _layer = layer.innerLayer(1);
                //添加到地图中
                layer.onAdd(self.map, 1)
            }
        }
    },

    /**
     * 依据传入的参数id属性，移除对应的图层
     * 
     * 
     */
    remove: function (layer) {
        console.log("remove")
        var self = this;
        if (layer.type == "GridLatLonLayers") {
            for (var i = 0; i < layer.Layers.length; i++) {
                self.map.removeLayer(layer.Layers[i].layer.id);
                self.map.removeSource(layer.Layers[i].layer.id);
                var index = self.layers.indexOf(layer.Layers[i].layer);
                if (index > -1) {
                    self.layers.splice(index, 1);
                }
            }
        } else if (layer.type == "StationLayer") {
            var mapLayers = self.map.getStyle().layers
            var length = mapLayers.length
            for (var i = 0; i < length; i++) {
                if (mapLayers[i].source == layer.source.id) {
                    self.map.removeLayer(mapLayers[i].id);
                }
            }
            self.map.removeSource(layer.source.id);
            var index = self.layers.indexOf(layer);
            if (index > -1) {
                self.layers.splice(index, 1);
            }
        } else if (layer.type == "IsoLineLayer") {
            var mapLayers = self.map.getStyle().layers
            var length = mapLayers.length
            for (var i = 0; i < length; i++) {
                if (mapLayers[i].source == layer.source.id) {
                    self.map.removeLayer(mapLayers[i].id);
                }
            }
            self.map.removeSource(layer.source.id);
            var index = self.layers.indexOf(layer);
            if (index > -1) {
                self.layers.splice(index, 1);
            }
        } else if (layer.type == "typhoonLayer") {
            var mapLayers = self.map.getStyle().layers
            var length = mapLayers.length
            for (var i = 0; i < length; i++) {
                if (mapLayers[i].source == layer.source.id) {
                    self.map.removeLayer(mapLayers[i].id);
                }
            }
            self.map.removeSource(layer.source.id);
            var index = self.layers.indexOf(layer);
            if (index > -1) {
                self.layers.splice(index, 1);
            }
        } else if (layer.type == "windMapLayer") {
            if (this.map.getLayer("mapdata")) {
                this.map.removeLayer("mapdata");
                this.map.removeSource("mapdata");
                layer.mapboxLayer.removeEventMapLayer()
            }
        } else if (layer.type == "GraphicsLayer") {
            for (var i = layer.graphics.length - 1; i >= 0; i--) {
                self.remove(layer.graphics[i]);
                layer.graphics.splice(i, 1)
            }
            var index = self.layers.indexOf(layer);
            if (index > -1) {
                self.layers.splice(index, 1);
            }
        } else if (layer.type == "AIDistinguishLayer") {
            // var mapLayers = self.map.getStyle().layers
            // var length = mapLayers.length
            // for (var i = 0; i < length; i++) {
            //     for (var j = 0; j < layer.layers.length; j++) {
            //         if (mapLayers[i].source == layer.layers[j].id) {
            //             self.map.removeLayer(mapLayers[i].id);
            //             self.map.removeSource(layer.layers[j].id);
            //         }
            //     }
            // }
            for(var i=0; i<layer.layers.length; i++){
                self.map.removeLayer(layer.layers[i].id)
            }
            
            for (var key in layer.mapSource) {
                self.map.removeSource(layer.mapSource[key].id)
            }

            var index = self.layers.indexOf(layer);
            if (index > -1) {
                self.layers.splice(index, 1);
            }
        } else {
            console.log(layer)
            self.map.removeLayer(layer.id);
            self.map.removeSource(layer.id);
            var index = self.layers.indexOf(layer);
            if (index > -1) {
                self.layers.splice(index, 1);
            }
        }
    },
    getAllLayers: function () {
        let _layers = this.map.style._layers;
        let reLayers = [];
        for (let item in _layers) {
            reLayers.push(_layers[item]);
        }
        return reLayers;
    },

    /**
     * 依据传入的图层id，查找图层
     * 
     * 
     */
    findLayerById: function (layerId) {
        var self = this;
        for (var i = 0; i < this.layers.length; i++) {
            if (this.layers[i].id == layerId) {
                return this.layers[i];
            }
        }
    },

    /**
     * 依据传入的图层id，获取图层
     * 
     *
     */
    getLayer: function (layerId) {
        var self = this;
        for (var i = 0; i < this.layers.length; i++) {
            if (this.layers[i].id == layerId) {
                return this.layers[i];
            }
        }
    },

    /**
     * 将layer图层移动到beforelayer图层的后面
     * 
     * 
     */
    moveLayer: function (layer, beforelayer) {
        var self = this;
        self.map.moveLayer(layer.id, beforelayer.id);
    },

    /**
     * 返回鼠标经过的图层Feature数组
     * 
     * 
     */
    queryRenderedFeatures: function (point, layer) {
        if (layer) {
            var temp = this.map.queryRenderedFeatures(point, {
                layers: [layer.id]
            });
            return temp
        } else {
            var temp = this.map.queryRenderedFeatures(point);
            return temp
        }
    },

    /**
     * 过去地理中心点坐标数组(Array)
     * 
     * 
     */
    getCenter: function () {
        var tempCenter = this.map.getCenter();
        return [tempCenter.lng, tempCenter.lat];
    },
    /**
     * 设置地理中心点坐标数组(Array)
     * 
     * 
     */
    setCenter: function (lnglat) {
        this.map.setCenter(lnglat)
    },

    /**
     * 获取地图的当前缩放级别
     * 
     * 
     */
    getZoom: function () {
        return this.map.getZoom();
    },

    /**
     * 设置地图的缩放等级
     * 
     *
     */
    setZoom: function (index) {
        this.map.setZoom(index);
    },

    /**
     * 获取地图的地理边界
     * 
     *
     */
    getBounds: function () {
        var tempBounds = this.map.getBounds();

        return [tempBounds._sw.lng, tempBounds._sw.lat, tempBounds._ne.lng, tempBounds._ne.lat];
    },

    /**
     * 启动地图拖拽
     * 
     * 
     */
    mapMoveEnable: function () {
        this.map.dragPan.enable();
    },

    /**
     * 关闭地图拖拽
     * 
     *
     */
    mapMoveDisable: function () {
        this.map.dragPan.disable();
    },

    /**
     * 启动地图缩放
     * 
     * 
     */
    mapBoxZoomEnable: function () {
        this.map.boxZoom.enable();
    },

    /**
     * 关闭地图缩放
     * 
     * 
     */
    mapBoxZoomDisable: function () {
        this.map.boxZoom.disable();
    },

    /**
     * 启动鼠标滚轮地图缩放
     * 
     *
     */
    mapScrollZoomEnable: function () {
        this.map.scrollZoom.enable();
    },

    /**
     * 关闭鼠标滚轮地图缩放
     * 
     * 
     */
    mapScrollZoomDisable: function () {
        this.map.scrollZoom.disable();
    },

    /**
     * 启动旋转地图
     * 
     */
    mapRotateEnable: function () {
        this.map.dragRotate.enable();
    },

    /**
     * 关闭旋转地图
     * 
     */
    mapRotateDisable: function () {
        this.map.dragRotate.disable();
    },

    /**
     * 启动鼠标双机地图缩放
     * 
     */
    doubleClickZoomEnable: function () {
        this.map.doubleClickZoom.enable();
    },

    /**
     * 关闭鼠标双机地图缩放
     * 
     */
    doubleClickZoomDisable: function () {
        this.map.doubleClickZoom.disable();
    },

    /**
     * 启动选取的图层高亮显示
     *
     * 
     */
    SelectHighlight: function (layers, status) {
        var self = this;
        console.log(layers)
        console.log(layers.length)

        function Highlight(e) {
            // var self = this;
            console.log(e);
            if (PIE.selectTYPE) {
                self.getLayer(e.features[0].layer.id).Selection();
            } else {
                return
            }
        }
        if (status) {
            for (var i = 0; i < layers.length; i++) {
                //if(this.layers[i].type != "Graphics") continue;
                this.map.on('click', layers[i].id, Highlight);
            };
            PIE.selectTYPE = true;
        } else {
            for (var i = 0; i < layers.length; i++) {
                this.map.off('click', layers[i].id, Highlight)
            };
            PIE.selectObject.setColor(PIE.defaultColor.getStyle());
            PIE.defaultColor = null;
            PIE.selectObject = null;
            PIE.selectTYPE = false;
        }

    },
    addControl: function (control) {
        this.map.addControl(control);
    },
    setBearing: function (angle) {
        this.map.setBearing(angle);
    },
    getVisibility: function (layer) {
        this.map.getLayoutProperty(layer, 'visibility');
    },

});
export {
    Mapbox
}