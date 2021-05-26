class BufferAnalysisTool {

    constructor(viewer) {
        this.viewer = viewer;
        this.enable = false;
        this.bufferEntity = [];

    }

    getEnable = function () {
        return this.enable;
    }
    setEnable = function (enable, entity, bufferRadius) {
        this.enable = enable;

        if (enable) {
            this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
            this.bufferAnalysis(entity, bufferRadius);

        } else {

            for (let i = 0; i < this.bufferEntity.length; i++) {
                this.viewer.entities.remove(this.bufferEntity[i])


            }
        }
    }
    bufferAnalysis(entity, bufferRadius) {
        // this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
        // var that = this;
        // this.handler.setInputAction(function (movement) {

        //     var pick = that.viewer.scene.pick(movement.position);

        //     if (Cesium.defined(pick) && (pick.id)) {

        //         var entity = that.viewer.entities.getById(pick.id._id);
        if (Cesium.defined(entity._point)) {
            let cartesian3 = entity.position.getValue();
            let ellipsoid = this.viewer.scene.globe.ellipsoid;
            let cartographic = ellipsoid.cartesianToCartographic(cartesian3);
            let lat = Cesium.Math.toDegrees(cartographic.latitude);
            let lng = Cesium.Math.toDegrees(cartographic.longitude);
            let alt = cartographic.height;
            let point = turf.point([lng, lat]);
            let buffered = turf.buffer(point, bufferRadius, { units: 'miles' });
            let coors = buffered.geometry.coordinates[0];
            console.log(coors)
            let coorArray = [];


            for (let i = 0; i < coors.length; i++) {
                coorArray = coorArray.concat(coors[i])
            }
            let type = buffered.geometry.type;
            var pointBuffer = this.viewer.entities.add({
                name: "线几何对象",
                polygon: {

                    hierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(coorArray)),
                    material: new Cesium.Color.fromCssColorString("#FFD700").withAlpha(.2),

                    outline: true,
                    outlineColor: Cesium.Color.RED
                }
            });
            this.bufferEntity.push(pointBuffer);
        }
        else if (Cesium.defined(entity._polyline)) {
            let cartesian3s = entity._polyline._positions._value;
            let degrees = [];
            for (let i = 0; i < cartesian3s.length; i++) {
                let ellipsoid = this.viewer.scene.globe.ellipsoid;
                let cartographic = ellipsoid.cartesianToCartographic(cartesian3s[i]);
                let lat = Cesium.Math.toDegrees(cartographic.latitude);
                let lng = Cesium.Math.toDegrees(cartographic.longitude);
                let alt = cartographic.height;
                let degree = [lng, lat];
                degrees.push(degree)

            }


            console.log(degrees)
            let line = turf.lineString(degrees);
            let buffered = turf.buffer(line, bufferRadius, { units: 'miles' });
            let coors = buffered.geometry.coordinates[0];

            let coorArray = [];

            for (let i = 0; i < coors.length; i++) {
                coorArray = coorArray.concat(coors[i])
            }
            let type = buffered.geometry.type;
            var lineBuffer = this.viewer.entities.add({

                polygon: {

                    hierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(coorArray)),
                    material: new Cesium.Color.fromCssColorString("#FFD700").withAlpha(.2),

                    outline: true,
                    outlineColor: Cesium.Color.RED
                }
            });
            this.bufferEntity.push(lineBuffer);
        } else {
            let cartesian3s = entity._polygon._hierarchy._value.positions;
            let degrees = [];
            let positionsArray = [];
            var firstPoint;
            for (let i = 0; i < cartesian3s.length; i++) {
                let ellipsoid = this.viewer.scene.globe.ellipsoid;
                let cartographic = ellipsoid.cartesianToCartographic(cartesian3s[i]);
                let lat = Cesium.Math.toDegrees(cartographic.latitude);
                let lng = Cesium.Math.toDegrees(cartographic.longitude);
                let alt = cartographic.height;
                let degree = [lng, lat];
                degrees.push(degree);
                if (i == 0) {
                    firstPoint = degree
                }

            }
            degrees.push(firstPoint)
            positionsArray.push(degrees);
            let line = turf.polygon(positionsArray);
            let buffered = turf.buffer(line, bufferRadius, { units: 'miles' });
            let coors = buffered.geometry.coordinates[0];

            let coorArray = [];

            for (let i = 0; i < coors.length; i++) {
                coorArray = coorArray.concat(coors[i])
            }
            let type = buffered.geometry.type;
            var poloygonBuffer = this.viewer.entities.add({

                polygon: {
                    height: 0.1,
                    hierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(coorArray)),
                    material: new Cesium.Color.fromCssColorString("#FFD700").withAlpha(.2),
                    perPositionHeight: true,
                    outline: true,
                    outlineColor: Cesium.Color.RED
                }
            });
            this.bufferEntity.push(poloygonBuffer)
        }

    }


    // }, Cesium.ScreenSpaceEventType.LEFT_CLICK)





}