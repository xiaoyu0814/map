
var DynamicIconsShader = {

    vertexShader:
        `
        attribute vec2 vcenter;
        uniform float iTime;
		varying vec2 vUv;
		
       void main() {
       		vUv = uv;
       		
       		float fscale = max(fract(iTime), 0.1);
       		vec2 newxy = (position.xy-vcenter) * fscale + vcenter;
       		gl_Position = projectionMatrix * modelViewMatrix * vec4(newxy, position.z, 1.0);
       		
       		//gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xyz, 1.0);
       }
		`,

    fragmentShader:
        `
		#include <packing>

        varying vec2 vUv;
        uniform sampler2D tDiffuse;
      
        void main() {
            gl_FragColor = texture2D(tDiffuse, vUv);
    	}
		`
};

function DynamicIcons(map, threemap) {
    Three.Group.call(this);

    this.map = map;
    this.threemap = threemap;
    this.material = null;

    this.dat = 1.0;
    this.group = null;
}

DynamicIcons.prototype = Object.assign(Object.create(Three.Group.prototype),{
    constructor: "DynamicIcons",

});

DynamicIcons.prototype.create = function( texture ) {

    var origin = [116.39078972717584, 39.91545554293933];
    this.group = this.threemap.createGeoGroup(origin, {preScale: 1, scaleToLatitude: false});
    this.group.visible = true;
    this.add(this.group);

    //===============================
    this.material = new Three.ShaderMaterial({
        vertexShader: DynamicIconsShader.vertexShader,
        fragmentShader: DynamicIconsShader.fragmentShader,
        depthTest: false,
        depthWrite: false,
        transparent: true,
        blending: Three.AdditiveBlending,
        uniforms: {
            iTime:  { value: 0 },
            tDiffuse:   { value: texture },
        }
    });
    //==========================

    for(let j = 0; j < 2; j++) {
        for (let n = 0; n < 3; n++) {
            let dx = 0.022 * (n - 1);
            let dy = 0.022 * (j - 0.6);

            var regionGeometry = new Three.PlaneBufferGeometry(0.02, 0.02);
            var ksize = regionGeometry.getAttribute('position').count;
            var center = [];
            for( let k=0; k<ksize; k++ ) {
                center.push(0, 0);
            }
            regionGeometry.addAttribute( 'vcenter', new Three.Float32BufferAttribute( center, 2 ) );

            var matregion = this.material;

            var meshregion = new Three.Mesh(regionGeometry, matregion);
            meshregion.position.x = dx;
            meshregion.position.y = dy;
            meshregion.position.z = 0;

            this.group.add(meshregion);
        }
    }
};

DynamicIcons.prototype.createIcons = function(origin, pos, size, texture) {

    var center = this.threemap.projectToWorld([origin[0], origin[1], 0]);
    this.group = this.threemap.createGeoGroup(origin, {preScale: 1, scaleToLatitude: false});
    this.group.visible = true;
    this.add(this.group);

    //===============================
    this.material = new Three.ShaderMaterial({
        vertexShader: DynamicIconsShader.vertexShader,
        fragmentShader: DynamicIconsShader.fragmentShader,
        depthTest: false,
        depthWrite: false,
        transparent: true,
        blending: Three.AdditiveBlending,
        uniforms: {
            iTime:  { value: 0 },
            tDiffuse:   { value: texture },
        }
    });

    //==========================
    var numsize = size.length;
    for(let j = 0; j < numsize; j++) {
        let jsize = size[j];
        let lon = pos[j*2 + 0];
        let lat = pos[j*2 + 1];

        let endP = this.threemap.projectToWorld([lon,lat,0]);
        var dx = endP.x-center.x;
        var dy = endP.y-center.y;

        var regionGeometry = new Three.PlaneBufferGeometry(jsize, jsize);
        var ksize = regionGeometry.getAttribute('position').count;
        var iconcenter = [];
        for( let k=0; k<ksize; k++ ) {
            iconcenter.push(0, 0);
        }
        regionGeometry.addAttribute( 'vcenter', new Three.Float32BufferAttribute( iconcenter, 2 ) );

        var matregion = this.material;

        var meshregion = new Three.Mesh(regionGeometry, matregion);
        meshregion.position.x = dx;
        meshregion.position.y = dy;
        meshregion.position.z = 0;

        this.group.add(meshregion);
    }
};

DynamicIcons.prototype.update = function() {

    this.dat = this.dat + 0.015;
    this.material.uniforms['iTime'].value = this.dat;
    this.material.needsUpdate = true;
};

export {DynamicIcons};
