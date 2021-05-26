//路网图层 对应的材质
import * as Three from 'three-full';
function check( v, d ) {
    if( v === undefined ) return d;
    return v;
}
var StreamMeshLineShader = {

    vertexShader: [

        //'precision highp float;',
        '',
        //'attribute vec3 position;',
        'attribute vec3 previous;',
        'attribute vec3 next;',
        'attribute float side;',
        'attribute float width;',
        //'attribute vec2 uv;',
        'attribute float counters;',
        "attribute float times;",
        '',
        //'uniform mat4 projectionMatrix;',
        //'uniform mat4 modelViewMatrix;',
        'uniform vec2 resolution;',
        'uniform float lineWidth;',
        'uniform vec3 color;',
        'uniform float opacity;',
        'uniform float near;',
        'uniform float far;',
        'uniform float sizeAttenuation;',
        '',
        'varying vec2 vUV;',
        'varying vec4 vColor;',
        'varying float vCounters;',
        "varying float vVertexTime;",
        '',
        'vec2 fix( vec4 i, float aspect ) {',
        '',
        '    vec2 res = i.xy / i.w;',
        '    res.x *= aspect;',
        '	 vCounters = counters;',
        '    return res;',
        '',
        '}',
        '',
        'void main() {',
        '',
        '    float aspect = resolution.x / resolution.y;',
        '	 float pixelWidthRatio = 1. / (resolution.x * projectionMatrix[0][0]);',
        '',
        '    vColor = vec4( color, opacity );',
        '    vUV = uv;',
        '	  vVertexTime = times;',
        '',
        '    mat4 m = projectionMatrix * modelViewMatrix;',
        '    vec4 finalPosition = m * vec4( position, 1.0 );',
        '    vec4 prevPos = m * vec4( previous, 1.0 );',
        '    vec4 nextPos = m * vec4( next, 1.0 );',
        '',
        '    vec2 currentP = fix( finalPosition, aspect );',
        '    vec2 prevP = fix( prevPos, aspect );',
        '    vec2 nextP = fix( nextPos, aspect );',
        '',
        '	 float pixelWidth = finalPosition.w * pixelWidthRatio;',
        '    float w = 1.8 * pixelWidth * lineWidth * width;',
        '',
        '    if( sizeAttenuation == 1. ) {',
        '        w = 1.8 * lineWidth * width;',
        '    }',
        '',
        '    vec2 dir;',
        '    if( nextP == currentP ) dir = normalize( currentP - prevP );',
        '    else if( prevP == currentP ) dir = normalize( nextP - currentP );',
        '    else {',
        '        vec2 dir1 = normalize( currentP - prevP );',
        '        vec2 dir2 = normalize( nextP - currentP );',
        '        dir = normalize( dir1 + dir2 );',
        '',
        '        vec2 perp = vec2( -dir1.y, dir1.x );',
        '        vec2 miter = vec2( -dir.y, dir.x );',
        '        //w = clamp( w / dot( miter, perp ), 0., 4. * lineWidth * width );',
        '',
        '    }',
        '',
        '    //vec2 normal = ( cross( vec3( dir, 0. ), vec3( 0., 0., 1. ) ) ).xy;',
        '    vec2 normal = vec2( -dir.y, dir.x );',
        '    normal.x /= aspect;',
        '    normal *= .5 * w;',
        '',
        '    vec4 offset = vec4( normal * side, 0.0, 1.0 );',
        '    finalPosition.xy += offset.xy;',
        '',
        '    gl_Position = finalPosition;',
        '',
        '}'

    ].join("\n"),

    fragmentShader: [

        '#extension GL_OES_standard_derivatives : enable',
        'precision mediump float;',
        '',
        //'uniform sampler2D map;',
        //'uniform sampler2D alphaMap;',
        //'uniform float useMap;',
        //'uniform float useAlphaMap;',
        'uniform float useDash;',
        'uniform vec2 dashArray;',
        'uniform float visibility;',
        'uniform float alphaTest;',
        'uniform vec2 repeat;',
        'uniform float invertType;',
        'uniform float sycleType;',
        'uniform float currentTime;',
        'uniform float sycleTime;',
        'uniform float traceTime;',
        'uniform float sumTime;',
        'uniform float tt;',
        '',
        'varying vec2 vUV;',
        'varying vec4 vColor;',
        'varying float vCounters;',
        'varying float vVertexTime;',
        '',

        'float smoothstep2( float a, float b, float x ) {',
        "	if (x < a){",
        " 		return 0.0;",
        "	}",
        "	if(x >= b) {",
        "		return 1.0;",
        "	}",
        "	float y = (x - a) / (b - a);",
        "	return (y * y * (3.0 - 2.0 * y));",
        '}',

        "float CalculateAlpha()",
        "{ ",
        "	float alpha = 0.0;",
        "	float cycleCurrentTime = mod(currentTime, sycleTime);",
        "	if (vVertexTime > cycleCurrentTime){",
        " 		alpha = 0.0;",
        "	}",
        "	else if(vVertexTime < cycleCurrentTime - traceTime) {",
        "		alpha = 0.0;",
        "	}",
        "	else{",
        "		alpha = (traceTime - (cycleCurrentTime - vVertexTime )) / traceTime;",
        "		alpha = smoothstep(0.0, 0.8, alpha) * 1.25;",
        "	}",
        "	return alpha;",
        "}",

        "float CalculateAlphaInvert()",
        "{ ",
        "	float alpha = 0.0;",
        "	float cycleCurrentTime = mod(currentTime, sycleTime);",
        "	if (sumTime - vVertexTime > cycleCurrentTime){",
        " 		alpha = 0.0;",
        "	}",
        "	else if(sumTime - vVertexTime < cycleCurrentTime - traceTime) {",
        "		alpha = 0.0;",
        "	}",
        "	else{",
        "		alpha = (traceTime - (cycleCurrentTime - (sumTime - vVertexTime) )) / traceTime;",
        "		alpha = smoothstep(0.0, 0.8, alpha) * 1.25;",
        "	}",
        "	return alpha;",
        "}",

        "float CalculateAlphaEx()",
        "{ ",
        "	float alpha = 0.0;",
        "	float cycleCurrentTime = mod(vVertexTime + currentTime, sycleTime);",
        "	alpha = cycleCurrentTime / traceTime;",
        '	 if ( invertType == 0.0 ){',
        '	 	 alpha = 1.0 - alpha;',
        '	 }',
        "	return alpha;",
        "}",

        "float CalculateAlphaExEx()",
        "{ ",
        "	float alpha = 0.0;",
        "	float cycleCurrentTime = mod(vVertexTime + currentTime, sycleTime);",
        "	alpha = step(0.5, cycleCurrentTime / traceTime);",
        '	 if ( invertType == 0.0 ){',
        '	 	 alpha = 1.0 - alpha;',
        '	 }',
        "	return alpha;",
        "}",

        "float CalculateAlphaOneTime()",
        "{ ",
        "	float alpha = 0.0;",
        "	float cycleCurrentTime = currentTime;",
        "	if (vVertexTime > cycleCurrentTime){",
        " 		alpha = 0.0;",
        "	}",
        "	else if(vVertexTime < cycleCurrentTime - traceTime) {",
        "		alpha = 0.0;",
        "	}",
        "	else{",
        "		alpha = (traceTime - (cycleCurrentTime - vVertexTime )) / traceTime;",
        //"		alpha = smoothstep(0.0, 0.8, alpha) * 1.25;",
        "	}",
        "	return alpha;",
        "}",

        'void main() {',
        '',
        '    vec4 c = vColor;',
        //'    if( useMap == 1. ) c *= texture2D( map, vUV * repeat );',
        //'    if( useAlphaMap == 1. ) c.a *= texture2D( alphaMap, vUV * repeat ).a;',
        //'	 if( c.a < alphaTest ) discard;',
        '	 if( useDash == 1. ){',
        '	 	 ',
        '	 }',
        '    gl_FragColor = c;',
        '	 gl_FragColor.a *= step(vCounters,visibility);',

        '	 float alpha = 1.0;',
        '	 if ( sycleType == 0.0 ){',
        '	 	if ( invertType == 0.0 ){',
        '	 	 	alpha = CalculateAlpha();',
        '	 	} else {',
        '	 	 	alpha = CalculateAlphaInvert();',
        '	 	}',
        '	 } else if ( sycleType == 1.0 ) {',
        '	 	 alpha = CalculateAlphaEx();',
        '	 } else if ( sycleType == 2.0 ) {',
        '	 	 alpha = CalculateAlphaExEx();',
        '	 } else if ( sycleType == 3.0 ) {',
        '	 	 alpha = CalculateAlphaOneTime();',
        '	 }',
        '    gl_FragColor.a *= alpha;',
        '}'

    ].join("\n")

};
function StreamMeshLineMaterial(parameters){
    parameters = parameters || {};

    this.lineWidth = check( parameters.lineWidth, 1 );
    this.map = check( parameters.map, null );
    this.useMap = check( parameters.useMap, 0 );
    this.alphaMap = check( parameters.alphaMap, null );
    this.useAlphaMap = check( parameters.useAlphaMap, 0 );
    this.color = check( parameters.color, new Three.Color( 0xffffff ) );
    this.opacity = check( parameters.opacity, 1 );
    this.resolution = check( parameters.resolution, new Three.Vector2( 1, 1 ) );
    this.sizeAttenuation = check( parameters.sizeAttenuation, 1 );
    this.near = check( parameters.near, 1 );
    this.far = check( parameters.far, 1 );
    this.dashArray = check( parameters.dashArray, [] );
    this.useDash = ( this.dashArray !== [] ) ? 1 : 0;
    this.visibility = check( parameters.visibility, 1 );
    this.alphaTest = check( parameters.alphaTest, 0 );
    this.repeat = check( parameters.repeat, new Three.Vector2( 1, 1 ) );
    this.invertType = check( parameters.invertType, 0 );
    this.sycleType = check( parameters.sycleType, 0 );
    this.currentTime = check( parameters.currentTime, 0 );
    this.sycleTime = check( parameters.sycleTime, 60 );
    this.traceTime = check( parameters.traceTime, 10 );
    this.sumTime = check( parameters.sumTime, 0 );
    this.tt = check(parameters.tt, 0);
    this.uniforms = {
        lineWidth: { type: 'f', value: this.lineWidth },
        map: { type: 't', value: this.map },
        useMap: { type: 'f', value: this.useMap },
        alphaMap: { type: 't', value: this.alphaMap },
        useAlphaMap: { type: 'f', value: this.useAlphaMap },
        color: { type: 'c', value: this.color },
        opacity: { type: 'f', value: this.opacity },
        resolution: { type: 'v2', value: this.resolution },
        sizeAttenuation: { type: 'f', value: this.sizeAttenuation },
        near: { type: 'f', value: this.near },
        far: { type: 'f', value: this.far },
        dashArray: { type: 'v2', value: new Three.Vector2( this.dashArray[ 0 ], this.dashArray[ 1 ] ) },
        useDash: { type: 'f', value: this.useDash },
        visibility: {type: 'f', value: this.visibility},
        alphaTest: {type: 'f', value: this.alphaTest},
        repeat: { type: 'v2', value: this.repeat },
        invertType: {type: 'f', value: this.invertType},
        sycleType: {type: 'f', value: this.sycleType},
        currentTime: {type: 'f', value: this.currentTime},
        sycleTime: {type: 'f', value: this.sycleTime},
        traceTime: {type: 'f', value: this.traceTime},
        sumTime: {type: 'f', value: this.sumTime},
        tt:{type:"f",value:this.tt}
    };
    this.vertexShader = check( parameters.vertexShader, StreamMeshLineShader.vertexShader );
    this.fragmentShader = check( parameters.fragmentShader, StreamMeshLineShader.fragmentShader );
    var instance = this;
    var material = new Three.ShaderMaterial({
        uniforms:instance.uniforms,
        vertexShader:instance.vertexShader,
        fragmentShader:instance.fragmentShader,
        blending: Three.AdditiveBlending,
        depthTest: false,
        transparent: true,
        depthWrite: false,
        // side:Three.DoubleSide
        // opacity:0.0
    });
    return material;
}
export {StreamMeshLineMaterial};