var settlementePointsTool = function (option) {
    this._option = option
    this._viewer=option.viewer
}

//创造点的集合
settlementePointsTool.prototype.getSettlementePoints=function(url,callback) {
    let _self=this;
    let pointPrimitives =_self._viewer.scene.primitives.add(new Cesium.PointPrimitiveCollection());

    this.getData(url, function (numData, numID) {
        for(var i=0;i<numData.features.length;i++){
            var obj=numData.features[i].geometry;
            var height=numData.features[i].attributes.HEIGHT;
            var VEL=numData.features[i].attributes.VEL;
            var color=new Cesium.Color();
            var colorArray=[[255, 0, 0, 255],   [255, 38, 0, 255],  [255, 60, 0, 255],  [255, 77, 0, 255],
                [255, 89, 0, 255],  [255, 102, 0, 255], [255, 119, 0, 255], [255, 132, 0, 255],
                [255, 145, 0, 255], [255, 157, 0, 255], [255, 170, 0, 255], [255, 187, 0, 255],
                [255, 200, 0, 255], [255, 213, 0, 255], [255, 225, 0, 255], [255, 238, 0, 255],
                [255, 251, 0, 255], [251, 255, 0, 255], [240, 252, 0, 255], [227, 252, 0, 255],
                [217, 250, 0, 255], [208, 250, 0, 255], [194, 247, 0, 255], [186, 247, 0, 255],
                [175, 245, 0, 255], [166, 242, 0, 255], [153, 242, 0, 255], [144, 240, 0, 255],
                [132, 240, 0, 255], [123, 237, 0, 255], [109, 235, 0, 255], [97, 232, 0, 255],
                [85, 232, 0, 255], [77, 230, 11, 255], [79, 227, 39, 255], [81, 224, 56, 255],
                [84, 222, 71, 255], [84, 222, 87, 255], [83, 219, 99, 255], [82, 217, 111, 255],
                [81, 214, 128, 255], [80, 212, 142, 255], [77, 209, 154, 255], [74, 207, 167,255],
                [70, 207, 182, 255], [63, 204, 197, 255], [56, 201, 209, 255], [47, 201,224, 255],
                [36, 197, 237, 255], [0, 195, 255, 255], [0, 195, 255, 255]];
            let index = Math.floor((VEL+118)/5);
            if(index>=colorArray.length){
                index = colorArray.length-1;

            }
            if (index < 0) {
                index = 0;
            }

            //新增点到点集合中
            var position = Cesium.Cartesian3.fromDegrees(Number(obj.x), Number(obj.y),height);
                pointPrimitives.add({
                id:"pointTest"+i,

                position: position,
                pixelSize: 5,
                property:{HEIGHT:height},
                color: Cesium.Color.fromBytes(colorArray[index][0], colorArray[index][1], colorArray[index][2], colorArray[index][3])
            });
        }
        if (callback && typeof callback == 'function') { callback(pointPrimitives) }
    })


}

settlementePointsTool.prototype.getData=function(url, fn) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onload = function () {
        if (xhr.status == 200) {
            var result = JSON.parse(xhr.response)
            if (result.length === 0) {
                console.log('无数据');
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
},

// 飞到目的地
settlementePointsTool.prototype.flyTo = function (destination, head, pitch, roll, duration, call) {
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