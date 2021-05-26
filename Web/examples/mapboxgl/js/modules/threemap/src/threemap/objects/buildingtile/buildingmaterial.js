
Three.UniformsLib.building = {
    emissive: { value: new Three.Color(0.0,0.0,0.0) },
    ambientLightColor: { value: new Three.Color(0.8,0.8,0.8) },
    resolution: { value: new Three.Vector2( 1, 1 ) },
    isfading: { value: 0.0 },
    speedFading: { value: 10.0 },
    isdynamic: { value: 0.0 },
    timeLoop: { value: 0.0 },
    speedLoop: { value: 30.0 },
    isbottomemit: { value: 0.0 },
    emitcolor: { value: new Three.Color(0.0,0.0,0.0) }
};

Three.ShaderLib[ 'building' ] = {

    uniforms: Three.UniformsUtils.merge( [
        Three.UniformsLib.common,
        Three.UniformsLib.specularmap,
        Three.UniformsLib.envmap,
        Three.UniformsLib.aomap,
        Three.UniformsLib.lightmap,
        Three.UniformsLib.emissivemap,
        Three.UniformsLib.fog,
        Three.UniformsLib.lights,
        Three.UniformsLib.building
    ] ),

	vertexShader:
        `
        #define LAMBERT
    
        varying vec3 vLightFront;
        varying float fHeight;
    
        #ifdef DOUBLE_SIDED
            varying vec3 vLightBack;
        #endif
        
        uniform vec2 resolution;
        #include <common>
        #include <uv_pars_vertex>
        #include <uv2_pars_vertex>
        #include <envmap_pars_vertex>
        #include <bsdfs>
        #include <lights_pars_begin>
        #include <color_pars_vertex>
        #include <fog_pars_vertex>
        #include <morphtarget_pars_vertex>
        #include <skinning_pars_vertex>
        #include <shadowmap_pars_vertex>
        #include <logdepthbuf_pars_vertex>
        #include <clipping_planes_pars_vertex>
        
        void main() {
        
            fHeight = 0.0;
            if ( position.z > 0.0 ) fHeight = 1.0;
            
            #include <uv_vertex>
            #include <uv2_vertex>
            #include <color_vertex>
        
            #include <beginnormal_vertex>
            #include <morphnormal_vertex>
            #include <skinbase_vertex>
            #include <skinnormal_vertex>
            #include <defaultnormal_vertex>
        
            #include <begin_vertex>
            #include <morphtarget_vertex>
            #include <skinning_vertex>
            #include <project_vertex>
            #include <logdepthbuf_vertex>
            #include <clipping_planes_vertex>
        
            #include <worldpos_vertex>
            #include <envmap_vertex>
            #include <lights_lambert_vertex>
            #include <shadowmap_vertex>
            #include <fog_vertex>
    
        }
		`,

	fragmentShader:
		`
		uniform vec3 diffuse;
		uniform vec3 emissive;
		uniform float opacity;
		uniform float isfading;
		
		
		uniform float speedFading;
		uniform float isdynamic;
		uniform float timeLoop;
		uniform float speedLoop;
		uniform float isbottomemit;
		uniform vec3 emitcolor;
        
		varying vec3 vLightFront;
		varying float fHeight;
		
		#ifdef DOUBLE_SIDED		
			varying vec3 vLightBack;	
		#endif
		
		#include <common>
		#include <packing>
		#include <dithering_pars_fragment>
		#include <color_pars_fragment>
		#include <uv_pars_fragment>
		#include <uv2_pars_fragment>
		#include <map_pars_fragment>
		#include <alphamap_pars_fragment>
		#include <aomap_pars_fragment>
		#include <lightmap_pars_fragment>
		#include <emissivemap_pars_fragment>
		#include <envmap_pars_fragment>
		#include <bsdfs>
		#include <lights_pars_begin>
		#include <fog_pars_fragment>
		#include <shadowmap_pars_fragment>
		#include <shadowmask_pars_fragment>
		#include <specularmap_pars_fragment>
		#include <logdepthbuf_pars_fragment>
		#include <clipping_planes_pars_fragment>
		
		void main() {
		
			#include <clipping_planes_fragment>
		
			vec4 diffuseColor = vec4( diffuse, opacity );
			//vec4 diffuseColor = vec4( diffuse + vec3(0.0, 0.5, 0.6)*(1.0-fHeight), opacity );
			ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
			vec3 totalEmissiveRadiance = vec3(0.0, 0.0, 0.0); //emissive;
			float fpos = 1.0 - fHeight;
			if ( isbottomemit > 0.5 )
                totalEmissiveRadiance = emitcolor * pow(fpos, 2.0 );
			if ( isdynamic > 0.5 ) 
			{
			    fpos = fract(timeLoop * 0.00035 * speedLoop);
			    float factor = 0.0;
			    if ( abs(fHeight-fpos) < 0.2 )
			        factor = 1.0 - abs(fHeight-fpos)/0.2;
			    totalEmissiveRadiance = emissive * factor;
			}
			
		
			#include <logdepthbuf_fragment>
			#include <map_fragment>
			#include <color_fragment>
			#include <alphamap_fragment>
			#include <alphatest_fragment>
			#include <specularmap_fragment>
			#include <emissivemap_fragment>
		
			// accumulation
			vec3 ac = ambientLightColor;
			if ( isfading > 0.5 )
			    ac = ac * (abs(fract(timeLoop * 0.00015*speedFading)- 0.5) * 2.0 + 0.1)/1.1;
			reflectedLight.indirectDiffuse = getAmbientLightIrradiance( ac );
		
			#include <lightmap_fragment>
		
			reflectedLight.indirectDiffuse *= BRDF_Diffuse_Lambert( diffuseColor.rgb );
		
			#ifdef DOUBLE_SIDED
		
				reflectedLight.directDiffuse = ( gl_FrontFacing ) ? vLightFront : vLightBack;
		
			#else
		
				reflectedLight.directDiffuse = vLightFront;
		
			#endif
		
			reflectedLight.directDiffuse *= BRDF_Diffuse_Lambert( diffuseColor.rgb ) * getShadowMask();
		
			// modulation
			#include <aomap_fragment>
		
			vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
		
			#include <envmap_fragment>
		
			gl_FragColor = vec4( outgoingLight, diffuseColor.a );
			//gl_FragColor = diffuseColor;
		
			#include <tonemapping_fragment>
			#include <encodings_fragment>
			#include <fog_fragment>
			#include <premultiplied_alpha_fragment>
			#include <dithering_fragment>
		
		}
		`
};

