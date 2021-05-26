
var MeshLine3DShader = {

    vertexShader:
        `
		attribute vec3 prev;
		attribute vec3 curr;
		attribute vec3 next;
		attribute float side;
		attribute float timeOut;

		uniform vec2 resolution;
		uniform float lineWidth;
		uniform float near;
		uniform float far;
		uniform float sizeAttenuation;
        uniform float CycleTime;
        uniform float TimeLengthRation;
		
		
		varying float v_TimeOut;
        varying float v_CycleTimeOut;
        varying float v_WidthTime;
		
		
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
		
		
		    v_TimeOut = timeOut;
            v_CycleTimeOut = CycleTime;
            v_WidthTime = max(0.00001, lineWidth * TimeLengthRation);
		}
		`,
    fragmentShader:
        `
		precision highp float;
		
		uniform vec4 FColor;
        uniform vec4 BackColor;
        uniform float CurrentTime;
        //uniform float StartTime;
        //uniform float EndTime;
        uniform float TraceTime;
        uniform float EnableLineStipple;
		uniform float ifAnimation;
		
		varying float v_TimeOut;
        varying float v_CycleTimeOut;
        varying float v_WidthTime;
		void main() {
		    float backAlpha ;
		    vec4 backColor = BackColor;
            float CycleCurrentTime = mod(CurrentTime, v_CycleTimeOut);
            float intTime = floor(CurrentTime/(v_CycleTimeOut-TraceTime));
            float alpha = 0.0;
            if(v_TimeOut > CycleCurrentTime){
                alpha = 0.0;
            }
            else if(v_TimeOut < CycleCurrentTime - TraceTime){
                alpha = 0.0;
            }
            else{
                if(ifAnimation>0.0){
                     if(intTime < 1.0){
                        alpha = 0.0;
                    }else{
                        alpha = (TraceTime - (CycleCurrentTime - v_TimeOut)) / TraceTime;
                    }
                }else{
                     alpha = (TraceTime - (CycleCurrentTime - v_TimeOut)) / TraceTime;
                }
                if(EnableLineStipple > 0.5 ){
                   float gaps = abs(CycleCurrentTime - v_TimeOut)/v_WidthTime;
                   if(gaps - floor(gaps) < 0.5){
                        alpha = 0.0;
                   }
                 }
             }
             if(ifAnimation > 0.0){
                if(intTime < 1.0){
                    if(v_TimeOut < CycleCurrentTime-TraceTime){
                        backAlpha = backColor.a;
                    }
                    backColor.a =backAlpha;
                }
             }
            if(backColor.a < 0.000001){
                if(alpha < 0.000001){
                    discard;
                }
            }
            gl_FragColor = mix(backColor, FColor, alpha);
        }     
		`,
};



function odLineMaterial01( parameters ) {

    function check( v, d ) {
        if( v === undefined ) return d;
        return v;
    }

    Three.ShaderMaterial.call( this, parameters );

    parameters = parameters || {};
    /*
    * uniform vec4 Color;
        uniform vec4 BackColor;
        uniform float CurrentTime;
        //uniform float StartTime;
        //uniform float EndTime;
        uniform float TraceTime;
        uniform float EnableLineStipple;
        uniform float sizeAttenuation;
        uniform float CycleTime;
        uniform float TimeLengthRation;
    *
    * */
    this.lineWidth = check( parameters.lineWidth, 3 );
    parameters.speed = parameters.speed || 1.0;
    this.speed =  parameters.speed>0 ? parameters.speed: 0.0 ;
    parameters.speed = this.speed;
    this.FColor = check( parameters.FColor, {x:1,y:1,z:1,w:1} );
    this.BackColor = check( parameters.BackColor, {x:0,y:1,z:0,w:0.6});
    this.resolution = check( parameters.resolution, new Three.Vector2( 1, 1 ) );
    this.sizeAttenuation = check( parameters.sizeAttenuation, 1 );
    this.near = check( parameters.near, 1 );
    this.far = check( parameters.far, 1 );


    this.CurrentTime = check( parameters.CurrentTime, 0 );
    this.TraceTime = check( parameters.TraceTime, 50.0 );
    this.EnableLineStipple = check( parameters.EnableLineStipple, false );
    this.CycleTime = check( parameters.CycleTime, 200 );
    this.TimeLengthRation = check( parameters.TimeLengthRation, 100000);
    parameters.ifAnimation = parameters.ifAnimation || 1.0;
    this.ifAnimation = parameters.ifAnimation > 0 ? 1.0 : -1.0;

    this.attributes = {
        prev: { type: 'v3', value: [] },
        curr: { type: 'v3', value: [] },
        next: { type: 'v3', value: [] },
        side: { type: 'f', value: [] },
        timeOut: { type: 'f', value: [] }
    };
    this.uniforms = {
        lineWidth: { type: 'f', value: this.lineWidth },
        FColor: { type: 'v4', value: this.FColor },
        resolution: { type: 'v2', value: this.resolution },
        sizeAttenuation: { type: 'f', value: this.sizeAttenuation },
        near: { type: 'f', value: this.near },
        far: { type: 'f', value: this.far },
        CurrentTime: {type: 'f', value: this.CurrentTime},
        TraceTime: {type: 'f', value: this.TraceTime},
        EnableLineStipple: {type: 'f', value: this.EnableLineStipple},
        BackColor:{type:'v4',value:this.BackColor},
        CycleTime:{type:'f',value:this.CycleTime},
        TimeLengthRation:{type:'f',value:this.TimeLengthRation},
        ifAnimation:{type:"f",value:this.ifAnimation}
    };
    this.vertexShader = check( parameters.vertexShader, MeshLine3DShader.vertexShader );
    this.fragmentShader = check( parameters.fragmentShader, MeshLine3DShader.fragmentShader );


    this.type = 'odLineMaterial01';

    this.setValues( parameters );
    let that = this;

    updateCurrentTime();
    function updateCurrentTime(){
        requestAnimationFrame(updateCurrentTime);
        that.uniforms.CurrentTime.value += that.speed;
        if( (that.uniforms.CurrentTime.value % that.CycleTime) == 0 ){
            that.callBackFun();
        }
    }

    this.callBackFun = function () {

    }

};

odLineMaterial01.prototype = Object.create( Three.ShaderMaterial.prototype );


export {odLineMaterial01 };
