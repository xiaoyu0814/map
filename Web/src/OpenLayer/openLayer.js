import {
    EventDispatcher
} from "../core/EventDispatcher";
import {
    Color
} from '../math/Color'
import { getFind } from "../core/find"
import {DataHandle} from "../core/DataHandle"
import {OLGroundStationStyle} from './OLGroundStationStyle';
import {OLStyle} from './OLStyle';
proj4.defs('EPSG:2700', '+title=Beijing1954 +proj=lcc +lat_1=21 +lat_2=24 +lat_0=18 +lon_0=114 +x_0=500000 +y_0=200000 +ellps=WGS84 +towgs84=0,0,1.9,0,-0000,-0,-0.39 +units=m +no_defs');
 proj4.defs('EPSG:2722', '+proj=sterea +lat_0=47.25 +lon_0=-63 +k=0.999912 +x_0=400000 +y_0=800000 +a=6378135 +b=6356750.304921594 +units=m +no_defs'); 
 //Albers 投影
 proj4.defs('EPSG:2798', '+proj=aea +lat_1=25 +lat_2=47 +lat_0=0 +lon_0=105 +x_0=0 +y_0=0 +ellps=krass +units=m +no_defs'); 

 /**
 * 该对象代表您网页上的地图。它公开了方法和属性，使您能够以编程方式更改地图，并在用户与其交互时触发事件<br/>

 */
