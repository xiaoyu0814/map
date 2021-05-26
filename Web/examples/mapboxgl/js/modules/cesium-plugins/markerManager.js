function Marker(lon, lat, height, text, image, video) {
    this.longitude = lon;
    this.latitude = lat;
    this.height = height;
    this.text = text;
    this.image = image;
    this.video = video;

    this.id = "";
    this.entity = null;
}

function MarkerManager(viewer) {
    this.viewer = viewer;
    this.markers = {};
}

MarkerManager.prototype.addMarker = function (marker, obj) {
    var entity = this.viewer.entities.add(obj);
    marker.id = entity.id;
    marker.entity = entity;
    this.markers[entity.id] = marker;
}

MarkerManager.prototype.removeMarker = function (id) {
    this.viewer.entities.remove(id);
    delete map[id];
}

MarkerManager.prototype.getMarker = function (id) {
    return this.markers[id];
}


function MarkerTool(viewer) {
    this.viewer = viewer;
    this.markerManager = new MarkerManager(viewer);
    this.enable = false;
    this.clickHandler = null;
    this.selectHandler = null;

    this.id = 0;
    this.text = "";
    this.image = "";
    this.video = "";
}

MarkerTool.prototype.isEnable = function () {
    return this.enable;
}

MarkerTool.prototype.setEnable = function (enable) {
    this.enable = enable;

    if (enable) {
        if (this.clickHandler == null) {
            let that = this;
            this.clickHandler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
            this.clickHandler.setInputAction(function (click) {
                that.createMarker(click);
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        }
    } else {
        if (this.clickHandler != null) {
            this.clickHandler.destroy();
            this.clickHandler = null;
        }
    }
}

MarkerTool.prototype.createMarker = function (click) {
    var pick = this.viewer.scene.pick(click.position);
    var pickPosition = this.viewer.scene.pickPosition(click.position);
    if (!Cesium.defined(pickPosition)) {
        return;
    }
    var pickMarker = null;
    if (Cesium.defined(pick) && Cesium.defined(pick.id)) {
        pickMarker = this.markerManager.getMarker(pick.id.id);
    }
    if (pickMarker == null) {
        var ellipsoid = this.viewer.scene.globe.ellipsoid;
        var cartographic = ellipsoid.cartesianToCartographic(pickPosition);
        var lon = Cesium.Math.toDegrees(cartographic.longitude);
        var lat = Cesium.Math.toDegrees(cartographic.latitude);
        var height = cartographic.height;

        var text = this.text;
        if (text == "") {
            text = '标注点' + this.id.toString();
            this.id++;
        }
        var image = this.image;
        if (image == "") {
            image = "./samples.png";
        }
        var video = this.video;
        if (video == "") {
            video = "./video.mp4";
        }

        var obj = {
            name: text,
            position: pickPosition,
            point: { // 点
                pixelSize: 0
            },
            label: { // 文字标签
                text: text,
                font: '14pt Source Han Sans CN',
                style: Cesium.LabelStyle.FILL,
                fillColor: Cesium.Color.WHITE,
                pixelOffset: new Cesium.Cartesian2(0, -15),   //偏移量
                showBackground: true,
                backgroundColor: new Cesium.Color(0.5, 0.6, 1, 1.0)
            },
            billboard: { // 图标
                image: "",
                width: 50,
                height: 50,
                pixelOffset: new Cesium.Cartesian2(0, -50),
            },
        };

        var marker = new Marker(lon, lat, height, text, image, video);
        this.markerManager.addMarker(marker, obj);
    }
    if (this.selectHandler != null) {
        this.selectHandler(pickMarker);
    }
}

