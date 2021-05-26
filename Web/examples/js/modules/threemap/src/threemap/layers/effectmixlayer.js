import {TexColorLayerComposer} from '../../threemap/composer/layer/texcolorlayercomposer.js';
import {RenderLayer} from "./renderlayer.js";

function EffectMixLayer(threemap) {
    RenderLayer.call(this, threemap);

    this.renderTargetTemp = new Three.WebGLRenderTarget( threemap.map.painter.width, threemap.map.painter.height );
    this.renderTargetTemp.texture.format = Three.RGBAFormat;
    this.renderTargetTemp.texture.minFilter = Three.NearestFilter;
    this.renderTargetTemp.texture.magFilter = Three.NearestFilter;
    this.renderTargetTemp.texture.generateMipmaps = false;
    this.renderTargetTemp.stencilBuffer = true;
    this.renderTargetTemp.depthBuffer = true;
    this.renderTargetTemp.depthTexture = new Three.DepthTexture();
    this.renderTargetTemp.depthTexture.format = Three.DepthStencilFormat;
    this.renderTargetTemp.depthTexture.type = Three.UnsignedInt248Type;

    this.composer = new TexColorLayerComposer(this.threemap, this, this.renderTargetTemp.texture);
}

EffectMixLayer.prototype = Object.assign(Object.create(RenderLayer.prototype),{
    constructor: "EffectMixLayer",

    update: function () {
        this.updateObjects();

        if (this.appearance != null) {
            this.appearance.update();
        }
        this.threemap.renderer.setSize(this.threemap.map.painter.width, this.threemap.map.painter.height);
        this.threemap.renderer.render(this.scene, this.threemap.camera, this.renderTargetTemp, true);

        this.composer.setSize(this.threemap.map.painter.width, this.threemap.map.painter.height);
        this.composer.render();
    }

});

export { EffectMixLayer };

