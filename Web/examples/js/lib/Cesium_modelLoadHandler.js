var ModeLoadHandler = function (option) {
    this._viewer = option.viewer
    this._scene = this._viewer.scene
    this._handler = new Cesium.ScreenSpaceEventHandler(this._viewer.canvas)
}

//加载实体数据
ModeLoadHandler.prototype.loadEntity = function (url,position) {
    var entity = this._viewer.entities.add({
        //name: url,
        position: position,
        model: {
            uri: url,
        },
    });
    return entity;
}

//加载3D切片数据
ModeLoadHandler.prototype.load3DTiles = function (url) {
    var tileset = new Cesium.Cesium3DTileset({
        url: url,
    });
    this._viewer.scene.primitives.add(tileset);
    return tileset;
}

ModeLoadHandler.prototype.loadGltfMode=function (obj) {
    var _self=this;

    var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(obj.origin);

    var model =Cesium.Model.fromGltf({
        url :obj.url,
        show : true,                     // default
        modelMatrix : modelMatrix,
        scale : 200,                     // double size
        minimumPixelSize : 128,          // never smaller than 128 pixels
        maximumScale: 20000,             // never larger than 20000 * model size (overrides minimumPixelSize)
        allowPicking : false,            // not pickable
        debugShowBoundingVolume : false, // default
        debugWireframe : false
    });
    Cesium.when(model.readyPromise).then(function (m) {
        // Play all animations when the model is ready to render
        m.activeAnimations.addAll();
        // Zoom to model
        var controller = _self._viewer.scene.screenSpaceCameraController;
        var r = 0;
        var center = new Cesium.Cartesian3();
        var hpRange = new Cesium.HeadingPitchRange();
         r = 2.0 * Math.max(m.boundingSphere.radius, _self._viewer.camera.frustum.near);
        controller.minimumZoomDistance = r * 0.5;
        Cesium.Matrix4.multiplyByPoint(
            m.modelMatrix,
            m.boundingSphere.center,
            center
        );

        hpRange.heading = obj.heading;
        hpRange.pitch = obj.pitch;
        hpRange.range = r * obj.coefficient;
        _self._viewer.camera.lookAt(center, hpRange);
    });
    this._scene.primitives.add(model);
},

// 飞到目的地
ModeLoadHandler.prototype.flyTo = function (destination, head, pitch, roll, duration, call) {
    var _self = this
    _self._viewer.camera.flyTo({
        destination: destination, // Cartesian3 | Rectangle
        orientation: {
            heading: head,
            pitch: pitch,
            roll: roll
        },
        duration: duration,
        complete: function () {
            if (call) {
                call()
            }
        }

    })
}
//直接定位目的地
ModeLoadHandler.prototype.setView = function (destination, head, pitch, roll) {
    var _self = this
    this._viewer.scene.camera.setView({
        destination: destination,
        orientation:{
            heading : Cesium.Math.toRadians(head), // east, default value is 0.0 (north)
            pitch : Cesium.Math.toRadians(pitch),    // default value (looking down)
            roll : Cesium.Math.toRadians(roll)                          // default value
        },
    });
}
