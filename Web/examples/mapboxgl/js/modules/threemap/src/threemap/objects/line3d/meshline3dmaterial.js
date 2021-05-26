
var MeshLine3DShader = {

	vertexShader:
		`
		attribute vec3 prev;
		attribute vec3 curr;
		attribute vec3 next;
		attribute float side;
		attribute float time;
		
		uniform vec2 resolution;
		uniform float lineWidth;
		uniform float near;
		uniform float far;
		uniform float sizeAttenuation;
		
		varying float vTime;
		
		vec4 transform(vec3 coord){
			return projectionMatrix * modelViewMatrix * vec4(coord, 1.0);
		}
		
		vec2 project(vec4 device){
			vec3 device_normal = device.xyz/device.w;
			vec2 clip_pos = (device_normal*0.5+0.5).xy;
			return clip_pos * resolution;
		}
		
		vec4 unproject(vec2 screen, float z, float w){
			vec2 clip_pos = screen/resolution;
			vec2 device_normal = clip_pos*2.0-1.0;
			return vec4(device_normal*w, z, w);
		}
		
		vec4 clipNear(vec4 p1, vec4 p2){
			float n = (p1.w - near) / (p1.w - p2.w);
			return vec4(mix(p1.xy, p2.xy, n), -near, near);
		}
		
		void main() {
			vTime = time;
		
			vec4 prevProj = transform(prev.xyz);
			vec4 currProj = transform(curr.xyz);
			vec4 nextProj = transform(next.xyz);
			if (currProj.w < 0.0) {
				if (prevProj.w < 0.0) {
					currProj = clipNear(currProj, nextProj);
				} else {
					currProj = clipNear(currProj, prevProj);
				}
			}
			vec2 prevScreen = project(prevProj);
			vec2 currScreen = project(currProj);
			vec2 nextScreen = project(nextProj);
			float expandWidth = side * lineWidth / 2.0;
			vec2 dir;
			if(abs(curr.x - prev.x) < 0.000001 && abs(curr.y - prev.y) < 0.000001){
				dir = normalize(nextScreen - currScreen);
			} else if(abs(curr.x - next.x) < 0.000001 && abs(curr.y - next.y) < 0.000001){
				dir = normalize(currScreen - prevScreen);
			} else {
				vec2 dirA = normalize(currScreen - prevScreen);
				vec2 dirB = normalize(nextScreen - currScreen);
				dir = normalize(dirA + dirB);
				float miter = 1.0 / max(dot(dir, dirA), 0.5);
				expandWidth *= miter;
			}
			dir = vec2(-dir.y, dir.x) * expandWidth;
			currScreen += dir;
			currProj = unproject(currScreen, currProj.z, currProj.w);
		
			gl_Position = currProj;
		
		}
		`,

	solidFragmentShader:
		`
		precision mediump float;

		uniform vec3 color;
		uniform float opacity;

		void main() {
		    gl_FragColor = vec4(color, opacity);
		}
		`,

	gradientCycleFragmentShader:
		`
		precision highp float;
		
		uniform vec3 color;
		uniform float opacity;

		uniform float currentTime;
		uniform float sycleTime;
		uniform float traceTime;
		
		varying float vTime;

		float CalculateAlpha() {
			float alpha = 0.0;
			float cycleCurrentTime = mod(currentTime, sycleTime);
			if (vTime > cycleCurrentTime) {
		 		alpha = 0.0;
			} else if (vTime < cycleCurrentTime - traceTime) {
				alpha = 0.0;
			} else {
				alpha = (traceTime - (cycleCurrentTime - vTime )) / traceTime;
				alpha = smoothstep(0.0, 0.8, alpha) * 1.25;
			}
			return alpha;
		}
		void main() {
			gl_FragColor = vec4(color, opacity);

			float alpha = CalculateAlpha();
			gl_FragColor.a *= alpha;
		}
		`,

	multiGradientCycleFragmentShader:
		`
		precision highp float;

		uniform vec3 color;
		uniform float opacity;

		uniform float currentTime;
		uniform float sycleTime;
		uniform float traceTime;

		varying float vTime;
		
		float CalculateAlpha() {
			float alpha = 0.0;
			float cycleCurrentTime = mod(vTime + currentTime, sycleTime);
			alpha = cycleCurrentTime / traceTime;
			alpha = 1.0 - alpha;
			return alpha;
		}

		void main() {
			gl_FragColor = vec4(color, opacity);

			float alpha = CalculateAlpha();
			gl_FragColor.a *= alpha;
		}
		`,

	multiSolidCycleFragmentShader:
		`
		precision highp float;

		uniform vec3 color;
		uniform float opacity;

		uniform float currentTime;
		uniform float sycleTime;
		uniform float traceTime;

		varying float vTime;
		
		float CalculateAlpha() {
			float alpha = 0.0;
			float cycleCurrentTime = mod(vTime + currentTime, sycleTime);
			alpha = step(0.5, cycleCurrentTime / traceTime);
			alpha = 1.0 - alpha;
			return alpha;
		}

		void main() {
			gl_FragColor = vec4(color, opacity);

			float alpha = CalculateAlpha();
			gl_FragColor.a *= alpha;
		}
		`,
};