function BuildingMaterial( parameters ) {

    Three.ShaderMaterial.call( this, {
		type: 'BuildingMaterial',
		uniforms: Three.UniformsUtils.clone( Three.ShaderLib[ 'building' ].uniforms ),
		vertexShader: Three.ShaderLib[ 'building' ].vertexShader,
		fragmentShader: Three.ShaderLib[ 'building' ].fragmentShader
	} );

    this.lights = true;
    this.color = new Three.Color( 0xffffff ); // diffuse
    this.ambientLightColor = new Three.Color( 0x101010 );
    this.map = null;
    this.opacity = 1.0;
    this.isfading = 0.0;
    this.speedFading = 10.0;
    this.isdynamic = 0.0; // no dynamic
    this.timeLoop = 0.0;
    this.speedLoop = 30.0;
    this.isbottomemit = 0.0;
    this.emitcolor = new Three.Color( 0x00c1c1 );

    this.lightMap = null;
    this.lightMapIntensity = 1.0;

    this.aoMap = null;
    this.aoMapIntensity = 1.0;

    this.emissive = new Three.Color( 0x00c1c1 );
    this.emissiveIntensity = 1.0;
    this.emissiveMap = null;

    this.specularMap = null;

    this.alphaMap = null;

    this.envMap = null;
    this.combine = Three.MultiplyOperation;
    this.reflectivity = 1;
    this.refractionRatio = 0.98;

    this.wireframe = false;
    this.wireframeLinewidth = 1;
    this.wireframeLinecap = 'round';
    this.wireframeLinejoin = 'round';

    this.skinning = false;
    this.morphTargets = false;
    this.morphNormals = false;

    //=================
	Object.defineProperties( this, {

		color: {
			enumerable: true,
			get: function () {
				return this.uniforms.diffuse.value;
			},

			set: function ( value ) {
				this.uniforms.diffuse.value = value;
			}
		},
        opacity: {
            enumerable: true,
            get: function () {
                return this.uniforms.opacity.value;
            },

            set: function ( value ) {
                this.uniforms.opacity.value = value;
            }
        },
        isbottomemit: {
            enumerable: true,
            get: function () {
                return this.uniforms.isbottomemit.value;
            },

            set: function ( value ) {
                this.uniforms.isbottomemit.value = value;
            }
        },
        emitcolor: {
            enumerable: true,
            get: function () {
                return this.uniforms.emitcolor.value;
            },

            set: function ( value ) {
                this.uniforms.emitcolor.value = value;
            }
        },
        isfading: {
            enumerable: true,
            get: function () {
                return this.uniforms.isfading.value;
            },

            set: function ( value ) {
                this.uniforms.isfading.value = value;
            }
        },
        speedFading: {
            enumerable: true,
            get: function () {
                return this.uniforms.speedFading.value;
            },

            set: function ( value ) {
                this.uniforms.speedFading.value = value;
            }
        },
        isdynamic: {
            enumerable: true,
            get: function () {
                return this.uniforms.isdynamic.value;
            },

            set: function ( value ) {
                this.uniforms.isdynamic.value = value;
            }
        },
        timeLoop: {
            enumerable: true,
            get: function () {
                return this.uniforms.timeLoop.value;
            },

            set: function ( value ) {
                this.uniforms.timeLoop.value = value;
            }
        },
        speedLoop: {
            enumerable: true,
            get: function () {
                return this.uniforms.speedLoop.value;
            },

            set: function ( value ) {
                this.uniforms.speedLoop.value = value;
            }
        },
        ambientLightColor: {
            enumerable: true,
            get: function () {
                return this.uniforms.ambientLightColor.value;
            },

            set: function ( value ) {
                this.uniforms.ambientLightColor.value = value;
            }
        },

		map: {
			enumerable: true,
			get: function () {
				return this.uniforms.map.value;
			},

			set: function ( value ) {
				this.uniforms.map.value = value;
			}
		},

        alphaMap: {
            enumerable: true,
            get: function () {
                return this.uniforms.alphaMap.value;
            },

            set: function ( value ) {
                this.uniforms.alphaMap.value = value;
            }
        },

        specularMap: {
            enumerable: true,
            get: function () {
                return this.uniforms.specularMap.value;
            },

            set: function ( value ) {
                this.uniforms.specularMap.value = value;
            }
        },

        lightMap: {
            enumerable: true,
            get: function () {
                return this.uniforms.lightMap.value;
            },

            set: function ( value ) {
                this.uniforms.lightMap.value = value;
            }
        },
        lightMapIntensity: {
            enumerable: true,
            get: function () {
                return this.uniforms.lightMapIntensity.value;
            },

            set: function ( value ) {
                this.uniforms.lightMapIntensity.value = value;
            }
        },

        aoMapIntensity: {
            enumerable: true,
            get: function () {
                return this.uniforms.aoMapIntensity.value;
            },

            set: function ( value ) {
                this.uniforms.aoMapIntensity.value = value;
            }
        },
        aoMap: {
            enumerable: true,
            get: function () {
                return this.uniforms.aoMap.value;
            },

            set: function ( value ) {
                this.uniforms.aoMap.value = value;
            }
        },

        emissive: {
            enumerable: true,
            get: function () {
                return this.uniforms.emissive.value;
            },

            set: function ( value ) {
                this.uniforms.emissive.value = value;
            }
        },
        emissiveMap: {
            enumerable: true,
            get: function () {
                return this.uniforms.emissiveMap.value;
            },

            set: function ( value ) {
                this.uniforms.emissiveMap.value = value;
            }
        },

        envMap: {
            enumerable: true,
            get: function () {
                return this.uniforms.envMap.value;
            },

            set: function ( value ) {
                this.uniforms.envMap.value = value;
            }
        },
        reflectivity: {
            enumerable: true,
            get: function () {
                return this.uniforms.reflectivity.value;
            },

            set: function ( value ) {
                this.uniforms.reflectivity.value = value;
            }
        },
        refractionRatio: {
            enumerable: true,
            get: function () {
                return this.uniforms.refractionRatio.value;
            },

            set: function ( value ) {
                this.uniforms.refractionRatio.value = value;
            }
        },

	} );

	this.setValues( parameters );

	var rr = 5.0;
	this.arr = rr;
};

