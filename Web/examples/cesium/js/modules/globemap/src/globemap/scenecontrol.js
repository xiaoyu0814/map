import {SceneMode} from "./scenemode";

function SceneControl(scene2D, scene3D) {
    this.scene2D = scene2D;
    this.scene2D.control = this;
    this.scene3D = scene3D;
    this.scene3D.control = this;

    this.isAutoSwitch = true;
    this.switchZoom = 4;
    this.sceneMode = SceneMode.Scene3D;
}

SceneControl.prototype = {

    switchTo: function (sceneMode) {
        if (sceneMode == SceneMode.Scene2D) {
            this.scene3D.show(false);
            this.scene2D.show(true);
            var param = this.scene3D.camera.computeParam();
            this.scene2D.camera.switchTo(param);
        } else if (sceneMode == SceneMode.Scene3D) {
            this.scene3D.show(true);
            this.scene2D.show(false);
            var param = this.scene2D.camera.computeParam();
            this.scene3D.camera.switchTo(param);
        }
        this.sceneMode = sceneMode;
    },

};

export { SceneControl };