var MeshLine3DxShader = {

	vertexShader:
		`
		attribute vec3 prev;
		attribute vec3 curr;
		attribute vec3 next;
		attribute float side;
		attribute float time;

		uniform vec2 resolution;
		uniform float lineWidth;
		uniform float near;
		uniform float far;
		uniform float sizeAttenuation;

		varying float vTime;

		vec2 fix( vec4 i, float aspect ) {
		    vec2 res = i.xy / i.w;
		    res.x *= aspect;
		    return res;
		}

		void main() {
			vTime = time;

		    float aspect = resolution.x / resolution.y;
			float pixelWidthRatio = 1. / (resolution.x * projectionMatrix[0][0]);	

		    mat4 m = projectionMatrix * modelViewMatrix;
		    vec4 finalPosition = m * vec4( curr, 1.0 );
		    vec4 prevPos = m * vec4( prev, 1.0 );
		    vec4 nextPos = m * vec4( next, 1.0 );

		    vec2 currentP = fix( finalPosition, aspect );
		    vec2 prevP = fix( prevPos, aspect );
		    vec2 nextP = fix( nextPos, aspect );

			float pixelWidth = finalPosition.w * pixelWidthRatio;
		    float w = 1.8 * pixelWidth * lineWidth;

		    if( sizeAttenuation == 1. ) {
		        w = 1.8 * lineWidth;
		    }

		    vec2 dir;
		    if( nextP == currentP )
		     	dir = normalize( currentP - prevP );
		    else if( prevP == currentP )
		     	dir = normalize( nextP - currentP );
		    else {
		        vec2 dir1 = normalize( currentP - prevP );
		        vec2 dir2 = normalize( nextP - currentP );
		        dir = normalize( dir1 + dir2 );

		        vec2 perp = vec2( -dir1.y, dir1.x );
		        vec2 miter = vec2( -dir.y, dir.x );
		        //w = clamp( w / dot( miter, perp ), 0., 4. * lineWidth );
		    }

		    //vec2 normal = ( cross( vec3( dir, 0. ), vec3( 0., 0., 1. ) ) ).xy;
		    vec2 normal = vec2( -dir.y, dir.x );
		    normal.x /= aspect;
		    normal *= .5 * w;

		    vec4 offset = vec4( normal * side, 0.0, 1.0 );
		    finalPosition.xy += offset.xy;

		    gl_Position = finalPosition;
		}
		`,

	solidFragmentShader:
		`
		precision mediump float;

		uniform vec3 color;
		uniform float opacity;

		void main() {
		    gl_FragColor = vec4(color, opacity);
		}
		`,

	gradientCycleFragmentShader:
		`
		precision highp float;
		
		uniform vec3 color;
		uniform float opacity;

		uniform float currentTime;
		uniform float sycleTime;
		uniform float traceTime;
		
		varying float vTime;

		float CalculateAlpha() {
			float alpha = 0.0;
			float cycleCurrentTime = mod(currentTime, sycleTime);
			if (vTime > cycleCurrentTime) {
		 		alpha = 0.0;
			} else if (vTime < cycleCurrentTime - traceTime) {
				alpha = 0.0;
			} else {
				alpha = (traceTime - (cycleCurrentTime - vTime )) / traceTime;
				alpha = smoothstep(0.0, 0.8, alpha) * 1.25;
			}
			return alpha;
		}
		
		void main() {
			gl_FragColor = vec4(color, opacity);

			float alpha = CalculateAlpha();
			gl_FragColor.a *= alpha;
		}
		`,

	multiGradientCycleFragmentShader:
		`
		precision highp float;

		uniform vec3 color;
		uniform float opacity;

		uniform float currentTime;
		uniform float sycleTime;
		uniform float traceTime;

		varying float vTime;
		
		float CalculateAlpha() {
			float alpha = 0.0;
			float cycleCurrentTime = mod(vTime + currentTime, sycleTime);
			alpha = cycleCurrentTime / traceTime;
			alpha = 1.0 - alpha;
			return alpha;
		}

		void main() {
			gl_FragColor = vec4(color, opacity);

			float alpha = CalculateAlpha();
			gl_FragColor.a *= alpha;
		}
		`,

	multiSolidCycleFragmentShader:
		`
		precision highp float;

		uniform vec3 color;
		uniform float opacity;

		uniform float currentTime;
		uniform float sycleTime;
		uniform float traceTime;

		varying float vTime;
		
		float CalculateAlpha() {
			float alpha = 0.0;
			float cycleCurrentTime = mod(vTime + currentTime, sycleTime);
			alpha = step(0.5, cycleCurrentTime / traceTime);
			alpha = 1.0 - alpha;
			return alpha;
		}

		void main() {
			gl_FragColor = vec4(color, opacity);

			float alpha = CalculateAlpha();
			gl_FragColor.a *= alpha;
		}
		`,
};


