import {GeoJsonFormatFeilds} from '../Symbol/StyleFeilds';
import {CesiumStyle} from "./CesiumStyle";
import {DataHandle} from "../core/DataHandle";
import {RenderDynamicWind} from "../StyleLayers/WindMap/DynamicWind";
import { getFind,getIndex,getFindCesiumLayer } from "../core/find"
import {Color} from "../math/Color"
/**
 * @author mhw
 * cesium类接口封装文档
 * 
 * 
 *  map					cesium初始化后的保存的map对象，map._cesiumViewer Cesium.Viewer对象
 *  container			cesium初始化div的id
 */
function PIECesium(){
    this.map = null;
	this.container='map';
	this.defaultSettings= {
		imageryProvider: false,
		animation: false,
		baseLayerPicker: false,
		fullscreenButton: false,
		geocoder: false,
		homeButton: false,
		infoBox: false,
		selectionIndicator: false,
		timeline: false,
		sceneModePicker: false,
		shouldAnimate : true,
		navigationHelpButton: false,
		contextOptions: {
			//allowTextureFilterAnisotropic : true,
			webgl: {
				alpha: false,
			}
		}

	};
	this.center = [0,0]
	this.backgroundColor = new Color("#ffffff");
	this.mapPrimitives=new Map();
	this.mapSources = [];
	this.layers = [];
	this.mouseEventHandler =null;
}
PIECesium.prototype = Object.assign(Object.create(CesiumStyle.prototype),{
	/**
     * 转换数据渲染类型
     * 
     * 
     *1：Mapbox渲染类型，2：OpenLayer渲染类型，3：Cesium渲染类型<br/>
     *
     */
    changeStyles:function (options) {
        var self = this;
        for(var i in options) {
			if(i=="container"){
			   self.container=options[i];
			}
			if (i == "center") {
                self.center = options[i];
            }
			if(i=="imageryProvider"){
				console.log(options[i])
				self.defaultSettings.imageryProvider = options[i];
			}
			if (i== "sprite") {
				var _url = options[i]+".json";
				new DataHandle().getData(_url,function(data){
					self.iconJsonData = data;
				});
				self.spriteUrl = options[i]+".png";
            } 
            if (i == "backgroundColor") {
                self.backgroundColor = new Color(options[i]);
            }
        }
    },

    mouseEvent:function(type,callback){
		var self=this;
		switch (type){
			case 'init':
					self.mouseEventHandler=new Cesium.ScreenSpaceEventHandler(self.map._cesiumViewer.scene.canvas);
				break;
			case 'roam':
					if(self.mouseEventHandler.getInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)){
						self.mouseEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
					}
					if(self.mouseEventHandler.getInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN)){
						self.mouseEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN);
					}
					if(self.mouseEventHandler.getInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE)){
						self.mouseEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
					}
					if(self.mouseEventHandler.getInputAction(Cesium.ScreenSpaceEventType.RIGHT_DOWN)){
						self.mouseEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_DOWN);
					}
				break;
			case 'pick':
					self.mouseEventHandler.setInputAction(function(event) {
						var object = self.map._cesiumViewer.scene.pick(event.position);
						var pos =self.map._cesiumViewer.scene.pickPosition(event.position);
						
						return callback(self.transformCartesian3(pos),self.transformObject(object),object,event.position);
					},  Cesium.ScreenSpaceEventType.LEFT_CLICK);
				break;
			case 'pickoff':
					if(self.mouseEventHandler.getInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)){
						self.mouseEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
					}
				break;
			case 'moveover':
					self.mouseEventHandler.setInputAction(function(movement) {
						var pos =self.map._cesiumViewer.scene.pickPosition(movement.endPosition);
						var object = self.map._cesiumViewer.scene.pick(movement.endPosition);
						if(object){
							if(self.moveinobject&&self.moveinobject===object){
								return;
							}else{
								self.moveinobject=object;
								return callback(self.transformCartesian3(pos),self.transformObject(object));
							}
						}else{
							self.moveinobject=null;
						}
					},Cesium.ScreenSpaceEventType.MOUSE_MOVE);
				break;
			case 'moveoveroff':
					if(self.mouseEventHandler.getInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE)){
						self.mouseEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
					}	
				break;	
			default:
				
				break;
		}
		
	},
	transformCartesian3:function(cartesian3){
		var callback={};
		var pos=Cesium.Cartographic.fromCartesian(cartesian3, Cesium.Ellipsoid.WGS84,new Cesium.Cartographic()); 
		callback.lat=Cesium.Math.toDegrees(pos.latitude);
		callback.lon=Cesium.Math.toDegrees(pos.longitude);
		callback.height=pos.height;
		return callback;
	},
	transformObject:function(object){
		var callback={};
		if(object.id&&object.id.properties&&object.id.properties.propertyNames.length>0){
			var pname=object.id.properties.propertyNames;
			for(var i=0;i<pname.length;i++){
				callback[pname[i]]=object.id.properties[pname[i]].getValue();	
			}
		}
		return callback;
	},

