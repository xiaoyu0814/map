import {
    Mapbox
} from '../mapbox/mapbox';
import {
    OpenLayer
} from '../OpenLayer/openLayer';
import {
    Collection
} from "../core/Collection";
import {
    BaseMap
} from './BaseMap';
import {
    PIECesium
} from '../cesium/cesium';
import {
    getFind,
    getIndex,
    getEvent
} from "../core/find"

/**
 * @module Map
 */

/***
 *
 * @param options
 * @author yqq
 */

/**
 * Map 是承载图层的容器，主要用于呈现地图服务、影像服务、此外还可以展示符合OGC标准的WMS服务等，一个图层只有被添加到Map中，才能被显示出来
 * <a href="../../examples/Test_new.html">new.html:26</a>
 * 
 *
 * @class Map
 * @param {Object} options 
 * [type] — 地图的渲染类别，默认为1Mapbox渲染。1：Mapbox渲染类型，2：OpenLayer渲染类型。3:Ceisum渲染类型<br/>
 * @constructor
 */

var loading = true;
var listenNum = 0;

function Map(options) {

    var self = this;
    /* //没传配置项自己丢错
     if(!options) {
         throw new Error("请传入配置参数");
     }*/
    options = options || {};
    loading = true;

    this.mapbox = new Mapbox();
    // this.mapboxgl = new mapboxgl;
    this.openlayer = new OpenLayer();
    this.pieCesium = new PIECesium();
    this.map;
    this.defaultSettings = {
        type: 1
    };
    this.basemap = new BaseMap() || options.baseMap;
    this.defaultSettings.type = options.type !== undefined ? options.type : 1;
    this.layers = [];
    this.PIEEvents = [];
}
Map.prototype = {
    /**
     * 初始化地图，返回底图map()defaultSettings.type =1时返回mapbox; map()defaultSettings.type =2时返回openlayer;
     * 
     */
    initMap: function () {
        console.log("initMap");
        var self = this;
        if (self.defaultSettings.type == 1) {
            PIE.MAPTYPE = 1;
            self.map = self.mapbox.initMap();
        } else if (self.defaultSettings.type == 2) {
            PIE.MAPTYPE = 2;
            self.map = self.openlayer.initMap();
        } else if (self.defaultSettings.type == 3) {
            PIE.MAPTYPE = 3;
            self.map = self.pieCesium.initMap();
        }
    },

    /**
     * 将数据源添加到地图图层
     * <p>依据传入的数据源id，添加对应的数据源属性</p>
     * 
     * 
     * @method addSource
     * @param {string} id 要添加的数据源的ID,不可以要添加到的数据源ID重复
     * @param {Object} obj Source对象
     * @return {Object} Source对象
     */
    addSource: function (id, obj) {
        console.log(id, obj)
        var self = this;
        if (self.defaultSettings.type == 1) {
            return self.mapbox.addSource(id, obj);
        }
    },

    /**
     * 将数据图层添加到地图图层中
     * <p>依据传入的图层id，添加对应的图层属性</p>
     * <a href="../../examples/Test_Canvas.html">Test_Canvas.html:90</a>
     * 
     * @param {string} layerId 要添加的数据源的ID,不可以要添加到的数据源ID重复
     * @param {Object} obj layer对象
     * @method addLayer
     * @return {Object} layer对象
     */
    addLayer: function (layerId, obj) {
        var self = this;
        if (self.defaultSettings.type == 1) {
            return self.mapbox.addLayer(layerId, obj);
        }
    },

    /**
     * 创建新图层
     * <a href="../../examples/Test_Point.html">Test_Point.html:54</a>
     * 
     * @param {Object} layer layer对象
     * @method add
     */
    add: function (layer) {
        //console.log("add");
        var self = this;
        // var temp = self.layers.find((item) => {
        //     return layer == item;
        // });
        var temp = getFind(self.layers, layer.id)
        // console.log(temp);
        if (temp) {

        } else {
            self.layers.push(layer);
        }
        if (self.defaultSettings.type == 1) {
            if (layer.type == "VideoLayer") {
                var _layer = layer.innerLayer(self.defaultSettings.type);
                console.log(_layer)
                self.mapbox.map.addLayer(_layer);
            }
            self.mapbox.add(layer);
        } else if (self.defaultSettings.type == 2) {
            if (layer.type == "VideoLayer") {
                var _layer = layer.innerLayer(self.defaultSettings.type);
                console.log(_layer)
                self.pieCesium;
            }
            self.openlayer.add(layer);
        } else if (self.defaultSettings.type == 3) {
            if (layer.type == "VideoLayer") {
                var _layer = layer.innerLayer(self.defaultSettings.type);
                console.log(_layer)
                self.pieCesium;
            }
            self.pieCesium.add(layer);
        };
    },
    /**
     * 添加多个图层
     * 
     * @param {Array} layers layer对象的数组
     * @method addMany
     */
    addMany: function (layers) {
        console.log("addMany");
        var self = this;
        var length = layers.length;
        for (var i = 0; i < length; i++) {
            if (self.defaultSettings.type == 1) {
                self.mapbox.add(layers[i]);
            } else if (self.defaultSettings.type == 2) {
                self.openlayer.add(layers[i]);
            } else if (self.defaultSettings.type == 3) {
                self.pieCesium.add(layers[i]);
            }
        }
    },

    /**
     * 移除对应的Layer对象
     * <a href="../../examples/openLayer_LayerCountSet.html">layerCountSet.html:194</a>
     * 
     * @param {Object} layer layer对象
     * @method remove
     */
    remove: function (layer) {
        //console.log("remove");
        var self = this;
        var index = getIndex(self.layers, layer.id);
        if (index > -1) {
            self.layers.splice(index, 1);
        }
        if (this.defaultSettings.type == 1) {
            self.mapbox.remove(layer);
        } else if (self.defaultSettings.type == 2) {
            self.openlayer.remove(layer);
        } else if (self.defaultSettings.type == 3) {
            self.pieCesium.remove(layer);
        }
    },

    /**
     * 移除对应的多个Layer对象
     * 
     * @param {Array} layers layer对象的数组
     * @method removeMany
     */
    removeMany: function (layers) {
        console.log("removeMany");
        var self = this;
        for (var i = 0; i < layers.length; i++) {
            if (self.defaultSettings.type == 1) {
                self.mapbox.remove(layers[i]);
            } else {

            }
        }
    },
    removeAll: function () {
        this.removeMany(this.layers)
    },

    /**
     * 依据传入的图层id，查找图层
     * 
     */
    findLayerById: function (id) {
        if (this.defaultSettings.type == 1) {
            return this.mapbox.findLayerById(id);
        }

    },

    /**
     * 依据传入的图层id，获取图层
     * <a href="../../examples/openLayer_LayerCountSet.html">layerCountSet.html:185</a>
     * 
     * @param {String} id 字符串，layer对象的id
     * @method getLayer
     * @return {Object} layer对象
     */
    getLayer: function (id) {
        var self = this;
        /* if (this.defaultSettings.type == 1) {
             return this.mapbox.getLayer(id);
         } else if (self.defaultSettings.type == 2) {
             return self.openlayer.getLayer(id);
         }*/
        var layer = getFind(this.layers, id);
        return layer;

    },

    /**
     * 将layer图层移动到beforelayer图层的后面
     * <a href="../../examples/openLayer_LayerCountSet.html">layerCountSet.html:201</a>
     * 
     * @param {Object} layer layer对象
     * @param {Object} beforelayer layer对象
     * @method moveLayer
     */
    moveLayer: function (layer, beforelayer) {
        var self = this;
        var zhiqian = self.layers.indexOf(beforelayer);
        var zhihou = self.layers.indexOf(layer);
        self.layers.splice(zhihou, 1);
        self.layers.splice(zhiqian, 0, layer)
        if (this.defaultSettings.type == 1) {
            this.mapbox.moveLayer(layer, beforelayer);
        } else if (this.defaultSettings.type == 2) {
            this.openlayer.moveLayer(layer, beforelayer);
        } else if (this.defaultSettings.type == 3) {
            this.pieCesium.movelayer(layer, beforelayer);
        }
    },

    clear(id) {
        var length = this.layers.length;
        for (var i = length - 1; i > 0; i--) {
            if (typeof id === "string" || id === undefined) {
                if (this.layers[i].id === "switcher_map" || this.layers[i].id === id) {

                } else {
                    this.remove(this.layers[i]);
                }
            } else {
                for (var j = 0; j < id.length; j++) {
                    if (this.layers[i].id !== id[j]) this.remove(this.layers[i]);
                }
            }
        }
    },
    /**
     * 转换数据渲染类型
     * <a href="../../examples/Test_Maptype.html">maptype.html:60</a>
     * 
     * @param {Number} type 渲染类型 传入1表示使用Mapbox渲染数据，传入2表示使用Openlayer渲染数据，传入3表示使用Ceisum渲染数据（三维球展示）
     * @method changeMapType
     */
    changeMapType: function (type, container) {
        container == undefined ? "map" : container;
        var self = this;
        var temp = self.defaultSettings.type;
        self.defaultSettings.type = type;
        var map = document.getElementById(container) //.remove();
        var parentNode = map.parentNode
        parentNode.removeChild(map)
        var dom = document.createElement('div');
        dom.id = container;
        parentNode.appendChild(dom)
        self.initMap();
        self.changemaptype_test = true
        if (self.defaultSettings.type == 1) {
            self.map.on('load', function () {
                self.addMany(self.layers);
            })
            // self.PIEEvents.forEach((item)=>{
            //     self.off(item.type, item.layer, item.listen);
            //     self.on(item.type, item.layer, item.listen);
            // })
            var length = self.PIEEvents.length
            for (var i = 0; i < length; i++) {
                self.off(self.PIEEvents[0].type, self.PIEEvents[0].layer, self.PIEEvents[0].listen);
                self.on(self.PIEEvents[0].type, self.PIEEvents[0].layer, self.PIEEvents[0].listen);
            }
            self.changemaptype_test = undefined
        } else {
            self.addMany(self.layers);
            // self.PIEEvents.forEach((item)=>{
            //     self.off(item.type, item.layer, item.listen);
            //     self.on(item.type, item.layer, item.listen);
            // }) 
            var length = self.PIEEvents.length
            for (var i = 0; i < length; i++) {
                self.off(self.PIEEvents[0].type, self.PIEEvents[0].layer, self.PIEEvents[0].listen);
                self.on(self.PIEEvents[0].type, self.PIEEvents[0].layer, self.PIEEvents[0].listen);
            }
            self.changemaptype_test = undefined
        }
    },


    /**
     * 为指定的layer图层要素上发生的指定类型的事件添加侦听器
     * <a href="../../examples/Test_AddRemoveMove.html">addRemoveMove.html:338</a>
     * 
     * @param {String} type 要侦听的事件类型
     * @param {String} layer layer图层的ID
     * @param {Funcion} listen 在执行事件时要调用的函数
     * @method on
     */
    on: function (type, layer, listen) {
        // console.log("2hehehehe",type,listen)
        //console.log(navigator)
        var _event = {
            id: listenNum,
            type: type,
            layer: layer,
            listen: listen
        };
        if (!this.changemaptype_test) {
            var temp = getEvent(this.PIEEvents, _event);
            if (temp) {
                return
            }

        }
        
        this.PIEEvents.push(_event);
        var self = this;
        if (self.defaultSettings.type == 1) {

            if (/(iPad|iPhone|iPod|Android)/g.test(navigator.userAgent)) {
                if (type == "mousedown") type = "touchstart";
                if (type == "mouseup") type = "touchend";
                self.map.on(type, layer, listen);
            } else {
                if (type == "load") {
                    if (loading) {
                        function callback() {
                            layer()
                            self.map.off("load", layer, listen);
                            loading = false
                        }
                        self.map.once("load", callback, listen);
                    }
                } else {
                    self.map.on(type, layer, listen);
                }
            }
        } else if (self.defaultSettings.type == 2) {
            if (type == "move") type = "movestart";
            if (type == "mousemove") type = "pointermove";
            if (type == "mousedown") type = "pointerdown";
            if (type == "mouseup") type = "pointerup";
            if (type == "zoomend") type = "moveend";
            if ((typeof layer) == 'function') {
                listen = layer;
                if (type == "load") {
                    if (loading) {
                        listen()
                        return
                    } else {
                        return
                    }
                }

                function callback(e) {
                    //console.log(e);
                    listen(e)
                }
                self.map.on(type, callback);
            } else {
                // var OLlayer = self.openlayer.layers.find((item)=>{
                //     return layer == item.id;
                // });
                var OLlayer = getFind(self.openlayer.layers, layer.id);
                OLlayer.on(type, listen);
            }
        } else if (self.defaultSettings.type == 3) {
            if ((typeof layer) == 'function') {
                listen = layer;

                if (type == "load") {
                    if (loading) {
                        listen()
                        return
                    } else {
                        return
                    }
                } else if (type == "mousedown" || type == "click") {
                    console.log(self.pieCesium.mouseEventHandler);
                    if (!self.pieCesium.mouseEventHandler) {
                        self.pieCesium.mouseEventHandler = new Cesium.ScreenSpaceEventHandler(self.pieCesium.map._cesiumViewer.scene.canvas)
                    }
                    self.pieCesium.mouseEventHandler.setInputAction(function (event) {
                        var position = event.position;
                        if (!Cesium.defined(position)) {
                            return;
                        }
                        var ray = self.map._cesiumViewer.camera.getPickRay(position);
                        if (!Cesium.defined(ray)) {
                            return;
                        }
                        var cartesian = self.map._cesiumViewer.scene.globe.pick(ray, self.map._cesiumViewer.scene);
                        if (!Cesium.defined(cartesian)) {
                            return;
                        }
                        var cartographic = self.map._cesiumViewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
                        //将弧度转为度的十进制度表示
                        var pos = {
                            lon: Cesium.Math.toDegrees(cartographic.longitude),
                            lat: Cesium.Math.toDegrees(cartographic.latitude),
                            alt: Math.ceil(cartographic.height)
                        };
                        let coordinate = [pos.lon, pos.lat]
                        listen({
                            coordinate: coordinate,
                            originalEvent: {
                                button: 0
                            }
                        })
                    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
                    self.pieCesium.mouseEventHandler.setInputAction(function (event) {
                        var position = event.position;
                        if (!Cesium.defined(position)) {
                            return;
                        }
                        var ray = self.map._cesiumViewer.camera.getPickRay(position);
                        if (!Cesium.defined(ray)) {
                            return;
                        }
                        var cartesian = self.map._cesiumViewer.scene.globe.pick(ray, self.map._cesiumViewer.scene);
                        if (!Cesium.defined(cartesian)) {
                            return;
                        }
                        var cartographic = self.map._cesiumViewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
                        //将弧度转为度的十进制度表示
                        var pos = {
                            lon: Cesium.Math.toDegrees(cartographic.longitude),
                            lat: Cesium.Math.toDegrees(cartographic.latitude),
                            alt: Math.ceil(cartographic.height)
                        };
                        let coordinate = [pos.lon, pos.lat]
                        listen({
                            coordinate: coordinate,
                            originalEvent: {
                                button: 2
                            }
                        })
                    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
                    //self.mouseEventHandler=new Cesium.ScreenSpaceEventHandler(self.map._cesiumViewer.scene.canvas);
                } else if (type == "mousemove") {
                    self.pieCesium.mouseEventHandler.setInputAction(function (event) {
                        var position = event.position;
                        if (!Cesium.defined(position)) {
                            return;
                        }
                        var ray = self.map._cesiumViewer.camera.getPickRay(position);
                        if (!Cesium.defined(ray)) {
                            return;
                        }
                        var cartesian = self.map._cesiumViewer.scene.globe.pick(ray, self.map._cesiumViewer.scene);
                        if (!Cesium.defined(cartesian)) {
                            return;
                        }
                        var cartographic = self.map._cesiumViewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
                        //将弧度转为度的十进制度表示
                        var pos = {
                            lon: Cesium.Math.toDegrees(cartographic.longitude),
                            lat: Cesium.Math.toDegrees(cartographic.latitude),
                            alt: Math.ceil(cartographic.height)
                        };
                        let coordinate = [pos.lon, pos.lat]
                        console.log(coordinate);
                        listen({
                            coordinate: coordinate
                        })
                    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
                }
                //self.map.on(type, listen);
            }
        }

    },
    once: function (type, layer, listen) {
        var _event = {
            type: type,
            layer: layer,
            listen: listen
        };
        this.PIEEvents.push(_event);
        var self = this;
        if (self.defaultSettings.type == 1) {

            if (/(iPad|iPhone|iPod|Android)/g.test(navigator.userAgent)) {
                if (type == "mousedown") type = "touchstart";
                if (type == "mouseup") type = "touchend";
                self.map.once(type, layer, listen);
            } else {
                self.map.once(type, layer, listen);
            }
        } else if (self.defaultSettings.type == 2) {

        } else if (self.defaultSettings.type == 3) {

        }
    },
    /**
     * 移除指定类型的事件侦听器
     * <a href="../../examples/Test_AddRemoveMove.html">addRemoveMove.html:333</a>
     * 
     * @param {String} type 以前用于安装侦听器的事件类型
     * @param {String} layer 以前用于安装侦听器的layer图层ID
     * @param {Funcion} listen 以前作为侦听器安装的函数
     * @method off
     */
    off: function (type, layer, listen) {
        var self = this;
        var _event = {
            id: listenNum,
            type: type,
            layer: layer,
            listen: listen
        };
        var event = getEvent(this.PIEEvents, _event)
        // self.map.off(type, layer, listen);
        if (self.defaultSettings.type == 1) {
            self.map.off(type, layer, listen);
            if (event) {
                this.PIEEvents.splice(this.PIEEvents.indexOf(event), 1)
            }
        } else if (self.defaultSettings.type == 2) {
            if ((typeof layer) == 'function') listen = layer;
            if (type == "move") type = "moveend";
            if (type == "mousemove") type = "pointermove";
            if (type == "mousedown") type = "pointerdown";
            if (type == "mouseup") type = "pointerup";

            self.map.un(type, listen);
        } else if (self.defaultSettings.type == 3) {
            if (!self.pieCesium.mouseEventHandler) {
                self.pieCesium.mouseEventHandler = new Cesium.ScreenSpaceEventHandler(self.pieCesium.map._cesiumViewer.scene.canvas)
            }
            if (type == "mousedown" || type == "click") {
                self.pieCesium.mouseEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
                self.pieCesium.mouseEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
            } else if (type == "mousemove") {
                self.pieCesium.mouseEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
            }
        }
    },

    /**
     * 返回鼠标经过的图层Feature数组
     * <a href="../../examples/Test_AddRemoveMove.html">addRemoveMove.html:201</a>
     * 
     */
    queryRenderedFeatures: function (point, layer) {
        if (this.defaultSettings.type == 1) {
            console.log(layer);
            if (layer.type == "") {

            }
            return this.mapbox.queryRenderedFeatures(point, layer);
        }
    },
    /**
     * 获去全部图层(Array)
     * 
     * @method getLayers
     * @return {Array} 图层数组
     */
    getLayers: function () {
        return this.layers;
    },
    getAllMapLayers: function () {
        if (this.defaultSettings.type == 1) {
            return this.mapbox.getAllLayers();
        } else if (this.defaultSettings.type == 2) {
            return this.openlayer.getAllLayers()
        } else if (this.defaultSettings.type == 3) {
            return this.pieCesium.getAllLayers()
        }
    },
    /**
     * 获去地理中心点坐标数组(Array)
     * 
     * @method getCenter
     * @return {Array} 地理中心点坐标数组
     */
    getCenter: function () {
        if (this.defaultSettings.type == 1) {
            return this.mapbox.getCenter();
        } else if (this.defaultSettings.type == 2) {
            return this.openlayer.getCenter()
        } else if (this.defaultSettings.type == 3) {
            return this.pieCesium.getCenter()
        }
    },

    /**
     * 设置地理中心点坐标数组(Array)
     * <a href="../../examples/Test_LayerSet.html">LayerSet.html:176</a>
     * 
     * @param {Array} coordinates 要设置的地理中心点坐标数组
     * @method setCenter
     * @return {Array} 设置完成后的地理中心点坐标数组
     */
    setCenter: function (coordinates) {
        if (this.defaultSettings.type == 1) {
            return this.mapbox.setCenter(coordinates);
        } else if (this.defaultSettings.type == 2) {
            return this.openlayer.setCenter(coordinates)
        } else if (this.defaultSettings.type == 3) {
            return this.pieCesium.setCenter(coordinates)
        }
    },

    /**
     * 获取地图的当前缩放级别
     * 
     * @method getZoom
     * @return {Number} 地图的当前缩放级别
     */
    getZoom: function () {
        if (this.defaultSettings.type == 1) {
            return this.mapbox.getZoom();
        } else if (this.defaultSettings.type == 2) {
            return this.openlayer.getZoom();
        } else if (this.defaultSettings.type == 3) {
            return this.pieCesium.getZoom();
        }
    },

    /**
     * 设置地图的缩放等级
     * <a href="../../examples/Test_LayerSet.html">LayerSet.html:168</a>
     * 
     * @param {Number} index 地图的缩放等级(0-20)
     * @method setZoom
     * @return {Number} 设置完成后地图的缩放等级
     */
    setZoom: function (index) {
        if (this.defaultSettings.type == 1) {
            return this.mapbox.setZoom(index);
        } else if (this.defaultSettings.type == 2) {
            return this.openlayer.setZoom(index);
        }
    },

    /**
     * 获取地图的地理边界
     * <a href="../../examples/Test_Canvas.html">Canvas.html:77</a>
     * 
     * @method getBounds
     * @return {Object} 地图的左上角(_ne)和右下角(_sw)坐标点LngLatBounds对象
     */
    getBounds: function () {
        if (this.defaultSettings.type == 1) {
            return this.mapbox.getBounds();
        } else if (this.defaultSettings.type == 2) {
            return this.openlayer.getBounds();
        } else if (this.defaultSettings.type == 3) {
            return this.pieCesium.getBounds();
        }
    },

    /**
     * 启动地图拖拽
     * <a href="../../examples/Test_AddRemoveMove.html">addRemoveMove.html:227</a>
     * 
     * 
     */
    mapMoveEnable: function () {
        if (this.defaultSettings.type == 1) {
            this.mapbox.mapMoveEnable();
        } else if (this.defaultSettings.type == 2) {

        }
    },

    /**
     * 关闭地图拖拽
     * <a href="../../examples/Test_AddRemoveMove.html">addRemoveMove.html:203</a>
     * 
     *
     */
    mapMoveDisable: function () {
        if (this.defaultSettings.type == 1) {
            this.mapbox.mapMoveDisable();
        } else if (this.defaultSettings.type == 2) {

        }
    },

    /**
     * 启动增加地图Zoom值
     * 
     * 
     */
    mapBoxZoomEnable: function () {
        if (this.defaultSettings.type == 1) {
            this.mapbox.mapBoxZoomEnable();
        } else if (this.defaultSettings.type == 2) {

        }
    },

    /**
     * 关闭增加地图Zoom值
     * 
     * 
     */
    mapBoxZoomDisable: function () {
        if (this.defaultSettings.type == 1) {
            this.mapbox.mapBoxZoomDisable();
        } else if (this.defaultSettings.type == 2) {

        }
    },

    /**
     * 启动鼠标滚轮增加地图Zoom值
     * 
     *
     */
    mapScrollZoomEnable: function () {
        if (this.defaultSettings.type == 1) {
            this.mapbox.mapScrollZoomEnable();
        } else if (this.defaultSettings.type == 2) {

        }
    },

    /**
     * 关闭鼠标滚轮增加地图Zoom值
     * 
     * 
     */
    mapScrollZoomDisable: function () {
        if (this.defaultSettings.type == 1) {
            this.mapbox.mapScrollZoomDisable();
        } else if (this.defaultSettings.type == 2) {

        }
    },

    /**
     * 启动旋转地图
     * 
     * 
     */
    mapRotateEnable: function () {
        if (this.defaultSettings.type == 1) {
            this.mapbox.mapRotateEnable();
        } else if (this.defaultSettings.type == 2) {

        }
    },

    /**
     * 关闭旋转地图
     * 
     *
     */
    mapRotateDisable: function () {
        if (this.defaultSettings.type == 1) {
            this.mapbox.mapRotateDisable();
        } else if (this.defaultSettings.type == 2) {

        }
    },

    /**
     * 启动鼠标双机增加地图Zoom值
     * 
     * 
     */
    doubleClickZoomEnable: function () {
        if (this.defaultSettings.type == 1) {
            this.mapbox.doubleClickZoomEnable();
        } else if (this.defaultSettings.type == 2) {

        }
    },

    /**
     * 关闭鼠标双机增加地图Zoom值
     * 
     *
     */
    doubleClickZoomDisable: function () {
        if (this.defaultSettings.type == 1) {
            this.mapbox.doubleClickZoomDisable();
        } else if (this.defaultSettings.type == 2) {

        }
    },
    insidePolygon: function (points, testPoint) {
        var x = testPoint[0],
            y = testPoint[1];
        var inside = false;
        for (var i = 0, j = points.length - 1; i < points.length; j = i++) {
            var xi = points[i][0],
                yi = points[i][1];
            var xj = points[j][0],
                yj = points[j][1];

            var intersect = ((yi > y) != (yj > y)) &&
                (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    },
    /**
     * 开启单个图层选中高亮
     * <a href="../../examples/Test_SelectLayer.html">selectLayer.html:121</a>
     * 
     * @param {Array} layers layer图层数组
     * @method onSelectHighlight
     */
    onSelectHighlight: function (layers) {
        if (this.defaultSettings.type == 1) {
            this.mapbox.SelectHighlight(layers, true);
        } else if (this.defaultSettings.type == 2) {

        }
    },

    /**
     * 关闭单个图层选中高亮
     * <a href="../../examples/Test_SelectLayer.html">selectLayer.html:126</a>
     * 
     * @param {Array} layers layer图层数组
     * @method offSelectHighlight
     */
    offSelectHighlight: function (layers) {
        console.log(layers)
        console.log(layers.length)
        if (this.defaultSettings.type == 1) {
            this.mapbox.SelectHighlight(layers, false);
        } else if (this.defaultSettings.type == 2) {

        };
    },

    /**
     * 切换投影方式
     * <a href="../../examples/Test_LayerSet.html">LayerSet.html:271</a>
     * 
     * @param {String} code 投影代码 "EPSG:4326" 、"EPSG:3857"、"EPSG:2700"
     * @method projectionModes
     */
    projectionModes: function (code) {
        console.log(code);
        this.openlayer.projection = code;
        this.openlayer.defaultSettings.view.projection = code;
        this.openlayer.mapSources = [];
        this.openlayer.layers = [];
        if (code == "EPSG:3857") {
            this.defaultSettings.type = 1
            PIE.MAPTYPE = 1
        } else {
            this.defaultSettings.type = 2
            PIE.MAPTYPE = 2
        }
        if (this.defaultSettings.type == 1) {
            this.changeMapType(1)
            //this.initMap();

        } else if (this.defaultSettings.type == 2) {
            this.openlayer.defaultSettings.view.center = [0, 0];
            this.changeMapType(2);

            //this.openlayer.projectionModes(code);
        };
    },
    /**
     * 绘制经纬线
     *
     * @param {Boolean} overflow 是否标注度数,缺省值为true，取值方式为true/false
     * @method gridLatLon
     */
    gridLatLon: function (overflow) {
        var self = this
        if (overflow == undefined) {
            overflow = true;
        }
        var _LineLat;

        function addLayer() {
            var zoom = parseInt(self.getZoom())
            var interval = 10
            if (zoom < 2) {
                interval = 10
            } else if (zoom > 2 && zoom <= 3) {
                interval = 9
            } else if (zoom > 3 && zoom <= 4) {
                interval = 8
            } else if (zoom > 4 && zoom <= 5) {
                interval = 7
            } else if (zoom > 5 && zoom <= 6) {
                interval = 6
            } else if (zoom > 6 && zoom <= 7) {
                interval = 5
            } else if (zoom > 7 && zoom <= 8) {
                interval = 4
            } else if (zoom > 8 && zoom <= 9) {
                interval = 3
            } else if (zoom > 9 && zoom <= 10) {
                interval = 2
            } else if (zoom > 10) {
                interval = 1
            }
            _LineLat = new PIE.MetoStyle.GridLatLonLayers({
                id: "lineLat",
                color: "#090",
                width: 1,
                zoom: interval,
                text: overflow,
                visible: "visible"
            });
            self.add(_LineLat);
        }
        self.on("zoomend", function (e) {
            console.log('zoomend')
            if (self.getLayer("lineLat")) {
                self.remove(_LineLat);
                addLayer();
            } else {
                return;
            }

        });
        addLayer()
    },
    scaleControl: function (configure) {
        if (this.defaultSettings.type == 1) {
            var scale = new mapboxgl.ScaleControl({
                maxWidth: configure.maxWidth,
                unit: configure.unit
            });
            this.mapbox.addControl(scale);
        } else if (this.defaultSettings.type == 2) {
            var scaleControl = new PIE.ol.control.ScaleLine();
            this.openlayer.addControl(scaleControl);
        }
    },
    setBearing: function (angle) {
        if (this.defaultSettings.type == 1) {
            this.mapbox.setBearing(angle)
        }
    },
    setVisibility: function (layer, visibility) {
        if (this.defaultSettings.type == 1 || this.defaultSettings.type == 2) {
            layer.setVisible(visibility)
        } else if (this.defaultSettings.type == 3) {

        }
    },
    /**
     * 粘贴功能 将复制或剪切图层 添加到地图中
     * @method paste
     */
    paste: function () {
        if (PIE.CopyLayer) {
            PIE.CopyLayer.id = PIE.CopyLayer.id + (new Date()).getTime();
            PIE.CopyLayer.source.id = PIE.CopyLayer.id;
            PIE.CopyLayer.layer.id = PIE.CopyLayer.id;
            this.add(PIE.CopyLayer);
        }
    },
    /**
     * 根据屏幕坐标拾取feature
     * 
     * @param {Array} pixel 屏幕坐标 
     * @method getFeaturesAtPixel
     */
    getFeaturesAtPixel: function (pixel) {
        if (this.defaultSettings.type == 1) {
            return this.mapbox.queryRenderedFeatures(pixel)
        } else if (this.defaultSettings.type == 2) {
            return this.openlayer.getFeaturesAtPixel(pixel)
        }
    },

};

export {
    Map
};