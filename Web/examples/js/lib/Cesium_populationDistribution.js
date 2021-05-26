var populationDistributionTool = function (option) {
    this._option = option
    this._viewer=option.viewer
}

populationDistributionTool.prototype.getPopulation=function(url,data, id) {
    let _self=this;
    var _Fills=null;
    var geoJson = this.getPopulationArea(data, id);
    _self.getDataAsync(url, function (numData, numID) {
        for (var i = 0; i < numData.year.datas.length; i++) {
            var cityname = numData.year.datas[i].cityname;
            var population = numData.year.datas[i].population;
            for (var j = 0; j < geoJson.features.length; j++) {
                let obj = geoJson.features[j];
                if (obj.properties.name == cityname) {
                    obj.properties.population = population;
                    obj.properties.extrudedHeight = population / 5000;
                    obj.properties.colorIndex = _self.getAdministrativeDisisonColor(cityname, population);
                }
            }

        }
        console.log(geoJson);

        _Fills = new PIE.MetoStyle.FillLayer({
            data: geoJson,
            id: id,
            opacity: 0.5
        });
        map.add(_Fills)

    });
    return _Fills;
}

populationDistributionTool.prototype.getPopulationArea=function(data, id) {
    var GEOJSON = {
        "type": "FeatureCollection",
        "features": []
    };

    for (var i = 0; i < data.data.child.length; i++) {
        //
        var pointsArray = data.data.child[i].points;
        for (var k = 0; k < pointsArray.length; k++) {
            var dataset = {
                "type": "Feature",
                "geometry": {
                    "type": "Polygon",
                    "coordinates": this.getArray(data.data.child[i].points[k].region)
                },
                "properties": {
                    "perPositionHeight": true,

                    "name": data.data.child[i].name
                }
            };
            GEOJSON.features.push(dataset);
        }

    }
    return GEOJSON;

}
populationDistributionTool.prototype.getAdministrativeDisisonColor=function(name, data) {
    let count = data;
    if (parseInt(count) < 12938693) {
        return '#FFFF00';
    }
    if (parseInt(count) < 28846170 && parseInt(count) >= 12938693) {
        return '#FFE100';
    }
    if (parseInt(count) < 46023761 && parseInt(count) >= 28846170) {
        return '#FFC300';
    }
    if (parseInt(count) < 65700762 && parseInt(count) >= 46023761) {
        return '#FFA600';
    }
    if (parseInt(count) < 80417528 && parseInt(count) >= 65700762) {
        return '#FF8800';
    }
    if (parseInt(count) < 104320459 && parseInt(count) >= 80417528) {
        return '#FF7500';
    }
    if (parseInt(count) >= 104320459) {
        return '#FF6600';
    } else {
        return 'rgba(255,255,255,0)';
    }
}

populationDistributionTool.prototype.getArray=function(coordinates) {
    var coordinatesArray = coordinates.split(',');
    //ÉùÃ÷Ò»¸öÐÂµÄÊý×é
    let coordinatesPolygon = [];

    for (let j = 0; j < coordinatesArray.length; j++) {
        let points = coordinatesArray[j].split(' ');
        let pointTransform = [parseFloat(points[0]), parseFloat(points[1]), 0];
        coordinatesPolygon.push(pointTransform);
    }
    return [coordinatesPolygon];
}

populationDistributionTool.prototype.getData=function(url, fn) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onload = function () {
        if (xhr.status == 200) {
            var result = JSON.parse(xhr.response)
            if (result.length === 0) {
                console.log('无数据');
                // reject('Êý¾Ý¶ÁÈ¡Ê§°Ü');
                return false;
            }

            var data = result;
            console.log(123123456456789798, data)
            fn(data, url);
        } else {

        }
    };
    xhr.onerror = function () {

    };
    xhr.send(null);
}

populationDistributionTool.prototype.getDataAsync=function(url, fn) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET",url,false);
    xhr.send(null);
    var data = JSON.parse(xhr.response);
    fn(data, url);
}

// 飞到目的地
populationDistributionTool.prototype.flyTo = function (destination, head, pitch, roll, duration, call) {
    var _self = this
    _self._viewer.camera.flyTo({
        destination: destination, // Cartesian3 | Rectangle
        orientation: {
            heading: head,
            pitch: pitch,
            roll: roll
        },
        duration: duration,
        complete: function () {
            if (call) {
                call()
            }
        }

    })
}