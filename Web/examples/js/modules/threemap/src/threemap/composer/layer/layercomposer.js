import {PreAlphaCopyShader} from '../../effects/copypass.js';
import {ClearColorPass} from '../../effects/clearcolorpass.js';
import {RenderTargetPass} from '../../effects/rendertargetpass.js';

function LayerComposer (threemap, layer) {
	Three.EffectComposer.call(this, threemap.renderer, threemap.renderTargetBack);

	this.clearPass = new ClearColorPass(0x000000, 0.0);
	this.addPass(this.clearPass);

	this.renderPass = new Three.RenderPass(layer.scene, threemap.camera);
	this.renderPass.clear = false;
	this.addPass(this.renderPass);

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

LayerComposer.prototype = Object.assign(Object.create(Three.EffectComposer.prototype),{
	constructor: "LayerComposer",

} );

export { LayerComposer };
