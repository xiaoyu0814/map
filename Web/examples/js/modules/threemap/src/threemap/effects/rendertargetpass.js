import * as Three from  'three-full';

 function RenderTargetPass( renderTarget, material ) {

	Three.Pass.call( this );

	this.textureID = "tDiffuse";
	this.material = material;
	this.renderTarget = renderTarget;

	this.needsSwap = false;

	this.camera = new Three.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
	this.scene = new Three.Scene();

	this.quad = new Three.Mesh( new Three.PlaneBufferGeometry( 2, 2 ), null );
	this.quad.frustumCulled = false; // Avoid getting clipped
	this.scene.add( this.quad );

};

RenderTargetPass.prototype = Object.assign( Object.create( Three.Pass.prototype ), {

	constructor: RenderTargetPass,

	render: function ( renderer, writeBuffer, readBuffer ) {

		if ( this.material.uniforms[ this.textureID ] ) {

			this.material.uniforms[ this.textureID ].value = readBuffer.texture;

		}

		this.quad.material = this.material;

		renderer.render( this.scene, this.camera, this.renderTarget, this.clear );

	}

} );

export { RenderTargetPass };
