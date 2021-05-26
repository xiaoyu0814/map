class VolumeMeasureTool {

    constructor(viewer) {
        this.viewer = viewer;
        this.hander = null;
        this.enbale = false;


        // this.polygon = null;
        this.pointArray = [];
        this.area;
        this.activeShape = null;
        this.entityPolygon




    }
    getEnable() {
        return this.getEnable;

    }
    setEnable(enable, height) {
        this.enable = enable;

        if (enable) {
            if (this.handler == null) {

            }
        } else {
            this.entityPolygon = null;
            this.floatingPoint = undefined;
            this.activeShape = undefined;
            this.activeShapePoints = [];
        }
    }
    clean() {
        if (Cesium.defined(this.entityPolygon)) {

            this.viewer.entities.remove(this.entityPolygon);
            this.entityPolygon = null;

        }
        if (this.pointArray.length > 0) {
           
            for (let i = 0; i < this.pointArray.length; i++) {
                this.viewer.entities.remove(this.pointArray[i])
            }
        }
        if (this.area) {
            this.area = 0;
        }
    }
    drawPolygon(height) {
        var that = this;
        var activeShapePoints = [];
        var floatingPoint;
        var tempPoints = [];
        var positions=[];
        // 取消双击事件-追踪该位置
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


                if (activeShapePoints.length === 0) {
                    floatingPoint = createPoint(earthPosition);
                    that.pointArray.push(floatingPoint);
                    var degrees = cartesianToDegrees(earthPosition);
                    tempPoints.push(degrees);
                    activeShapePoints.push(earthPosition);
                    var dynamicPositions = new Cesium.CallbackProperty(function () {
                        return new Cesium.PolygonHierarchy(activeShapePoints);
                        ;
                    }, false);
                    that.activeShape = drawShape(dynamicPositions);
                }
                activeShapePoints.push(earthPosition);
                floatingPoint = createPoint(earthPosition);
                that.pointArray.push(floatingPoint);
               
                var degrees = cartesianToDegrees(earthPosition);
                tempPoints.push(degrees);

            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        //
        this.handler.setInputAction(function (event) {
            if (Cesium.defined(floatingPoint)) {
                var newPosition = that.viewer.scene.pickPosition(event.endPosition);
                if (Cesium.defined(newPosition)) {
                    floatingPoint.position.setValue(newPosition);
                    activeShapePoints.pop();
                    activeShapePoints.push(newPosition);
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        //
        this.handler.setInputAction(function (event) {
            
           
            that.viewer.entities.remove(that.activeShape)
            that.entityPolygon = drawShape(activeShapePoints);
            if (that.entityPolygon.polygon != null) {

                that.entityPolygon.polygon.extrudedHeight = height;
            }
           
            that.area = getArea(tempPoints).toFixed(3);
            var volume = that.area * height;
            var text = volume + "立方米";
            console.log(text)
            
            var lastEntity = that.pointArray[that.pointArray.length - 1];
            lastEntity.label = {
                text: text,
                font: '18px sans-serif',
                fillColor: Cesium.Color.GOLD,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                outlineWidth: 2,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(20, -40),
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
            }
            positions = [];
            tempPoints = [];
           
            that.handler.destroy();
           
            floatingPoint = undefined;
            that.activeShape = undefined;
            activeShapePoints = [];
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
            // that.activeEntityPoint.push(point);
            // that.points = point;
            return point;
        }

        function drawShape(positionData) {
            var shape = that.viewer.entities.add({
                polygon: {
                    hierarchy: positionData,
                    material: new Cesium.ColorMaterialProperty(Cesium.Color.AQUA)
                }
            });

            return shape;
        }



        function cartesianToDegrees(position) {
            //     //在三维场景中添加点
            var cartographic = Cesium.Cartographic.fromCartesian(position);
            var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
            var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
            var heightString = cartographic.height;
            var degrees = { lon: longitudeString, lat: latitudeString, hei: heightString };
            return degrees;
        }
        
        var radiansPerDegree = Math.PI / 180.0;//角度转化为弧度(rad) 
        var degreesPerRadian = 180.0 / Math.PI;//弧度转化为角度

     
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


                var dis_temp1 = distance(activeShapePoints[i], activeShapePoints[j]);
                var dis_temp2 = distance(activeShapePoints[j], activeShapePoints[k]);
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

    }


}