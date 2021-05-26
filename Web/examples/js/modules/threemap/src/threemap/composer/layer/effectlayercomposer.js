import {ClearColorPass} from "../../effects/clearcolorpass.js";
import { RenderTargetPass } from "../../effects/rendertargetpass.js";
import {DefaultCopyShader} from "../../effects/copypass.js";

function EffectLayerComposer  (threemap, layer) {
	Three.EffectComposer.call(this, threemap.renderer, threemap.renderTargetBack);

	this.clearPass = new ClearColorPass(0x000000, 0.0);
	this.addPass(this.clearPass);

	this.renderPass = new Three.RenderPass(layer.scene, threemap.camera);
	this.renderPass.clear = false;
	this.addPass(this.renderPass);

	this.effectFXAA = new Three.ShaderPass(Three.FXAAShader);
	this.effectFXAA.uniforms['resolution'].value.set(1 / threemap.map.painter.width, 1 / threemap.map.painter.height);
	this.addPass(this.effectFXAA);

	this.bloomPass = new Three.UnrealBloomPass(new Three.Vector2(threemap.map.painter.width, threemap.map.painter.height), 1.5, 0.4, 0.85);
	this.bloomPass.threshold = 0;
	this.bloomPass.strength = 0.6;
	this.bloomPass.radius = 0;
	this.addPass(this.bloomPass);

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
	this.addPass(this.renderTargetPass);

};

EffectLayerComposer.prototype = Object.assign(Object.create(Three.EffectComposer.prototype),{
	constructor: "EffectLayerComposer",

} );

export { EffectLayerComposer };
