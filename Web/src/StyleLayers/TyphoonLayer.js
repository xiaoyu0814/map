
import {Layer} from '../Layer/Layer';
import {LineLayer} from "./LineLayer";
import {FillLayer} from "./FillLayer";
import {PointLayer} from "./PointLayer";
var typhoonLayer = 1;
/**
 * @module Layer
 */
/**
 * TyphoonLayer
 *
 * @class TyphoonLayer
 * @extends Layer
 * @param {Object} options <br/>
 * [url] — 图层的URL，或者用于渲染图层的样式资源的URL。<br/>
 * [id] — 图层的唯一id。<br/>
 * [data] — 图层的数据。<br/>
 * @constructor
 */
function TyphoonLayer(options) {
	Layer.call(this);
	options = options || {};
    this.url = options.url !== undefined ? options.url : "";
    this.id = options.id !== undefined ? options.id : "typhoonLayer"+typhoonLayer++;
    this.data = options.data !== undefined ? options.data : "";
    this.sourceId = options.sourceId !== undefined ? options.sourceId : false;
    this.filter = options.filter !== undefined?options.filter:false;
    this.num = 0;
    this.speed = options.speed !== undefined?options.speed:100;
    this.startBtn = options.startBtn !== undefined?options.startBtn:false;
    this.goStart = true;
    this.type = "typhoonLayer";
    this.strong_Name = {
	    "0":{name:"热带低压",color:"#fff"},
	    "1":{name:"热带低压",color:"#0f0"},
	    "2":{name:"热带风暴",color:"#00f"},
	    "3":{name:"强热带风暴",color:"#ff0"},
	    "4":{name:"台风",color:"orange"},
	    "5":{name:"强台风",color:"#f0f"},
	    "6":{name:"超强台风",color:"#f00"},
	    "9":{name:"超强台风",color:"#000"},
	    "热带低压":{name:"热带低压",color:"#0f0"},
	    "热带风暴":{name:"热带风暴",color:"#00f"},
	    "强热带风暴":{name:"强热带风暴",color:"#ff0"},
	    "台风":{name:"台风",color:"orange"},
	    "强台风":{name:"强台风",color:"#f0f"},
	    "超强台风":{name:"超强台风",color:"#f00"},
	};

	this.pointCount = 0;//每隔一秒调用一次，记录下全局的计数器
	this.typhoonRadius = null;//记录气旋的半径
	this.typhoonRunStatus=true;//台风运行状态
	this.typhoonIntever = null;

    // this.symbol = options.symbol !== undefined ? options.symbol : new PIE.MarketSymbol({color:"blue",width:1});
    this.initData(options);

}
TyphoonLayer.prototype =  Object.assign( Object.create( Layer.prototype ), {
	handleData:function(self){
		console.log(self)
	},
	initLayer:function(data){
		console.log(data)
		var lines = []
		var tempData = data[0];
		var pointLength = data[0].points.length;
		var points = data[0].points;

		var point_data = this.getPointData(points);
		this.TyphoonPointsArray=points;
		this.TyphoonData = point_data;
		this.length  = pointLength;
		console.log(point_data)
		this.source= {
	        "id":this.id,
	        "source":{
	            "type":"geojson",
	            "data":point_data
	        }
        };

	},

	start:function(map){
		this.num=0;
		this.goStart=true;
		var self = this;

		function go(){
			self.num ++;
			if(self.num>(self.length-1)){
				self.goStart = false;
				return;
			}
			if(self.goStart){
				setTimeout(go,self.speed)	
			}
			map.setFilter(self.id+"_Line",[
					"all",
                [
                    "in",
                    "num",
                    self.num
                ],["==", "$type", "LineString"]
            ]);
			map.setFilter(self.id+"_Point",[
                "all",
                [
                    "<=",
                    "num",
                    self.num
                ],["==", "$type", "Point"]
            ]);
            map.setFilter(self.id+"_Fill",[
                "all",
                [
                    "in",
                    "num",
                    self.num
                ],["==", "$type", "Polygon"]
            ]);
			
			
		}
		go()

	},
	getPointData : function (linePath) {

	    var data ={
	      "type": "FeatureCollection",
	      "features": []
	    };
	    

	    for(var i =0 ;i<linePath.length;i++){
	      var obj = linePath[i];
	      var strong = obj.strong;
	      var color = this.strong_Name[strong].color;
	      var strongName= this.strong_Name[strong].name;
	      var date =obj.time// moment(obj.TIME,"YYYYMMDDHH").format("YYYY-MM-DD HH时");
	      var dataset = {
	        "type": "Feature",
	        "geometry": {
	          "type": "Point",
	          "coordinates": [obj.longitude, obj.latitude]
	        },
	        "properties":{
	          "descripption": "<div id = 'showId'><strong>"+date+strongName+"</strong><p><b>当前位置：</b>"+obj.longitude+"°E/"+obj.latitude+"°N<br><b>中心气压：</b>"+obj.pressure+" HPa<br><b>最大风速：</b>"+obj.speed+" m/s<br><b>七级半径：</b>"+obj.radius7+" km<br><b>十级半径：</b>"+obj.radius10+" km<br><b>十二级半径：</b>"+obj.radius12+" km</p></div>",
	          "speed":obj.speed,
	          "radius7": obj.radius7,
	          "radius10": obj.radius10,
	          "radius12": obj.radius12,
	          "radius7_quad":obj.radius7_quad,
	          "radius10_quad": obj.radius10_quad,
	          "radius12_quad": obj.radius12_quad,
	          "num":i,
	          "valueColor":color
	        }
	      };
	     
	      	var line = this.getLineData(linePath,i+1);
	      	data.features.push(line);
			var radius = this.getradiusPolygn(obj,i);
			data.features.push(radius[0])
			data.features.push(radius[1])
			data.features.push(radius[2])
	    	data.features.push(dataset);
	    	

	    }
	    return data;

 	},
 	getLineData:function(linePath,num){
 		var dataLineset = {
	      "type": "Feature",
	      "geometry": {
	        "type": "LineString",
	        "coordinates": []
	      },
	      "properties":{
	        "num":num-1
	      }
	    };
	    for(var i=0;i<num;i++){
	    	var obj = linePath[i]
	    	 dataLineset.geometry.coordinates.push([obj.longitude,obj.latitude]);
	    }

	    return dataLineset

 	},
 	getradiusPolygn:function(quad,num){
 		var lng = quad.longitude,lat = quad.latitude;
 		var radius7_quad = quad.radius7_quad;
 		var radius10_quad = quad.radius10_quad;
 		var radius12_quad = quad.radius12_quad;
 		var neStart = 0,seStart = 270,swStart =180,nwStart =90;

 		var neR = radius7_quad.ne/100,seR = radius7_quad.se/100,swR = radius7_quad.sw/100, nwR = radius7_quad.nw/100
        var radius7Line = this.getLinePath(lng,lat,neR,neStart).concat(this.getLinePath(lng,lat,nwR,nwStart)).concat(this.getLinePath(lng,lat,swR,swStart)).concat(this.getLinePath(lng,lat,seR,seStart));

        var neR = radius10_quad.ne/100,seR = radius10_quad.se/100,swR = radius10_quad.sw/100, nwR = radius10_quad.nw/100
        var radius10Line = this.getLinePath(lng,lat,neR,neStart).concat(this.getLinePath(lng,lat,nwR,nwStart)).concat(this.getLinePath(lng,lat,swR,swStart)).concat(this.getLinePath(lng,lat,seR,seStart));

        var neR = radius12_quad.ne/100,seR = radius12_quad.se/100,swR = radius12_quad.sw/100, nwR = radius12_quad.nw/100
        var radius12Line = this.getLinePath(lng,lat,neR,neStart).concat(this.getLinePath(lng,lat,nwR,nwStart)).concat(this.getLinePath(lng,lat,swR,swStart)).concat(this.getLinePath(lng,lat,seR,seStart));

       var radius7 =   this.getFillData(radius7Line,"",num,"#00dd00");
       var radius10 =  this.getFillData(radius10Line,"",num,"#dddd00");
       var radius12 = this.getFillData(radius12Line,"",num,"#dd0000");

       return [radius7,radius10,radius12]

 	},
 	getFillData : function (linePath,data,num,color) {
	 
	    var dataLineset = {
	      "type": "Feature",
	      "geometry": {
	        "type": "Polygon",
	        "coordinates": [linePath]
	      },
	      "properties":{
	        "descripption": "<div><p>"+data+"</p></div>",
	        "valueColor":color,
	        "num":num
	      }
	    };
    	return dataLineset;
  	},

	//拿到弧线坐标
	getLinePath:function(lng,lat,r,start) {
	    var lines = [];
		if(r===0)
		{
			return  [];
		}
	    for(var i=0;i<31;i++){
	      var b = ((start+i*3)/180)*Math.PI;
	      var x = lng + r*Math.cos(b);
	      var y = lat + r*Math.sin(b);

	      var temp = [x,y]
	      lines.push(temp);
	    }
	    return lines;
  	},
	typhoonTrack:function(points,layer,pointPrimitives,cesiumMap){
		if (this.typhoonRunStatus) {
            this.getPoint_Cesium(points,layer,pointPrimitives,cesiumMap);
		} else {
			// Console.log("台风运行轨迹暂停");
		}
	},
	getPoint_Cesium:function(linePath,layer,pointPrimitives,cesiumMap)//绘制多边形与面
	{
		if(layer.pointCount==linePath.length) {//代表到了最后一个台风点，下面的代码无需执行
			return;
		}
		var obj = linePath[layer.pointCount];
		var strong = obj.strong;
		var color = layer.strong_Name[strong].color;

		//增加台风点
		var position = Cesium.Cartesian3.fromDegrees(Number(obj.longitude), Number(obj.latitude));
		pointPrimitives.add({
			id:layer.id +"typhoon-point"+"-"+layer.pointCount,
			position : position,
			pixelSize : 10,
			color:Cesium.Color.fromCssColorString(color)
		});

		//增加风旋图形
		layer.typhoonRadius = this.getradiusPolygn(obj,layer.pointCount);
		//画多面形
		this.getPolygn_Cesium(layer.typhoonRadius,cesiumMap);

		//增加台风路径,必须是先画点之后，再画其对应的前一条线
		if(layer.pointCount<=linePath.length-1 && layer.pointCount>0)
		{
			var line = layer.getLine_Cesium(linePath,layer.pointCount,cesiumMap,color);
		}

		//把最新点之前的所有风旋都设置为不可见，只显示最新的风旋
		if(layer.pointCount>=1)
		{
			var entityArray = cesiumMap._cesiumViewer.entities._entities._array;
			var arr = [];
			for(var i=0;i<entityArray.length;i++){
				//如果字符串中不包含目标字符会返回-1
				if(entityArray[i]._id.indexOf('polygon'+(layer.pointCount-1).toString())>=0){
					//console.log(entityArray[i]._id+":"+Date.now().toString());
					arr.push(entityArray[i]);
				}
			}

			for(var i=0; i<arr.length;i++)
			{
                arr[i].show=false;
			}
		}

		// //清除定时器
		// if(layer.pointCount==linePath.length-1)
		// {
		// 	clearInterval(layer.typhoonIntever);
		// 	return;
		// }

		//更新全局变量
		layer.pointCount +=1;
	},
	getLine_Cesium:function(linePath,count,cesiumMap,color){
		var objStart=linePath[count-1];
		var obj = linePath[count];
		var position = Cesium.Cartesian3.fromDegreesArray([objStart.longitude,objStart.latitude,obj.longitude,obj.latitude]);

		// 从给的坐标点创建线段
		var lineGeometry = Cesium.PolylineGeometry.createGeometry(
			new Cesium.PolylineGeometry({
				positions: position,
				width:1
			}) );
		if(lineGeometry !=undefined)
		{
			// 根据图形实例创建一个图元
			var geometryInstance = new Cesium.GeometryInstance({
				geometry: lineGeometry,
				id: this.id + 'typhoon-line' + count.toString(),
				attributes: {
					color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromCssColorString(color))
				}
			});

			//加载图元到界面开始
			cesiumMap._cesiumViewer.scene.primitives.add(new Cesium.Primitive({
				geometryInstances: geometryInstance,
				appearance : new Cesium.PolylineColorAppearance({
					translucent : false
				})
			}));
			//加载图元到界面对束
		}
	},
	getPolygn_Cesium:function(radius,cesiumMap){
		for(var i=0;i<radius.length;i++) {
			var obj=radius[i];
			var coordinate_twoDimension = obj.geometry.coordinates;
			var coordinate_oneDimension = [].concat.apply([], coordinate_twoDimension);//几何对象的坐标
			var coordinate = [].concat.apply([], coordinate_oneDimension)
			//  var coordinate = [146.1, 19, 146.0978072556073, 19.08373752998871, 146.09123503258922, 19.167245541228244, 146.08030134495223, 19.25029514406437, 146.06503616117408, 19.332658705308415, 146.0454813220625, 19.414110472164033, 146.02169042607224, 19.494427190999915, 145.99372868239553, 19.57338871927248, 145.96167273222815, 19.65077862892128, 145.9256104387014, 19.726384799583276, 145.8856406460551, 19.8, 145.84187290871267, 19.871422456024042, 145.79442719099993, 19.94045640366796, 145.74343353833115, 20.00691262567974, 145.68903172076384, 20.070608970174174, 145.63137084989847, 20.131370849898477, 145.57060897017416, 20.18903172076383, 145.50691262567975, 20.243433538331153, 145.44045640366795, 20.294427190999915, 145.37142245602405, 20.341872908712677, 145.3, 20.3856406460551, 145.2263847995833, 20.425610438701387, 145.15077862892127, 20.461672732228163, 145.0733887192725, 20.493728682395524, 144.99442719099991, 20.521690426072247, 144.91411047216403, 20.54548132206251, 144.8326587053084, 20.56503616117409, 144.75029514406438, 20.580301344952222, 144.66724554122825, 20.59123503258924, 144.58373752998872, 20.597807255607318, 144.5, 20.6, 144.5, 20.6, 144.41626247001128, 20.597807255607318, 144.33275445877175, 20.59123503258924, 144.24970485593562, 20.580301344952222, 144.1673412946916, 20.56503616117409, 144.08588952783597, 20.54548132206251, 144.00557280900009, 20.521690426072247, 143.9266112807275, 20.493728682395524, 143.84922137107873, 20.461672732228163, 143.7736152004167, 20.42561043870139, 143.7, 20.3856406460551, 143.62857754397595, 20.341872908712677, 143.55954359633205, 20.294427190999915, 143.49308737432025, 20.243433538331153, 143.42939102982584, 20.189031720763833, 143.36862915010153, 20.131370849898477, 143.31096827923616, 20.070608970174174, 143.25656646166885, 20.00691262567974, 143.20557280900007, 19.94045640366796];
			var position = Cesium.Cartesian3.fromDegreesArray(coordinate);

			this.getPolygnEntity_Cesium(position, obj, i, cesiumMap);
		}
	},
	getPolygnEntity_Cesium:function (position,obj,i,cesiumMap) {
		cesiumMap._cesiumViewer.entities.add({
			id: this.id +'typhoon-polygon' + this.pointCount.toString() + "-" + i,
			polygon: {
				hierarchy:new Cesium.CallbackProperty(function () {
					return  new Cesium.PolygonHierarchy(position)
				}, false),
				//material: Cesium.Color.RED.withAlpha(0.5)
				// material: Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(obj.properties.valueColor), 0.2),
				material:(Cesium.Color.fromCssColorString(obj.properties.valueColor)).withAlpha(0.2),
				zIndex:i,
			}
		});
		if(([].concat.apply([],obj.geometry.coordinates) ).length>1) {
			//cesiumMap._cesiumViewer.camera.lookAt(Cesium.Cartesian3.fromDegrees(obj.geometry.coordinates[0][0][0], obj.geometry.coordinates[0][0][1], 1500), new Cesium.HeadingPitchRange(-Cesium.Math.PI /2, -Cesium.Math.PI_OVER_FOUR, 4000000));
			//cesiumMap._cesiumViewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
		}
		//PageInfo.viewer.zoomTo(PageInfo.viewer.entities,new Cesium.HeadingPitchRange(-Cesium.Math.PI/2, -Cesium.Math.PI_OVER_FOUR, 2000000));
	},


	innerSource:function(type){

        if(type ==1){
            this.mapSource ={
                "id":this.id,
		        "source":{
		            "type":"geojson",
		            "data":this.TyphoonData
		        }
            };
            return this.mapSource;

        }else if(type==2){
            this.olSource = new PIE.ol.source.ImageWMS({
                url: this.url,
                params: {'LAYERS': this.layers},
                ratio: 1,
                //serverType: 'geoserver'
              })
            this.olSource.id = this.id;
            return this.olSource;
        }else if(type == 3){

        }
    },
    innerLayer:function(type){
       
        //"http://211.154.196.253:6080/arcgis/rest/services/EDATA/lspop2013/ImageServer/exportImage/export?bbox=98.701171875%2C31.102294921874996%2C98.71215820312499%2C31.113281250000004&size=256%2C256&format=png&transparent=true&f=image&bboxSR=4326&imageSR=4326"
       
         if(type==1){ 
	        this.layers = this.initTyphoonStyle(this);
	        return this.layers;
        }else if(type ==2){
            this.olLayer =   new PIE.ol.layer.Image({
                //extent: [-13884991, 2870341, -7455066, 6338219],
                source: this.olSource
            })
            this.olLayer.id = this.id;
            return this.olLayer;
        }else if(type == 3){
            this.cesLayer = new Cesium.WebMapTileServiceImageryProvider({
                url : this.url,
                layer : this.layers,
                style : this.style,
                format : this.format,
                //tileMatrixSetID : 'default028mm',
                // tileMatrixLabels : ['default028mm:0', 'default028mm:1', 'default028mm:2' ...],
                //maximumLevel: 19,
                //credit : new Cesium.Credit('U. S. Geological Survey')
            });
            return this.cesLayer;
        }
    },
    onAdd:function(map,type){
        this._map = map;
        if(type == 1){
            for(var i=0;i<this.layers.length;i++){
                map.addLayer(this.layers[i].layer);
            }
            this.start(map);
            
        }else if(type==2){
            
        }else if(type ==3){

        }
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
})


export {TyphoonLayer}