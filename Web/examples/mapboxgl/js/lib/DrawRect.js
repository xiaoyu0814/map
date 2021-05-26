var DrawRect =function (map,callback) {
    var map = map;
    this.startDraw = function () {
        //map.map.dragPan.disable();
        //map.map.dragRotate.disable();
        map.on("mousedown",mouseDown);
        map.on("mousemove",mouseMove);
        map.on("mouseup",mouseUp);
    };
    this.endDraw = function () {
        //map.map.dragPan.enable();
       // map.map.dragRotate.enable();
        map.off("mousedown",mouseDown);
        map.off("mousemove",mouseMove);
        map.off("mouseup",mouseUp);
        if(map.getLayer("line_test")){
            map.remove( map.getLayer("line_test"));
        }
    };
    var downDraw = false,startLng,startLat;

    this.setBounds = function (lines) {
        if(map.getLayer("line_test")){
            map.getLayer("line_test").setSource(getLineData(lines));
        }else{
            lines = new PIE.MetoStyle.LineLayer({data:getLineData(lines),id:"line_test",color:"#ff0000",width:2});
            map.add(lines);
        }
    };

    function mouseDown(e) {
            downDraw = true;
            var t = PIE.ol.proj.transform(e.coordinate,"EPSG:3857", "EPSG:4326");
            startLng = t[0];
            startLat = t[1];
    }

    function mouseMove(e) {
        if(downDraw){
            var temp = PIE.ol.proj.transform(e.coordinate,"EPSG:3857", "EPSG:4326");
            draw(temp);
        }
    }

    function mouseUp(e) {
        if(downDraw){
            downDraw = false;
        }
    }
    function draw(lnglat) {
        var line = [[startLng,startLat],[startLng,lnglat[1]],[lnglat[0],lnglat[1]],[lnglat[0],startLat]];
        if(callback && typeof callback=== "function"){
            callback(line);
        }
        line.push([startLng,startLat]);
        if(map.getLayer("line_test")){
           // map.getLayer("line_test").setSource(getLineData(line));
           map.remove( map.getLayer("line_test"));
           lines = new PIE.MetoStyle.LineLayer({data:getLineData(line),id:"line_test",color:"#ff0000",width:2});
            map.add(lines);
        }else{
            lines = new PIE.MetoStyle.LineLayer({data:getLineData(line),id:"line_test",color:"#ff0000",width:2});
            map.add(lines);
        }

    }
    function getLineData(line) {

        var dataLine ={
            "type": "FeatureCollection",
            "features": []
        };
        var dataLineset = {
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": line
            }
        };
        dataLine.features.push(dataLineset);
        return dataLine;
    }
};
