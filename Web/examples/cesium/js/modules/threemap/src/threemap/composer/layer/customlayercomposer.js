import {DefaultCopyShader} from "../../effects/copypass.js";
import {ClearColorPass} from "../../effects/clearcolorpass.js";
import {RenderTargetPass} from "../../effects/rendertargetpass.js";
import {HaloPulsePass} from "../../effects/halopulsepass";

function CustomLayerComposer  (threemap, layer) {
	Three.EffectComposer.call(this, threemap.renderer, threemap.renderTargetBack);

	this.clearPass = new ClearColorPass(0x000000, 0.0);
	this.addPass(this.clearPass);

    this.renderPass = new Three.RenderPass(layer.scene, threemap.camera);
	this.renderPass.clear = false;
	this.addPass(this.renderPass);


    this.bloomPass = new Three.UnrealBloomPass(new Three.Vector2(threemap.map.painter.width, threemap.map.painter.height), 1.5, 0.4, 0.85);
    this.bloomPass.threshold = -6.13;
    this.bloomPass.strength = 23.70;
    this.bloomPass.radius = 0.6;
	this.addPass(this.bloomPass);


    // radius: 0.6
    // strength: 29.70364098221846
    // threshold: -6.138865368331922

    this.haloPulsePass = new HaloPulsePass(threemap, threemap.renderTargetFore, threemap.renderTargetBack.texture, threemap.renderTargetBack.depthTexture);
	this.addPass(this.haloPulsePass);


	this.copyMaterial = new Three.ShaderMaterial( {
		vertexShader: DefaultCopyShader.vertexShader,
		fragmentShader: DefaultCopyShader.fragmentShader,
		depthTest: false,
		depthWrite: false,
		transparent: true,
		blending: Three.AdditiveBlending,
		uniforms: {
			tDiffuse: { value: null },
		}
	});
	this.renderTargetPass = new RenderTargetPass(threemap.renderTargetFore, this.copyMaterial);
	this.renderTargetPass.renderToScreen = true;
	//this.addPass(this.renderTargetPass);
};

CustomLayerComposer.prototype = Object.assign(Object.create(Three.EffectComposer.prototype),{
	constructor: "CustomLayerComposer",

} );

export { CustomLayerComposer };
