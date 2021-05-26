import * as Three from  'three-full';

var ColorDepthRegionShader = {

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
		#include <packing>

        varying vec2 vUv;
        uniform sampler2D tDiffuse;
        uniform sampler2D tDepth;
        uniform vec2 vCenter;
        uniform mat4 viewProjectionInverseMatrix;
        uniform mat4 projectionViewMatrix;

        vec3 getWorldPosition(vec2 uv) {
            float zOverW = texture2D(tDepth, uv).r;
            vec4 H = vec4(uv.x * 2. - 1., uv.y * 2. - 1., zOverW * 2. - 1., 1.);
            vec4 D = viewProjectionInverseMatrix * H;
            vec3 worldPos = D.xyz / D.w;
            return worldPos;
        }

        void main() {
            vec3 worldPos = getWorldPosition(vUv);
            if ( worldPos.z < 1.0 )
                discard;
            vec3 newPos = vec3(worldPos.x, worldPos.y, 0.0);
            vec4 PrjCoord = projectionViewMatrix * vec4(newPos, 1.0);
            vec2 final = PrjCoord.xy / PrjCoord.w;
            final = (final + vec2(1.0, 1.0))*0.5;
            vec4 diffuse = texture2D(tDiffuse, final);
            if ( diffuse.a < 0.01 )
                discard;
            gl_FragColor = diffuse;
    	}
		`
};

 function ColorDepthRegionPass( threemap, renderTarget, colorTexture, depthTexture, shader ) {

	Three.Pass.call( this );

	this.threemap = threemap;
	this.renderTarget = renderTarget;
	this.vCenter = new Three.Vector2(116.39078972717584, 39.91545554293933);

	this.material = new Three.ShaderMaterial( {
		vertexShader: shader.vertexShader,
		fragmentShader: shader.fragmentShader,
        depthTest: false,
        depthWrite: false,
        transparent: true,
		blending: Three.AdditiveBlending,
		uniforms: {
			vCenter: { value: new Three.Vector2(0, 0) },
			tDiffuse:   { value: colorTexture },
			tDepth:     { value: depthTexture },
			viewProjectionInverseMatrix:     { value: new Three.Matrix4() },
            projectionViewMatrix:     { value: new Three.Matrix4() },
		}
	});

	this.camera = new Three.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
	this.scene = new Three.Scene();

	this.quad = new Three.Mesh( new Three.PlaneBufferGeometry( 2, 2 ), this.material );
	this.quad.frustumCulled = false; // Avoid getting clipped
	this.scene.add( this.quad );

};

ColorDepthRegionPass.prototype = Object.assign( Object.create( Three.Pass.prototype ), {

	constructor: ColorDepthRegionPass,

	render: function( renderer, writeBuffer, readBuffer, delta, maskActive ) {

		this.quad.material = this.material;

		var projectionMatrixMap = this.threemap.map.transform.projectionMatrix;
		var viewMatrixMap = this.threemap.map.transform.viewMatrix;

		var viewMatrix = new Three.Matrix4();
		viewMatrix.elements = viewMatrixMap;

		var projectionMatrix = new Three.Matrix4();
		projectionMatrix.elements = projectionMatrixMap;

		var spritePosition = new Three.Vector3();
		var spriteRotation = new Three.Quaternion();
		var spriteScale = new Three.Vector3();
		viewMatrix.decompose( spritePosition, spriteRotation, spriteScale );

		var viewProjectionMatrix = new Three.Matrix4();
		viewProjectionMatrix.copy(projectionMatrix);
		viewProjectionMatrix.multiply(viewMatrix);

		var viewProjectionInverseMatrix = new Three.Matrix4();
		viewProjectionInverseMatrix.getInverse(viewProjectionMatrix);

		var vCenter = this.threemap.map.transform.project({ lng: this.vCenter.x, lat: this.vCenter.y}, 0);
        vCenter.x = vCenter.x - this.threemap.map.transform.point.x;
        vCenter.y = vCenter.y - this.threemap.map.transform.point.y;

		this.material.uniforms[ 'vCenter' ].value = vCenter;
		this.material.uniforms.viewProjectionInverseMatrix.value.copy(viewProjectionInverseMatrix);
        this.material.uniforms.projectionViewMatrix.value.copy(viewProjectionMatrix);
		this.material.needsUpdate = true;

		if ( this.renderToScreen ) {

			renderer.render( this.scene, this.camera );

		} else {

			if (this.renderTarget != null) {

				renderer.render( this.scene, this.camera, this.renderTarget, this.clear );

			} else {
				renderer.render( this.scene, this.camera, writeBuffer, this.clear );
			}

		}

	}

} );

export { ColorDepthRegionShader, ColorDepthRegionPass };
