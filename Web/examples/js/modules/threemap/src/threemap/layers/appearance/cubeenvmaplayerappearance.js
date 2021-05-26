import {EnvMapLayerAppearance} from "./envmaplayerappearance.js";

function CubeEnvMapLayerAppearance(threemap, layer, options) {

	var cubeCamera = new Three.CubeCamera(1, 1000000, 128);
	cubeCamera.renderTarget.texture.minFilter = Three.LinearMipMapLinearFilter;

	var materials = [];
	for (var i = 0; i < 6; i++) {
		var loader = new Three.TextureLoader();
		var texture = loader.load(options.urls[i],
			// onLoad callback
            function ( texture ) {
                // in this example we create the material when the texture is loaded
                materials.push(new Three.MeshBasicMaterial({
                    map: texture,
                    depthWrite: false,
                    side: Three.BackSide
                }));
            },
            // onProgress callback currently not supported
            undefined,
            // onError callback
            function ( err ) {
                console.error( 'An error happened.' );
                console.error(err);

            }
        );

	}
	var cubeMesh = new Three.Mesh(new Three.BoxGeometry(30000, 30000, 30000), materials);
	cubeMesh.rotation.x = Math.PI / 2.0;
	threemap.moveToCoordinate(cubeMesh, options.position, {preScale: 1});

	EnvMapLayerAppearance.call(this, threemap, layer, cubeCamera, cubeMesh);
};

CubeEnvMapLayerAppearance.prototype = Object.assign(Object.create(EnvMapLayerAppearance.prototype),{
	constructor: "CubeEnvMapLayerAppearance",

} );

export { CubeEnvMapLayerAppearance };
