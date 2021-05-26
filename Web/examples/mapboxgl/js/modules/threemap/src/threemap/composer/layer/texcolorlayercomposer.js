import {DefaultCopyShader} from "../../effects/copypass.js";
import {ClearColorPass} from "../../effects/clearcolorpass.js";
import {RenderTargetPass} from "../../effects/rendertargetpass.js";
import {ColorDepthRegionShader, ColorDepthRegionPass} from "../../effects/colordepthregionspass";
import {PreAlphaCopyShader} from "../../effects/copypass";

function TexColorLayerComposer  (threemap, layer, colorTexture) {

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

    Three.EffectComposer.call(this, threemap.renderer, this.renderTargetE);

	this.clearPass = new ClearColorPass(0x000000, 0.0);
	this.addPass(this.clearPass);

    this.colordepthregionpass = new ColorDepthRegionPass(threemap, threemap.renderTargetE, colorTexture, threemap.renderTargetFore.depthTexture, ColorDepthRegionShader);
	this.addPass(this.colordepthregionpass);

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

TexColorLayerComposer.prototype = Object.assign(Object.create(Three.EffectComposer.prototype),{
	constructor: "TexColorLayerComposer",

} );

export { TexColorLayerComposer };
