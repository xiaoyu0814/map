class FloodAnalysisTool {

    constructor(viewer) {
        this.viewer = viewer;
        this.enable = false;
        this.handler = null;
        this.entityPolygon = null;
        this.points = null;
        //this. drawingMode = 'polygon';
        this.activeShapePoints = [];
        this.activeShape;
        this.floatingPoint;
        this.currentHeight = 0;
        this.maxValue = 0;
        this.int = null;
        this.activeEntityPoint = [];
        this.area = 0;
        this.lastEntity;
        this.thisWidget = {

            entity: null,
            drawOk: function (e) {
                this.entity = e;
                var t = this.computePolygonHeightRange(e.polygon.hierarchy.getValue());
                // this.currentHeight = t.minHeight, this.maxValue = t.maxHeight;
                return t;
            },
            computePolygonHeightRange: function (e) {
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

                    (o = viewer.scene.globe.getHeight(Cesium.Cartographic.fromCartesian(l))) < g && (g = o),
                    h < o && (h = o),
                    l = new Cesium.Cartesian3(d.attributes.position.values[3 * n], d.attributes.position.values[3 * n + 1], d.attributes.position.values[3 * n + 2]),
                    (s = viewer.scene.globe.getHeight(Cesium.Cartographic.fromCartesian(l))) < g && (g = s),
                    h < s && (h = s),
                    l = new Cesium.Cartesian3(d.attributes.position.values[3 * r], d.attributes.position.values[3 * r + 1], d.attributes.position.values[3 * r + 2]),
                    (u = viewer.scene.globe.getHeight(Cesium.Cartographic.fromCartesian(l))) < g && (g = u),
                    h < u && (h = u);
                return {
                    maxHeight: h,
                    minHeight: g
                }
            },
            startFx: function (e) {
                viewer.scene.globe.depthTestAgainstTerrain = !0;
                var t = this;
                this.extrudedHeight = e,
                    this.entity.polygon.extrudedHeight = new Cesium.CallbackProperty(function (e) {
                        return t.extrudedHeight
                    }, false);

                for (var i = this.entity.polygon.hierarchy.getValue(), a = [], n = 0; n < i.length; n++) {
                    var r = Cesium.Ellipsoid.WGS84.cartesianToCartographic(i[n]),
                        o = {
                            lon: Cesium.Math.toDegrees(r.longitude),
                            lat: Cesium.Math.toDegrees(r.latitude),
                            hgt: e
                        },
                        s = [o.lon, o.lat, o.hgt];
                    a = a.concat(s)
                }
                return i = Cesium.Cartesian3.fromDegreesArrayHeights(a),
                    this.entity.polygon.hierarchy = new Cesium.CallbackProperty(function (e) {
                        return i;
                    }, false),
                    !0
            },
            clear: function () {
                viewer.scene.globe.depthTestAgainstTerrain = !1,
                    this.entity = null
            },
            updateHeight: function (e) {
                this.entity.polygon.extrudedHeight = e
            }
        };
    }

    drawPlygon() {
        this.viewer.scene.pickTranslucentDepth = false;
        this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
        this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        var that = this;
        this.handler.setInputAction(function (event) {
            if (!Cesium.Entity.supportsPolylinesOnTerrain(that.viewer.scene)) {
                console.log('This browser does not support polylines on terrain.');
                return;
            }
            // 使用viewer.scene.pickPosition` 来代替`viewer.camera.pickEllipsoid` 这样当鼠标掠过terrain能得到正确的坐标
            var earthPosition = that.viewer.scene.pickPosition(event.position);
            if (Cesium.defined(earthPosition)) {

                if (that.activeShapePoints.length === 0) {
                    that.floatingPoint = createPoint(earthPosition);

                    that.activeShapePoints.push(earthPosition);
                    var dynamicPositions = new Cesium.CallbackProperty(function () {
                        return new Cesium.PolygonHierarchy(that.activeShapePoints);
                        ;
                    }, false);
                    that.activeShape = drawShape(dynamicPositions);
                }
                that.activeShapePoints.push(earthPosition);
                createPoint(earthPosition);

            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        //
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
        //
        this.handler.setInputAction(function (event) {
            that.activeShapePoints.pop();
            var tempPoints = [];
            that.entityPolygon = drawShape(that.activeShapePoints);
            for (let i = 0; i < that.activeShapePoints.length; i++) {
                var tem = cartesianToDegrees(that.activeShapePoints[i])
                tempPoints.push(tem)
            }

            if (that.entityPolygon.polygon != null) {

                var height = that.thisWidget.drawOk(that.entityPolygon);

                that.currentHeight = height.minHeight;
                that.maxValue = height.maxHeight;
            }
            that.area = getArea(tempPoints).toFixed(3);
            that.lastEntity = that.activeEntityPoint[that.activeEntityPoint.length - 2];


            that.floodAnalysis(80);
            that.viewer.entities.remove(that.floatingPoint);
            that.viewer.entities.remove(that.activeShape);
            that.entityPolygon = null;
            that.floatingPoint = undefined;
            that.activeShape = undefined;
            that.activeShapePoints = [];

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
                var point1cartographic = Cesium.Cartographic.fromCartesian(point1);
                var point2cartographic = Cesium.Cartographic.fromCartesian(point2);
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


                    var dis_temp1 = distance(that.activeShapePoints[i], that.activeShapePoints[j]);
                    var dis_temp2 = distance(that.activeShapePoints[j], that.activeShapePoints[k]);
                    res += dis_temp1 * dis_temp2 * Math.abs(Math.sin(totalAngle));
                    console.log(res);
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
            var point = viewer.entities.add({
                position: worldPosition,
                point: {
                    pixelSize: 10,
                    color: Cesium.Color.YELLOW,
                    //disableDepthTestDistance: Number.POSITIVE_INFINITY,
                    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
                },
            });
            that.activeEntityPoint.push(point);
            that.points = point;
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

    floodAnalysis(speed) {

        var that = this;
        this.int = self.setInterval(flood, speed);

        function stopFX() {
            self.clearInterval(that.int);
        }

        function flood() {

            that.currentHeight > that.maxValue ? stopFX() : (that.thisWidget.updateHeight(that.currentHeight), that.currentHeight += 10);
            console.log(that.area)
            var volume = that.area * that.currentHeight;
            var text = "体积" + volume.toFixed(4) + "立方米" + "   面积" + that.area + "平方米";
            console.log(text);

            that.lastEntity.label = {
                text: text,
                font: '18px sans-serif',
                fillColor: Cesium.Color.GOLD,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                outlineWidth: 2,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(20, -40),
                heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
            }
        }

    }

    clean() {
        this.viewer.entities.remove(this.thisWidget.entity)
        for (var i = 0; i < this.activeEntityPoint.length; i++) {
            this.viewer.entities.remove(this.activeEntityPoint[i])
        }
        this.handler.destroy();
        this.handler = null;
    }


}