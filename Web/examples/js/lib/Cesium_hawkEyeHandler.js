var hawkEyeTool = function (option) {
    this._viewer=option.viewer
}
//获取鼠标经纬度
hawkEyeTool.prototype.init = function (hawkEyeDivId) {
    let _self=this;
    var eyeViewer = new Cesium.Viewer(hawkEyeDivId, {
        animation: false,
        baseLayerPicker: false,
        fullscreenButton: false,
        geocoder: false,
        homeButton: false,
        infoBox: false,
        selectionIndicator: false,
        timeline: false,
        sceneModePicker: false,
        shouldAnimate : true,
        navigationHelpButton: false,
    });
     eyeViewer._cesiumWidget._creditContainer.style.display = "none";
     let control =eyeViewer.scene.screenSpaceCameraController;
         control.enableRotate = false;
         control.enableTranslate = false;
         control.enableZoom = false;
         control.enableTilt = false;
         control.enableLook = false;

    let syncViewer = function() {
        eyeViewer.camera.flyTo({
            destination: _self._viewer.camera.position,
            orientation: {
                heading: _self._viewer.camera.heading,
                pitch: _self._viewer.camera.pitch,
                roll: _self._viewer.camera.roll
            },
            duration: 0.0
        });
    }
      //
    this._viewer.scene.preRender.addEventListener(syncViewer);
}

