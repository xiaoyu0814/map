var Typhoon =  function (mapset) {
    var map = mapset,typhoon;
    var i =0,linePath =[];
    var marker;
    this.getTyphoon= function (id){
        $.ajax({
            async : false,
            type : "POST",
            dataType : "json",
            url : "http://127.0.0.1:8060/PIE-Web/typhoon/typhoonToJson?id="+id,
            success : function(rs) {
                if (!rs || rs.length == 0) {
                    return;
                }
                console.log(rs);
                typhoon = rs;
                setInterval(animat,1000);
            },
        })
    };

    this.getData = function(url) {
            const xhr = new XMLHttpRequest();
            //xhr.open("GET","http://"+url, true);
            xhr.open("GET",url, true);
            xhr.onload = function () {
                if (xhr.status == 200 ) {
                    var result = JSON.parse(xhr.response)
                    if (result.length === 0) {
                        console.log('数据读取失败');

                        return false;
                    }
                    typhoon = result;
                    setInterval(animat,1000);
                } else {
                    return xhr.statusText;
                }

            };
            xhr.onerror = function () {
                return xhr.statusText;
            };
            xhr.send(null);

    };
    map.on('click', 'point_test', function (e) {
        var coordinates = e.features[0].geometry.coordinates.slice();
        var description = e.features[0].properties.descripption;
        var radius7_quad = e.features[0].properties.radius7_quad;
        var radius10_quad = e.features[0].properties.radius10_quad;
        var radius12_quad = e.features[0].properties.radius12_quad;
        console.log(e);
        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
        var typhoon = {
            "radius7_quad":JSON.parse(radius7_quad),
            "radius10_quad":JSON.parse(radius10_quad),
            "radius12_quad":JSON.parse(radius12_quad),

        };
      //  getPolygon(typhoon)
       var popup =  new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(description)
           .addTo(map.map);
        getPolygon2(coordinates[0],coordinates[1],typhoon);
        removeMarker();
    });
    function removeMarker(){
        if(marker){
            marker.remove();
        }
    }


    function getPolygon2(lng,lat,path) {
        console.log(path);

        var PolyGon = {
            "radius7_quad":{
                Line:[],
                data:""
            },
            "radius10_quad":{
                Line:[],
                data:""
            },
            "radius12_quad":{
                Line:[],
                data:""
            }
        };
        /*"ne": 180, 0
          "se": 100,270
          "sw": 100,180
          "nw": 180 90*/
        var lines = [];

        var colorMap ={
            "radius7_quad":"#00dd00",
            "radius10_quad":"#dddd00",
            "radius12_quad":"#dd0000",
        };
        var levels ={
            "radius7_quad":"七级风圈",
            "radius10_quad":"十级风圈",
            "radius12_quad":"十二级风圈",

        }
        for(var Level in path){
            console.log(Level);
            var neLines ,nwLines,swLines,seLines;
            for(var item in path[Level]){
                var r=(path[Level][item]/100);
                console.log("r：",item,r)
                if(item == "ne"){
                    var start = 0;
                    var line = getLinePath(lng,lat,r,start);
                    console.log(1);
                    neLines = line;
                    //PolyGon[Level].Line = PolyGon[Level].Line.concat(line);
                }
                if(item == "se"){
                    var start = 270;
                    console.log(2);
                    var line = getLinePath(lng,lat,r,start);
                    seLines = line;
                    //PolyGon[Level].Line = PolyGon[Level].Line.concat(line);
                }
                if(item == "sw"){
                    var start = 180;
                    var line = getLinePath(lng,lat,r,start);
                    console.log(3);
                    swLines = line;
                    //PolyGon[Level].Line = PolyGon[Level].Line.concat(line);
                }
                if(item == "nw"){
                    var start = 90;
                    var line = getLinePath(lng,lat,r,start);
                    console.log(4);
                    nwLines = line;
                    //PolyGon[Level].Line = PolyGon[Level].Line.concat(line);
                }
            }
            PolyGon[Level].Line = PolyGon[Level].Line.concat(neLines).concat(nwLines).concat(swLines).concat(seLines);
            PolyGon[Level].data =levels[Level]+ "（东北"+path[Level]["ne"]+"km，东南"
                +path[Level]["se"]+"km，西北"
                +path[Level]["nw"]+"km，西南"
                +path[Level]["sw"]+"km）"
            console.log(PolyGon[Level].Line);

            if(map.getLayer(Level)){
                map.getLayer(Level).setSource(getFillData(PolyGon[Level].Line, PolyGon[Level].data));
            }else{
                var fillTyphoon = new PIE.MetoStyle.FillLayer({
                    data:getFillData(PolyGon[Level].Line, PolyGon[Level].data),
                    color:colorMap[Level],
                    id:Level
                });
                map.add(fillTyphoon);
                map.moveLayer(fillTyphoon,map.getLayer("point_test"));
            }

            map.on('mousedown', Level, function (e) {
                var coordinates = e.features[0].geometry.coordinates.slice();
                var description = e.features[0].properties.descripption;
                var div = document.createElement("div");
                div.innerHTML = description;
                removeMarker();
                marker =  new mapboxgl.Marker(div);
                marker.setLngLat(e.lngLat)
                    .addTo(map.map)
            });
        }
       /* PolyGon[Level].data = "七级风圈（东北"+path["Seven"]["EN"]["Area"]+"km，东南"
            +path["Seven"]["WN"]["Area"]+"km，西北"
            +path["Seven"]["WS"]["Area"]+"km，西南"
            +path["Seven"]["ES"]["Area"]+"km）"*/


    }
    function getPolygon(lng,lat,path) {
        console.log(path);
        var PolyGon = {
            "Seven":{
                Line:[],
                data:""
            }
        };
        var lines = [];
        for(var Level in path){
            console.log(Level);
            if(Level == "Seven"){
                for(var item in path[Level]){
                    var r=(path[Level][item].Area/100);
                    var start = path[Level][item].start;
                    var line = getLinePath(lng,lat,r,start);
                    console.log(line);
                    PolyGon[Level].Line = PolyGon[Level].Line.concat(line);

                }
            }

        }
        PolyGon[Level].data = "七级风圈（东北"+path["Seven"]["EN"]["Area"]+"km，东南"
            +path["Seven"]["WN"]["Area"]+"km，西北"
            +path["Seven"]["WS"]["Area"]+"km，西南"
            +path["Seven"]["ES"]["Area"]+"km）"
        console.log(PolyGon[Level].Line);

        if(map.getLayer("testfill")){
           map.getLayer("testfill").setSource(getFillData(PolyGon[Level].Line, PolyGon[Level].data));
        }else{
            var fillTyphoon = new PIE.MetoStyle.FillLayer({
                data:getFillData(PolyGon[Level].Line, PolyGon[Level].data),
                color:"#ffff00",
                id:"testfill"
            });
            map.add(fillTyphoon);
            map.moveLayer(fillTyphoon,map.getLayer("point_test"));
        }

    }

    function getLinePath(lng,lat,r,start) {
        console.log(lng,lat,start,r);
        var lines = [];

        for(var i=0;i<31;i++){
            var b = ((start+i*3)/180)*Math.PI;
            var x = lng + r*Math.cos(b);
            var y = lat + r*Math.sin(b);

            var temp = [x,y]
            lines.push(temp);
        }
        return lines;
    }
    function svgDraw() {
        var svgDom = document.createElementNS('http://www.w3.org/2000/svg','svg');
        svgDom.setAttribute('width','2000');
        svgDom.setAttribute('height','2000');
       // getSvgRValue(,,400,400);
       var r = getSvgR();

       /* Mx y A r r 0 0 0 x+r-r*cos(α)  y+r*sin(α)  L x+r y z
            M730 325  A 50 50 0 0 0 740 365 L780 325 z
        这样就可以了，其中α为扇形的角，r为半径*/

        var path=document.createElementNS("http://www.w3.org/2000/svg","circle");
        path.setAttributeNS(null,"id","circle");
        path.setAttributeNS(null,"cx","1000");
        path.setAttributeNS(null,"cy","1000");
        path.setAttributeNS(null,"r",r);
        path.setAttributeNS(null,"fill","red");
        path.setAttributeNS(null,"fill-opacity","0.5");

        svgDom.appendChild(path);
        return svgDom;
    }
// Change the cursor to a pointer when the mouse is over the places layer.
    map.on('mouseenter', 'point_test', function () {
        map.map.getCanvas().style.cursor = 'pointer';
    });

// Change it back to a pointer when it leaves.
    map.on('mouseleave', 'point_test', function () {
        map.map.getCanvas().style.cursor = '';
    });
    function animat() {
        if(typhoon[0].points.length>i){
            var temp = typhoon[0].points[i];
            i++;
            linePath.push(temp);
            draw();
        }
    }
    function draw() {
        if(map.getLayer("point_test")){
            map.getLayer("point_test").setSource(getPointData(linePath));
        }else{
            points = new PIE.MetoStyle.PointLayer({data:getPointData(linePath),id:"point_test"});
            map.add(points);
        }
        if(map.getLayer("line_test")){
            map.getLayer("line_test").setSource(getLineData(linePath));
        }else{
            lines = new PIE.MetoStyle.LineLayer({data:getLineData(linePath),id:"line_test",color:"#ff0000",width:2});
            map.add(lines);
        }
        var obj = linePath[linePath.length-1];
        var radius7 = obj.radius7;
        var radius10 = obj.radius10;
        var radius12 = obj.radius12;
        var radius7_quad = obj.radius7_quad;
        var radius10_quad = obj.radius10_quad;
        var radius12_quad = obj.radius12_quad;
        var lng = obj.longitude;
        var lat = obj.latitude;
        /*"ne": 180, 0
            "se": 100,270
            "sw": 100,180
            "nw": 180 90*/
        var typhoon = {
            "radius7_quad":radius7_quad,
            "radius10_quad":radius10_quad,
            "radius12_quad":radius12_quad,

        };
        getPolygon2(lng,lat,typhoon)

    }

    function getFillData(linePath,data) {
        var dataLine ={
            "type": "FeatureCollection",
            "features": []
        };
        var dataLineset = {
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [linePath]
            },
            "properties":{
                "descripption": "<div><p>"+data+"</p></div>",
            }
        };
        dataLine.features.push(dataLineset);
        return dataLine;
    }
    function getPointData(linePath) {

        var data ={
            "type": "FeatureCollection",
            "features": []
        };

        for(var i =0 ;i<linePath.length;i++){
            var obj = linePath[i];
            var date =obj.time// moment(obj.TIME,"YYYYMMDDHH").format("YYYY-MM-DD HH时");
            var dataset = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [obj.longitude, obj.latitude]
                },
                "properties":{
                    "descripption": "<strong>"+date+obj.strong+"</strong><p><b>当前位置：</b>"+obj.longitude+"°/"+obj.latitude+"°<br><b>中心气压：</b>"+obj.pressure+" 百帕<br><b>最大风速：</b>"+obj.speed+" M/s<br><b>七级半径：</b>"+obj.radius7+" 公里<br><b>十级半径：</b>"+obj.radius10+" 公里<br><b>十二级半径：</b>"+obj.radius12+" 公里</p>",
                    "speed":obj.speed,
                    "radius7": obj.radius7,
                    "radius10": obj.radius10,
                    "radius12": obj.radius12,
                    "radius7_quad":obj.radius7_quad,
                    "radius10_quad": obj.radius10_quad,
                    "radius12_quad": obj.radius12_quad,
                }
            };
            data.features.push(dataset);

        }
        console.log(data);
        return data;
    }

    function getLineData(linePath) {


        var dataLine ={
            "type": "FeatureCollection",
            "features": []
        };
        var dataLineset = {
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": []
            }
        };
        for(var i =0 ;i<linePath.length;i++){
            var obj = linePath[i];
            dataLineset.geometry.coordinates.push([obj.longitude,obj.latitude]);
        }
        dataLine.features.push(dataLineset);
        return dataLine;
    }
};


