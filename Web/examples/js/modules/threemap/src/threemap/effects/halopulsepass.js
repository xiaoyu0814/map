import * as Three from  'three-full';

var DefaultHaloPulseShader = {

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
        uniform float cameraNear;
        uniform float cameraFar;
        uniform float ringRadius;
        uniform float ringThickness;
        uniform vec2 ringCenter;
        uniform vec4 ringColor;
        uniform mat4 viewProjectionInverseMatrix;

        vec3 getWorldPosition(vec2 uv) {
            float zOverW = texture2D(tDepth, uv).r;
            vec4 H = vec4(uv.x * 2. - 1., uv.y * 2. - 1., zOverW * 2. - 1., 1.);
            vec4 D = viewProjectionInverseMatrix * H;
            vec3 worldPos = D.xyz / D.w;
            return worldPos;
        }

        void main() {
            vec3 worldPos = getWorldPosition(vUv);
        	//vec3 centerPos = getWorldPosition(vec2(0.5, 0.5));
        	//vec3 centerPos = vec3(0.0, 0.0, 0.0);
            vec3 centerPos = vec3(ringCenter.x, ringCenter.y, 0.0);
            float dist = length(worldPos.xyz - centerPos.xyz);

            vec3 diffuse = texture2D(tDiffuse, vUv).rgb;
        	//if (dist > (ringRadius - ringThickness) && dist < (ringRadius + ringThickness)) {
        		//diffuse = ringColor.rgb;
			//}
            if (dist > (ringRadius - ringThickness) && dist < ringRadius) {
            	float alpha = 0.3 * (1.0 - (ringRadius - dist) / ringThickness);
            	vec4 diffuseColor = mix(vec4(diffuse, 1.0), ringColor, alpha);
            	diffuse = diffuseColor.rgb;
        	}

        	gl_FragColor.rgb = diffuse;
        	gl_FragColor.a = 1.0;
    	}
		`
};

var SkeletonPulseShader = {

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
        uniform float cameraNear;
        uniform float cameraFar;
        uniform float ringMode;
        uniform float ringRadius;
        uniform float ringThickness;
        uniform vec2 ringCenter;
        uniform vec4 ringColor;
        uniform mat4 viewProjectionInverseMatrix;

        vec3 getWorldPosition(vec2 uv) {
            float zOverW = texture2D(tDepth, uv).r;
            vec4 H = vec4(uv.x * 2. - 1., uv.y * 2. - 1., zOverW * 2. - 1., 1.);
            vec4 D = viewProjectionInverseMatrix * H;
            vec3 worldPos = D.xyz / D.w;
            return worldPos;
        }

        void main() {
             vec3 worldPos = getWorldPosition(vUv);
             vec4 dc = texture2D(tDiffuse, vUv);
             vec3 diffuse = dc.rgb;
             float alpha = 1.0;
   
             if ( worldPos.z > 1.0 )
             {
                 vec3 centerPos = vec3(ringCenter.x, ringCenter.y, 0.0);
                 float dist = length(worldPos.xyz - centerPos.xyz);
                 if (dist > (ringRadius - ringThickness) && dist < ringRadius) {
                     float factor = 0.3 * (1.0 - (ringRadius - dist) / ringThickness);
                     vec4 diffuseColor = ringColor;
                     float fMode = ringMode; 
                     if ( fMode < 0.5 ) 
                     {
                         vec3 colorx_1y = texture2D(tDiffuse, vec2(vUv.x-0.0016, vUv.y)).rgb;
                         vec3 colorxy_1 = texture2D(tDiffuse, vec2(vUv.x, vUv.y-0.0016)).rgb;
                         float xyv = length(diffuse);
                         float xGrad = xyv - length(colorx_1y);
                         float yGrad = xyv - length(colorxy_1);
                         float mag = sqrt( pow(xGrad, 2.0) + pow(yGrad, 2.0) );
                         if ( mag > 0.9 ){
                             alpha = mag/sqrt(6.0);
                             diffuse = diffuseColor.rgb;
                             alpha = 1.0;
                         }
                         else{
                             diffuse = vec3(0.0,0.0,0.2);
                             alpha = 1.0;
                         }
                     }
                     else {
                        vec3 colorbr = texture2D(tDiffuse, vec2(vUv.x+0.0026, vUv.y+0.0026)).rgb;
                        vec3 newclr = vec3(dc.r - colorbr.r+0.5, dc.g - colorbr.g+0.5, dc.b - colorbr.b+0.5); 
                        diffuse = newclr;
                        alpha = 1.0;
                    }
                }
            }
            gl_FragColor.rgb = diffuse;
            gl_FragColor.a = alpha;
    	}
		`
};

 function HaloPulsePass( threemap, renderTarget, colorTexture, depthTexture ) {

	Three.Pass.call( this );

	this.threemap = threemap;
	this.renderTarget = renderTarget;
	this.ringRadius = 0;
	this.ringCenter = new Three.Vector2(116.39078972717584, 39.91545554293933);
	this.ringColor = new Three.Vector4(1, 1, 0, 1);
	//var worldSize =  threemap.map.transform.worldSize;
	//this.worldSize = worldSize;
	this.ringRange = 1000;

	this.ringStep = 100;

	this.material = new Three.ShaderMaterial( {
		vertexShader: DefaultHaloPulseShader.vertexShader,
		fragmentShader: DefaultHaloPulseShader.fragmentShader,
		depthTest: false,
		depthWrite: false,
		//transparent: true,
		//blending: Three.AdditiveBlending,
		uniforms: {
			cameraNear: { value: this.threemap.camera.near },
			cameraFar:  { value: this.threemap.camera.far },
			ringRadius:  { value: 0 },
			ringThickness: { value: 180.0 },
			ringCenter: { value: new Three.Vector2(0, 0) },
			ringColor: { value: new Three.Vector4(1, 1, 1, 1) },
			tDiffuse:   { value: colorTexture },
			tDepth:     { value: depthTexture },
			viewProjectionInverseMatrix:     { value: new Three.Matrix4() },
		}
	});

     this.material1 = new Three.ShaderMaterial( {
         vertexShader: SkeletonPulseShader.vertexShader,
         fragmentShader: SkeletonPulseShader.fragmentShader,
         depthTest: false,
         depthWrite: false,
         //transparent: true,
         //blending: Three.AdditiveBlending,
         uniforms: {
             cameraNear: { value: this.threemap.camera.near },
             cameraFar:  { value: this.threemap.camera.far },
             ringMode:   {value:0, type:'f'},
             ringRadius:  { value: 0 },
             ringThickness: { value: 180.0 },
             ringCenter: { value: new Three.Vector2(0, 0) },
             ringColor: { value: new Three.Vector4(1, 1, 1, 1) },
             tDiffuse:   { value: colorTexture },
             tDepth:     { value: depthTexture },
             viewProjectionInverseMatrix:     { value: new Three.Matrix4() },
         }
     });

	this.camera = new Three.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
	this.scene = new Three.Scene();

	this.quad = new Three.Mesh( new Three.PlaneBufferGeometry( 2, 2 ), null );
	this.quad.frustumCulled = false; // Avoid getting clipped
    this.quad.material = this.material;
    this.pulseMode = 0;

    this.scene.add( this.quad );

};

