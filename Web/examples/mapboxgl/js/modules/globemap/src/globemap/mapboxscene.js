import {MapboxCamera} from "./MapboxCamera";
import {SceneMode} from "./scenemode";

function MapboxScene(container, map) {
    this.control = null;
    this.container = container;
    this.camera = new MapboxCamera(map);

    var _this = this;
    this.camera.map.on('postMapRender', function() {
        if (_this.control != null && _this.control.isAutoSwitch && _this.control.sceneMode == SceneMode.Scene2D) {
            _this.update();
        }
    });
    this.update();
}

MapboxScene.prototype = {

    update: function () {
        if (this.control != null && this.control.isAutoSwitch && this.control.sceneMode == SceneMode.Scene2D) {
            var zoom = this.camera.computeZoom();
            if (zoom < this.control.switchZoom) {
                this.control.switchTo(SceneMode.Scene3D);
            }
        }
    },

    show: function (visible) {
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

export { MapboxScene };
