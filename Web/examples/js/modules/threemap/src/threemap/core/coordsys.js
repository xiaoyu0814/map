function CoordSys() {
    this.epsg = 4326;
    this.tileBounds = [-180, -90, 180, 90];
}

Object.assign(CoordSys.prototype, {

    setEPSG: function (epsg) {
        this.epsg = epsg;
    },

    getEPSG: function () {
        return this.epsg;
    },

    setTileBounds: function (tileBounds) {
        this.tileBounds = tileBounds;
    },

    getTileBounds: function () {
        return this.tileBounds;
    },

    scale2Zoom: function (scale) {
        return Math.log(scale) / Math.LN2;
    },

    zoom2Scale: function (zoom) {
        return Math.pow(2, zoom);
    },

    mercatorXfromLng: function (lng) {
        if (this.epsg == 4326) {
            return (180 + lng) / 360;
        }
        return (lng - this.tileBounds[0]) / (this.tileBounds[2] - this.tileBounds[0]);
    },

    mercatorYfromLat: function (lat) {
        if (this.epsg == 4326) {
            lat = Math.min(85.051129, Math.max(-85.051129, lat));
            return (0.5 + (Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360)) / (2 * Math.PI)));
        }
        return (lat - this.tileBounds[1]) / (this.tileBounds[3] - this.tileBounds[1]);
    },

    projectedUnitsPerMeter: function(latitude) {
        const circumference = 2 * Math.PI * 6378137;
        return Math.abs(512 * (1 / Math.cos(latitude * Math.PI / 180)) / circumference);
    },

    worldSizePerMeter: function(size) {
        if (this.epsg == 4326) {
            return 512 * size / (2 * Math.PI * 6378137);
        }
        return 512 * size / (this.tileBounds[2] - this.tileBounds[0]);
    },

    geoToWorld: function (p) {
        p.x = this.mercatorXfromLng(p.x) * 512;
        p.y = this.mercatorYfromLat(p.y) * 512;
        return p;
    },

    lngFromMercatorX: function (x) {
        if (this.epsg == 4326) {
            return x * 360 - 180;
        }
        return x * (this.tileBounds[2] - this.tileBounds[0]) + this.tileBounds[0];
    },

    latFromMercatorY: function (y) {
        if (this.epsg == 4326) {
            const y2 = 180 - (1 - y) * 360;
            return 360 / Math.PI * Math.atan(Math.exp(y2 * Math.PI / 180)) - 90;
        }
        return this.tileBounds[1] + y * (this.tileBounds[3] - this.tileBounds[1]);
    },

    worldToGeo: function (p) {
        p.x = this.lngFromMercatorX(p.x / 512);
        p.y = this.latFromMercatorY(p.y / 512);
        return p;
    },

} );

export { CoordSys };
