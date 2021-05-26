class VolumeMeasureTool {

    constructor(viewer) {
        this.viewer = viewer;
        this.hander = null;
        this.enbale = false;


        this.polygon = null;
        this.floatingPointArray = [];
        this.shape = null;
        this.positionArray = [];
        this.activeShapePoints = [];
        this.floatingPoint = null;
        this.activeShape = [];
        this.entityPolygon = null;

        //dian
        this.pointGeometry = null;
        this.activeEntityPoint=[]

        //线
        this.linefloatPoint = null;
        this.linePositionArray = [];
        this.lineEntity = null



    }
    getEnable() {
        return this.getEnable;

    }
    setEnable(enable) {
        this.enable = enable;

        if (enable) {
            if (this.handler == null) {

            }
        } else {

        }
    }
    drawPolygon() {
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