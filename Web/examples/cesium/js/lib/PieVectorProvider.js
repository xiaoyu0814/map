/**
 * Created by Administrator on 2017/10/30.
 */
function PieParseProtoBuffer(callback){
    console.log("callback ",callback)
    this._state = {
        ready:false,
        message:null
    };
	console.log(0)
    var func = loadProtoFile(this._state,callback);
    console.log(func)
    console.log(this._state.message);
    function loadProtoFile(state,callback){
        console.log(1)
        // return new Promise((resolve) => {
        //     console.log(2)
        //     protobuf.load([
        //         'js/lib/proto/wpIsolineRenderData.proto',
        //         'js/lib/proto/wpIsoSurfaceRenderData.proto',
        //         'js/lib/proto/streamline.proto',
        //         'js/lib/proto/wpGeoWindPole.proto'
        //     ], (err, root) => {
        //         var datasetMessage = root.lookup("pbufWeather.wpIsolineRenderData");
        //         var datasurfaceMessage = root.lookup("pbufWeather.wpIsoSurfaceRenderData");
        //         var datastreamlineMessage = root.lookup("streamline.GeoStreamline");
        //         var datawindpoleMessage = root.lookup("windpole.GeoWindPole");
        //         state.ready = true;
        //         state.message = [datasetMessage,datasurfaceMessage,datastreamlineMessage,datawindpoleMessage];
        //         // state.message = {'isoline':datasetMessage,
        //         //                 'isv':datasurfaceMessage,
        //         //                 'wsl':datastreamlineMessage,
        //         //                 'wws':datawindpoleMessage
        //         //                 };
				
		// 		if(callback)
		// 		{
		// 			callback();
		// 		}
        //         resolve();
        //     });
        // })
        console.log(protobuf)
        return protobuf.load([
            'js/lib/proto/wpIsolineRenderData.proto',
            'js/lib/proto/wpIsoSurfaceRenderData.proto',
            'js/lib/proto/streamline.proto',
            'js/lib/proto/wpGeoWindPole.proto'
        ], function (err, root) {
            var datasetMessage = root.lookup("pbufWeather.wpIsolineRenderData");
            var datasurfaceMessage = root.lookup("pbufWeather.wpIsoSurfaceRenderData");
            var datastreamlineMessage = root.lookup("streamline.GeoStreamline");
            var datawindpoleMessage = root.lookup("windpole.GeoWindPole");
            state.ready = true;
            state.message = [datasetMessage,datasurfaceMessage,datastreamlineMessage,datawindpoleMessage];
            // state.message = {'isoline':datasetMessage,
            //                 'isv':datasurfaceMessage,
            //                 'wsl':datastreamlineMessage,
            //                 'wws':datawindpoleMessage
            //                 };
            
            if(callback)
            {
                callback();
            }
            // resolve();
        });
    }
}

PieParseProtoBuffer.prototype.requestData = function(url, type, callback){
    var self = this
    if(this._state.message == null){
        //setTimeout(function(){
            return getProtobuf(self._state.message,url,type,callback)
        //},1000)
    }else{
        return getProtobuf(self._state.message,url,type,callback)
    }
    
}

function getProtobuf(msg,url,type,callback) {
    console.log(4)
    // return new Promise((resolve) => {
    //     console.log(5)
    //     var xhr = new XMLHttpRequest();
    //     xhr.open("GET",url, true);
    //     //xhr.open("GET",url, true);
    //     xhr.responseType = "arraybuffer";
    //     xhr.onload = function () {
    //         var result = new Uint8Array(xhr.response);
    //         if (result.length === 0) {
    //             console.log('数据读取失败');
    //             return false;
    //         }
    //         console.log(6)
    //         var readerData = new protobuf.Reader(result);
    //         var protoData;
    //         if(type=="isoline"){
    //             protoData = msg[0].decode(readerData);
    //         }else if(type=="isv"){
    //             protoData = msg[1].decode(readerData);
    //         }else if(type == "wsl"){
    //             protoData = msg[2].decode(readerData);
    //         }else if(type == "wws"){
    //             protoData = msg[3].decode(readerData);
    //         }
    //         resolve(protoData);
    //     };
    //     xhr.send(null);
    // })
    console.log(5)
    var xhr = new XMLHttpRequest();
    xhr.open("GET",url, true);
    //xhr.open("GET",url, true);
    xhr.responseType = "arraybuffer";
    xhr.onload = function () {
        var result = new Uint8Array(xhr.response);
        if (result.length === 0) {
            console.log('数据读取失败');
            return false;
        }
        console.log(6)
        var readerData = new protobuf.Reader(result);
        var protoData;
        if(type=="isoline"){
            protoData = msg[0].decode(readerData);
        }else if(type=="isv"){
            protoData = msg[1].decode(readerData);
        }else if(type == "wsl"){
            protoData = msg[2].decode(readerData);
        }else if(type == "wws"){
            protoData = msg[3].decode(readerData);
        }
        callback(protoData);
    };
    xhr.send(null);
}

