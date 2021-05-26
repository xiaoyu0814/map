var terrainClippingTool = function (option) {
  this._option = option
  this._viewer=option.viewer
}
//获取鼠标经纬度
terrainClippingTool.prototype.init = function (points) {
  var _self = this;
  //

    var pointsLength = points.length;
    var clippingPlanes = []; // 存储ClippingPlane集合
    for (var i = 0; i < pointsLength; ++i) {
        var nextIndex = (i + 1) % pointsLength;
        var midpoint = Cesium.Cartesian3.add(points[i], points[nextIndex], new Cesium.Cartesian3());
        midpoint = Cesium.Cartesian3.multiplyByScalar(midpoint, 0.5, midpoint);

        var up = Cesium.Cartesian3.normalize(midpoint, new Cesium.Cartesian3());
        var right = Cesium.Cartesian3.subtract(points[nextIndex], midpoint, new Cesium.Cartesian3());
        right = Cesium.Cartesian3.normalize(right, right);

        var normal = Cesium.Cartesian3.cross(right, up, new Cesium.Cartesian3());
        normal = Cesium.Cartesian3.normalize(normal, normal);

        var originCenteredPlane = new Cesium.Plane(normal, 0.0);
        var distance = Cesium.Plane.getPointDistance(originCenteredPlane, midpoint);

        clippingPlanes.push(new Cesium.ClippingPlane(normal, distance));
    }
    _self._viewer.scene.globe.clippingPlanes = new Cesium.ClippingPlaneCollection({
        planes:clippingPlanes,
        edgeWidth: 1.0,
        edgeColor: Cesium.Color.YELLOW
    });

    _self._viewer.camera.flyTo({
        destination:points[0],
        orientation : {
            heading : Cesium.Math.toRadians(175.0),
            pitch : Cesium.Math.toRadians(-35.0),
            roll : 0.0
        }
    });
}

terrainClippingTool.prototype.clearAll=function(){
    if (this.primitive != null) {
        this._viewer.scene.primitives.remove(this.primitive);
        this.positionArr = null;
        this.colorArr = null;
        this.indiceArr = null;
        this.geometry = null;
        this.appearance = null;
        this.primitive = null;
    }
}



// 飞到目的地
terrainClippingTool.prototype.flyTo = function (destination, head, pitch, roll, duration, call) {
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