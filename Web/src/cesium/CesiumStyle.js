
function CesiumStyle(){}

CesiumStyle.prototype={
	initImage:function(layer){

		var imageLayer =new Cesium.SingleTileImageryProvider({
			url:layer.url,
			rectangle: Cesium.Rectangle.fromDegrees(layer.region[0],layer.region[1],layer.region[2],layer.region[3])
		})
		return imageLayer;
	},
	initText:function(layer,properties){
		var value = properties[layer.text].toString();
		var tfont = 'bold ' +layer.size+ 'px Arial';
		if(value){
			var color = layer.color
			if(color.property){
				color = properties[color.property]._value
			}
			var options={
				text: value,
				font:tfont,
				fillColor: Cesium.Color.fromCssColorString(color),
				scale:1.0,
				heightReference:Cesium.HeightReference.CLAMP_TO_GROUND,
				pixelOffset:new Cesium.Cartesian2(layer.offset[0]*layer.size,layer.offset[1]*layer.size)
			};
			var obj=new Cesium.LabelGraphics(options);
			return obj;
		}

	},
	initIsoLine:function(layer,properties){
		var data  =JSON.parse(JSON.stringify( layer.data));
		var pointFeatures = {
            "features":[],
            "type":"FeatureCollection"
        }
        var LineFeatures = {
            "features":[],
            "type":"FeatureCollection"
        }
        var LineFeatures1 = {
            "features":[],
            "type":"FeatureCollection"
        }
        var t=0;
        var features = data.features;
        for(var i=0;i<features.length;i++){
            var feature = features[i];
            if(feature.geometry.type == "Point"){
                pointFeatures.features.push(feature);
            }else{
                var linefeature = feature;
                var linefeature1 = JSON.parse(JSON.stringify(feature));
                var coordinates = linefeature.geometry.coordinates;
                for(var j=0;j<coordinates.length;j++){
                    var lng = coordinates[j][0];
                    if(lng>180){
                        linefeature.geometry.coordinates[j][0] = -360+linefeature.geometry.coordinates[j][0];
                        linefeature1.geometry.coordinates[j][0] = 360;
                        t++
                    }else{
                        if(t>0){
                            linefeature.geometry.coordinates[j][0]=-360;
                        }
                    }
                }
                LineFeatures.features.push(linefeature) ;
                LineFeatures1.features.push(linefeature1) ;
            }
        }  
        var provinceProvider = new Cesium.VectorTileImageryProvider({
            source: LineFeatures,
            zIndex: 100,
            removeDuplicate: false,
             defaultStyle: {
                outlineColor: "#000000",
                lineWidth:1
            },
           styleFilter: function (feature, style) {
                if (feature.properties.hasOwnProperty("lineWidth")) {
                    style.lineWidth = feature.properties["lineWidth"]*1;
                }
                if (feature.properties.hasOwnProperty("valueColor")) {
                    style.outlineColor = Cesium.Color.fromCssColorString(feature.properties["valueColor"]);
                }
            },
            maximumLevel: 10,
            minimumLevel: 1,
            simplify: false
          
        });
        var provinceProvider1 = new Cesium.VectorTileImageryProvider({
            source: LineFeatures1,
            zIndex: 100,
            
            removeDuplicate: false,
             defaultStyle: {
                outlineColor: "#000000",
                lineWidth:1
            },
            styleFilter: function (feature, style) {
                if (feature.properties.hasOwnProperty("lineWidth")) {
                    style.lineWidth = feature.properties["lineWidth"]*1;
                }
                if (feature.properties.hasOwnProperty("valueColor")) {
                    style.outlineColor = Cesium.Color.fromCssColorString(feature.properties["valueColor"]);
                }
            },
            maximumLevel: 10,
            minimumLevel: 1,
            simplify: false
            
        });

        var layers = [provinceProvider,provinceProvider1,pointFeatures];
        return layers;
	},
    initTyphoon:function(layer,cesiumMap){
	    layer.pointCount=0;//清零计时器
        //cesiumMap._cesiumViewer.entities.removeAll();//强制清空所有实体
        let _entities = cesiumMap._cesiumViewer.entities.values;
        let elength = _entities.length;
        for(let ei = elength-1;ei>=0;ei--){
            if(_entities[ei].id.indexOf(layer.id +'typhoon-polygon')>-1){
                cesiumMap._cesiumViewer.entities.remove(_entities[ei]);  
            }
           
        }
        var _primitives = cesiumMap._cesiumViewer.scene.primitives._primitives;
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
								_primitives[i].removeAll();
								break;
							}
						}
						
				}
			}

         //删除折线
        var primitives = cesiumMap._cesiumViewer.scene.primitives;
        for (var i=(primitives.length-1);(i>-1 && i<primitives.length);i--) {
            var p = primitives.get(i);
            if (p && p._instanceIds && p._instanceIds[0].indexOf(layer.id + "typhoon-line")>-1)
            {
                cesiumMap._cesiumViewer.scene.primitives.remove(p);
            }
        }

        clearInterval(this.typhoonIntever);
        //创造点的集合
      
        var pointPrimitives = cesiumMap._cesiumViewer.scene.primitives.add(new Cesium.PointPrimitiveCollection());
        layer.pointPrimitives=pointPrimitives;
         var points = layer.TyphoonPointsArray;
        //增加台风开始运行及暂停运行的按钮
        var btnStart = document.createElement("button");
        btnStart.id="btnStart";
        btnStart.style.position = "absolute";
        btnStart.style.top = "13%";
        btnStart.style.right = "1%";
        btnStart.style.width = "100px";
        btnStart.style.height = "30px";
        btnStart.style.background =  "rgba(60, 141, 188, 1.0)";
        btnStart.style.border = "none";
        btnStart.style.padding = "5px 10px";
        btnStart.style.color = "#fff";
        btnStart.style.zIndex = "9999"
        btnStart.innerText = "开始"
        btnStart.onclick = function () {
            layer.typhoonRunStatus=true;
            btnStart.style.background = "rgb(64, 52, 216)";
            btnStop.style.background = "rgba(60, 141, 188, 1.0)";
      }

        var btnStop = document.createElement("button");
        btnStop.id="btnStop";
        btnStop.style.position = "absolute";
        btnStop.style.top = "17%";
        btnStop.style.right = "1%";
        btnStop.style.width = "100px";
        btnStop.style.height = "30px";
        btnStop.style.background =  "rgba(60, 141, 188, 1.0)";
        btnStop.style.border = "none";
        btnStop.style.padding = "5px 10px";
        btnStop.style.color = "#fff";
        btnStop.style.zIndex = "9999"
        btnStop.innerText = "结束"
        btnStop.onclick = function () {
            layer.typhoonRunStatus=false;
            btnStart.style.background = "rgba(60, 141, 188, 1.0)";
            btnStop.style.background = "rgb(64, 52, 216)";
        }
        if(layer.startBtn){
            cesiumMap._cesiumViewer.container.appendChild(btnStart);
            cesiumMap._cesiumViewer.container.appendChild(btnStop);

        }
        

        //循环台风点
        this.typhoonIntever=setInterval(function () {
                  layer.typhoonTrack(points,layer,pointPrimitives,cesiumMap);
             },layer.speed);//每隔一秒调用一次

     },
    initCustomTileLayer:function(layer,cesiumMap)
    {
        var imageryLayers = cesiumMap._cesiumViewer.imageryLayers;
        imageryLayers.addImageryProvider(layer);
    },
	initPoint:function(layer,properties){
		var tempPoint = new Cesium.PointGraphics();
		tempPoint.color = Cesium.Color.fromCssColorString(layer.color.toString());
        tempPoint.color._value.alpha = layer.opacity;
		if(typeof(layer.size) == "object"){
			layer.size = layer.size.stops[0][1]
		}
		tempPoint.pixelSize = layer.size*2;
        if(layer.strokeWidth>0){
            tempPoint.outlineWidth = layer.strokeWidth+5;
            tempPoint.outlineColor =Cesium.Color.fromCssColorString(layer.strokeColor.toString());
        } 
        tempPoint.outlineWidth = 0;
		
		return tempPoint;
	},
	initIcon:function(layer,url,iconJson,properties){
        
        var tempUrl = properties[layer.iconUrl];
        if(tempUrl){
            
        }else{
            tempUrl = "";
        }
        
        var iconrotate =0;
        var poffset=new Cesium.Cartesian2(0,0);
        if(layer.offset){
            var oy=layer.offset[1]*layer.size*1;
            var ox=layer.offset[0]*layer.size*1;
            if(layer.rotate){
                var jd=properties[layer.rotate].toString()*-1;
                iconrotate=jd*Math.PI/180;
                if(layer.rotateOffset){
                	var rotateOffset = this.getFuYuOffset(jd);
                	ox = rotateOffset[0];
                	oy = rotateOffset[1];
                }
            }

            poffset=new Cesium.Cartesian2(ox,oy);
        }
        console.log(layer.loadImageUrl)
        if(layer.loadImageUrl){
            var options={
                image:layer.loadImageUrl,
                scale:layer.size||1.0,
                pixelOffset:poffset,
                rotation:iconrotate,
                heightReference:Cesium.HeightReference.CLAMP_TO_GROUND,
                horizontalOrigin:Cesium.HorizontalOrigin.CENTER,
                verticalOrigin:Cesium.VerticalOrigin.BOTTOM
            };
            console.log(options)
            var obj=new Cesium.BillboardGraphics(options);
            console.log(obj)
               return obj;
        }else{
            var offsetData = false;
            if(iconJson){
                offsetData = iconJson[layer.imageName +tempUrl ];
            }
            if(!offsetData){
                var obj=new Cesium.BillboardGraphics();
                return obj;
            }else{
                var bRectangle=new Cesium.BoundingRectangle(offsetData.x,1024-offsetData.y-offsetData.height,offsetData.width,offsetData.height);
            }
            var options={
                image:url,
                scale:layer.size||1.0,
                pixelOffset:poffset,
                rotation:iconrotate,
                width:offsetData.width,
                height:offsetData.height,
                heightReference:Cesium.HeightReference.CLAMP_TO_GROUND,
                imageSubRegion:bRectangle,
                horizontalOrigin:Cesium.HorizontalOrigin.CENTER,
                verticalOrigin:Cesium.VerticalOrigin.CENTER
            };
            var obj=new Cesium.BillboardGraphics(options);
            return obj;
        }
       
	},
	getFuYuOffset:function(jd){
		var ox=16,oy=-16;
		if((-jd>10&&-jd<45)||-jd==45){
			ox=9;
			oy=-12.8;
		}else if(-jd>45&&-jd<80){
			ox=12.8;
			oy=-9;
		}else if((-jd>80&&-jd<100)||-jd==80||-jd==100){
			ox=16;
			oy=0;
		}else if((-jd>100&&-jd<135)||-jd==135){
			ox=12.8;
			oy=9;
		}else if(-jd>135&&-jd<170){
			ox=9;
			oy=12.8;
		}else if((-jd>170&&-jd<190)||-jd==170||-jd==190){
			ox=0;
			oy=16;
		}else if((-jd>190&&-jd<225)||-jd==225){
			ox=-9;
			oy=12.8;
		}else if(-jd>225&&-jd<260){
			ox=-12;
			oy=7;
		}else if((-jd>260&&-jd<280)||-jd==260||-jd==280){
			ox=-16;
			oy=0;
		}else if((-jd>280&&-jd<315)||-jd==315){
			ox=-12.8;
			oy=-9;
		}else if(-jd>315&&-jd<350){
			ox=-7;
			oy=-12;
		}else if(-jd>350||-jd>10||-jd==350||-jd==10){
			ox=0;
			oy=-15;
		}
		return [ox,oy];
	},
}

export {CesiumStyle}