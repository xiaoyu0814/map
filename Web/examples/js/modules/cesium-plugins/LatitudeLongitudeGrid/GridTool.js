class GridTool {

    constructor(viewer) {
        this.viewer = viewer;
        this.lableArray = [];
        this.lineArray = [];
    }
    getEnable() {
        return this.enable;
    }
    setEnable(enable) {
        this.enable = enable;

        if (enable) {
            this.lineArray = this.makeGrid(3, Cesium.Color.YELLOW, true)
        } else {
            if (this.lableArray.length > 0) {
                this.lableArray.forEach(function (lable) {
                    lable.show = false;
                });
            }
            if (this.lineArray.length > 0) {
                this.lineArray.forEach(function (line) {
                    line.show = false;
                });
            }


        }
    }
    parallel(latitude, color, granularity) {
        var name = "Parallel " + latitude;
        if (latitude >= 0) {
            var northLat = this.viewer.entities.add({

                //参数顺序：经度、纬度
                position: Cesium.Cartesian3.fromDegrees(-180, latitude),

                label: {
                    text: latitude + "N",
                    font: '14pt monospace',
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    outlineWidth: 2,
                    verticalOrigin: Cesium.VerticalOrigin.TOP,
                    pixelOffset: new Cesium.Cartesian2(0, 0)//此属性为设置偏移量
                },
                type: 'text'//自定义属性
            });
            this.lableArray.push(northLat);
        } else {
            var sourthLat = this.viewer.entities.add({

                //参数顺序：经度、纬度
                position: Cesium.Cartesian3.fromDegrees(-180, latitude),

                label: {
                    text: Math.abs(latitude) + "S",
                    font: '14pt monospace',
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    outlineWidth: 2,
                    verticalOrigin: Cesium.VerticalOrigin.TOP,
                    pixelOffset: new Cesium.Cartesian2(0, 0)//此属性为设置偏移量
                },
                type: 'text'//自定义属性
            });
            this.lableArray.push(sourthLat)
        }

        return this.viewer.entities.add({
            name: name,
            polyline: {
                positions: Cesium.Cartesian3.fromDegreesArray([
                    -180,
                    latitude,
                    -90,
                    latitude,
                    0,
                    latitude,
                    90,
                    latitude,
                    180,
                    latitude,
                ]),
                width: 2,
                arcType: Cesium.ArcType.RHUMB,
                material: color,
                granularity: granularity,
            },

        });

    }

    meridian(longitude, color, granularity) {
        var name = "Meridian " + longitude;
        if (longitude !== 180) {
            if (longitude >= 0) {
                var eastLong = this.viewer.entities.add({

                    //参数顺序：经度、纬度
                    position: Cesium.Cartesian3.fromDegrees(longitude, 0),

                    label: {
                        text: longitude + "E",
                        font: '14pt monospace',
                        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                        outlineWidth: 2,
                        verticalOrigin: Cesium.VerticalOrigin.TOP,
                        pixelOffset: new Cesium.Cartesian2(0, 0)//此属性为设置偏移量
                    },
                    type: 'text'//自定义属性
                });
                this.lableArray.push(eastLong)
            } else {
                var westLong = this.viewer.entities.add({

                    //参数顺序：经度、纬度
                    position: Cesium.Cartesian3.fromDegrees(longitude, 0),

                    label: {
                        text: Math.abs(longitude) + "W",
                        font: '14pt monospace',
                        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                        outlineWidth: 2,
                        verticalOrigin: Cesium.VerticalOrigin.TOP,
                        pixelOffset: new Cesium.Cartesian2(0, 0)//此属性为设置偏移量
                    },
                    type: 'text'//自定义属性
                });
                this.lableArray.push(westLong)
            }

        }

        return this.viewer.entities.add({
            name: name,
            polyline: {
                positions: Cesium.Cartesian3.fromDegreesArray([
                    longitude,
                    90,
                    longitude,
                    0,
                    longitude,
                    -90,
                ]),
                width: 2,
                arcType: Cesium.ArcType.RHUMB,
                material: color,
                granularity: granularity,
            },

        });

    }
    makeGrid(numberOfDivisions, color, bolean) {
        // debugger
        var parallels = this.makeParallelsRecursive(
            -90,
            90,
            numberOfDivisions,
            color
        );
        var meridians = this.makeMeridiansRecursive(
            -180,
            180,
            numberOfDivisions,
            color
        );
        meridians.push(this.meridian(180, color));

        var allLines = parallels.concat(meridians);
        // allLines.forEach(function (line) {
        //     line.show = bolean;
        // });

        return allLines;
    }
    makeParallelsRecursive(minLatitude, maxLatitude, depth, color) {
        var result = [];
        var midpoint = (minLatitude + maxLatitude) / 2;
        result.push(this.parallel(midpoint, color));

        if (depth > 0) {
            var southernLines = this.makeParallelsRecursive(
                minLatitude,
                midpoint,
                depth - 1,
                color
            );
            var northernLines = this.makeParallelsRecursive(
                midpoint,
                maxLatitude,
                depth - 1,
                color
            );
            result = southernLines.concat(result, northernLines);
        }

        return result;
    }

    makeMeridiansRecursive(minLongitude, maxLongitude, depth, color) {
        var result = [];
        var midpoint = (minLongitude + maxLongitude) / 2;
        result.push(this.meridian(midpoint, color));

        if (depth > 0) {
            var westernLines = this.makeMeridiansRecursive(
                minLongitude,
                midpoint,
                depth - 1,
                color
            );
            var easternLines = this.makeMeridiansRecursive(
                midpoint,
                maxLongitude,
                depth - 1,
                color
            );
            result = westernLines.concat(result, easternLines);
        }

        return result;
    }


}
