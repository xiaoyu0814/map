function ProfileAnalystTool(option) {
    this.viewer = option.viewer;
    this.enable = false;
    this.handler = null;

    this.ellipsoid = this.viewer.scene.globe.ellipsoid;

    this.start = null;
    this.end = null;
    this.profile = {
        arrHB: [],
        arrPoint: [],
        arrLX: [],
        ponits: [],
        distance: 0
    };
    this.sectionChars = option.sectionChars;
    this.echartsView1 = option.echartsView1;
    this.myChart = null;
    this.drawingMode = option.drawingMode;
    this.activeShapePoints = [];
    this.activeShape = null;
    this.floatingPoint = null;
    this.floatingPointS = [];
    this.entityPolygon = null;
    this.point = null;
    this.points = [];

}

ProfileAnalystTool.prototype.isEnable = function () {
    return this.enable;
}
ProfileAnalystTool.prototype.setEnable = function (enable) {
    this.enable = enable;

    if (enable) {
        if (this.handler == null) {
            this.draw();
        }
    } else {
        this.viewer.entities.remove(this.entityPolygon);
        this.viewer.entities.remove(this.point);
        this.sectionChars.hide();
        this.echartsView1.style.display = "none";

        this.profile.distance = 0;
        this.profile.ponits.length = 0;
        this.profile.arrLX.length = 0;
        this.profile.arrPoint.length = 0;
        this.profile.arrHB.length = 0;

        if (this.handler != null) {
            this.handler.destroy();
            this.handler = null;
        }
    }
}
ProfileAnalystTool.prototype.draw = function () {
    var that = this;
    //取消左键双击事件
    this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
    var entityPolygon = null;
    var points = null;
    //取消左键双击事件
    this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

    var drawingMode = this.drawingMode;



    this.handler.setInputAction(function (event) {

        if (!Cesium.Entity.supportsPolylinesOnTerrain(viewer.scene)) {
            console.log('This browser does not support polylines on terrain.');
            return;
        }
        // 使用viewer.scene.pickPosition` 来代替`viewer.camera.pickEllipsoid` 这样当鼠标掠过terrain能得到正确的坐标
        var earthPosition = that.viewer.scene.pickPosition(event.position);
        if (Cesium.defined(earthPosition)) {
            if (that.activeShapePoints.length === 0) {
                start = earthPosition;
                that.floatingPoint = that.createPoint(earthPosition);
                that.floatingPointS.push(this.floatingPoint);
                that.activeShapePoints.push(earthPosition);
                var dynamicPositions = new Cesium.CallbackProperty(function () {
                    return that.activeShapePoints;
                }, false);
                that.activeShape = that.drawShape(dynamicPositions);
            }
            //计算距离并且进行叠加
            that.profile.distance = that.profile.distance + that.distance(that.activeShapePoints[that.activeShapePoints.length - 1], earthPosition);
            that.activeShapePoints.push(earthPosition);
            that.point = that.createPoint(earthPosition);
            that.points.push(that.point);
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    this.handler.setInputAction(function (event) {
        if (Cesium.defined(that.floatingPoint)) {
            var newPosition = that.viewer.scene.pickPosition(event.endPosition);
            if (Cesium.defined(newPosition)) {
                that.floatingPoint.position.setValue(newPosition);
                that.activeShapePoints.pop();
                that.activeShapePoints.push(newPosition);
            }
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    this.handler.setInputAction(function (event) {
        var length = that.activeShapePoints.length - 1;
        end = that.activeShapePoints[length];
        var data = that.profileAnalyse(start, end);

        that.setEchartsData(data);
        that.terminateShape();

        if (this.handler != null) {
            this.handler.destroy();
            this.handler = null;
        }

    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
}
ProfileAnalystTool.prototype.createPoint = function (worldPosition) {
    var point = this.viewer.entities.add({
        position: worldPosition,
        point: {
            pixelSize: 10,
            color: Cesium.Color.YELLOW,
            //disableDepthTestDistance: Number.POSITIVE_INFINITY,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
        },
    });
    points = point;
    return point;
}
ProfileAnalystTool.prototype.drawShape = function (positionData) {
    var shape;
    if (this.drawingMode === 'line') {
        shape = this.viewer.entities.add({

            polyline: {
                positions: positionData,
                clampToGround: true,
                arcType: Cesium.ArcType.RHUMB,
                material: Cesium.Color.YELLOW,
                width: 5,

                //zIndex:1
            }
            //,show:false
        });
    }
    else if (this.drawingMode === 'polygon') {
        shape = this.viewer.entities.add({
            polygon: {
                hierarchy: positionData,
                material: new Cesium.ColorMaterialProperty(Cesium.Color.LIGHTSKYBLUE.withAlpha(0.7))
            }
        });
    }
    return shape;
}
//计算两点间的距离
ProfileAnalystTool.prototype.distance = function (point1, point2) {
    //var point1cartographic = Cesium.Cartographic.fromCartesian(point1);
    //var point2cartographic = Cesium.Cartographic.fromCartesian(point2);
    /**根据经纬度计算出距离**/
    var geodesic = new Cesium.EllipsoidGeodesic();
    geodesic.setEndPoints(point1, point2);
    var s = geodesic.surfaceDistance;
    //返回两点之间的距离
    s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2.height - point1.height, 2));
    return s;

}
//剖面分析
ProfileAnalystTool.prototype.profileAnalyse = function (start, end) {
    var startPoint = Cesium.Cartographic.fromCartesian(start);
    var endPoint = Cesium.Cartographic.fromCartesian(end);

    /*
   this.profile.arrLX.push(0);
   this.profile.ponits.push(startPoint);
   this.profile.arrPoint.push(this.getDegrees(startPoint));
   this.profile.arrHB.push(startPoint.height);
   // 插值100个点，点越多模拟越精确，但是效率会低
   var count = 100.0;
   for (var i = 1; i < count; i++) {
       var cart = Cesium.Cartesian3.lerp(start, end, i / count, new Cesium.Cartesian3());
       var cartographicCart = Cesium.Cartographic.fromCartesian(cart);
       var disc = this.distance(this.profile.ponits[i - 1], cartographicCart);
       this.profile.distance = this.profile.distance + disc;
       this.profile.ponits.push(cartographicCart);
       this.profile.arrLX.push(this.profile.arrLX[i - 1] + disc);

       this.profile.arrPoint.push(this.getDegrees(cart));
       this.profile.arrHB.push(cartographicCart.height);
   }
   */

    var ellipsoid = this.viewer.scene.globe.ellipsoid;
    var cartographicStart = ellipsoid.cartesianToCartographic(start);
    var latStart = Cesium.Math.toDegrees(cartographicStart.latitude);
    var lngStart = Cesium.Math.toDegrees(cartographicStart.longitude);
    var cartographicEnd = ellipsoid.cartesianToCartographic(end);
    var latEnd = Cesium.Math.toDegrees(cartographicEnd.latitude);
    var lngEnd = Cesium.Math.toDegrees(cartographicEnd.longitude);

    let cartographic = Cesium.Cartographic.fromDegrees(lngStart, latStart, 0);
    let height = this.viewer.scene.globe.getHeight(cartographic);

    this.profile.distance = 0;
    this.profile.ponits.push(cartographic);
    this.profile.arrLX.push(this.profile.arrLX[i - 1]);
    this.profile.arrPoint.push(this.getDegrees(cartographic));
    this.profile.arrHB.push(height);

    var count = 100.0;
    for (var i = 1; i < count; i++) {
        var cart = Cesium.Cartesian2.lerp(new Cesium.Cartesian2(lngStart, latStart), new Cesium.Cartesian2(lngEnd, latEnd), i / (count - 1), new Cesium.Cartesian3());
        let cartographic = Cesium.Cartographic.fromDegrees(cart.x, cart.y, 0);
        let height = this.viewer.scene.globe.getHeight(cartographic);

        var dist = this.distance(this.profile.ponits[i - 1], cartographic);
        this.profile.distance += dist;
        this.profile.ponits.push(cartographic);
        this.profile.arrLX.push(this.profile.arrLX[i - 1] + dist);
        this.profile.arrPoint.push(this.getDegrees(cartographic));
        this.profile.arrHB.push(height);
    }

    return this.profile;
}

//设置Echart数据
ProfileAnalystTool.prototype.setEchartsData = function (e) {
    if (null != e && null != e.arrPoint) {
        this.echartsView1.style.display = "";
        this.sectionChars.show(),
            null == this.myChart && (this.myChart = echarts.init(this.echartsView1, "dark"));

        var that = this;
        var t = e.arrPoint,
            chartData = {
                grid: {
                    left: 10,
                    right: 10,
                    bottom: 10,
                    containLabel: !0
                },
                dataZoom: [{
                    type: "inside",
                    throttle: 50
                }],
                tooltip: {
                    trigger: "axis",
                    formatter: function (e) {
                        var a = "";
                        if (0 == e.length) return a;
                        e[0].value;

                        var r = t[e[0].dataIndex];

                        return a += "所在位置&nbsp;" + that.strFormat(r.x) + "," + that.strFormat(r.y) + "<br />距起点&nbsp;<label>" + e[0].axisValue + "米" + "</label><br />" + e[0].seriesName + "&nbsp;<label style='color:" + e[0].color + ";'>" + e[0].value + "米" + "</label><br />"
                    }
                },
                xAxis: [{
                    name: "行程",
                    type: "category",
                    boundaryGap: !1,
                    axisLine: {
                        show: !1
                    },
                    axisLabel: {
                        show: !1
                    },
                    data: e.arrLX
                }],
                yAxis: [{
                    type: "value",
                    axisLabel: {
                        rotate: 60,
                        formatter: "{value} 米"
                    }
                }],
                series: [{
                    name: "高程值",
                    type: "line",
                    smooth: !0,
                    symbol: "none",
                    sampling: "average",
                    itemStyle: {
                        normal: {
                            color: "rgb(255, 70, 131)"
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: "rgb(255, 158, 68)"
                            },
                            {
                                offset: 1,
                                color: "rgb(255, 70, 131)"
                            }])
                        }
                    },
                    data: e.arrHB
                }]
            };
        this.myChart.setOption(chartData)
    }
}

ProfileAnalystTool.prototype.terminateShape = function () {
    this.activeShapePoints.pop();
    this.entityPolygon = this.drawShape(this.activeShapePoints);
    this.viewer.entities.remove(this.floatingPoint);
    for (let i = 0; i < this.floatingPointS.length; i++) {
        this.viewer.entities.remove(this.floatingPointS[i]);
    }
    for (let i = 0; i < this.points.length; i++) {
        this.viewer.entities.remove(this.points[i]);
    }
    this.viewer.entities.remove(this.activeShape);
    entityPolygon = null;
    //this.floatingPoint = undefined;
    //this.activeShape = undefined;
    this.activeShapePoints = [];
}

//世界坐标转换为经纬度
ProfileAnalystTool.prototype.getDegrees = function (cart) {
    var cartographic = this.ellipsoid.cartesianToCartographic(cart);
    var lat = Cesium.Math.toDegrees(cartographic.latitude);
    var lng = Cesium.Math.toDegrees(cartographic.longitude);
    var alt = cartographic.height;
    return { x: lng, y: lat, z: alt };
}
//经纬度保留两位小数
ProfileAnalystTool.prototype.strFormat = function (str) {
    var strString = str.toString();
    var strs = strString.slice(0, strString.indexOf(".") + 3);
    return strs;
}
// ProfileAnalystTool.prototype.remove = function (str) {
//     this.viewer.entities.remove(this.entityPolygon);
//     this.viewer.entities.remove(this.point);
//     this.sectionChars.hide();
//     this.echartsView1.style.display = "none";
//     this.handler.destroy();
//     this.handler = null;
// }
