import {CesiumCamera} from "./CesiumCamera";
import {SceneMode} from "./scenemode";

function CesiumScene(container, cesiumViewer) {
    this.control = null;
    this.container = container;
    this.camera = new CesiumCamera(cesiumViewer);

    var _this = this;
    this.viewerHandler = new Cesium.ScreenSpaceEventHandler(this.camera.viewer.scene.canvas);
    this.viewerHandler.setInputAction(function(wheelment) {
        _this.update();
    }, Cesium.ScreenSpaceEventType.WHEEL);

    this.camera.viewer.scene.camera.changed.addEventListener(function(){
        _this.update();
    });
    this.camera.viewer.scene.postRender.addEventListener(function(){
        _this.update();
    });
    this.update();
}

CesiumScene.prototype = {

    update: function () {
        if (this.control != null && this.control.isAutoSwitch && this.control.sceneMode == SceneMode.Scene3D) {
            var zoom = this.camera.computeZoom();
            if (zoom >= this.control.switchZoom) {
                this.control.switchTo(SceneMode.Scene2D);
            }
        }
    },

    show: function (visible) {
        this.camera.viewer.useDefaultRenderLoop = visible;
        if (visible) {
            this.getElement(this.container).style.visibility = "visible";
        } else {
            this.getElement(this.container).style.visibility = "hidden";
        }
    },

    getElement: function (element) {
        if (typeof element === 'string') {
            var foundElement = document.getElementById(element);
            if (foundElement === null) {
                throw new Error();
            }
            element = foundElement;
        }
        return element;
    },

};

export { CesiumScene };