function OpenLayer(options) {
    this.options = options || {};
    this.map = null;
    //var self = this;
    this.projection = "EPSG:3857";
    this.defaultSettings = {
        layers: [],
        target: 'map',
        view: {
            zoom: 5,
            center: [0, 0],
            projection: this.projection !== undefined ? this.projection : "EPSG:3857"
        }
    };

    this.mapSources = [];
    this.layers = [];
    this.PIElayers = [];
}
OpenLayer.prototype = Object.assign(Object.create(OLStyle.prototype),EventDispatcher.prototype, {

    /**
     * 转换数据渲染类型
     * 
 
     */
    changeStyles: function (options) {
        console.log("changeStyles")
        var self = this;
        for (var pro in options) {
            if (pro == "container") {
                self.defaultSettings.target = options[pro];
            }
            if (pro == "zoom") {
                self.defaultSettings.view.zoom = options[pro];
            }
            if (pro == "projection") {
                self.projection = options[pro];
                self.defaultSettings.view.projection = options[pro];
            }
            if (pro == "center") {
                self.defaultSettings.view.center = PIE.ol.proj.fromLonLat(options[pro], self.projection);
            }
           
            if (pro == "sprite") {
              var _url = options[pro]+".json";
              new DataHandle().getData(_url,function(data){
                self.iconJsonData = data;
              });
              self.spriteUrl = options[pro]+".png";
            } 
            if (pro == "backgroundColor") {
               console.log(44)
               var doc = document;
               var style = doc.createElement('style');
               style.innerText=".ol-viewport{ background:"+options[pro]+"}";
               var heads = doc.getElementsByTagName("head")
               if(heads.length)
                    heads[0].appendChild(style);
                else
                    doc.documentElement.appendChild(style);
            }
        }

    },

    /**
     * 初始化地图
    
     */
    initMap: function () {
        var self = this;
        var option = {
            layers: self.defaultSettings.layers,
            target: self.defaultSettings.target,
            controls: PIE.ol.control.defaults({attribution: false, zoom: false, rotate: false}),
            view: new PIE.ol.View({
                center: self.defaultSettings.view.center,
                zoom: self.defaultSettings.view.zoom,
                projection: self.projection
            })
        }

        self.map = new PIE.ol.Map(option);

     
        self.map.getViewport().oncontextmenu = function(e){e.preventDefault();}
        return self.map;
    },

    /**
     * 将定义的source 添加到openlayer对象中。
     * 
   
     */
    innerOlSource: function (source,layer) {
        var self = this;
        if (!source) {
            console.error("数据源错误");
            return;
        }
        if (source.source.type == "geojson") {
            var sourceTemp = new PIE.ol.source.Vector({
                features: (new PIE.ol.format.GeoJSON()).readFeatures(source.source.data, {
                    featureProjection: self.projection
                })
            });
            sourceTemp.id = source.id;
            self.mapSources.push(sourceTemp);
            layer.olSource = sourceTemp;
        }
    },

    /**
     * 监听图层的属性，如有属性变动则会重绘此图层
     * 
    
     */
    EventListener: function (layer) {
        var self = this;
        if(!layer.addEventListener) {return;}
        layer.addEventListener("source", function (e) {
            // console.log( self.map.getSource(layer.source.id));
            if (PIE.MAPTYPE !== 2) return;
            if (layer.type == "rasterLayer") {
                self.map.getSource(layer.source.id).url = e.data;
            } else {
                var sourceTemp = new PIE.ol.source.Vector({
                    features: (new PIE.ol.format.GeoJSON()).readFeatures(e.data, {
                        featureProjection: self.projection
                    })
                });
                sourceTemp.id = layer.source.id;
                layer.source.source.data = e.data;
                // var tempLayer = self.layers.find((item) => {
                //     return item.id == layer.id;
                // })
                var tempLayer = getFind(self.layers, layer.id)
                tempLayer.setSource(sourceTemp)

            }

        });
        layer.addEventListener("visible", function (e) {
            console.log(e)
            if (PIE.MAPTYPE !== 2) return;
            var _visible
            // var layerVisible = self.layers.find((item) => {
            //     return item.id == layer.id;
            // });
            var layerVisible = getFind(self.layers, layer.id)
            if (e.visible == "none" || e.visible == false) {
                _visible = false
            } else if (e.visible == "visible" || e.visible == true) {
                _visible = true
            }

            layerVisible.setVisible(_visible)

        });
        layer.addEventListener("opacity", function (e) {
            if (PIE.MAPTYPE !== 2) return;
            // var layerVisible = self.layers.find((item) => {
            //     return item.id == layer.id;
            // });
            var layerVisible = getFind(self.layers, layer.id)
            if (e.target.symbol) {
                e.target.symbol.opacity = e.opacity
            }
            if(e.target.getStyle){
                layerVisible.setStyle(e.target.getStyle());
            }else{
                layerVisible.setOpacity( e.opacity)
            }
            
        });
        layer.addEventListener("color", function (e) {
            if (PIE.MAPTYPE !== 2) return;
            // var layerVisible = self.layers.find((item) => {
            //     return item.id == layer.id;
            // });
            var layerVisible = getFind(self.layers, layer.id)
            if (e.target.symbol) {
                e.target.symbol.color = new Color(e.color)
            }
            if(e.target.getStyle){
                layerVisible.setStyle(e.target.getStyle());
            }else{
                if(layer.type == "lineLayer"){
                    var temp  = new PIE.ol.style.Style({
                        stroke: new PIE.ol.style.Stroke({
                            color: e.color,
                            width: layer.width,
                        })
                    });
                    layerVisible.setStyle(temp)
                }else{
                    var temp = new PIE.ol.style.Style({
                        fill: new PIE.ol.style.Fill({
                            color: e.color
                        })
                    });
                    layerVisible.setStyle(temp)
                }
                
            }

           
        });
        layer.addEventListener("width", function (e) {
            if (PIE.MAPTYPE !== 2) return;
            // var layerVisible = self.layers.find((item) => {
            //     return item.id == layer.id;
            // });
            var layerVisible = getFind(self.layers, layer.id)
            if (e.target.symbol) {
                e.target.symbol.width = e.width
            }
             if(e.target.getStyle){
                layerVisible.setStyle(e.target.getStyle());
            }else{
                if(layer.type == "lineLayer"){
                    var temp  = new PIE.ol.style.Style({
                        stroke: new PIE.ol.style.Stroke({
                            width: e.width,
                            color:layer.color
                        })
                    });
                    layerVisible.setStyle(temp)
                } 
            }
            
        });
        layer.addEventListener("size", function (e) {
            if (PIE.MAPTYPE !== 2) return;
            // var layerVisible = self.layers.find((item) => {
            //     return item.id == layer.id;
            // });
            var layerVisible = getFind(self.layers, layer.id)
            if (e.target.symbol) {
                e.target.symbol.size = e.size
            }
            layerVisible.setStyle(e.target.getStyle())
        });
    },

    /**
     * PIE的layer对象转化为openlayer的layer对象
     * 
   
     */
    innerOlLayer: function (layer) {
        var self = this;
        var olsource = getFind(self.mapSources, layer.source.id)
        var vectorLayer = new PIE.ol.layer.Vector({
            source: olsource,
            style: function (feature) {
                return self.StyleFormat(layer,feature,self.spriteUrl,self.iconJsonData)
            },
        });
        vectorLayer.id = layer.layer.id;
        self.map.addLayer(vectorLayer);
        self.layers.push(vectorLayer);
    },
    
    innerOLStationLayer:function(layer){
        var self = this;
        var olsource = getFind(self.mapSources, layer.source.id)
        var vectorLayer = new PIE.ol.layer.Vector({
            source: olsource,
            style: function (feature) {

                return OLGroundStationStyle(layer.symbol,feature,self.spriteUrl,self.iconJsonData)
            },
        });
        vectorLayer.id = layer.source.id;
        self.map.addLayer(vectorLayer);
        self.layers.push(vectorLayer);   
    },
    
    innerOLIsoLineLayer:function(layer){
        var self = this;
        var olsource = getFind(self.mapSources, layer.source.id)
        var vectorLayer = new PIE.ol.layer.Vector({
            source: olsource,
            style: function (feature) {

                return self.initIsoLine(layer.symbol,feature)
            },
        });
        vectorLayer.id = layer.source.id;
        self.map.addLayer(vectorLayer);
        self.layers.push(vectorLayer);   
    },

    /**
     * PIE的layer对象转化为openlayer的layer对象
 
     */
    innerGraphics: function (layer) {
        var self = this; 
        var olsource = getFind(self.mapSources, layer.source.id)
        var vectorLayer = new PIE.ol.layer.Vector({
            source: olsource,
            style: layer.layer.style,
        });
        vectorLayer.id = layer.layer.id;
        self.map.addLayer(vectorLayer);
        self.layers.push(vectorLayer);
    },
    addLayer: function () {

    },

    /**
     * 创建新图层
  
     */
    add: function (layer) {
        console.log(layer)
        var self = this;
        console.log("add" + layer.type);
        var temp = getFind(self.PIElayers, layer.id)
        if (!temp) {
            self.PIElayers.push(layer);
        }
        self.EventListener(layer);
        if (layer.type == "GridLatLonLayers") {
            console.log(layer);
            for(var i=0;i<layer.Layers.length;i++){
                self.add(layer.Layers[i]);
            }
        } else if (layer.type == "heatmap") {
            layer.initData(layer);

            if (layer.layer) {
                self.map.addLayer(layer.layer);
                self.layers.push(layer.layer);
            } else {
                layer.addEventListener("load",function () {
                    self.map.addLayer(layer.layer);
                    self.layers.push(layer.layer);
                })
            }
            // self.layers.push(layer.layer);
        } else if (layer.type == "ImageLayer") {
            var OLlayer = self.initImage(layer,self.projection)
            self.map.addLayer(OLlayer);
             self.layers.push(OLlayer);
        } else if (layer.type == "IsoLineLayer") {
            self.innerOlSource(layer.source,layer);
            self.innerOLIsoLineLayer(layer);
        } else if (layer.type == "Graphics") {
            layer.initData();
            this.innerOlSource(layer.source,layer);
            this.innerGraphics(layer);
        } else if (layer.type == "GraphicsLayer") {
            layer.map = this;
            for (var i = 0; i < layer.graphics.length; i++) {
                self.add(layer.graphics[i])
            }
        } else if (layer.type == "StationLayer") {
            self.innerOlSource(layer.source,layer);
            self.innerOLStationLayer(layer);
        } else if (layer.type == "WFSFilterLayer" || layer.type == "ThemeLabelLayer") {
            var _source = layer.innerSource(2);
            self.mapSources.push(_source);
            var _layer = layer.innerLayer(2);
            console.log(_layer);
            var _LAYER = layer.onAdd(self.map,2);
            self.layers.push(_LAYER);
        } else if (layer.type == "ThemeGraphLayer") {
            var _LAYER = layer.onAdd(self.map,2);
            self.layers.push(_LAYER);    
        } else if (layer.type == "GridTileLayer") {
            var GridTileLayer = new PIE.ol.layer.Tile({
                source: new PIE.ol.source.XYZ({
                    url: layer.url,
                    projection:layer.projection
                }),
               // extent:[layer.region[0], layer.region[1], layer.region[2],layer.region[3]],
                defaultDataProjection:layer.projection,
                featureProjection: self.projection,
                zIndex: 0
            });
            console.log(layer)
            GridTileLayer.id = layer.id;
            layer._openLayer = GridTileLayer
            self.map.addLayer(GridTileLayer);
            self.layers.push(GridTileLayer)
        } else if(layer.type == "lineLayer" || layer.type == "textLayer" ||layer.type == "fillLayer" ||layer.type == "iconLayer" ||layer.type == "pointLayer"){
            console.log(layer.type);
           if( layer.initData){
            layer.initData(layer);
           }
            if (layer.source) {
                self.innerOlSource(layer.source,layer);
                self.innerOlLayer(layer);
            } else {
                
                layer.addEventListener("load", function () {
                    self.innerOlSource(layer.source,layer);
                    self.innerOlLayer(layer);
                })
            }
        }else {
            console.log(layer.type);
            var _source = layer.innerSource(2);
            self.mapSources.push(_source);
            var _layer = layer.innerLayer(2);
            layer.onAdd(self.map,2);
            self.layers.push(_layer)
        }
    },

    /**
     * 依据传入的参数id属性，移除对应的图层
   
     */
    remove: function (layer) {
        
        if(layer.type == "GridLatLonLayers"){
            for(var i=0;i<layer.Layers.length;i++){
                this.remove(layer.Layers[i]);   
            }
        }else if(layer.type == "ThemeGraphLayer"||layer.type == "WFSFilterLayer"){
            var tempLayer = getFind(this.layers, layer.id);
            var index = this.layers.indexOf(tempLayer);
            if (index > -1) {
                this.layers.splice(index, 1);
            }
            layer.onRemove(this.map,2);
        } else if (layer.type == "GraphicsLayer") {
            for (var i = layer.graphics.length - 1; i >= 0; i--) {
                this.remove(layer.graphics[i]);
                layer.graphics.splice(i, 1)
            }
            var index = this.layers.indexOf(layer);
            if (index > -1) {
                this.layers.splice(index, 1);
            }
        }else{
            var tempLayer = getFind(this.layers, layer.id);
            var layerindex = this.layers.indexOf(tempLayer);
            if (layerindex > -1) {
                this.layers.splice(layerindex, 1);
            }
            var tempLayer2 = getFind(this.PIElayers, layer.id);
            var index2 = this.PIElayers.indexOf(tempLayer2);
            if (index2 > -1) {
                this.PIElayers.splice(index2, 1);
            }
            this.map.removeLayer(tempLayer);

            var tempSource = getFind(this.mapSources, layer.id);
            var sourceindex = this.mapSources.indexOf(tempSource);
            if (sourceindex > -1) {
                this.mapSources.splice(sourceindex, 1);
            }
          
        }
        

    },
      /**
     * 依据传入的图层id，获取图层
    
     */
    findLayerById: function (layerId) {
        var tempLayer = getFind(this.PIElayers, layerId)
        return tempLayer;
    },
    getAllLayers:function(){
        let _layers = this.map.getLayers().getArray()
        return _layers;
    },
    

    /**
     * 依据传入的图层id，获取图层
   
     */
    getLayer: function (layerId) {
        var tempLayer = getFind(this.PIElayers, layerId)
        return tempLayer;
    },
    moveLayer: function (layer, beforeLayer) {
        var tempLayer = getFind(this.layers, layer.id)
        var beforetempLayer = getFind(this.layers,beforeLayer.id);
        var zindex = tempLayer.getZIndex();
        beforetempLayer.setZIndex(zindex+1);
    },

    /**
     * 获取地理中心点坐标数组(Array)
   
     */
    getCenter: function () {
        return PIE.ol.proj.transform(this.map.getView().getCenter(),this.projection, "EPSG:4326");
    },

    /**
     * 设置地理中心点坐标数组(Array)
    
     */
    setCenter: function (lnglat) {
        this.map.getView().setCenter(PIE.ol.proj.fromLonLat(lnglat, this.projection))
    },

    /**
     * 获取地图的当前缩放级别
     * 
    
     */
    getZoom: function () {
        return this.map.getView().getZoom();
    },

    /**
     * 设置地图的缩放等级
     
     */
    setZoom: function (index) {
        this.map.getView().setZoom(index);
    },

    /**
     * 获取范围
     */
    getBounds: function () {
        var bounds = this.map.getView().calculateExtent();
        var leftbootom = PIE.ol.proj.transform([bounds[0],bounds[1]],this.projection, "EPSG:4326");
        var righttop = PIE.ol.proj.transform([bounds[2],bounds[3]],this.projection, "EPSG:4326");
        return [leftbootom[0],leftbootom[1],righttop[0],righttop[1]];
    },
    getFeaturesAtPixel: function (pixel) {
      return this.map.getFeaturesAtPixel(pixel);
    },

    /**
     * 重新渲染图层
     * 
    
     */
    refreshLayer: function (layer) {

        // var _layer = this.layers.find((item) => {
        //     return item.id == layer.id
        // });
        var _layer = getFind(this.layers,layer.id)
        _layer.refresh()
    },

    /**
     * 切换投影方式
    
     */
    projectionModes: function (code) {
        this.projection = code;
        this.defaultSettings.view.projection = code;
        var _self = this
        var _strLayers = this.PIElayers;
        var length = _strLayers.length;

        for (var i = 0; i < length; i++) {
            _self.add(_strLayers[i]);
        }
    },
    addControl(scaleControl){
        this.map.addControl(scaleControl);
    }
});

export {
    OpenLayer
}