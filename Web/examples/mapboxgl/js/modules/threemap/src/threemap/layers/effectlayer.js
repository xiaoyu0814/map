import {LayerComposer} from '../../threemap/composer/layer/layercomposer.js';
import {RenderLayer} from "./renderlayer.js";

function EffectLayer(threemap) {
    RenderLayer.call(this, threemap);

    this.composer = new LayerComposer(this.threemap, this);
}

EffectLayer.prototype = Object.assign(Object.create(RenderLayer.prototype),{
    constructor: "EffectLayer",

    update: function () {
        this.updateObjects();

        if (this.appearance != null) {
            this.appearance.update();
        }

        this.composer.setSize(this.threemap.map.painter.width, this.threemap.map.painter.height);
        this.composer.render();
    }

});

export { EffectLayer };

