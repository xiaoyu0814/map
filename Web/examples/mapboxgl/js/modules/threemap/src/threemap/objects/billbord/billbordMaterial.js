
function BillbordMaterial(mapImg){
    if(!mapImg){
        return null;
    }
    let textureLoader = new Three.TextureLoader();
    let material = new Three.SpriteMaterial({
        map:textureLoader.load(mapImg),
        color: new Three.Color(1,1,1),
        transparent:false,
        depthTest:false,
        depthWrite:false,
        blending: Three.AdditiveBlending,
        blendEquation :Three.AddEquation,
        blendSrc:Three.SrcAlphaFactor,
        blendDst:Three.OneMinusSrcAlphaFactor
    });
    return material;
}

export {BillbordMaterial};
