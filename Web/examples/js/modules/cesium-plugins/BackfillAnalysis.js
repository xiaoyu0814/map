class BackfillAnalysisTool {
    constructor(viewer) {
        this.viewer = viewer;
        this.handler = null;
        this.enable = false;

        this.activeShape = null;
        this.pointArray = [];
        this.fillShape = null;

        this.fillVolume = 0;
        this.allVolume = 0;
        this.cutVolume = 0;
        this.heightExtent = null;
        this.averageHeight = 0;
        this.area = 0;



    }
    getEnable = function () {
        return this.enable;
    }
    setEnable = function (enable, callback) {
        this.enable = enable;

        if (enable) {
            if (this.handler == null) {
                this.drawPlygon(callback)
            }
        } else {

            for (let i = 0; i < this.pointArray.length; i++) {
                this.viewer.entities.remove(this.pointArray[i]);
            }

            this.viewer.entities.remove(this.activeShape);
            this.viewer.entities.remove(this.fillShape);
            this.fillVolume = 0;
            this.allVolume = 0;
            this.cutVolume = 0;
            this.heightExtent = null;
            this.averageHeight = 0;

            this.pointArray = [];


        }
    }
    computePolygonHeightRange(e) {
        var t = []
        for (var i = 0; i < e.positions.length; i++) t.push(e.positions[i].clone());
        var a, n, r, o, s, u, l, h = 0,
            g = 9999,
            c = Math.PI / Math.pow(2, 11) / 64,
            m = new Cesium.PolygonGeometry.fromPositions({
                positions: t,
                vertexFormat: Cesium.PerInstanceColorAppearance.FLAT_VERTEX_FORMAT,
                granularity: c
            }),

            d = new Cesium.PolygonGeometry.createGeometry(m);
        // debugger
        for (i = 0; i < d.indices.length; i += 12) a = d.indices[i],
            n = d.indices[i + 1],
            r = d.indices[i + 2],
            l = new Cesium.Cartesian3(d.attributes.position.values[3 * a], d.attributes.position.values[3 * a + 1], d.attributes.position.values[3 * a + 2]),
            (o = this.viewer.scene.globe.getHeight(Cesium.Cartographic.fromCartesian(l))) < g && (g = o),
            h < o && (h = o),
            l = new Cesium.Cartesian3(d.attributes.position.values[3 * n], d.attributes.position.values[3 * n + 1], d.attributes.position.values[3 * n + 2]),
            (s = this.viewer.scene.globe.getHeight(Cesium.Cartographic.fromCartesian(l))) < g && (g = s),
            h < s && (h = s),
            l = new Cesium.Cartesian3(d.attributes.position.values[3 * r], d.attributes.position.values[3 * r + 1], d.attributes.position.values[3 * r + 2]),
            (u = this.viewer.scene.globe.getHeight(Cesium.Cartographic.fromCartesian(l))) < g && (g = u),
            h < u && (h = u);
        return {
            maxHeight: h,
            minHeight: g
        }
    }

    drawPlygon(callback) {

        var activeShapePoints = [];
        var floatingPoint = null;
        var activeEntityPoint = [];
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
            if (Cesium.defined(earthPosition)) {
                if (activeShapePoints.length === 0) {
                    floatingPoint = createPoint(earthPosition);
                    that.pointArray.push(floatingPoint);
                    activeShapePoints.push(earthPosition);
                    var dynamicPositions = new Cesium.CallbackProperty(function () {
                        return new Cesium.PolygonHierarchy(activeShapePoints);;
                    }, false);
                    that.activeShape = drawShape(dynamicPositions);
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
            that.viewer.entities.remove(floatingPoint);
            floatingPoint = undefined;
            var values = that.activeShape.polygon.hierarchy.getValue();
            // debugger
            that.heightExtent = that.computePolygonHeightRange(values);
            that.averageHeight = (that.heightExtent.maxHeight + that.heightExtent.minHeight) / 2;
            //填方体积
            that.fillShape = that.viewer.entities.add({
                polygon: {
                    hierarchy: values.positions,
                    material: new Cesium.ColorMaterialProperty(Cesium.Color.RED.withAlpha(0.7)),
                    extrudedHeight: that.averageHeight,
                    outline: true
                }
            });
            var c = Math.PI / Math.pow(2, 11) / 64;
            var polygonGeometryFill = new Cesium.PolygonGeometry.fromPositions({
                positions: that.fillShape.polygon.hierarchy.getValue().positions,
                extrudedHeight: that.averageHeight,
                vertexFormat: Cesium.VertexFormat.POSITION_ONLY,
                granularity: c
            });
            var polygonGeometry1Fill = new Cesium.PolygonGeometry.createGeometry(polygonGeometryFill);
            var vertexArray = [];
            var vertexIndex = polygonGeometry1Fill.indices;
            for (let i = 0; i < vertexIndex.length; i += 3) {
                var pIndex = vertexIndex[i];
                var cartesian3 = new Cesium.Cartesian3(polygonGeometry1Fill.attributes.position.values[3 * pIndex], polygonGeometry1Fill.attributes.position.values[3 * pIndex + 1], polygonGeometry1Fill.attributes.position.values[3 * pIndex + 2]);
                var latLng = cartesianToDegrees(cartesian3);
                vertexArray.push(latLng);
            }
            that.area = getArea(vertexArray).toFixed(3);
            that.fillVolume = that.area * that.averageHeight;

            //总体积
            // var allShape = that.viewer.entities.add({
            //     polygon: {
            //         hierarchy: values.positions,
            //         material: new Cesium.ColorMaterialProperty(Cesium.Color.GREEN.withAlpha(0.7)),
            //         extrudedHeight: heightExtent.maxHeight,
            //     }
            // });
            // var polygonGeometryAll = new Cesium.PolygonGeometry.fromPositions({
            //     positions: allShape.polygon.hierarchy.getValue().positions,
            //     extrudedHeight: heightExtent.maxHeight,
            //     vertexFormat: Cesium.VertexFormat.POSITION_ONLY,
            //     granularity: c
            // });
            // var polygonGeometry1All = new Cesium.PolygonGeometry.createGeometry(polygonGeometryAll);
            // var allVertexArray=[];
            // var allVertexIndex=polygonGeometry1All.indices;
            // for (let i = 0; i < allVertexIndex.length; i += 3) {
            //     var pIndex = allVertexIndex[i];
            //     var cartesian3 = new Cesium.Cartesian3(polygonGeometry1All.attributes.position.values[3 * pIndex], polygonGeometry1All.attributes.position.values[3 * pIndex + 1], polygonGeometry1All.attributes.position.values[3 * pIndex + 2]);
            //     var latLng = cartesianToDegrees(cartesian3);
            //     allVertexArray.push(latLng);
            // }
            that.allVolume = that.area * (that.heightExtent.maxHeight);
            that.cutVolume = that.allVolume - that.fillVolume;
            callback();




            var radiansPerDegree = Math.PI / 180.0;//角度转化为弧度(rad) 
            var degreesPerRadian = 180.0 / Math.PI;//弧度转化为角度
            function cartesianToDegrees(position) {
                //     //在三维场景中添加点
                var cartographic = Cesium.Cartographic.fromCartesian(position);
                var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
                var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
                var heightString = cartographic.height;
                var degrees = { lon: longitudeString, lat: latitudeString, hei: heightString };
                return degrees;
            }
            function distance(point1, point2) {
                var point1cartographic = Cesium.Cartographic.fromCartesian(Cesium.Cartesian3.fromDegrees(point1.lon, point1.lat, point1.hei));
                var point2cartographic = Cesium.Cartographic.fromCartesian(Cesium.Cartesian3.fromDegrees(point2.lon, point2.lat, point2.hei));
                /**根据经纬度计算出距离**/
                var geodesic = new Cesium.EllipsoidGeodesic();
                geodesic.setEndPoints(point1cartographic, point2cartographic);
                var s = geodesic.surfaceDistance;
                //console.log(Math.sqrt(Math.pow(distance, 2) + Math.pow(endheight, 2)));
                //返回两点之间的距离
                s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2cartographic.height - point1cartographic.height, 2));
                return s;
            }


            //计算多边形面积
            function getArea(points) {

                var res = 0;
                //拆分三角曲面

                for (var i = 0; i < points.length - 2; i++) {
                    var j = (i + 1) % points.length;
                    var k = (i + 2) % points.length;
                    var totalAngle = Angle(points[i], points[j], points[k]);


                    var dis_temp1 = distance(points[i], points[j]);
                    var dis_temp2 = distance(points[j], points[k]);
                    res += dis_temp1 * dis_temp2 * Math.abs(Math.sin(totalAngle));
                }


                return res;
            }

            /*角度*/
            function Angle(p1, p2, p3) {
                var bearing21 = Bearing(p2, p1);
                var bearing23 = Bearing(p2, p3);
                var angle = bearing21 - bearing23;
                if (angle < 0) {
                    angle += 360;
                }
                return angle;
            }
            /*方向*/
            function Bearing(from, to) {
                var radiansPerDegree = Math.PI / 180.0;//角度转化为弧度(rad) 
                var degreesPerRadian = 180.0 / Math.PI;//弧度转化为角度
                var lat1 = from.lat * radiansPerDegree;
                var lon1 = from.lon * radiansPerDegree;
                var lat2 = to.lat * radiansPerDegree;
                var lon2 = to.lon * radiansPerDegree;
                var angle = -Math.atan2(Math.sin(lon1 - lon2) * Math.cos(lat2), Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2));
                if (angle < 0) {
                    angle += Math.PI * 2.0;
                }
                angle = angle * degreesPerRadian;//角度
                return angle;
            }


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
            var shape = that.viewer.entities.add({
                polygon: {
                    hierarchy: positionData,
                    material: new Cesium.ColorMaterialProperty(Cesium.Color.LIGHTSKYBLUE.withAlpha(0.7))
                }
            });

            return shape;
        }

    }

}