function ab2str(buf) {
   var string = String.fromCharCode.apply('\n',new Uint8Array(buf));
   return string;
}
function getTrueValue(value) {
    if(value<15){
        return "0"+value.toString(16);
    }
    else{
        return value.toString(16);
    }
}
function color(rgb) {
    // console.log("前",rgb)
    rgb = Math.abs(rgb);
    //return rgb.toString(16);
    // console.log("后",rgb)
    var a = (rgb)>>(24)&(0xff);
    //console.log(sa)
    var r  = (rgb)>>(16)&(0xff);
    // console.log("r ",r)
    var g  = (rgb)>>(8)&(0xff);
    // console.log("g ",g)
    var b  = (rgb)&(0xff);
    // console.log("b ",b)
    // console.log(getTrueValue(r),getTrueValue(g),getTrueValue(b))
    var _rgb = getTrueValue(r)+getTrueValue(g)+getTrueValue(b);

    return _rgb;
}
function TestRgexp(re, s){ // 参数说明 re 为正则表达式 s 为要判断的字符
    return re.test(s)
}
/*
 * 解析protocol buffer数据为等值线的geojson格式
 * */
function getGeoJsonData(val,to){
    console.log(val)
    var geojson = {
        "type": "FeatureCollection",
        "features": []
    };
    if(val.wGeoLineArray){
        //等值线
        var re =/^-?\d+$/;
        for(var i=0;i<val.wGeoLineArray.length;i++){
            // 获取GeoLine
            var xArr = val.wGeoLineArray[i].xArray;
            var yArr = val.wGeoLineArray[i].yArray;
            var _colorIndex = val.wGeoLineArray[i].Value;
            var ValueString = val.wGeoLineArray[i].ValueString;
            var _angleArr = val.wGeoLineArray[i].Angle;
            var  valuecolorArr = '#'+ color(val.wGeoLineArray[i].ValueColor);
            
            var pntCount = xArr.length;
            
            var LineString =ab2str(val.wGeoLineArray[i].LingTypeString);
            if(LineString == "Strong"){
                LineString = 3;
            }
            else {
                LineString =1;
            }

            if( _colorIndex != "+"&&!TestRgexp(re , _colorIndex))
            {
                _colorIndex=  parseFloat( _colorIndex).toFixed(1)
            }

            // console.log(ValueString);
            if(ValueString.length != 0)
            {
                //console.log(ab2str(ValueString))
                _colorIndex = ab2str(ValueString) ;
            }
            var featureL={
                "type": "Feature",
                "geometry": {
                    "type": "LineString",
                    "coordinates": []
                },
                "properties":{
                    "colorIndex":_colorIndex,
                    "angle":_angleArr*180/Math.PI,// angleArr[i]
                    "valueColor":valuecolorArr,
                    "LineTypeString":LineString
                }
            };
            for(var j =0; j<pntCount;j++){
                if(pntCount>=2)
                {
                    featureL.geometry.coordinates.push([xArr[j],yArr[j]]);
                }
            }
            if(pntCount>=2){

                geojson.features.push(featureL);

            }else if(pntCount == 1){

                featureL.geometry.type = "Point";
                featureL.geometry.coordinates.push(xArr[0]);
                featureL.geometry.coordinates.push(yArr[0]);
                geojson.features.push(featureL);
            }

        }
    }else if(val.wpGeoRegionArray){
        // var colorArr = [];
        //等值面
        for(var i=0;i<val.wpGeoRegionArray.length;i++){
            // 获取GeoLine
            var xArr = val.wpGeoRegionArray[i].xArray;
            var yArr = val.wpGeoRegionArray[i].yArray;
            var valueArr = val.wpGeoRegionArray[i].Value;
            // colorArr.push(valueArr);
            var pntcountArr = val.wpGeoRegionArray[i].SubPntCounts;
            var featureR={
                "type": "Feature",
                "geometry": {
                    "type": "Polygon",
                    "coordinates":[]
                },
                "properties":{
                    "colorIndex":parseInt(valueArr)
                }
            };
            for(var k=0;k<1;k++){
                var featureL={
                    "type": "Feature",
                    "geometry": {
                        "type": "Polygon",
                        "coordinates":[]
                    },
                    "properties":{
                        "colorIndex":parseInt(valueArr)
                    }
                };
                var pcount = 0;
                for(var j = pcount;j<pntcountArr[k]+pcount;j++){
                    featureL.geometry.coordinates.push([xArr[j],yArr[j]]);
                }
                pcount += pntcountArr[k];
                featureR.geometry.coordinates.push(featureL.geometry.coordinates);
                // remove laset ，
            }
            geojson.features.push(featureR);
        }
    }else if(val.geoLines){
        //静态流线数据
        for(var i=0;i<val.geoLines.length;i++){
            // 获取GeoLine
            var points = val.geoLines[i].points;
            var featureL={
                "type": "Feature",
                "geometry": {
                    "type": "LineString",
                    "coordinates": []
                }
            }
            for(var j =0; j<points.length;j++){
                featureL.geometry.coordinates.push([points[j].x,points[j].y]);
            }
            geojson.features.push(featureL);
        }
    }else if(val.windPole){
        //风向杆数据
        for(var i=0; i<val.windPole.length;i++){
            var windpole = val.windPole[i]
            var featureW = {
                "type":"Feature",
                "geometry":{
                    "type":"Point",
                    "coordinates":[windpole.X,windpole.Y]
                },
                "properties":{
                    //{"iconUrl":"%s.png","iconSize":[80,80], "iconAnchor":[25, 25], "popupAnchor":[0,-25], "className":"dot", "angle":%f}
                    "iconUrl":windpole.Value+".png",
                    "angle":windpole.Angle*180/Math.PI
                }
            }
            geojson.features.push(featureW)
        }
    }
    return geojson;
}



