import  * as Three from  'three-full';

 function ClearColorPass( clearColor, clearAlpha ) {

	Three.Pass.call( this );

	this.needsSwap = false;

	this.clearColor = ( clearColor !== undefined ) ? clearColor : 0x000000;
	this.clearAlpha = ( clearAlpha !== undefined ) ? clearAlpha : 0;

};

ClearColorPass.prototype = Object.assign( Object.create( Three.Pass.prototype ), {

	constructor: ClearColorPass,

	render: function ( renderer, writeBuffer, readBuffer, delta, maskActive ) {

		var oldClearColor = renderer.getClearColor().getHex();
		var oldClearAlpha = renderer.getClearAlpha();
		renderer.setClearColor( this.clearColor, this.clearAlpha );

		renderer.setRenderTarget( this.renderToScreen ? null : readBuffer );
		renderer.clear(true, false, false);

		renderer.setClearColor( oldClearColor, oldClearAlpha );

	}

} );

export  { ClearColorPass };
