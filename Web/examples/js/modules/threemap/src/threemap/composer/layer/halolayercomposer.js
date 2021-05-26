import {DefaultCopyShader} from "../../effects/copypass.js";
import {ClearColorPass} from "../../effects/clearcolorpass.js";
import {RenderTargetPass} from "../../effects/rendertargetpass.js";
import {HaloPulsePass} from "../../effects/halopulsepass";
import {PreAlphaCopyShader} from "../../effects/copypass";

function HaloLayerComposer  (threemap, layer) {

    this.renderTargetE = new Three.WebGLRenderTarget( threemap.map.painter.width, threemap.map.painter.height );
    this.renderTargetE.texture.format = Three.RGBAFormat;
    this.renderTargetE.texture.minFilter = Three.NearestFilter;
    this.renderTargetE.texture.magFilter = Three.NearestFilter;
    this.renderTargetE.texture.generateMipmaps = false;
    this.renderTargetE.stencilBuffer = true;
    this.renderTargetE.depthBuffer = true;
    this.renderTargetE.depthTexture = new Three.DepthTexture();
    this.renderTargetE.depthTexture.format = Three.DepthStencilFormat;
    this.renderTargetE.depthTexture.type = Three.UnsignedInt248Type;

    Three.EffectComposer.call(this, threemap.renderer, threemap.renderTargetE);

	this.clearPass = new ClearColorPass(0x000000, 0.0);
	this.addPass(this.clearPass);

    this.oldpulseMode = 0;
    this.haloPulsePass = new HaloPulsePass(threemap, threemap.renderTargetE, threemap.renderTargetFore.texture, threemap.renderTargetFore.depthTexture);
    this.addPass(this.haloPulsePass);

    //this.skeletonPulsePass = new SkeletonPulsePass(threemap, threemap.renderTargetE, threemap.renderTargetFore.texture, threemap.renderTargetFore.depthTexture, SkeletonPulseShader);
    //this.addPass(this.skeletonPulsePass);

    this.copyMaterial = new Three.ShaderMaterial( {
        vertexShader: PreAlphaCopyShader.vertexShader,
        fragmentShader: PreAlphaCopyShader.fragmentShader,
        depthTest: false,
        depthWrite: false,
        transparent: true,
        blendSrc: Three.OneFactor,
        blendDst: Three.OneMinusSrcAlphaFactor,
        uniforms: {
            tDiffuse: { value: null },
        }
    });
    this.renderTargetPass = new RenderTargetPass(threemap.renderTargetFore, this.copyMaterial);
    this.addPass(this.renderTargetPass);
};

HaloLayerComposer.prototype = Object.assign(Object.create(Three.EffectComposer.prototype),{
	constructor: "HaloLayerComposer",

} );

HaloLayerComposer.prototype.setPulseMode = function(mode) {

    if ( mode == this.oldpulseMode )
        return;
    else {
        this.haloPulsePass.setPulseMode(mode);
        this.oldpulseMode = mode;
    }

};

export { HaloLayerComposer };
