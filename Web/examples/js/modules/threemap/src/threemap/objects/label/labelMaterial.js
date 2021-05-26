
function LabelMaterial(text){
    var width=512, height=512;
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;


    var ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(0,0,0,0)';
    var gradient=ctx.createLinearGradient(0,0,width,height);
    gradient.addColorStop("0","yellow");
    gradient.addColorStop("0.5","blue");
    gradient.addColorStop("1.0","red");
    ctx.fillRect(0, 0, width, height);
    ctx.font = 100+'px " 1000';
    ctx.fillStyle = 'rgba(255,255,255,1.0)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(text, width/2,height/2);
    /* 画布内容用于纹理贴图 */
    let texture = new Three.Texture(canvas);
    texture.needsUpdate = true;

    let spriteMaterial = new Three.SpriteMaterial({ map: texture } );
    return spriteMaterial;



}
export {LabelMaterial};
