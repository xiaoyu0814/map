
function MapboxCamera(map) {
    this.map = map;
}

MapboxCamera.prototype = {

    toDegrees: function (radians) {
        return radians * (180 / Math.PI);
    },

    toRadians: function (degrees) {
        return degrees * (Math.PI / 180);
    },

    computeZoom: function () {
        var zoom = this.map.getZoom();
        return zoom;
    },

    computeParam: function () {
        var param = {};

        param.pitch = this.map.getPitch();
        param.heading = this.map.getBearing();
        param.zoom = this.map.getZoom();
        param.center = this.map.getCenter();
        param.longitude = param.center.lng;
        param.latitude = param.center.lat;

        return param;
    },

    switchTo: function (param) {
        var pitch = param.pitch;
        var heading = param.heading;
        var zoom = param.zoom;
        var longitude = param.longitude;
        var latitude = param.latitude;

        //this.map.setZoom(zoom);
        //this.map.setPitch(this.toDegrees(pitch));
        //this.map.setBearing(-this.toDegrees(heading));
        //this.map.setCenter([longitude, latitude]);
        var options = {center: [longitude, latitude], zoom: zoom, bearing: -this.toDegrees(heading), pitch: this.toDegrees(pitch)};
        this.map.jumpTo(options);
        this.map.render();
    },

};

export { MapboxCamera };
