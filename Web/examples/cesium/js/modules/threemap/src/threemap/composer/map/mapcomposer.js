
function MapComposer(threemap) {
	Three.EffectComposer.call(this, threemap.renderer);

	this.texturePass = new Three.TexturePass();
	this.texturePass.map = threemap.renderTargetFore.texture;
	this.texturePass.renderToScreen = true;
	this.addPass(this.texturePass);
};

MapComposer.prototype = Object.assign(Object.create(Three.EffectComposer.prototype),{
	constructor: "MapComposer",

} );

export { MapComposer };