BuildingMaterial.prototype = Object.create( Three.ShaderMaterial.prototype );
BuildingMaterial.prototype.constructor = BuildingMaterial;

BuildingMaterial.prototype.isBuildingMaterial = true;

BuildingMaterial.prototype.copy = function ( source ) {

    Three.ShaderMaterial.prototype.copy.call( this, source );

	this.color.copy( source.color );
    this.map = source.map;
    this.isfading = source.isfading;
    this.speedFading = source.speedFading;
    this.isdynamic = source.isdynamic;
    this.timeLoop = source.timeLoop;
    this.speedLoop = source.speedLoop;
    this.isbottomemit = source.isbottomemit;
    this.emitcolor.copy( source.emitcolor );

    this.ambientLightColor.copy( source.ambientLightColor );
    this.lightMap = source.lightMap;
    this.lightMapIntensity = source.lightMapIntensity;

    this.aoMap = source.aoMap;
    this.aoMapIntensity = source.aoMapIntensity;

    this.emissive.copy( source.emissive );
    this.emissiveMap = source.emissiveMap;
    this.emissiveIntensity = source.emissiveIntensity;

    this.specularMap = source.specularMap;

    this.alphaMap = source.alphaMap;

    this.envMap = source.envMap;
    this.combine = source.combine;
    this.reflectivity = source.reflectivity;
    this.refractionRatio = source.refractionRatio;

    this.wireframe = source.wireframe;
    this.wireframeLinewidth = source.wireframeLinewidth;
    this.wireframeLinecap = source.wireframeLinecap;
    this.wireframeLinejoin = source.wireframeLinejoin;

    this.skinning = source.skinning;
    this.morphTargets = source.morphTargets;
    this.morphNormals = source.morphNormals;

	return this;

};

export {BuildingMaterial};
