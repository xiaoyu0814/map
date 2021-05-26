class SlopeAspectTool {
    constructor(viewer, terrainLayer) {
        this.viewer = viewer;
        this.handler = null;
        this.enable = false;
        this.resultArray = [];
        this.terrainLayer = terrainLayer;
        this.pointArray = []



    }
    getEnable () {
        return this.enable;
    }
    setEnable (enable) {
        this.enable = enable;

        if (enable) {
            if (this.handler == null) {
                this.drawPlygon()
            }
        } else {

            for (let i = 0; i < this.resultArray.length; i++) {
                this.viewer.entities.remove(this.resultArray[i]);
            }
            for (let j = 0; j < this.pointArray.length; j++) {
                this.viewer.entities.remove(this.pointArray[j]);
            }
            this.pointArray = [];
            this.resultArray = [];

        }
    }

    drawPlygon() {

        var shape = null;
        var activeShapePoints = [];
        var floatingPoint = null;
        var activeShape = [];
        var entityPolygon = null;
        var activeEntityPoint = [];
        if (!this.terrainLayer) {
            return
        }
        var terrainLayer = this.terrainLayer;



        this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
        this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        var that = this;
        this.handler.setInputAction(function (event) {
            var earthPosition;
            var feature = that.viewer.scene.pick(event.position);
            if (feature) {
                earthPosition = that.viewer.scene.pickPosition(event.position);
            } else {
                let ray = that.viewer.camera.getPickRay(event.position);
                earthPosition = that.viewer.scene.globe.pick(ray, that.viewer.scene);

            }

            // 使用viewer.scene.pickPosition` 来代替`viewer.camera.pickEllipsoid` 这样当鼠标掠过terrain能得到正确的坐标
            // var earthPosition = that.viewer.scene.pickPosition(event.position);
            if (Cesium.defined(earthPosition)) {
                if (activeShapePoints.length === 0) {
                    floatingPoint = createPoint(earthPosition);
                    that.pointArray.push(floatingPoint);
                    activeShapePoints.push(earthPosition);
                    var dynamicPositions = new Cesium.CallbackProperty(function () {
                        return new Cesium.PolygonHierarchy(activeShapePoints);;
                    }, false);
                    activeShape = drawShape(dynamicPositions);
                }
                activeShapePoints.push(earthPosition);
                var tePoint = createPoint(earthPosition);
                that.pointArray.push(tePoint)

            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        //
        this.handler.setInputAction(function (event) {
            if (Cesium.defined(floatingPoint)) {
                var newPosition;
                var feature = that.viewer.scene.pick(event.endPosition);
                if (feature) {
                    newPosition = that.viewer.scene.pickPosition(event.endPosition);
                } else {
                    let ray = that.viewer.camera.getPickRay(event.endPosition);
                    newPosition = that.viewer.scene.globe.pick(ray, that.viewer.scene);

                }
                // var newPosition = that.viewer.scene.pickPosition(event.endPosition);
                if (Cesium.defined(newPosition)) {
                    floatingPoint.position.setValue(newPosition);
                    activeShapePoints.pop();
                    activeShapePoints.push(newPosition);
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        //
        this.handler.setInputAction(function (event) {

            that.handler.destroy(); //关闭事件句柄
            that.handler = undefined;


            activeShapePoints.pop();
            entityPolygon = drawShape(activeShapePoints);
            that.viewer.entities.remove(floatingPoint);
            that.viewer.entities.remove(activeShape);
            entityPolygon = null;
            floatingPoint = undefined;
            activeShape = undefined;
            var positionArray = [];
            for (let i = 0; i < activeShapePoints.length; i++) {
                var point = activeShapePoints[i];
                var ellipsoid = that.viewer.scene.globe.ellipsoid;
                var cartographic = ellipsoid.cartesianToCartographic(point);
                var lat = Cesium.Math.toDegrees(cartographic.latitude);
                var lng = Cesium.Math.toDegrees(cartographic.longitude);
                var alt = cartographic.height;
                var position = {
                    lat: lat,
                    lng: lng,
                    alt: alt
                };
                positionArray.push(position)
            }
            that.viewer.entities.remove(shape)
            if(positionArray.length<4){
                alert("请绘制4个点");
                return;
            }
            that.drawSlopePolygon(positionArray[0].lng, positionArray[0].lat, positionArray[0].alt,
                positionArray[1].lng, positionArray[1].lat, positionArray[1].alt,
                positionArray[2].lng, positionArray[2].lat, positionArray[2].alt,
                positionArray[3].lng, positionArray[3].lat, positionArray[3].alt, terrainLayer
            )
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

        function createPoint(worldPosition) {
            var point = that.viewer.entities.add({
                position: worldPosition,
                point: {
                    pixelSize: 10,
                    color: Cesium.Color.YELLOW,
                    //disableDepthTestDistance: Number.POSITIVE_INFINITY,
                    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
                },
            });
            activeEntityPoint.push(point);
            // points = point;
            return point;
        }
        function drawShape(positionData) {
            shape = that.viewer.entities.add({
                polygon: {
                    hierarchy: positionData,
                    material: new Cesium.ColorMaterialProperty(Cesium.Color.LIGHTSKYBLUE.withAlpha(0.7))
                }
            });

            return shape;
        }

    }
    //绘制小矩形面 四个经纬度的点，z值高度可以忽略 如：113.xx  ,37.xx,0 ,113.xx,37.xx,0
    drawSlopePolygon(startx1, starty1, startz1, startx2, starty2, startz2, startx3, starty3, startz3, startx4, starty4, startz4, terrainLayer) {

        //高度z全为0
        var count = 100;
        var slopelineposition = [];
        var hireacys = [];
        var hireacysdistance = []
        for (let j = 0; j < 100; j++) {
            for (var i = 0; i < 100; i++) {
                var hireacy = [];
                //分割成小面，切分经纬度
                hireacy.push(new Cesium.Cartesian3(startx1 + (startx2 - startx1) / count * i + (startx4 + (startx3 - startx4) / count * (i) - startx1 - (startx2 - startx1) / count * i) / count * j,
                    starty1 + (starty2 - starty1) / count * i + (starty4 + (starty3 - starty4) / count * (i) - starty1 - (starty2 - starty1) / count * i) / count * j,
                    startz1 + (startz2 - startz1) / count * i + (startz4 + (startz3 - startz4) / count * (i) - startz1 - (startz2 - startz1) / count * i) / count * j))
                hireacy.push(new Cesium.Cartesian3(startx1 + (startx2 - startx1) / count * (i + 1) + (startx4 + (startx3 - startx4) / count * (i + 1) - startx1 - (startx2 - startx1) / count * (i + 1)) / count * j,
                    starty1 + (starty2 - starty1) / count * (i + 1) + (starty4 + (starty3 - starty4) / count * (i + 1) - starty1 - (starty2 - starty1) / count * (i + 1)) / count * j,
                    startz1 + (startz2 - startz1) / count * (i + 1) + (startz4 + (startz3 - startz4) / count * (i + 1) - startz1 - (startz2 - startz1) / count * (i + 1)) / count * j))
                hireacy.push(new Cesium.Cartesian3(startx4 + (startx3 - startx4) / count * (i + 1) - (startx4 + (startx3 - startx4) / count * (i + 1) - startx1 - (startx2 - startx1) / count * (i + 1)) / count * (count - 1 - j),
                    starty4 + (starty3 - starty4) / count * (i + 1) - (starty4 + (starty3 - starty4) / count * (i + 1) - starty1 - (starty2 - starty1) / count * (i + 1)) / count * (count - 1 - j),
                    startz4 + (startz3 - startz4) / count * (i + 1) - (startz4 + (startz3 - startz4) / count * (i + 1) - startz1 - (startz2 - startz1) / count * (i + 1)) / count * (count - 1 - j)))
                hireacy.push(new Cesium.Cartesian3(startx4 + (startx3 - startx4) / count * i - (startx4 + (startx3 - startx4) / count * (i) - startx1 - (startx2 - startx1) / count * i) / count * (count - 1 - j),
                    starty4 + (starty3 - starty4) / count * i - (starty4 + (starty3 - starty4) / count * (i) - starty1 - (starty2 - starty1) / count * i) / count * (count - 1 - j),
                    startz4 + (startz3 - startz4) / count * i - (startz4 + (startz3 - startz4) / count * (i) - startz1 - (startz2 - startz1) / count * i) / count * (count - 1 - j)))
                hireacys.push(hireacy);
                //取出面的8个点坐标，拿点坐标去求高度值
                slopelineposition.push(Cesium.Cartographic.fromDegrees(hireacy[0].x, hireacy[0].y));
                slopelineposition.push(Cesium.Cartographic.fromDegrees((hireacy[0].x + hireacy[1].x) / 2, (hireacy[0].y + hireacy[1].y) / 2));
                slopelineposition.push(Cesium.Cartographic.fromDegrees(hireacy[1].x, hireacy[1].y));
                slopelineposition.push(Cesium.Cartographic.fromDegrees((hireacy[1].x + hireacy[2].x) / 2, (hireacy[1].y + hireacy[2].y) / 2));
                slopelineposition.push(Cesium.Cartographic.fromDegrees(hireacy[2].x, hireacy[2].y));
                slopelineposition.push(Cesium.Cartographic.fromDegrees((hireacy[2].x + hireacy[3].x) / 2, (hireacy[2].y + hireacy[3].y) / 2));
                slopelineposition.push(Cesium.Cartographic.fromDegrees(hireacy[3].x, hireacy[3].y));
                slopelineposition.push(Cesium.Cartographic.fromDegrees((hireacy[3].x + hireacy[0].x) / 2, (hireacy[3].y + hireacy[0].y) / 2));

            }
        }
        var promise = Cesium.sampleTerrainMostDetailed(terrainLayer, slopelineposition);
        var that = this;
        Cesium.when(promise,
            function (updatedPositions) {
                //拿到所有的高度数据

                var heighmm = [];
                var m = 0
                //计算坡度比的次数
                var countcolor1 = 0;
                var countcolor2 = 0;
                var countcolor3 = 0;
                var countcolor4 = 0;
                var countcolor5 = 0;
                var countcolor6 = 0;
                var countcolor7 = 0;
                for (let k = 0; k < updatedPositions.length / 8; k++) {
                    //第一个点与第五个点的坡
                    debugger
                    var one = updatedPositions[m].height - updatedPositions[m + 4].height;
                    var tow = Cesium.Cartesian3.distance(
                        Cesium.Cartesian3.fromDegrees(updatedPositions[m].longitude, updatedPositions[m].latitude, updatedPositions[m].height),
                        Cesium.Cartesian3.fromDegrees(updatedPositions[m + 4].longitude, updatedPositions[m + 4].latitude, updatedPositions[m].height));
                    var slope1 = (updatedPositions[m].height - updatedPositions[m + 4].height) / (Cesium.Cartesian3.distance(
                        Cesium.Cartesian3.fromDegrees(updatedPositions[m].longitude, updatedPositions[m].latitude, updatedPositions[m].height),
                        Cesium.Cartesian3.fromDegrees(updatedPositions[m + 4].longitude, updatedPositions[m + 4].latitude, updatedPositions[m+4].height)))
                    //第二个点与第六个点的坡度
                    var slope2 = (updatedPositions[m + 1].height - updatedPositions[m + 5].height) / (Cesium.Cartesian3.distance(
                        Cesium.Cartesian3.fromDegrees(updatedPositions[m + 1].longitude, updatedPositions[m + 1].latitude, updatedPositions[m + 1].height),
                        Cesium.Cartesian3.fromDegrees(updatedPositions[m + 5].longitude, updatedPositions[m + 5].latitude, updatedPositions[m+5].height)))
                    //第三个点与第七个点的坡度
                    var slope3 = (updatedPositions[m + 2].height - updatedPositions[m + 6].height) / (Cesium.Cartesian3.distance(
                        Cesium.Cartesian3.fromDegrees(updatedPositions[m + 2].longitude, updatedPositions[m + 2].latitude, updatedPositions[m + 2].height),
                        Cesium.Cartesian3.fromDegrees(updatedPositions[m + 6].longitude, updatedPositions[m + 6].latitude, updatedPositions[m+6].height)))
                    //第四个点与第八个点的坡度
                    var slope4 = (updatedPositions[m + 3].height - updatedPositions[m + 7].height) / (Cesium.Cartesian3.distance(
                        Cesium.Cartesian3.fromDegrees(updatedPositions[m + 3].longitude, updatedPositions[m + 3].latitude, updatedPositions[m + 3].height),
                        Cesium.Cartesian3.fromDegrees(updatedPositions[m + 7].longitude, updatedPositions[m + 7].latitude, updatedPositions[m+7].height)))
                    console.log("slope1:" + slope1 + ";slope2:" + slope2 + ";slope3:" + slope3 + ";slope4:" + slope4);
                    var arrposition = [Math.abs(slope1), Math.abs(slope2), Math.abs(slope3), Math.abs(slope4)];//取绝对值
                    // arrposition.sort();
                    var slope = Math.max(...arrposition); // 拿到最大的坡度值
                    var lineposition = [];//画方向线的坐标
                    if (slope == Math.abs(slope1)) {
                        if (slope1 > 0) {
                            lineposition.push(Cesium.Math.toDegrees(updatedPositions[m].longitude), Cesium.Math.toDegrees(updatedPositions[m].latitude),
                                Cesium.Math.toDegrees(updatedPositions[m + 4].longitude), Cesium.Math.toDegrees(updatedPositions[m + 4].latitude));
                        } else {
                            lineposition.push(
                                Cesium.Math.toDegrees(updatedPositions[m + 4].longitude), Cesium.Math.toDegrees(updatedPositions[m + 4].latitude),
                                Cesium.Math.toDegrees(updatedPositions[m].longitude), Cesium.Math.toDegrees(updatedPositions[m].latitude));

                        }
                    } else if (slope == Math.abs(slope2)) {
                        if (slope2 > 0) {
                            lineposition.push(Cesium.Math.toDegrees(updatedPositions[m + 1].longitude), Cesium.Math.toDegrees(updatedPositions[m + 1].latitude),
                                Cesium.Math.toDegrees(updatedPositions[m + 5].longitude), Cesium.Math.toDegrees(updatedPositions[m + 5].latitude));
                        } else {
                            lineposition.push(
                                Cesium.Math.toDegrees(updatedPositions[m + 5].longitude), Cesium.Math.toDegrees(updatedPositions[m + 5].latitude),
                                Cesium.Math.toDegrees(updatedPositions[m + 1].longitude), Cesium.Math.toDegrees(updatedPositions[m + 1].latitude));
                        }
                    } else if (slope == Math.abs(slope3)) {
                        if (slope3 > 0) {
                            lineposition.push(Cesium.Math.toDegrees(updatedPositions[m + 2].longitude), Cesium.Math.toDegrees(updatedPositions[m + 2].latitude),
                                Cesium.Math.toDegrees(updatedPositions[m + 6].longitude), Cesium.Math.toDegrees(updatedPositions[m + 6].latitude));
                        } else {
                            lineposition.push(
                                Cesium.Math.toDegrees(updatedPositions[m + 6].longitude), Cesium.Math.toDegrees(updatedPositions[m + 6].latitude),
                                Cesium.Math.toDegrees(updatedPositions[m + 2].longitude), Cesium.Math.toDegrees(updatedPositions[m + 2].latitude));
                        }
                    } else if (slope == Math.abs(slope4)) {
                        if (slope4 > 0) {
                            lineposition.push(Cesium.Math.toDegrees(updatedPositions[m + 3].longitude), Cesium.Math.toDegrees(updatedPositions[m + 3].latitude),
                                Cesium.Math.toDegrees(updatedPositions[m + 7].longitude), Cesium.Math.toDegrees(updatedPositions[m + 7].latitude));
                        } else {
                            lineposition.push(
                                Cesium.Math.toDegrees(updatedPositions[m + 7].longitude), Cesium.Math.toDegrees(updatedPositions[m + 7].latitude),
                                Cesium.Math.toDegrees(updatedPositions[m + 3].longitude), Cesium.Math.toDegrees(updatedPositions[m + 3].latitude));
                        }
                    }
                    // slope = (Math.abs(slope1) + Math.abs(slope2) + Math.abs(slope3) + Math.abs(slope4)) / 4; //四个坡度值大小有的差值特别大，这里取的平均值用来配置颜色
                    // // console.log(slope);
                    // var slopecolor;
                    // if (0 <= slope && slope < 0.29) {
                    //     slopecolor = '#FFFFFF'
                    //     countcolor1++;
                    // } else if (0.29 <= slope && slope < 0.5) {
                    //     slopecolor = '#C0C0C0'
                    //     countcolor2++;
                    // } else if (0.5 <= slope && slope < Math.sqrt(2) / 2) {
                    //     slopecolor = '#FF00FF'
                    //     countcolor3++;
                    // } else if (Math.sqrt(2) / 2 <= slope && slope < 0.87) {
                    //     slopecolor = '#00FFFF'
                    //     countcolor4++;
                    // } else if (0.87 <= slope && slope < 0.91) {
                    //     slopecolor = '#FFFF00'
                    //     countcolor5++;
                    // } else if (0.91 <= slope && slope < 0.95) {
                    //     slopecolor = '#0000FF'
                    //     countcolor6++;
                    // } else {
                    //     slopecolor = '#FF0000'
                    //     countcolor7++;
                    // }

                    var cartographics = [updatedPositions[m], updatedPositions[m + 4]]
                    var result = that.viewer.entities.add({
                        type: 'drawSloperectange',
                        // rectangle: {
                        //     coordinates: Cesium.Rectangle.fromCartographicArray(cartographics)
                        //     ,
                        //     material: Cesium.Color.fromCssColorString(slopecolor)

                        // },
                        polyline: {
                            clampToGround: true,
                            positions: Cesium.Cartesian3.fromDegreesArray(lineposition),
                            material: new Cesium.PolylineArrowMaterialProperty(Cesium.Color.GHOSTWHITE.withAlpha(0.5)),// Cesium.Color.BLUE.withAlpha(0.5) ,
                            width: 8,
                            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, updatedPositions[m + 4].height + 4500)
                        },


                    }
                    );
                    // debugger
                    that.resultArray.push(result);
                    m += 8;
                }
                // var contents = "<div class='slope_layer'><div> <div style='height:19px;background-color:#FFFFFF; width: 64px;float: left;'> </div><span >" + (countcolor1 / (updatedPositions.length / 8) * 100).toFixed(2) + "% (<0.29)</span></div>";
                // contents += " <div  style='clear: both;'><div style='height:19px;background-color:#C0C0C0 ; width: 64px;float: left;'></div><span >  " + (countcolor2 / (updatedPositions.length / 8) * 100).toFixed(2) + "%(<0.5)</span></div>";
                // contents += "<div   style='clear: both;'><div  style='height:19px;background-color:#FF00FF;width: 64px;float: left;'> </div><span >" + (countcolor3 / (updatedPositions.length / 8) * 100).toFixed(2) + "%(<0.7)</span></div>";
                // contents += " <div  style='clear: both;'><div style='height:19px;background-color:#00FFFF;width: 64px;float: left;'> </div><span >" + (countcolor4 / (updatedPositions.length / 8) * 100).toFixed(2) + "%(<0.87)</span></div>";
                // contents += " <div  style='clear: both;'><div style='height:19px;background-color:#FFFF00;width: 64px;float: left;'> </div><span > " + (countcolor5 / (updatedPositions.length / 8) * 100).toFixed(2) + "%(<0.91)</span></div>";
                // contents += " <div  style='clear: both;'><div style='height:19px;background-color:#0000FF;width: 64px;float: left;'> </div><span >" + (countcolor6 / (updatedPositions.length / 8) * 100).toFixed(2) + "%(<0.95)</span></div>";
                // contents += " <div  style='clear: both;'><div style='height:19px;background-color:#FF0000;width: 64px;float: left;'> </div><span > " + (countcolor7 / (updatedPositions.length / 8) * 100).toFixed(2) + "%(<1)</span></div></div>";
                // layer.closeAll();


                // layer.open({
                //     type: 1,
                //     offset: ["500px", "1200px"],
                //     area: ['260px', '179px'],
                //     title: "坡度分析信息"
                //     ,
                //     content: contents
                //     ,
                //     btnAlign: 'c' //按钮居中
                //     ,
                //     shade: 0 //不显示遮罩
                //     ,
                //     cancel: function (index) {
                //         layer.close(index);
                //     }
                // });


            })

    }
}