/**
 * cesium初始化地图

 */
	initMap:function () {
        var self = this;
		self.map={};
        self.map._cesiumViewer = new Cesium.Viewer(self.container,self.defaultSettings);
		//self.map._cesiumViewer.scene.globe.baseColor=Cesium.Color.WHITE;
		self.map._cesiumViewer.scene.globe.showGroundAtmosphere=false;
		self.map._cesiumViewer.scene.globe.showWaterEffect =false;
		self.map._cesiumViewer.scene.globe.enableLighting =false;
		self.map._cesiumViewer.scene.globe.shadows =Cesium.ShadowMode.DISABLED;
		self.map._cesiumViewer.scene.globe.baseColor = new Cesium.Color(self.backgroundColor.r, self.backgroundColor.g, self.backgroundColor.b, 0.01);
		self.map._cesiumViewer._cesiumWidget._creditContainer.style.display = "none";
		// var layer =self.map._cesiumViewer.imageryLayers.get(0);
		// if(layer){
		// 	layer.brightness=2.0;
		// 	layer.gamma=0.25;
		// }
		self.map._cesiumViewer._cesiumWidget._supportsImageRenderingPixelated = Cesium.FeatureDetection.supportsImageRenderingPixelated();
        self.map._cesiumViewer._cesiumWidget._forceResize = true;
        if (Cesium.FeatureDetection.supportsImageRenderingPixelated()) {
            var vtxf_dpr = window.devicePixelRatio;
            // 适度降低分辨率
            while (vtxf_dpr >= 2.0) {
                vtxf_dpr /= 2.0;
            }
            //alert(dpr);
            self.map._cesiumViewer.resolutionScale = vtxf_dpr;
        }
		self.mapSources = [];
		self.layers = [];
		self.setCenter(self.center)
        return self.map;
	},
	/**
     * 将定义的source 添加到cesium对象中。
     * 
   
     */
	innerOlSource:function (source,symbol) {
        var self = this;
        if(!source) {console.error("数据源错误");return;}
        if(source.source.type == "geojson"){
           var lstyle=self.initGraphicsLayerStyle(symbol);
		   self.innerGeoJsonSource(source,lstyle);
        }
	},
	/**
     * PIE的layer对象转化为cesium的layer对象
     * 
  
     */
	innerOlLayer:function(layer){
        var self = this;
		if(layer.source.source.type == "geojson"){
			self.innerGraphics(layer);
		}
	},
	/**
     * 重新加载数据源
     * 
    
     */
	innerGeoJsonSource:function(source,lstyle){
		var self = this;
		if(!source) {console.error("数据源错误");return;}
		if(source.source.type == "geojson"){
			var sourceTemp = new Cesium.GeoJsonDataSource.load(source.source.data,lstyle);
			sourceTemp.style=lstyle;
			sourceTemp.id =source.id;
			self.mapSources.push(sourceTemp); 
		}
	},

	innerGraphics:function(layer){
        var self = this;
		var cesource = getFind(self.mapSources,layer.source.id);
		var promise =self.map._cesiumViewer.dataSources.add(cesource);
		promise.then(function(dataSource) {
			dataSource.id = layer.layer.id;
			self.layers.push(dataSource);
			self.setGeoJsonProperties(dataSource);
		});
	},
	
	innerIconLayer:function(layer){
		var self = this;
		
		var cesource = getFind(self.mapSources,layer.id);
		if(layer.sourceId){
			cesource = getFind(self.mapSources,layer.sourceId);
		}
		var promise =self.map._cesiumViewer.dataSources.add(cesource);
		promise.then(function(dataSource) {
			dataSource.id = layer.id;
			var entities =dataSource.entities.values;
			for(var i=0;i<entities.length;i++){
				var entity = entities[i];
				var properties=entity.properties;
				if(!properties){
					return;
				}
				if(entity.billboard){
					var sobj=self.initIcon(layer,self.spriteUrl,self.iconJsonData,properties);
					if(sobj){
						entity.billboard=sobj;
					}
				}
			}
		});
	},
	innerTextLayer:function(layer){
		var self = this;
		var cesource = getFind(self.mapSources,layer.id);
		if(layer.sourceId){
			cesource = getFind(self.mapSources,layer.sourceId);
		}
		var promise =self.map._cesiumViewer.dataSources.add(cesource);
		promise.then(function(dataSource) {
			dataSource.id = layer.id;
			var entities =dataSource.entities.values;
			for(var i=0;i<entities.length;i++){
				var entity = entities[i];
				var properties=entity.properties;
				if(!entity.properties){
					return;
				}
				if(entity.billboard){
					var sobj=self.initText(layer,properties);
					entity.billboard=null;
					if(sobj){
						entity.label=sobj;
					}else{
						entity.label=new Cesium.LabelGraphics();
					}
					
				}
			}
		});	
	},
	innerPointLayer:function(layer){
		var self = this;
		var layerSymbol={
			show:true,
			stroke:Cesium.Color.BLACK,
			fill: Cesium.Color.BLACK,
			strokeWidth: 0,
			markerSize:0,
			markerColor:Cesium.Color.BLACK,
			clampToGround:true
		};
		self.innerGeoJsonSource(layer.source,layerSymbol)
		var cesource = getFind(self.mapSources,layer.source.id);
		var promise =self.map._cesiumViewer.dataSources.add(cesource);
		promise.then(function(dataSource) {
			dataSource.id = layer.id;
			var entities =dataSource.entities.values;
			for(var i=0;i<entities.length;i++){
				var entity = entities[i];
				var properties=entity.properties;
				if(!entity.properties){
					return;
				}
				if(entity.billboard){
					var obj = self.initPoint(layer,properties);
					entity.point = obj;
					
				}
			}
		});
	},
	innerIsoLineLayer1:function(layer){
		var self = this;
		var lstyle1=self.initGeojsonLayerStyle(layer.layerSymbol);
		self.innerGeoJsonSource(layer.source,lstyle1)
		var cesource =getFind(self.mapSources,layer.source.id);
		var promise =self.map._cesiumViewer.dataSources.add(cesource);
		promise.then(function(dataSource) {
			dataSource.id = layer.id;
			var entities =dataSource.entities.values;
			for(var i=0;i<entities.length;i++){
				var entity = entities[i];
				var properties=entity.properties;
				if(!entity.properties){
					return;
				}
				var geoobj=null;
				if(entity.polyline){
					geoobj=entity.polyline;
					if(properties[layer.symbol.line.lineWidth]){
						geoobj.width=properties[layer.symbol.line.lineWidth].toString()*2;
					}
					if(properties[layer.symbol.line.lineColor]){
						geoobj.material=Cesium.Color.fromCssColorString(properties[layer.symbol.line.lineColor].toString());
					}
				}
				if(entity.billboard){
					if(properties[layer.symbol.text.textName]){
						geoobj=new Cesium.LabelGraphics();
						entity.label=geoobj;
						if(properties[layer.symbol.text.textName]){
							geoobj.text=properties[layer.symbol.text.textName].toString();
						}
						if(properties[layer.symbol.text.textColor]){
							geoobj.fillColor=Cesium.Color.fromCssColorString(properties[layer.symbol.text.textColor].toString());
							geoobj.outlineColor = geoobj.fillColor;
							geoobj.outlineWidth = 1;
						}
						
						geoobj.font=layer.symbol.text.size.toString() +  'px Helvetica';
						geoobj.HeightReference = Cesium.HeightReference.RELATIVE_TO_GROUND
						geoobj.style = Cesium.LabelStyle.FILL_AND_OUTLINE;
						
					}
				}
			}
		});
	},
	// innerIsoLineLayer:function(layer){
	// 	var self = this;
	// 	var layers = self.initIsoLine(layer);
	// 	layer.layers = layers;
	//
	// 	var lstyle1=self.initGeojsonLayerStyle(layer.layerSymbol);
	// 	var sourceTemp = new Cesium.GeoJsonDataSource.load(layers[2],lstyle1);
	// 	sourceTemp.style=lstyle1;
	// 	sourceTemp.id =layer.id;
	// 	self.mapSources.push(sourceTemp);
	// 	var promise =self.map._cesiumViewer.dataSources.add(sourceTemp);
	// 	promise.then(function(dataSource) {
	// 		dataSource.id = layer.id;
	// 		var entities =dataSource.entities.values;
	// 		for(var i=0;i<entities.length;i++){
	// 			var entity = entities[i];
	// 			var properties=entity.properties;
	// 			if(!entity.properties){
	// 				return;
	// 			}
	// 			var objtype='',geoobj=null;
	// 			if(entity.billboard){
	// 				if(properties[layer.symbol.text.textName]){
	// 					objtype='label';
	// 					geoobj=new Cesium.LabelGraphics();
	// 					entity.label=geoobj;
	// 					if(properties[layer.symbol.text.textName]){
	// 						geoobj.text=properties[layer.symbol.text.textName].toString();
	// 					}
	// 					if(properties[layer.symbol.text.textColor]){
	// 						geoobj.fillColor=Cesium.Color.fromCssColorString(properties[layer.symbol.text.textColor].toString());
	// 						geoobj.outlineColor = geoobj.fillColor;
	// 						geoobj.outlineWidth = 1;
	// 					}
	//
	// 					geoobj.font=layer.symbol.text.size.toString() +  'px Helvetica';
	// 					geoobj.HeightReference = Cesium.HeightReference.RELATIVE_TO_GROUND
	// 					geoobj.style = Cesium.LabelStyle.FILL_AND_OUTLINE;
	//
	// 				}
	// 			}
	// 		}
	// 	});
	//
	// 	layer.oneImage = self.map._cesiumViewer.imageryLayers.addImageryProvider(layers[0]);
	// 	layer.twoImage = self.map._cesiumViewer.imageryLayers.addImageryProvider(layers[1]);
	//
	// },
	innerIsoLineLayer:function(layer){
		var self = this;
		//var layers = self.initIsoLine(layer);
		//layer.layers = layers;

		//存放图形实例对象的容器
		var geometryInstances = [];
		//创造点的集合
		//var pointPrimitives=self.map._cesiumViewer.scene.primitives.add(new Cesium.PointPrimitiveCollection());
		//创造标签的集合
		var labelPrimitives = self.map._cesiumViewer.scene.primitives.add(new Cesium.LabelCollection());

		//循环feature开始
		for(let i=0;i<layer.data.features.length;i++){
			// if(i==33){continue} 
			let feature = layer.data.features[i];
			var geometryInstance=null;
			var type=feature.geometry.type;//几何对象的类型：点，线，面
			var coordinates =feature.geometry.coordinates;//几何对象的线宽
			var properties=feature.properties;//几何对象的属性信息

			if(type=="LineString") {
				var coordinate = [].concat.apply([],coordinates);//几何对象的坐标
				if(coordinate.length>4){
					if((coordinate[1]==coordinate[3])&&(coordinate[3]==coordinate[5])){
						continue;
					}
				}
				var position = Cesium.Cartesian3.fromDegreesArray(coordinate);

				// 从给的坐标点创建线段
				var lineGeometry = Cesium.PolylineGeometry.createGeometry(
					new Cesium.PolylineGeometry({
						positions: position,
						width:properties.lineWidth,

					}) );

				// 根据图形实例创建一个图元
				geometryInstance= new Cesium.GeometryInstance({
					geometry: lineGeometry,
					id: 'myLine' + i.toString(),
					attributes: {
						color:  Cesium.ColorGeometryInstanceAttribute.fromColor(new Cesium.Color(0.0, 0.0, 0.0,layer.opacity))
					},
					appearance: new Cesium.PolylineColorAppearance({
						translucent: true
					})
				});
				// if(geometryInstance!=null)
				// {
				// 	var p=new Cesium.Primitive({
				// 		geometryInstances: geometryInstance,
				// 		appearance : new Cesium.PolylineColorAppearance({
				// 			translucent : true
				// 		})
				// 	});
				// 	linePrimitives.add(p);
				// }
				
			}
			else if(type=="Point"){
				
				//新增点到点集合中
				var position = Cesium.Cartesian3.fromDegrees(coordinates[0],coordinates[1]);
				// pointPrimitives.add({
				// 	position : position,
				// 	pixelSize : 2,
				// 	color:Cesium.Color.fromCssColorString(properties.valueColor)
				// });
				//新增标签到标签集合中
				labelPrimitives.add({
					position : position,
					font : '14px Helvetica',
					fillColor :Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(properties.valueColor), layer.opacity),
					//eyeOffset: new Cesium.Cartesian3(0.0, 11.0, 0.0),
					pixelOffset : new Cesium.Cartesian2(10.0,10),
					style : Cesium.LabelStyle.FILL_AND_OUTLINE,
					text : properties.value.toString()
				});

			}
			if(geometryInstance!=null)
			{
				geometryInstances.push(geometryInstance);
			}
		}
		//循环feature结束

		//加载图元到界面开始
		var p=new Cesium.Primitive({
			geometryInstances: geometryInstances,
			appearance : new Cesium.PolylineColorAppearance({
				translucent : true
			})
		});
		self.mapPrimitives.set(layer.id,[p,labelPrimitives]);
		self.map._cesiumViewer.scene.primitives.add(p);
		//加载图元到界面对束
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
			if (PIE.MAPTYPE !== 3) return;
			return
            if (layer.type == "rasterLayer") {
                self.map.getSource(layer.source.id).url = e.data;
            } else {
                self.map.getSource(layer.source.id).setData(e.data);
                layer.source.source.data = e.data;
            }

        });
        layer.addEventListener("visible", function (e) {
            console.log(self)
            if (PIE.MAPTYPE !== 3) return;
            if (layer.type === "StationLayer") {
                for (var i = 0; i < layer.Layers.length; i++) {
                    self.map.setLayoutProperty(layer.Layers[i].id, 'visibility', e.visible);
                }
            } else {
				let temp = getFindCesiumLayer(self.map._cesiumViewer,layer)
				let _visible = true;
				if (e.visible == "none" || e.visible == false) {
					_visible = false;
				}
				if(temp){
					temp.show = _visible
				}
            }
        });
        layer.addEventListener("opacity", function (e) {
			if (PIE.MAPTYPE !== 3) return;
			return
            if (layer.type === "StationLayer") {
                for (var i = 0; i < layer.Layers.length; i++) {
                    self.map.setPaintProperty(layer.Layers[i].id, layer.Layers[i].layer.type + '-opacity', e.opacity);
                }
            } else {
                self.map.setPaintProperty(layer.id, e.target.layer.type + '-opacity', e.opacity);
            }

        });
        layer.addEventListener("color", function (e) {
			if (PIE.MAPTYPE !== 3) return;
			return
            if (layer.type === "StationLayer") {
                for (var i = 0; i < layer.Layers.length; i++) {
                    self.map.setPaintProperty(layer.Layers[i].id, layer.Layers[i].layer.type + '-color', e.color);
                }
            } else {
                self.map.setPaintProperty(layer.id, e.target.layer.type + '-color', e.color);
            }
        });
        layer.addEventListener("size", function (e) {
			if (PIE.MAPTYPE !== 3) return;
			return
            if (layer.type === "StationLayer") {
                for (var i = 0; i < layer.Layers.length; i++) {
                    self.map.setPaintProperty(layer.Layers[i].id, layer.Layers[i].layer.type + '-radius', e.size);
                }
            } else {
                self.map.setPaintProperty(layer.id, e.target.layer.type + '-radius', e.size);
            }

        });
        layer.addEventListener("width", function (e) {
			if (PIE.MAPTYPE !== 3) return;
			return
            if (layer.type === "StationLayer") {
                for (var i = 0; i < layer.Layers.length; i++) {
                    self.map.setPaintProperty(layer.Layers[i].id, layer.Layers[i].layer.type + '-width', e.width);
                }
            } else {
                self.map.setPaintProperty(layer.id, e.target.layer.type + '-width', e.width);
            }

        });
    },
	/**
     * 创建新图层
     * 
   
     */
	add:function (layer) {
		var self = this;
		//console.log(layer)
		var temp = getFind(this.layers, layer.id)
        if (temp) {
        	return;
		}
		this.EventListener(layer);
		if (layer.type == "GridLatLonLayers") {
            console.log(layer);
            for(var i=0;i<layer.Layers.length;i++){
                self.add(layer.Layers[i]);
            }
        }else if(layer.type == "iconLayer"){
			var lstyle1 = "";
			if(layer.source){
				lstyle1=self.initGeojsonLayerStyle(layer.layerSymbol);
				self.innerGeoJsonSource(layer.source,lstyle1)
				self.innerIconLayer(layer);
			}else{
				if(layer.sourceId){
						self.innerIconLayer(layer)
				}else{
					layer.addEventListener("load",function(){
						lstyle1=self.initGeojsonLayerStyle(layer.layerSymbol);
						self.innerGeoJsonSource(layer.source,lstyle1)
						self.innerIconLayer(layer);
					});
				}
				
			}
		}else if(layer.type == "windMapLayer"){
			layer.cesiumLayer = new RenderDynamicWind(this.map._cesiumViewer);
			layer.cesiumLayer.parseData(layer.field);
			layer.cesiumLayer.Render();
		}else if(layer.type == "textLayer"){
			if(layer.source){
				var lstyle1=self.initGeojsonLayerStyle(layer.layerSymbol);
				self.innerGeoJsonSource(layer.source,lstyle1)
				self.innerTextLayer(layer);
			}else{
				if(layer.sourceId){
						self.innerIconLayer(layer)
				}else{
					layer.addEventListener("load",function(){
						var lstyle1=self.initGeojsonLayerStyle(layer.layerSymbol);
						self.innerGeoJsonSource(layer.source,lstyle1)
						self.innerTextLayer(layer);
					});
				}
			}
		}else if(layer.type == "IsoLineLayer"){
			if(layer.source){
				self.innerIsoLineLayer(layer);
			}else{
				layer.addEventListener("load",function(){
					self.innerIsoLineLayer(layer);
				});
			}
		}else if(layer.type == "typhoonLayer"){
			if(layer.source){
				self.initTyphoon(layer,self.map);
			}else{
				layer.addEventListener("load",function(){
					self.initTyphoon(layer,self.map);
				});
			}
		}else if(layer.type == "CustomTileLayer"){
			if(layer.source){
				self.initCustomTileLayer(layer,self.map);
			}else{
				layer.addEventListener("load",function(){
					self.initCustomTileLayer(layer,self.map);
				});
			}
		}else if (layer.type == "pointLayer") {
			if(layer.source){
				self.innerPointLayer(layer);
			}else{
				layer.addEventListener("load",function(){
					self.innerPointLayer(layer);
				});
			}
        }else if(layer.type == "Graphics"){
			layer.initData();
			var lstyle=self.initGraphicsLayerStyle(layer.symbol);
			self.innerGeoJsonSource(layer.source,lstyle);
			self.innerGraphics(layer);
		}else if(layer.type == "GraphicsLayer"){
			layer.map = this;
            for(var i=0;i< layer.graphics.length;i++){
                self.add(layer.graphics[i])
            }
		}else if(layer.type == "VectorTileLayer"){
			var layer = new Cesium.MVTImageryProvider({
              url: layer.url,
              token: "secure&access_token=pk.eyJ1IjoicWlhbmt1bjIwMDgiLCJhIjoiY2pxZDdvbGdrNDJvOTQycHBrajF5NmVubiJ9.alWm23QayDt98SsRbRjGEw",
          });
			var newImageLayer1=self.map._cesiumViewer.imageryLayers.addImageryProvider(layer);
			newImageLayer1.id=layer.id;
			self.layers.push(newImageLayer1);
		}else if(layer.type == "geoJsonLayer"){
			if(layer.source){
				var lstyle1=self.initGeojsonLayerStyle(layer.layerSymbol);
				self.innerGeoJsonSource(layer.source,lstyle1)
				self.innerGraphics(layer);
			}else{
				layer.addEventListener("load",function(){
					var lstyle1=self.initGeojsonLayerStyle(layer.layerSymbol);
					self.innerGeoJsonSource(layer.source,lstyle1)
					self.innerGraphics(layer);
				});
			}
		}else if(layer.type == "fillLayer"  || layer.type == "lineLayer"){
			console.log("cesium : bug")
			if(layer.source){
				let promise = layer.innerLayer(3);
				promise.then(function(dataSource){
					self.map._cesiumViewer.dataSources.add(dataSource);
					dataSource.id = layer.id;
					layer.CesiumLayer = dataSource;
					console.log("添加图层成功");
				})
			}else{
				layer.addEventListener("load",function(){
                    let promise = layer.innerLayer(3);
					promise.then(function(dataSource){
						self.map._cesiumViewer.dataSources.add(dataSource);
						dataSource.id = layer.id;
						layer.CesiumLayer = dataSource;
						console.log("添加图层成功");
					})
                });
			}
		}else {
			var _source = layer.innerSource(3);
			if(_source){
				this.mapSources.push(_source);
			}
			var _ley = layer.innerLayer(3);
			if(_ley){
				_ley.id = layer.id;
			}
			var _LAYER = layer.onAdd(self.map._cesiumViewer,3,this)
			self.layers.push(_LAYER);
		}
	},
	
	/**
     * 依据传入的参数id属性，移除对应的图层
     * 
    
     */
	remove: function (layer) {
        //console.log("remove")
        var self = this;
        if (layer.type == "threeDTileLayer"||layer.type == "ModelLayer") {
			console.log(layer)
			self.mapLayerRemoveById(layer.id);
			layer.onRemove(self.map._cesiumViewer,3);
			// layer.initLayer()
        }else if (layer.type == "GridLatLonLayers") {
            console.log(layer);
            console.log(layer.Layers);
            
        }else if(layer.type == "windMapLayer"){
			layer.cesiumLayer.remove();
		}else if (layer.type == "typhoonLayer") {
                //先清除记时器
                clearInterval(layer.typhoonIntever);
                //清除控制按钮 
                var btnS= document.getElementById("btnStart");
                var btnSto= document.getElementById("btnStop");
                if(btnS!=null){
                self.map._cesiumViewer.container.removeChild(btnS);
                }
                if(btnSto!=null){
                self.map._cesiumViewer.container.removeChild(btnSto);
                }
                //清除警告图层
                 var typhoon_alram_tip= document.getElementById("typhoon_alram_tip");
                 if(typhoon_alram_tip!=null){
                   self.map._cesiumViewer.container.removeChild(typhoon_alram_tip);
                }

                var _primitives = self.map._cesiumViewer.scene.primitives._primitives;
                var length = _primitives.length;
                //删除点
                 for (var i = 0; i < length; i++) { 
                      if(_primitives[i] && _primitives[i]._pointPrimitives)
                      {
                           var pointArray=_primitives[i]._pointPrimitives;
                            for(var j=0;j<pointArray.length;j++)
                            {
                                var p = pointArray[j];
                                if(p.id.indexOf(layer.id + "typhoon-point")>-1){
//                                    self.map._cesiumViewer.scene.primitives.remove(p);
                                      layer.pointPrimitives.remove(p);
                                 }
                            }
                               
                      }
                 }

                 //删除折线
                var primitives = self.map._cesiumViewer.scene.primitives;
                for (var i=(primitives.length-1);(i>-1 && i<primitives.length);i--) {
                    var p = primitives.get(i);
                    if (p && p._instanceIds && p._instanceIds[0].indexOf(layer.id + "typhoon-line")>-1)
                    {
                        self.map._cesiumViewer.scene.primitives.remove(p);
                    }
                }
                 
                 
                var polygonEntities= self.map._cesiumViewer.entities._entities._array;
                 for(var i=(polygonEntities.length-1);(i>-1 && i<polygonEntities.length);i--)
                 {
                     //debugger;
                     //删除风旋多边形
                     if(polygonEntities[i] && polygonEntities[i]._id && polygonEntities[i]._id.indexOf(layer.id + "typhoon-polygon")>-1)
                     {
                         self.map._cesiumViewer.entities.remove(polygonEntities[i]);
                     }

                     //删除影响的核电站
                      if(polygonEntities[i] && polygonEntities[i]._id && polygonEntities[i]._id.indexOf("typhoon-nuclear")>-1)
                     {
                         self.map._cesiumViewer.entities.remove(polygonEntities[i]);
                     }
                     //删除影响的学校
                      if(polygonEntities[i] && polygonEntities[i]._id && polygonEntities[i]._id.indexOf("typhoon-school")>-1)
                     {
                         self.map._cesiumViewer.entities.remove(polygonEntities[i]);
                     }
                       //删除影响的港口
                      if(polygonEntities[i] && polygonEntities[i]._id && polygonEntities[i]._id.indexOf("typhoon-harbor")>-1)
                     {
                         self.map._cesiumViewer.entities.remove(polygonEntities[i]);
                     }

                     //删除高亮的行政区域 
                     if(polygonEntities[i] && polygonEntities[i]._id && polygonEntities[i]._id.indexOf("typhoon-highlight-polygon")>-1)
                     {
                         self.map._cesiumViewer.entities.remove(polygonEntities[i]);
                     }

                      if(polygonEntities[i] && polygonEntities[i]._id && polygonEntities[i]._id.indexOf("typhon_demo")>-1){
                        self.map._cesiumViewer.entities.remove(polygonEntities[i]);
                      }
                 }   
            }
		else if (layer.type == "IsoLineLayer") {
			// self.mapSourcesRemoveById(layer.id);
			// self.mapLayerRemoveById(layer.id);
			// layer.oneImage.show = false;
			// layer.twoImage.show  = false;
			var primitiveArray= self.mapPrimitives.get(layer.id);
			for (var i= 0; i<primitiveArray.length;i++)
			{
				self.map._cesiumViewer.scene.primitives.remove(primitiveArray[i]);
			}
        }else if (layer.type == "pointLayer") {
			self.mapSourcesRemoveById(layer.id);
			self.mapLayerRemoveById(layer.id);
        }else if (layer.type == "StationLayer") {
			for(var i in layer.symbol){
				self.mapSourcesRemoveById(layer.symbol[i].id);
			}
        } else if (layer.type == "geoJsonLayer"||layer.type == "Graphics") {
			self.mapSourcesRemoveById(layer.source.id);
			self.mapLayerRemoveById(layer.layer.id);
        }else if (layer.type == "GraphicsLayer") {
            for (var i = layer.graphics.length - 1; i >= 0; i--) {
                self.mapSourcesRemoveById(layer.graphics[i].source.id);
				self.mapLayerRemoveById(layer.graphics[i].layer.id);
            }
        }else if (layer.type == "GridTileLayer"||layer.type == "ImageLayer" || layer.type == "FY4GridTileLayer" ||layer.type == "ArcGisMapLayer") {
			console.log("remove:")
			self.mapLayerRemoveById(layer.id,'Uimage');
		}else {
            //console.log(layer)
			this.removeById(layer.id);
        }

	},
	removeById:function(id){
		this.removerCesiumLayer(id);
		this.mapSourcesRemoveById(id);
		var layerIndex = getIndex(this.layers,id);
		if(layerIndex>-1){
			this.layers.splice(layerIndex, 1);
		}
	},
	removerCesiumLayer:function(id){
		let _map = this.map._cesiumViewer;
		let _entities = _map.entities.values;
		let _imageryLayers = _map.imageryLayers._layers;
		let _primitives = _map.scene.primitives._primitives;
		let _dataSources = _map.dataSources._dataSources
		let tempentity = getFind(_entities,id)
		if(tempentity) _map.entities.remove(tempentity);
		let tempImagery = getFind(_imageryLayers,id)
		if(tempImagery) _map.imageryLayers.remove(tempImagery);
		let tempPrimitive = getFind(_primitives,id)
		if(tempPrimitive) _map.scene.primitives.remove(tempPrimitive)
		let tempDataSource = getFind(_dataSources,id);
		if(tempDataSource) _map.dataSources.remove(tempDataSource)
		
	},
	dataSourcesRemoveById:function(sourceId){
		var dataSources = this.map._cesiumViewer.dataSources;
		for (var i= 0; i < dataSources.length; i++) {
			if (dataSources.get(i).id==sourceId) {
				dataSources.remove(dataSources.get(i));
				break;
			}
		}
	},
	mapSourcesRemoveById:function(sourceId){
		var t=-1;
		var layersource = getFind(this.mapSources,sourceId);
		t = getIndex(this.mapSources,sourceId) ;
		if(t>-1){
			this.dataSourcesRemoveById(layersource.id);
			this.mapSources.splice(t, 1);
		}
	},
	mapLayerRemoveById:function(layerId,type){
		var layerIndex = getIndex(this.layers,layerId);
		if(layerIndex>-1){
			if(type=='Uimage'){
				this.map._cesiumViewer.imageryLayers.remove(this.layers[layerIndex], true);
			}
			this.layers.splice(layerIndex, 1);
		}
	},
	getAllLayers:function(){
		let _map = this.map._cesiumViewer;
		let _entities = _map.entities.values;
		let _imageryLayers = _map.imageryLayers._layers;
		let _primitives = _map.scene.primitives._primitives;
		let _dataSources = _map.dataSources._dataSources;
		return [].concat(_imageryLayers).concat(_entities).concat(_primitives).concat(_dataSources)
	},
	getCenter:function(){
		var viewer = this.map._cesiumViewer;
		var point = new Cesium.Cartesian2(viewer.scene.canvas.width/2,viewer.scene.canvas.height/2);
		var center= viewer.scene.globe.pick(viewer.camera.getPickRay(point), viewer.scene);
		if (!Cesium.defined(center)) {
			return [0,0];
		}
		var cartographic =  viewer.scene.globe.ellipsoid.cartesianToCartographic(center);
		var pos = {
			lon: Cesium.Math.toDegrees(cartographic.longitude),
			lat: Cesium.Math.toDegrees(cartographic.latitude),
			alt: Math.ceil(cartographic.height)
		};
		let coordinate = [pos.lon,pos.lat];
		return coordinate;
	},
	setCenter:function(center){
		var viewer = this.map._cesiumViewer;
		var cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(viewer.camera.position);
		var pos = {
			lon: center[0],
			lat: center[1],
			alt: Math.ceil(cartographic.height)
		};
		pos.alt = center[2]!==undefined? center[2]:pos.alt;
		viewer.camera.setView({
			// Cesium的坐标是以地心为原点，一向指向南美洲，一向指向亚洲，一向指向北极州
			// fromDegrees()方法，将经纬度和高程转换为世界坐标
			destination:Cesium.Cartesian3.fromDegrees(pos.lon,pos.lat,pos.alt),
			orientation:{
				// 指向
				heading:Cesium.Math.toRadians(0,0),
				// 视角
				pitch:Cesium.Math.toRadians(-90),
				roll:0.0
			}
		});
	 
	},
	getZoom:function(){
		function altitudeToZoom(altitude) {
			var A = 40487.57;
			var B = 0.00007096758;
			var C = 91610.74;
			var D = -40467.74;
		
			return Math.round(D +(A-D)/(1 + Math.pow(altitude / C,B)));
		}
		var viewer = this.map._cesiumViewer;
		var cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(viewer.camera.position);
		return altitudeToZoom(cartographic.height);
	},
	getBounds:function(){
		var viewer = this.map._cesiumViewer;
		var leftpoint = new Cesium.Cartesian2(0,0);
		var leftcenter= viewer.scene.globe.pick(viewer.camera.getPickRay(leftpoint), viewer.scene);
		if (!Cesium.defined(leftcenter)) {
			return [0,0];
		}
		var cartographic =  viewer.scene.globe.ellipsoid.cartesianToCartographic(leftcenter);
		var leftpos = {
			lon: Cesium.Math.toDegrees(cartographic.longitude),
			lat: Cesium.Math.toDegrees(cartographic.latitude),
			alt: Math.ceil(cartographic.height)
		};
		var rightpoint = new Cesium.Cartesian2(viewer.scene.canvas.width,viewer.scene.canvas.height);
		var rightcenter= viewer.scene.globe.pick(viewer.camera.getPickRay(rightpoint), viewer.scene);
		if (!Cesium.defined(rightcenter)) {
			return [0,0];
		}
		var rightcartographic =  viewer.scene.globe.ellipsoid.cartesianToCartographic(rightcenter);
		var rightpos = {
			lon: Cesium.Math.toDegrees(rightcartographic.longitude),
			lat: Cesium.Math.toDegrees(rightcartographic.latitude),
			alt: Math.ceil(rightcartographic.height)
		};
		return [leftpos.lon,leftpos.lat,rightpos.lon,rightpos.lat];
	},
	movelayer:function(layer, beforelayer){
        if((beforelayer.type == "GridTileLayer"||beforelayer.type == "ImageLayer" )&&(layer.type == "GridTileLayer"||layer.type == "ImageLayer")){
            var layer1 = getFind(this.layers,layer.id)
            var beforelayer1 =getFind(this.layers,beforelayer.id);

            var bnum=this.map._cesiumViewer.imageryLayers.indexOf(beforelayer1);
            var num=this.map._cesiumViewer.imageryLayers.indexOf(layer1);
            if(num>-1&&bnum>-1){
                var movenum=bnum-num;
                if(movenum<0){
                    for(var i=0;i>movenum;i--){
                        this.map._cesiumViewer.imageryLayers.lower(layer1);
                        console.log(1);
                    }
                }else if(movenum>0){
                    for(var i=1;i<=movenum;i++){
                        this.map._cesiumViewer.imageryLayers.raise(layer1);
                        console.log(-1);
                    }
                }
            }
        }
    },
	setGraphicsStyle:function(type,geoObject,properties){
		switch (type){
			case 'polyline':
				if(properties[GeoJsonFormatFeilds.lineSFeilds.lineWidth]){
					geoObject.width=properties[GeoJsonFormatFeilds.lineSFeilds.lineWidth].toString()*1;
				}
				if(properties[GeoJsonFormatFeilds.lineSFeilds.lineColor]){
					geoObject.material=Cesium.Color.fromCssColorString(properties[GeoJsonFormatFeilds.lineSFeilds.lineColor].toString());
				}
				break;
			case 'polygon':
				if(properties[GeoJsonFormatFeilds.polygonSFeilds.fillColor]){
					geoObject.fill=true;
					var color = new Color(properties[GeoJsonFormatFeilds.polygonSFeilds.fillColor].toString());
					geoObject.material=Cesium.Color.fromAlpha(new Cesium.Color(color.r, color.g, color.b),geoObject.material.getValue().color.alpha);
				}
				if(properties[GeoJsonFormatFeilds.polygonSFeilds.outlineWidth]){
					geoObject.outline=true;
					geoObject.outlineWidth=properties[GeoJsonFormatFeilds.polygonSFeilds.outlineWidth].toString()*1;
				}
				if(properties[GeoJsonFormatFeilds.polygonSFeilds.outlineColor]){
					geoObject.outline=true;
					geoObject.outlineColor=Cesium.Color.fromCssColorString(properties[GeoJsonFormatFeilds.polygonSFeilds.outlineColor].toString());
				}
				if(properties[GeoJsonFormatFeilds.polygonSFeilds.extrudedHeight]){
					geoObject.extrudedHeight=properties[GeoJsonFormatFeilds.polygonSFeilds.extrudedHeight].toString()*1;
				}
				break;
			case 'point':
					if(properties[GeoJsonFormatFeilds.pointSFeilds.pointColor]){
						geoObject.color=Cesium.Color.fromCssColorString(properties[GeoJsonFormatFeilds.pointSFeilds.pointColor].toString());
					}
					if(properties[GeoJsonFormatFeilds.pointSFeilds.outlineWidth]){
						geoObject.outlineWidth=properties[GeoJsonFormatFeilds.pointSFeilds.outlineWidth].toString()*1;
					}
					if(properties[GeoJsonFormatFeilds.pointSFeilds.outlineColor]){
						geoObject.outlineColor=Cesium.Color.fromCssColorString(properties[GeoJsonFormatFeilds.pointSFeilds.outlineColor].toString());
					}
					if(properties[GeoJsonFormatFeilds.pointSFeilds.pointSize]){
						geoObject.pixelSize=properties[GeoJsonFormatFeilds.pointSFeilds.pointSize].toString()*1;
					}
				break;
			case 'label':
					if(properties[GeoJsonFormatFeilds.textSFeilds.textName]){
						geoObject.text=properties[GeoJsonFormatFeilds.textSFeilds.textName].toString();
					}
					if(properties[GeoJsonFormatFeilds.textSFeilds.textColor]){
						geoObject.fillColor=Cesium.Color.fromCssColorString(properties[GeoJsonFormatFeilds.textSFeilds.textColor].toString());
					}
					if(properties[GeoJsonFormatFeilds.textSFeilds.textFont]){
						geoObject.font=properties[GeoJsonFormatFeilds.textSFeilds.textFont].toString();
					}
					var xft=0,yft=0;
					if(properties[GeoJsonFormatFeilds.textSFeilds.textXOffset]){
						xft=properties[GeoJsonFormatFeilds.textSFeilds.textXOffset].toString()*1;
					}
					if(properties[GeoJsonFormatFeilds.textSFeilds.textYOffset]){
						yft=properties[GeoJsonFormatFeilds.textSFeilds.textYOffset].toString()*1;
					}
					if(xft!=0||yft!=0){
						geoObject.pixelOffset=new Cesium.Cartesian2(xft,yft);
					}
					if(properties[GeoJsonFormatFeilds.textSFeilds.outlineWidth]){
						geoObject.style=Cesium.LabelStyle.FILL_AND_OUTLINE;
						geoObject.outlineWidth=properties[GeoJsonFormatFeilds.textSFeilds.outlineWidth].toString()*1;
					}
					if(properties[GeoJsonFormatFeilds.textSFeilds.outlineColor]){
						geoObject.style=Cesium.LabelStyle.FILL_AND_OUTLINE;
						geoObject.outlineColor=Cesium.Color.fromCssColorString(properties[GeoJsonFormatFeilds.textSFeilds.outlineColor].toString());
					}
					if(properties[GeoJsonFormatFeilds.textSFeilds.textScale]){
						geoObject.scale=properties[GeoJsonFormatFeilds.textSFeilds.textScale].toString()*1;
					}
					if(properties[GeoJsonFormatFeilds.textSFeilds.backgroundColor]){
						geoObject.showBackground=true;
						geoObject.backgroundColor=Cesium.Color.fromCssColorString(properties[GeoJsonFormatFeilds.textSFeilds.backgroundColor].toString());
					}
					var xbt=0,ybt=0;
					if(properties[GeoJsonFormatFeilds.textSFeilds.backgroundXPadding]){
						xbt=properties[GeoJsonFormatFeilds.textSFeilds.backgroundXPadding].toString()*1;
					}
					if(properties[GeoJsonFormatFeilds.textSFeilds.backgroundYPadding]){
						ybt=properties[GeoJsonFormatFeilds.textSFeilds.backgroundYPadding].toString()*1;
					}
					if(xbt!=0||ybt!=0){
						//geoObject.showBackground=true;
						geoObject.backgroundPadding=new Cesium.Cartesian2(xbt,ybt);
					}
				break;
			case 'billboard':
					if(properties[GeoJsonFormatFeilds.iconSFeilds.iconImage]){
						geoObject.image=properties[GeoJsonFormatFeilds.iconSFeilds.iconImage].toString();
					}
					if(properties[GeoJsonFormatFeilds.iconSFeilds.imageScale]){
						geoObject.scale=properties[GeoJsonFormatFeilds.iconSFeilds.imageScale].toString()*1;
					}
					if(properties[GeoJsonFormatFeilds.iconSFeilds.imageRotation]){
						geoObject.rotation=(properties[GeoJsonFormatFeilds.iconSFeilds.imageRotation].toString()*Math.PI/180);
					}
					var xft=0,yft=0;
					if(properties[GeoJsonFormatFeilds.iconSFeilds.imageXOffset]){
						xft=properties[GeoJsonFormatFeilds.iconSFeilds.imageXOffset].toString()*1;
					}
					if(properties[GeoJsonFormatFeilds.iconSFeilds.imageYOffset]){
						yft=properties[GeoJsonFormatFeilds.iconSFeilds.imageYOffset].toString()*1;
					}
					if(xft!=0||yft!=0){
						geoObject.pixelOffset=new Cesium.Cartesian2(xft,yft);
					}
				break;
			default:
				
				break;
		}
	},
	setGeoJsonProperties:function(dataSource){
		var self = this;
		var entities =dataSource.entities.values;
		for(var i=0;i<entities.length;i++){
			var entity = entities[i];
			var properties=entity.properties;
			if(!entity.properties){
				return;
			}
			var objtype='',geoobj=null;
			/*if(properties.lineWidth){
				entity.polygon = null
				entity.polyline = new Cesium.PolylineGraphics();				
			}*/
			if(entity.polygon){
				objtype='polygon';
				geoobj=entity.polygon;
				
			}
			if(entity.polyline){
				objtype='polyline';
				geoobj=entity.polyline;
			}
			if(entity.billboard){
				if(properties[GeoJsonFormatFeilds.iconSFeilds.iconImage]){
					objtype='billboard';
					geoobj=entity.billboard;
				}else if(properties[GeoJsonFormatFeilds.textSFeilds.textName]){
					objtype='label';
					geoobj=new Cesium.LabelGraphics();
					entity.label=geoobj;
				}else{
					objtype='point';
					geoobj=new Cesium.PointGraphics();
					entity.point=geoobj;
				}
			}
			if(objtype&&geoobj){
				self.setGraphicsStyle(objtype,geoobj,properties);
			}
		}
	},
	initGeojsonLayerStyle:function(symbol){
		var layerSymbol={
			show:true,
			stroke:Cesium.Color.BLACK,
			fill: Cesium.Color.BLACK,
			markerColor:Cesium.Color.BLACK,
			strokeWidth: 0,
			markerSize:0,
			clampToGround:true
		};
		if(symbol){
			if(symbol.pointColor){
				layerSymbol.markerColor=Cesium.Color.fromCssColorString(symbol.pointColor);
				layerSymbol.markerSize=1;
				if(symbol.pointSize){
					layerSymbol.markerSize=symbol.pointSize*1;
				}
			}
			if(symbol.lineColor){
				layerSymbol.stroke=Cesium.Color.fromCssColorString(symbol.lineColor);
				layerSymbol.fill==Cesium.Color.fromCssColorString(symbol.lineColor);
				if(symbol.lineWidth){
					layerSymbol.strokeWidth=symbol.lineWidth*1;
				}
			}
			if(symbol.fillColor){
				layerSymbol.stroke=Cesium.Color.fromCssColorString(symbol.fillColor);
				layerSymbol.fill==Cesium.Color.fromCssColorString(symbol.fillColor);
			}
		}
		return layerSymbol;
	},
	initGraphicsLayerStyle:function(symbol){
		var layerSymbol={
			show:true,
			stroke:Cesium.Color.BLACK,
			fill: Cesium.Color.BLACK,
			strokeWidth: 1,
			markerSize:0,
			clampToGround:true
		};
		if(symbol) {
			var color=Cesium.Color.BLACK;
			if(symbol.color){
				color=new Cesium.Color(symbol.color.r, symbol.color.g, symbol.color.b,1.0);				
			}
			if(symbol.opacity){
				color=color.withAlpha(symbol.opacity);
				layerSymbol.fill = color;
			}
			if(symbol.type=='LineSymbol'){
				layerSymbol.stroke=color;
				layerSymbol.fill=color;
				if(symbol.width){
					layerSymbol.strokeWidth=symbol.width;
				}
			}else if(symbol.type=='MarketSymbol'){
				layerSymbol.markerColor=color;
				layerSymbol.strokeWidth=0;
				if(symbol.size){
					layerSymbol.markerSize=symbol.size;
				}
			}else if(symbol.type=='FillSymbol'){
				layerSymbol.stroke=color;
				layerSymbol.fill=color;
			}
		}
		return layerSymbol;
	}
});
export { PIECesium }