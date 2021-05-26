import * as Three from 'three-full';

function LayerAppearance(threemap, layer) {
	this.threemap = threemap;
	this.scene = layer.scene;
	this.group = layer.group;

	this.ambientLight = null;
	this.directionalLight = null;

};

Object.assign(LayerAppearance.prototype, {
	constructor: "LayerAppearance",

	initialize: function () {
		this.ambientLight = new Three.AmbientLight(0xCCCCCC);
		this.group.add(this.ambientLight);

		this.directionalLight = new Three.DirectionalLight(0xffffff, 0.5);
		this.directionalLight.position.set(500, -800, 900);
		this.directionalLight.matrixWorldNeedsUpdate = true;
		this.group.add(this.directionalLight);
	},

	unInitialize: function () {
		if (this.group != null) {
			if (this.ambientLight != null) {
				this.group.remove(this.ambientLight);
				this.ambientLight = null;
			}
			if (this.directionalLight != null) {
				this.group.remove(this.directionalLight);
				this.directionalLight = null;
			}
		}
	},

	update: function () {

	},

} );

export { LayerAppearance };
