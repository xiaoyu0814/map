
function CesiumCamera(cesiumViewer) {
    this.viewer = cesiumViewer;
}

CesiumCamera.prototype = {

    toDegrees: function (radians) {
        return radians * (180 / Math.PI);
    },

    toRadians: function (degrees) {
        return degrees * (Math.PI / 180);
    },

    computeZoom: function () {
        var param = this.computeParam();
        return param.zoom;
    },

    computeParam: function () {
        var param = {};

        var metersPerUnit = 1;
        var scene = this.viewer.scene;
        var camera = scene.camera;
        var ellipsoid = Cesium.Ellipsoid.WGS84;

        var target = this.pickCenterPoint(scene);
        if (!target) {
            var carto = camera.positionCartographic.clone();
            carto.height = scene.globe.getHeight(carto) || 0;
            target = Cesium.Ellipsoid.WGS84.cartographicToCartesian(carto);
        }
        param.carto = Cesium.Ellipsoid.WGS84.cartesianToCartographic(target);
        param.longitude = this.toDegrees(param.carto.longitude);
        param.latitude = this.toDegrees(param.carto.latitude);
        var distance = Cesium.Cartesian3.distance(target, camera.position);
        param.resolution = this.computeResolutionForDistance(scene, metersPerUnit, distance, this.toRadians(param.latitude));
        var scale = (40075016.685578488 / param.resolution) / 512;
        param.zoom = Math.log(scale) / Math.LN2;

        if (target) {
            var pos = camera.position;

            // normal to the ellipsoid at the target
            var targetNormal = new Cesium.Cartesian3();
            ellipsoid.geocentricSurfaceNormal(target, targetNormal);

            // vector from the target to the camera
            var targetToCamera = new Cesium.Cartesian3();
            Cesium.Cartesian3.subtract(pos, target, targetToCamera);
            Cesium.Cartesian3.normalize(targetToCamera, targetToCamera);

            // HEADING
            var up = camera.up;
            var right = camera.right;
            var normal = new Cesium.Cartesian3(-target.y, target.x, 0); // what is it?
            param.heading = Cesium.Cartesian3.angleBetween(right, normal);
            var cross = Cesium.Cartesian3.cross(target, up, new Cesium.Cartesian3());
            var orientation = cross.z;
            param.heading = orientation < 0 ? param.heading : -param.heading;

            // TILT
            var tiltAngle = Math.acos(Cesium.Cartesian3.dot(targetNormal, targetToCamera));
            param.pitch = isNaN(tiltAngle) ? 0 : tiltAngle;
        } else {
            param.heading = camera.heading;

            param.pitch = -camera.pitch + Math.PI / 2;
        }

        return param;
    },

    switchTo: function (param) {
        var pitch = param.pitch;
        var heading = param.heading;
        var zoom = param.zoom;
        var longitude = param.longitude;
        var latitude = param.latitude;

        var metersPerUnit = 1;
        var scene = this.viewer.scene;
        var camera = scene.camera;
        var ellipsoid = Cesium.Ellipsoid.WGS84;

        var carto = new Cesium.Cartographic(this.toRadians(longitude), this.toRadians(latitude));
        if (scene.globe) {
            var height = scene.globe.getHeight(carto);
            carto.height = height || 0;
        }
        var destination = Cesium.Ellipsoid.WGS84.cartographicToCartesian(carto);

        var orientation = {
            pitch: this.toRadians(pitch) - Cesium.Math.PI_OVER_TWO,
            heading: this.toRadians(heading),
            roll: undefined
        };
        camera.setView({destination, orientation});

        var scale = Math.pow(2, zoom) * 512;
        var resolution = 40075016.685578488 / scale;
        var distance = this.computeDistanceForResolution(scene, metersPerUnit, resolution, this.toRadians(latitude));
        camera.moveBackward(distance);

        this.viewer.render();
    },

    computeDistanceForResolution: function (scene, metersPerUnit, resolution, latitude) {
        var canvas = scene.canvas;
        var fovy = scene.camera.frustum.fovy; // vertical field of view

        // number of "map units" visible in 2D (vertically)
        var visibleMapUnits = resolution * canvas.clientHeight;

        // The metersPerUnit does not take latitude into account, but it should
        // be lower with increasing latitude -- we have to compensate.
        // In 3D it is not possible to maintain the resolution at more than one point,
        // so it only makes sense to use the latitude of the "target" point.
        var relativeCircumference = Math.cos(Math.abs(latitude));

        // how many meters should be visible in 3D
        var visibleMeters = visibleMapUnits * metersPerUnit * relativeCircumference;

        // distance required to view the calculated length in meters
        //
        //  fovy/2
        //    |\
        //  x | \
        //    |--\
        // visibleMeters/2
        var requiredDistance = (visibleMeters / 2) / Math.tan(fovy / 2);

        // NOTE: This calculation is not absolutely precise, because metersPerUnit
        // is a great simplification. It does not take ellipsoid/terrain into account.
        return requiredDistance;
    },

    computeResolutionForDistance: function (scene, metersPerUnit, distance, latitude) {
        // See the reverse calculation (calcDistanceForResolution) for details
        var canvas = scene.canvas;
        var fovy = scene.camera.frustum.fovy;

        var visibleMeters = 2 * distance * Math.tan(fovy / 2);
        var relativeCircumference = Math.cos(Math.abs(latitude));
        var visibleMapUnits = visibleMeters / metersPerUnit / relativeCircumference;
        var resolution = visibleMapUnits / canvas.clientHeight;

        return resolution;
    },

    pickOnTerrainOrEllipsoid: function (scene, pixel) {
        var ray = scene.camera.getPickRay(pixel);
        var target = scene.globe.pick(ray, scene);
        return target || scene.camera.pickEllipsoid(pixel);
    },

    pickCenterPoint: function (scene) {
        var canvas = scene.canvas;
        var center = new Cesium.Cartesian2(
            canvas.clientWidth / 2,
            canvas.clientHeight / 2);
        return this.pickOnTerrainOrEllipsoid(scene, center);
    },

};

export { CesiumCamera };
