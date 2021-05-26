
var MeshLineShader = {

	vertexShader:
		`
		attribute vec3 prev;
		attribute vec3 curr;
		attribute vec3 next;
		attribute vec3 side;
		attribute float time;
		
		uniform float dimension;
		uniform float lineWidth;
		uniform vec2 resolution;
		uniform float near;
		uniform float far;
		
		varying float vTime;
		varying vec2 vCornerOffset;
		
		const float EPSILON = 0.001;
		
		vec2 lineJoin(vec2 prev, vec2 curr, vec2 next, vec3 side)
		{
			float vSideX = side.x;
			float vSideY = side.y;
			float vRole = side.z;
		
			vec2 deltaA = curr.xy - prev.xy;
			vec2 deltaB = next.xy - curr.xy;
		
			float lenA = length(deltaA);
			float lenB = length(deltaB);
			lenA = lenA > lineWidth ? lenA : 0.0;
			lenB = lenB > lineWidth ? lenB : 0.0;
		
			vec2 dirA = normalize(deltaA);
			vec2 dirB = normalize(deltaB);
			dirA = lenA > 0.0 ? dirA : dirB;
			dirB = lenB > 0.0 ? dirB : dirA;
		
			vec2 perpA = vec2(-dirA.y, dirA.x);
			vec2 perpB = vec2(-dirB.y, dirB.x);
		
			bool turnsRight = dirA.x * dirB.y < dirA.y * dirB.x;
			vec2 tangent = vec2(dirA.x + dirB.x, dirA.y + dirB.y);
			tangent = length(tangent) > 0.0 ? tangent : perpA;
			vec2 miter = normalize(vec2(tangent.y, -tangent.x));
			if (turnsRight) {
				miter = normalize(vec2(-tangent.y, tangent.x));
			}
		
			vec2 dir = (vSideX == 0.0 || vSideX == 1.0) ? dirB : dirA;
			vec2 perp = (vSideX == 0.0 || vSideX == 1.0) ? perpB : perpA;
		
			float sinHalfA = abs(dot(miter, perp));
			float cosHalfA = abs(dot(dirA, miter));
			float offsetWidth = lineWidth * 0.5;
			float miterWidth = offsetWidth * (1.0 / max(sinHalfA, EPSILON));
			float dirWidth = miterWidth * (max(cosHalfA, EPSILON));
			//float dirWidth = sqrt(abs(miterWidth * miterWidth - offsetWidth * offsetWidth));
		
			vec2 offset = vec2(0.0, 0.0);
			if (vRole == 1.0) {
				offset += (miter * miterWidth);
			} else {
				offset += (perp * offsetWidth * vSideY);
				offset += (dir * dirWidth * vSideX);
			}
		
			vCornerOffset = miter * miterWidth + offset;
		
			return vec2(curr.xy + offset);
		}
		
		vec4 transform(vec3 coord)
		{
			return projectionMatrix * modelViewMatrix * vec4(coord, 1.0);
		}
		
		vec2 project(vec4 device)
		{
			vec3 device_normal = device.xyz / device.w;
			vec2 clip_pos = (device_normal * 0.5 + 0.5).xy;
			return clip_pos * resolution;
		}
		
		vec4 unproject(vec2 screen, float z, float w)
		{
			vec2 clip_pos = screen / resolution;
			vec2 device_normal = clip_pos * 2.0 - 1.0;
			return vec4(device_normal * w, z, w);
		}
		
		vec4 clipNear(vec4 p1, vec4 p2)
		{
			float n = (p1.w - near) / (p1.w - p2.w);
			return vec4(mix(p1.xy, p2.xy, n), -near, near);
		}
		
		void main() {
			vTime = time;
		
			if (dimension > 2.0) {
				vec4 prevProj = transform(prev.xyz);
				vec4 currProj = transform(curr.xyz);
				vec4 nextProj = transform(next.xyz);
				vec2 prevScreen = project(prevProj);
				vec2 currScreen = project(currProj);
				vec2 nextScreen = project(nextProj);
				vec2 pos = lineJoin(prevScreen, currScreen, nextScreen, side);
				gl_Position = unproject(pos, currProj.z, currProj.w);
			} else {
				vec2 pos = lineJoin(prev.xy, curr.xy, next.xy, side);
				gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 0.0, 1.0);	
			}
		}
		`,

	solidFragmentShader:
		`
		precision highp float;
		
		uniform float lineWidth;
		uniform vec3 color;
		uniform float opacity;
		
		varying float vTime;
		varying vec2 vCornerOffset;
		
		void main() {
		
			if (lineWidth < length(vCornerOffset)) {
				discard;
			}
		
			gl_FragColor = vec4(color, opacity);
		}
		`,

	gradientCycleFragmentShader:
		`
		precision highp float;
		
		uniform float lineWidth;
		uniform vec3 color;
		uniform float opacity;

		uniform float currentTime;
		uniform float sycleTime;
		uniform float traceTime;
		
		varying float vTime;
		varying vec2 vCornerOffset;

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
		
			if (lineWidth < length(vCornerOffset)) {
				discard;
			}
		
			gl_FragColor = vec4(color, opacity);

			float alpha = CalculateAlpha();
			gl_FragColor.a *= alpha;
		}
		`,

	multiGradientCycleFragmentShader:
		`
		precision highp float;

		uniform float lineWidth;
		uniform vec3 color;
		uniform float opacity;

		uniform float currentTime;
		uniform float sycleTime;
		uniform float traceTime;

		varying float vTime;
		varying vec2 vCornerOffset;
		
		float CalculateAlpha() {
			float alpha = 0.0;
			float cycleCurrentTime = mod(vTime + currentTime, sycleTime);
			alpha = cycleCurrentTime / traceTime;
			alpha = 1.0 - alpha;
			return alpha;
		}

		void main() {

			if (lineWidth < length(vCornerOffset)) {
				discard;
			}

			gl_FragColor = vec4(color, opacity);

			float alpha = CalculateAlpha();
			gl_FragColor.a *= alpha;
		}
		`,

	multiSolidCycleFragmentShader:
		`
		precision highp float;

		uniform float lineWidth;
		uniform vec3 color;
		uniform float opacity;

		uniform float currentTime;
		uniform float sycleTime;
		uniform float traceTime;

		varying float vTime;
		varying vec2 vCornerOffset;
		
		float CalculateAlpha() {
			float alpha = 0.0;
			float cycleCurrentTime = mod(vTime + currentTime, sycleTime);
			alpha = step(0.5, cycleCurrentTime / traceTime);
			alpha = 1.0 - alpha;
			return alpha;
		}

		void main() {

			if (lineWidth < length(vCornerOffset)) {
				discard;
			}

			gl_FragColor = vec4(color, opacity);

			float alpha = CalculateAlpha();
			gl_FragColor.a *= alpha;
		}
		`,

};


