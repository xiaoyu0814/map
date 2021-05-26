import * as Three from 'three-full';
import {LayerAppearance} from "./appearance/layerappearance.js";

function RenderLayer(threemap) {
    this.threemap = threemap;

    this.scene = new Three.Scene();
    this.group = new Three.Group();
    this.group.matrixAutoUpdate = false;
    this.scene.add(this.group);

    this._appearance = new LayerAppearance(threemap, this);
    this._appearance.initialize();

    Object.defineProperties(this,{
        appearance: {
            get: function() {
                return this._appearance;
            },
            set: function(value) {
                if (this._appearance != null) {
                    this._appearance.unInitialize();
                }
                this._appearance = value;
                if (this._appearance != null) {
                    this._appearance.initialize();
                }
            }
        },
    })
}

Object.assign(RenderLayer.prototype, {
    constructor: "RenderLayer",

    addObject: function(obj, lnglat, options) {
        var group = this.threemap.createGeoGroup(lnglat, options);
        if (group != null) {
            group.add(obj);
            this.group.add(group);

            if (obj.attachLayer != null) {
                obj.attachLayer(this);
            }
        }
        return obj;
    },

    removeObject: function(obj) {
        if (obj != null) {
            if("detachLayer" in obj){
                obj.detachLayer();

            }
            var parent = obj.parent;
            if (parent != null) {
                this.group.remove(parent);
            }
        }
    },

    initialize: function () {

    },

    unInitialize: function () {

    },

    notify: function () {
        this.group.matrix = this.threemap.cameraSynchronizer.cameraMatrix;

        this.notifyObjects();
    },

    update: function () {
        this.updateObjects();
        console.log("................");
        if (this.appearance != null) {
            this.appearance.update();
        }

        this.threemap.renderer.setSize(this.threemap.map.painter.width, this.threemap.map.painter.height);
        this.threemap.renderer.render(this.scene, this.threemap.camera, this.threemap.renderTargetFore, false);
    },

    notifyObjects: function () {
        for (var i = 0; i < this.group.children.length; i++) {
            var group = this.group.children[i];
            if (group.isGroup) {
                for (var j = 0; j < group.children.length; j++) {
                    var child = group.children[j];
                    if (child.notify != null) {
                        child.notify();
                    }
                }
            }
        }
    },

    updateObjects: function () {
        for (var i = 0; i < this.group.children.length; i++) {
            var group = this.group.children[i];
            if (group.isGroup) {
                for (var j = 0; j < group.children.length; j++) {
                    var child = group.children[j];
                    if (child.update != null) {
                        child.update();
                    }
                }
            }
        }
    },

});

export { RenderLayer };

