import {LayerAppearance} from "./layerappearance.js";

function EnvMapLayerAppearance(threemap, layer, cubeCamera, cubeMesh) {
	LayerAppearance.call(this, threemap, layer);

	this._cubeCamera = cubeCamera;
	this._cubeMesh = cubeMesh;
	if (this._cubeMesh != null) {
		this.group.add(this._cubeMesh);
	}

	Object.defineProperties(this,{
		cubeCamera: {
			get: function() {
				return this._cubeCamera;
			},
			set: function(value) {
				this._cubeCamera = value;
			}
		},

		cubeMesh: {
			get: function() {
				return this._cubeMesh;
			},
			set: function(value) {
				if (this._cubeMesh != null) {
					this.group.remove(this._cubeMesh);
				}
				this._cubeMesh = value;
				if (this._cubeMesh != null) {
					this.group.add(this._cubeMesh);
				}
			}
		},
	})
};

EnvMapLayerAppearance.prototype = Object.assign(Object.create(LayerAppearance.prototype),{
	constructor: "EnvMapLayerAppearance",

	initialize: function () {
		LayerAppearance.prototype.initialize.call(this);
	},

	unInitialize: function () {
		LayerAppearance.prototype.unInitialize.call(this);

		if (this._cubeMesh != null) {
			this.group.remove(this._cubeMesh);
		}
	},

	update: function () {
		LayerAppearance.prototype.update.call(this);

		if (this._cubeCamera != null && this._cubeMesh != null && this.scene != null) {
			this._cubeMesh.visible = true;
			this._cubeCamera.update(this.threemap.renderer, this.scene);
			this._cubeMesh.visible = false;

			this.threemap.renderer.setRenderTarget(this.threemap.renderTargetFore);
		}

	},

} );

export { EnvMapLayerAppearance };
