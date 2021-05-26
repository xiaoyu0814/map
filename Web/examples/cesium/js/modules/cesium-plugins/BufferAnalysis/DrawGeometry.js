class DrawGeometry {


    constructor(viewer) {
        this.viewer = viewer;
        this.enable = false;
        this.handler = null;
        this.shape = null;
        this.positionArray = [];
        this.activeShapePoints = [];
        this.floatingPoint = null;
        this.activeShape = [];
        this.entityPolygon = null;

        //dian
        this.pointGeometry = null;

        //线
        this.linefloatPoint = null;
        this.linePositionArray = [];
        this.lineEntity = null

    }
    // getEnable = function () {
    //     return this.enable;
    // }
    // setEnable = function (enable, drawingMode) {
    //     this.enable = enable;

    //     if (enable) {
    //         if (this.handler == null) {
    //             this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
    //             let that = this;
    //             this.handler.setInputAction(function (movement) {
    //                 var pick = that.viewer.scene.pickPosition(movement.position);

    //                 if (Cesium.defined(pick)) {

    //                     if (drawingMode == "point")
    //                         that.createPoint(pick);
    //                     else {

    //                         that.positionArray.push(pick);


    //                         if (that.positionArray.length >= 2) {
    //                             that.drawShape(drawingMode, that.positionArray)
    //                         }

    //                     }

    //                 }

    //             }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    //         }
    //     } else {
    //         if (this.handler != null) {

    //             this.handler.destroy();
    //             this.handler = null;
    //         }
    //     }
    // }

    // drawPoint(position) {

    //     var pointGeometry = this.viewer.entities.add({
    //         name: "点几何对象",
    //         position: position,
    //         point: {
    //             color: Cesium.Color.SKYBLUE,
    //             pixelSize: 10,
    //             outlineColor: Cesium.Color.YELLOW,
    //             outlineWidth: 3,
    //             disableDepthTestDistance: Number.POSITIVE_INFINITY
    //         }
    //     });
    //     return pointGeometry;
    // }




    // drawPolyline(positions) {
    //     if (positions.length < 1) return;
    //     var polylineGeometry = this.viewer.entities.add({
    //         name: "线几何对象",
    //         polyline: {
    //             positions: positions,
    //             width: 5.0,
    //             material: new Cesium.PolylineGlowMaterialProperty({
    //                 color: Cesium.Color.GOLD,
    //             }),
    //             depthFailMaterial: new Cesium.PolylineGlowMaterialProperty({
    //                 color: Cesium.Color.GOLD,
    //             }),
    //         }
    //     });
    //     return polylineGeometry;
    // }


    // drawPolygon(positions) {
    //     if (positions.length < 2) return;
    //     var polygonGeometry = this.viewer.entities.add({
    //         name: "线几何对象",
    //         polygon: {
    //             height: 0.1,
    //             hierarchy: new Cesium.PolygonHierarchy(positions),
    //             material: new Cesium.Color.fromCssColorString("#FFD700").withAlpha(.2),
    //             perPositionHeight: true,
    //         }
    //     });
    //     return polygonGeometry;
    // }
    // //绘制点
    // createPoint(worldPosition) {
    //     var point = this.viewer.entities.add({
    //         position: worldPosition,
    //         point: {
    //             color: Cesium.Color.SKYBLUE,
    //             pixelSize: 10,
    //             outlineColor: Cesium.Color.YELLOW,
    //             outlineWidth: 3,
    //             disableDepthTestDistance: Number.POSITIVE_INFINITY
    //         }
    //     });
    //     return point;
    // }

    // //绘制图形
    // drawShape(drawingMode, positionData) {

    //     if (drawingMode === 'line') {
    //         this.shape = this.viewer.entities.add({
    //             polyline: {
    //                 positions: positionData,

    //                 width: 3
    //             }
    //         });
    //     }
    //     else if (drawingMode === 'polygon') {
    //         this.shape = this.viewer.entities.add({
    //             polygon: {
    //                 hierarchy: new Cesium.PolygonHierarchy(positionData),
    //                 material: new Cesium.ColorMaterialProperty(Cesium.Color.WHITE.withAlpha(0.7))
    //             }
    //         });
    //     }
    //     return this.shape;
    // }
    drawPoint() {

        this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
        this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        var that = this;
        this.handler.setInputAction(function (event) {
            let ray = viewer.camera.getPickRay(event.position);
            var position = viewer.scene.globe.pick(ray, viewer.scene);
            that.pointGeometry = that.viewer.entities.add({
                name: "点几何对象",
                position: position,
                point: {
                    color: Cesium.Color.SKYBLUE,
                    pixelSize: 10,
                    outlineColor: Cesium.Color.YELLOW,
                    outlineWidth: 3,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY
                }
            });
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }
    drawLine() {

        this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
        this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        var that = this;
        var positions=[];
        var floatingPoint=null;
        var polylineGeometry =null;
        this.handler.setInputAction(function (movement) {

            let ray = viewer.camera.getPickRay(movement.position);
            var cartesian = viewer.scene.globe.pick(ray, viewer.scene);
            if (!Cesium.defined(cartesian)) //跳出地球时异常
                return;

            if (positions.length == 0) {
                positions.push(cartesian.clone());
            }
            positions.push(cartesian);
         
            var labelPt = positions[positions.length - 1];
           if (positions.length == 2) {
               
                floatingPoint = that.viewer.entities.add({
                    name: '空间距离',
                    position: labelPt,
                    point: {
                        pixelSize: 5,
                        color: Cesium.Color.RED,
                        outlineColor: Cesium.Color.WHITE,
                        outlineWidth: 2,
                    }
                });
                
            }

        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        this.handler.setInputAction(function (movement) {

            let ray = that.viewer.camera.getPickRay(movement.endPosition);
            var cartesian =that.viewer.scene.globe.pick(ray, viewer.scene);
            if (!Cesium.defined(cartesian)) //跳出地球时异常
                return;
            if (positions.length >= 2) {
                if (!Cesium.defined(polylineGeometry)) {
                     polylineGeometry = that.viewer.entities.add({
                        name: "线几何对象",
                        polyline: {
                            positions: positions,
                            width: 5.0,
                            material: new Cesium.PolylineGlowMaterialProperty({
                                color: Cesium.Color.GOLD,
                            }),
                            depthFailMaterial: new Cesium.PolylineGlowMaterialProperty({
                                color: Cesium.Color.GOLD,
                            }),
                        }
                    });
                } else {
                    positions.pop();
                    positions.push(cartesian);
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);



        this.handler.setInputAction(function (movement) {
            that.handler.destroy(); //关闭事件句柄
            that.handler = undefined;
            positions.pop(); //最后一个点无效
            if (positions.length == 1)
                viewer.entities.remove(floatingPoint);
           
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    }
    drawPlygon() {
        this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
        this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        var that = this;
        this.handler.setInputAction(function (event) {

            // 使用viewer.scene.pickPosition` 来代替`viewer.camera.pickEllipsoid` 这样当鼠标掠过terrain能得到正确的坐标
            var earthPosition = that.viewer.scene.pickPosition(event.position);
            if (Cesium.defined(earthPosition)) {

                if (that.activeShapePoints.length === 0) {
                    that.floatingPoint = createPoint(earthPosition);

                    that.activeShapePoints.push(earthPosition);
                    var dynamicPositions = new Cesium.CallbackProperty(function () {
                        return new Cesium.PolygonHierarchy(that.activeShapePoints);;
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

            that.handler.destroy(); //关闭事件句柄
            that.handler = undefined;


            that.activeShapePoints.pop();
            that.entityPolygon = drawShape(that.activeShapePoints);
            that.viewer.entities.remove(that.floatingPoint);
            that.viewer.entities.remove(that.activeShape);
            that.entityPolygon = null;
            that.floatingPoint = undefined;
            that.activeShape = undefined;
            that.activeShapePoints = [];
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




}