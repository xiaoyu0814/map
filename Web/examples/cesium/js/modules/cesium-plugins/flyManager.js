function Position(lon, lat, height) {
    this.longitude = lon;
    this.latitude = lat;
    this.height = height;
}

function FlyPath(viewer) {
    this.viewer = viewer;
    this.data = [];
    this.lineData = [];
    this.pathEntityIds = [];
    this.trackedEntity = null;
}

FlyPath.prototype.addCameraPoint = function () {
    var camera = this.viewer.scene.camera;
    var cameraPosition = camera.positionCartographic;
    var longitude = Cesium.Math.toDegrees(cameraPosition.longitude);
    var latitude = Cesium.Math.toDegrees(cameraPosition.latitude);
    var height = cameraPosition.height;

    this.addPoint(longitude, latitude, height);
    alert("添加成功");
}

FlyPath.prototype.addPoint = function (longitude, latitude, height) {
    var ctrlPosition = new Position(longitude, latitude, height);
    this.data.push(ctrlPosition);
    var worldPosition = Cesium.Cartesian3.fromDegrees(longitude, latitude, height);
    this.lineData.push(worldPosition);

    this.updatePathEntitys();
}

FlyPath.prototype.clearPoints = function () {
    this.data.length = 0;
    this.lineData.length = 0;

    this.stopFly();
    this.clearPathEntitys();
}

FlyPath.prototype.updatePathEntitys = function () {
    this.clearPathEntitys();

    // 在三维场景中添加飞行控制点
    for (var i = 0; i < this.lineData.length; i++) {
        var entity = this.viewer.entities.add({
            name: '空间距离',
            position: this.lineData[i],
            point: {
                pixelSize: 5,
                color: Cesium.Color.RED,
                outlineColor: Cesium.Color.WHITE,
                outlineWidth: 2,
            }
        });
        this.pathEntityIds.push(entity.id);
    }

    // 在三维场景中添加飞行路径
    var pathEntity = this.viewer.entities.add({
        name: "线几何对象",
        polyline: {
            positions: this.lineData,
            width: 5.0,
            material: new Cesium.PolylineGlowMaterialProperty({
                color: Cesium.Color.GOLD,
            }),
            depthFailMaterial: new Cesium.PolylineGlowMaterialProperty({
                color: Cesium.Color.GOLD,
            }),
        }
    });
    this.pathEntityIds.push(pathEntity.id);
}

FlyPath.prototype.clearPathEntitys = function () {
    for (var j = 0; j < this.pathEntityIds.length; j++) {
        this.viewer.entities.removeById(this.pathEntityIds[j]);
    }
    this.pathEntityIds.length = 0;
}

FlyPath.prototype.startFly = function () {
    if (this.trackedEntity != null) {
        return;
    }

    // 起始时间
    let start = Cesium.JulianDate.fromDate(new Date(2017, 7, 11));
    // 结束时间
    let stop = Cesium.JulianDate.addSeconds(start, 360, new Cesium.JulianDate());
    // 设置始时钟始时间
    this.viewer.clock.startTime = start.clone();
    // 设置时钟当前时间
    this.viewer.clock.currentTime = start.clone();
    // 设置始终停止时间
    this.viewer.clock.stopTime = stop.clone();
    // 时间速率，数字越大时间过的越快
    this.viewer.clock.multiplier = 10;
    // 时间轴
    this.viewer.timeline.zoomTo(start, stop);
    // 循环执行,即为2，到达终止时间，重新从起点时间开始
    //this.viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;

    for (j = 0; j < this.data.length; j++) {
        this.data[j].time = j * 100;
    }
    let property = new Cesium.SampledPositionProperty();
    for (let i = 0; i < this.data.length; i++) {
        let time = Cesium.JulianDate.addSeconds(start, this.data[i].time, new Cesium.JulianDate);
        let position = Cesium.Cartesian3.fromDegrees(this.data[i].longitude, this.data[i].latitude, this.data[i].height);
        // 添加位置，和时间对应
        property.addSample(time, position);
    }

    // 添加模型
    this.trackedEntity = this.viewer.entities.add({
        // 和时间轴关联
        availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
            start: start,
            stop: stop
        })]),
        position: property,
        // 根据所提供的速度计算模型的朝向
        orientation: new Cesium.VelocityOrientationProperty(property),
        // 模型数据
        model: {
            uri: './src/Cesium-1.65/Apps/SampleData/models/CesiumAir/Cesium_Air.glb',
            minimumPixelSize: 128
        },

    });
    this.viewer.trackedEntity = this.trackedEntity;
}

FlyPath.prototype.pauseFly = function () {
    if (this.viewer.trackedEntity != null && this.viewer.clock != null) {
        this.viewer.clock.multiplier = 0;
    }
}

FlyPath.prototype.resumeFly = function () {
    if (this.viewer.trackedEntity != null && this.viewer.clock != null) {
        this.viewer.clock.multiplier = 10;
    }
}

FlyPath.prototype.stopFly = function () {
    if (this.trackedEntity != null) {
        this.viewer.entities.removeById(this.trackedEntity.id);
        this.trackedEntity = null;
    }
}


