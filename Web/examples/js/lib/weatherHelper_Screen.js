var rainSnowFall_Screen = function (options) {
    this._viewer = options.viewer;
    this._options = options;
    this.stage_snow = null;//存放雪的全局变量
    this.stage_rain = null;//存放雨的全局变量
};

rainSnowFall_Screen.prototype.getSnow= function () {
    var fragmentShaderSource =
        'uniform sampler2D colorTexture;\n' +
        'varying vec2 v_textureCoordinates;\n' +

        'float snow(vec2 uv,float scale)\n' +
        '{\n' +
        '    float time = czm_frameNumber / 60.0;\n' +
        '    float w=smoothstep(1.,0.,-uv.y*(scale/10.));if(w<.1)return 0.;\n' +
        '    uv+=time/scale;uv.y+=time*2./scale;uv.x+=sin(uv.y+time*.5)/scale;\n' +
        '    uv*=scale;vec2 s=floor(uv),f=fract(uv),p;float k=3.,d;\n' +
        '    p=.5+.35*sin(11.*fract(sin((s+p+scale)*mat2(7,3,6,5))*5.))-f;d=length(p);k=min(d,k);\n' +
        '    k=smoothstep(0.,k,sin(f.x+f.y)*0.01);\n' +
        '    return k*w;\n' +
        '}\n' +

        'void main(void){\n' +
        '    vec2 resolution = czm_viewport.zw;\n' +
        '    vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);\n' +

        '    vec3 finalColor=vec3(0);\n' +
        '    //float c=smoothstep(1.,0.3,clamp(uv.y*.3+.8,0.,.75));\n' +
        '    float c = 0.0;\n' +
        '    c+=snow(uv,30.)*.0;\n' +
        '    c+=snow(uv,20.)*.0;\n' +
        '    c+=snow(uv,15.)*.0;\n' +
        '    c+=snow(uv,10.);\n' +
        '    c+=snow(uv,8.);\n' +
        '    c+=snow(uv,6.);\n' +
        '    c+=snow(uv,5.);\n' +
        '    finalColor=(vec3(c));\n' + //屏幕上雪的颜色
        '    gl_FragColor = mix(texture2D(colorTexture, v_textureCoordinates), vec4(finalColor,1), 0.5);\n' + //将雪和三维场景融合
        '}\n' ;

    this.stage_snow=new Cesium.PostProcessStage({
        name : 'czm_snow',
        fragmentShader :fragmentShaderSource
      });
   this._viewer.scene.postProcessStages.add(this.stage_snow);
};

rainSnowFall_Screen.prototype.getRain = function () {
    let fragmentShaderSource =
        'uniform sampler2D colorTexture;\n' +
        'varying vec2 v_textureCoordinates; \n' +

        'float hash(float x){\n' +
        'return fract(sin(x*133.3)*13.13);\n' +
        '}\n' +

        'void main(void){\n' +

        'float time = czm_frameNumber / 60.0;\n' +
        'vec2 resolution = czm_viewport.zw;\n' +

        'vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);\n' +
        'vec3 c=vec3(.6,.7,.8);\n' +

        'float a=-.4;\n' +
        'float si=sin(a),co=cos(a);\n' +
        'uv*=mat2(co,-si,si,co);\n' +
        'uv*=length(uv+vec2(0,4.9))*.3+1.;\n' +

        'float v=1.-sin(hash(floor(uv.x*100.))*2.);\n' +
        'float b=clamp(abs(sin(20.*time*v+uv.y*(5./(2.+v))))-.95,0.,1.)*20.;\n' +
        'c*=v*b; \n' +

        'gl_FragColor = mix(texture2D(colorTexture, v_textureCoordinates), vec4(c,1), 0.5); \n' +
        '}\n';
    this.stage_rain=new Cesium.PostProcessStage({
        name : 'czm_rain',
        fragmentShader :fragmentShaderSource
    });
    this._viewer.scene.postProcessStages.add(this.stage_rain);
};

 //定位
rainSnowFall_Screen.prototype.flyTo = function (destination, head, pitch, roll, duration, call) {
    var _self = this;
    _self._viewer.camera.flyTo({
            destination: destination,    //Cartesian3 | Rectangle
            orientation: {
                heading: head,
                pitch: pitch,
                roll: roll,
            },
            duration: duration,
            complete: function ()//飞行完毕后执行的动作
            {
                if (call)//如果有回调函�?
                {
                    call();
                }
            }

        });
    }