
function meshCube(w,depth,h){
    this.geometry =  new Three.BoxGeometry(w,depth, h);
}
meshCube.prototype  =  Object.assign( Object.create(null ), {
    constructor:meshCube,
    iscubeGeometry:true,
});
export {meshCube}