function MeshLine3DMaterial( parameters ) {

	function check( v, d ) {
		if( v === undefined ) return d;
		return v;
	}

	Three.ShaderMaterial.call( this, parameters );

	parameters = parameters || {};

	this.lineWidth = check( parameters.lineWidth, 1 );
	this.color = check( parameters.color, new Three.Color( 0xffffff ) );
	this.opacity = check( parameters.opacity, 1 );
	this.resolution = check( parameters.resolution, new Three.Vector2( 1, 1 ) );
	this.sizeAttenuation = check( parameters.sizeAttenuation, 1 );
	this.near = check( parameters.near, 1 );
	this.far = check( parameters.far, 1 );
	this.currentTime = check( parameters.currentTime, 0 );
	this.sycleTime = check( parameters.sycleTime, 60 );
	this.traceTime = check( parameters.traceTime, 10 );

	this.attributes = {
		prev: { type: 'v3', value: [] },
		curr: { type: 'v3', value: [] },
		next: { type: 'v3', value: [] },
		side: { type: 'f', value: [] },
		time: { type: 'f', value: [] }
	};
	this.uniforms = {
		lineWidth: { type: 'f', value: this.lineWidth },
		color: { type: 'c', value: this.color },
		opacity: { type: 'f', value: this.opacity },
		resolution: { type: 'v2', value: this.resolution },
		sizeAttenuation: { type: 'f', value: this.sizeAttenuation },
		near: { type: 'f', value: this.near },
		far: { type: 'f', value: this.far },
		currentTime: {type: 'f', value: this.currentTime},
		sycleTime: {type: 'f', value: this.sycleTime},
		traceTime: {type: 'f', value: this.traceTime}
	};
	this.vertexShader = check( parameters.vertexShader, MeshLine3DShader.vertexShader );
	this.fragmentShader = check( parameters.fragmentShader, MeshLine3DShader.gradientCycleFragmentShader );


	this.type = 'MeshLine3DMaterial';

	this.setValues( parameters );

};

MeshLine3DMaterial.prototype = Object.create( Three.ShaderMaterial.prototype );

MeshLine3DMaterial.prototype.clone = function ( ) {

	var material = new MeshLine3DMaterial();

	Three.ShaderMaterial.prototype.clone.call( this, material );

	material.lineWidth = this.lineWidth;
	material.color.copy( this.color );
	material.opacity = this.opacity;
	material.resolution.copy( this.resolution );
	material.sizeAttenuation = this.sizeAttenuation;
	material.near = this.near;
	material.far = this.far;
	material.currentTime = this.currentTime;
	material.sycleTime = this.sycleTime;
	material.traceTime = this.traceTime;

	return material;

};

export {MeshLine3DMaterial, MeshLine3DShader, MeshLine3DxShader};
