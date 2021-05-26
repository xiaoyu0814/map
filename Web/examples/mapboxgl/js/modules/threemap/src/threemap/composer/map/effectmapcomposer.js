import {HaloPulsePass} from "../../effects/halopulsepass";

function EffectMapComposer(threemap) {
	Three.EffectComposer.call(this, threemap.renderer);

	this.haloPulsePass = new HaloPulsePass(threemap, null, threemap.renderTargetFore.texture, threemap.renderTargetFore.depthTexture);
	this.haloPulsePass.renderToScreen = false;
	this.addPass(this.haloPulsePass);

	this.effectFXAA = new Three.ShaderPass(Three.FXAAShader);
	this.effectFXAA.uniforms['resolution'].value.set(1 / threemap.map.painter.width, 1 / threemap.map.painter.height);
	this.effectFXAA.renderToScreen = true;
	this.addPass(this.effectFXAA);
};

EffectMapComposer.prototype = Object.assign(Object.create(Three.EffectComposer.prototype),{
	constructor: "EffectMapComposer",

} );

export { EffectMapComposer }
