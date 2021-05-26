import * as Three from  'three-full';

var DefaultCopyShader = {

	vertexShader:
		`
		varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
		}
		`,

	fragmentShader:
		`
		uniform float opacity;
		uniform sampler2D tDiffuse;
		varying vec2 vUv;
		void main() {
			vec4 texel = texture2D(tDiffuse, vUv);
			gl_FragColor = texel;
		}
		`
};


var PreAlphaCopyShader = {

	vertexShader:
		`
		varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
		}
		`,

	fragmentShader:
		`
		uniform float opacity;
		uniform sampler2D tDiffuse;
		varying vec2 vUv;
		void main() {
			vec4 texel = texture2D(tDiffuse, vUv);
			gl_FragColor.rgb = texel.a * texel.rgb;;
			gl_FragColor.a = texel.a;;
		}
		`
};


 function CopyPass( shader, textureID ) {

	Three.Pass.call( this );

	this.textureID = ( textureID !== undefined ) ? textureID : "tDiffuse";

	if ( shader instanceof Three.ShaderMaterial ) {

		this.uniforms = shader.uniforms;

		this.material = shader;

	} else if ( shader ) {

		this.uniforms = Three.UniformsUtils.clone( shader.uniforms );

		this.material = new Three.ShaderMaterial( {

			defines: Object.assign( {}, shader.defines ),
			uniforms: this.uniforms,
			vertexShader: shader.vertexShader,
			fragmentShader: shader.fragmentShader

		} );

	}

	this.camera = new Three.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
	this.scene = new Three.Scene();

	this.quad = new Three.Mesh( new Three.PlaneBufferGeometry( 2, 2 ), null );
	this.quad.frustumCulled = false; // Avoid getting clipped
	this.scene.add( this.quad );

};

CopyPass.prototype = Object.assign( Object.create( Three.Pass.prototype ), {

	constructor: CopyPass,

	render: function( renderer, writeBuffer, readBuffer, delta, maskActive ) {

		if ( this.uniforms[ this.textureID ] ) {

			this.uniforms[ this.textureID ].value = readBuffer.texture;

		}

		this.quad.material = this.material;

		if ( this.renderToScreen ) {

			renderer.render( this.scene, this.camera );

		} else {

			renderer.render( this.scene, this.camera, writeBuffer, this.clear );

		}

	}

} );

export { DefaultCopyShader,PreAlphaCopyShader,CopyPass };