function MeshLineMaterial( parameters ) {

	function check( v, d ) {
		if( v === undefined ) return d;
		return v;
	}

	Three.ShaderMaterial.call( this, parameters );

	parameters = parameters || {};

	this.dimension = check( parameters.dimension, 2 );
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
		side: { type: 'v3', value: [] },
		time: { type: 'f', value: [] }
	};
	this.uniforms = {
		dimension: { type: 'f', value: this.dimension },
		lineWidth: { type: 'f', value: this.lineWidth },
		color: { type: 'c', value: this.color },
		opacity: { type: 'f', value: this.opacity },
		resolution: { type: 'v2', value: this.resolution },
		sizeAttenuation: { type: 'f', value: this.sizeAttenuation },
		near: { type: 'f', value: this.near },
		far: { type: 'f', value: this.far },
		currentTime: { type: 'f', value: this.currentTime },
		sycleTime: { type: 'f', value: this.sycleTime },
		traceTime: { type: 'f', value: this.traceTime }
	};
	this.vertexShader = check( parameters.vertexShader, MeshLineShader.vertexShader );
	this.fragmentShader = check( parameters.fragmentShader, MeshLineShader.gradientCycleFragmentShader );

	this.type = 'MeshLineMaterial';

	this.setValues( parameters );

};

MeshLineMaterial.prototype = Object.create( Three.ShaderMaterial.prototype );

MeshLineMaterial.prototype.clone = function ( ) {

	var material = new MeshLineMaterial();
	Three.ShaderMaterial.prototype.clone.call( this, material );

	material.dimension = this.dimension;
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

export {MeshLineMaterial, MeshLineShader};