HaloPulsePass.prototype = Object.assign( Object.create( Three.Pass.prototype ), {

	constructor: HaloPulsePass,

	render: function( renderer, writeBuffer, readBuffer, delta, maskActive ) {

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

		var ringCenter = this.threemap.map.transform.project({ lng: this.ringCenter.x, lat: this.ringCenter.y}, 0);
		ringCenter.x = ringCenter.x - this.threemap.map.transform.point.x;
		ringCenter.y = ringCenter.y - this.threemap.map.transform.point.y;

        var worldSize  = this.threemap.map.transform.worldSize;

        const circumference = 2 * Math.PI * 6378137;
        const meterPerWorldunit =  circumference / worldSize; //ÿ���������굥λ����ľ��루����Ϊ��λ��

        var stepMeter =this.ringRange/this.ringStep;
        var stepWorldunit = stepMeter/meterPerWorldunit;
        if(stepWorldunit>stepMeter){  //�Ŵ���ٶ�Ҳ����̫����
            stepWorldunit = stepMeter;
		}

        var range = this.ringRange ;
        var radius = this.ringRadius * meterPerWorldunit ;  //��ǰ�뾶�ľ��룺�������굥λ��*ÿ���������굥λ����ľ���

        radius +=  stepMeter;
        this.ringRadius  += stepWorldunit; //��ǰ�뾶�ľ��룺�������굥λ��

		if(this.ringStep>0){  //��ɢ��Ȧ
            if (radius > range) {
                radius = 0;
                this.ringRadius = 0;
            }
        }
        else if(this.ringStep<0) {  //������Ȧ
            if (radius <=0 ) {
                radius = range;
                this.ringRadius = this.ringRange/meterPerWorldunit;
            }
        }


        //project and unproject
        // project(lnglat: LngLat) {
        //     const lat = clamp(lnglat.lat, this.maxValidLatitude[0], this.maxValidLatitude[1]);
        //     return new Point(
        //         mercatorXfromLng(lnglat.lng) * this.worldSize,
        //         mercatorYfromLat(lat) * this.worldSize);
        // }
        //
        // unproject(point: Point): LngLat {
        //     return new MercatorCoordinate(point.x / this.worldSize, point.y / this.worldSize).toLngLat();
        // }


        // //
        // var lnglatCenter  = new LngLat(ringCenter.x,ringCenter.y);;
        // var pointCenter  = this.threemap.map.transform.project(lnglatCenter);
        // //point to mercator coordinate;
        // var pointMercator = new Point();

        // pointMercator.x = pointCenter.x * worldSize;
        // pointMercator.y = pointCenter.y * worldSize;
        //
        // //offset
        // var pointMercatorOffset = new Point(pointMercator.x,pointMercator.y);
        // pointMercatorOffset.x += radius;

        //mercator coordinate to point;
       // var pointOffset = new Point( pointMercatorOffset.x/worldSize,pointMercatorOffset.y/worldSize);



		if ( 0 == this.pulseMode ) {
            this.material.uniforms['ringRadius'].value = this.ringRadius;
            this.material.uniforms['ringCenter'].value = ringCenter;
            this.material.uniforms['ringColor'].value = this.ringColor;
            this.material.uniforms.viewProjectionInverseMatrix.value.copy(viewProjectionInverseMatrix);
            this.material.needsUpdate = true;
        }
        else {
			this.material1.uniforms['ringMode'].value = this.pulseMode-1;
            this.material1.uniforms['ringRadius'].value = this.ringRadius;
            this.material1.uniforms['ringCenter'].value = ringCenter;
            this.material1.uniforms['ringColor'].value = this.ringColor;
            this.material1.uniforms.viewProjectionInverseMatrix.value.copy(viewProjectionInverseMatrix);
            this.material1.needsUpdate = true;
		}

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

HaloPulsePass.prototype.setPulseMode = function(mode) {

	if ( mode == this. pulseMode )
		return;

    if ( 0 == mode )
    {
        this.quad.material = this.material;
    }
    else
    {
        this.quad.material = this.material1;
    }

    this.pulseMode = mode;
};

export { HaloPulsePass };
