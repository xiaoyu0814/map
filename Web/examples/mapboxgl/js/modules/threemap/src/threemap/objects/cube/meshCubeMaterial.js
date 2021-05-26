
let meshCubeShader = {
    vertexShader:`
        uniform float currentTime;
        uniform vec3 startColor;
        uniform vec3 endColor;
        varying vec3 v_color;
        void main(){
            vec3 realP = position;
            if(realP.z > 0.0){
                v_color = endColor;
            }else{
                v_color = startColor;
                realP.z = 0.0;
            }       
            realP.z = realP.z * currentTime;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( realP, 1.0 );
        }    
    `,
    fragmentShader:`
        precision mediump float;
        varying vec3 v_color;
        void main(){
            gl_FragColor = vec4(v_color.rgb,1.0);
        }    
    `
};
function meshCubeMaterial(options){
    options = options || {};
    let material = new Three.ShaderMaterial( {
        uniforms: {
            currentTime: { value: 1.0,type:"f" },
            startColor:{value:options.sColor || new Three.Color('#d4865a'), type:"v3"},
            endColor:{value:options.eColor || new Three.Color(0xfffff00), type:"v3"}
        },
        vertexShader:  meshCubeShader.vertexShader,
        fragmentShader: meshCubeShader.fragmentShader,
        // blending: Three.AdditiveBlending,
        depthTest: true,
        transparent: false,
        // side:Three.DoubleSide
        // opacity:1.0
    } );
    this.state = 0;
    this.material = material;
    this.speed = 0.01;
    let instance = this;
    this.onload = function(){};
    animation();
    function animation(){
        requestAnimationFrame(animation);

        if(material.uniforms.currentTime.value >=1){
            instance.state = 1;
            material.uniforms.currentTime.value =0;
            instance.onload();
        }
        material.uniforms.currentTime.value+=instance.speed;
    }
}
export {meshCubeMaterial};
