
function Polygon(map, threemap) {
    Three.Group.call(this);

    this.map = map;
    this.threemap = threemap;

    this.group = null;
}

Polygon.prototype = Object.assign(Object.create(Three.Group.prototype),{
    constructor: "Polygon",

});

Polygon.prototype.create = function() {
    //var data = options.data;
    // var d = data[0];
    // var lon =d['lon'];
    // var lat = d['lat'];
    // var endP = threeBox.projectToWorld([lon,lat,0]);

    //var origin = [116.40, 39.95];
    var origin = [116.39078972717584, 39.91545554293933];
    this.group = this.threemap.createGeoGroup(origin, {preScale: 1, scaleToLatitude: false});
    this.group.visible = true;
    this.add(this.group);

    //==========================
    var colors = [0Xcc0000, 0Xcccc00, 0X00cccc, 0X00cc00, 0Xcc00cc, 0X0000cc];
    var triangleShape = new Three.Shape();

    for(let j = 0; j < 2; j++) {
        for (let n = 0; n < 3; n++) {
            let dx = 0.025 * (n - 1);
            let dy = 0.025 * (j - 0.5);
            triangleShape.moveTo(-0.01, -0.01, 0);
            triangleShape.lineTo(-0.01, 0.01, 0);
            triangleShape.lineTo(0.01, 0.01, 0);
            triangleShape.lineTo(0.01, -0.01, 0);
            triangleShape.moveTo(-0.01, -0.01, 0);

            var regionGeometry = new Three.ShapeGeometry(triangleShape);

            var matregion = new Three.MeshPhongMaterial({
                color: colors[n + 2*j],
                side: Three.DoubleSide,
                depthTest: true,
                depthWrite: false,
                transparent: false,
                opacity: 0.9,
            });
            var meshregion = new Three.Mesh(regionGeometry, matregion);
            meshregion.position.x = dx;
            meshregion.position.y = dy;
            meshregion.position.z = 0;

            this.group.add(meshregion);
        }
    }

    // //=============================
    // var regionGeometry = new Three.PlaneGeometry(0.01, 0.01);
    //
    // var matregion = new Three.MeshPhongMaterial( {
    //     color: 0Xcc00cc,
    //     side: Three.DoubleSide,
    //     depthTest: true,
    //     depthWrite: false,
    //     transparent: false,
    //     opacity: 0.8,
    // } );
    //
    // var meshregion = new Three.Mesh(regionGeometry, matregion);
    // meshregion.position.x = 0;
    // meshregion.position.y = 0;
    // meshregion.position.z = 0;
    // meshregion.userData.name = "regions";

};

Polygon.prototype.createPoly = function(origin, pos, count, colors) {

    var center = this.threemap.projectToWorld([origin[0], origin[1], 0]);
    this.group = this.threemap.createGeoGroup(origin, {preScale: 1, scaleToLatitude: false});
    this.group.visible = true;
    this.add(this.group);

    //==========================
    var numshapes = count.length;
    var sumpos = 0;
    for(let j = 0; j < numshapes; j++) {
        let jcount = count[j];

        var triangleShape = new Three.Shape();
        for (let n = 0; n < jcount; n++) {
            let lon = pos[sumpos + n*2 + 0];
            let lat = pos[sumpos + n*2 + 1];
            var endP = this.threemap.projectToWorld([lon,lat,0]);
            if ( 0 == n ) {
                triangleShape.moveTo(endP.x-center.x, endP.y-center.y, 0);
            }
            else {
                triangleShape.lineTo(endP.x-center.x, endP.y-center.y, 0);
            }
        }

        var regionGeometry = new Three.ShapeGeometry(triangleShape);
        var matregion = new Three.MeshPhongMaterial({
            color: colors[j],
            side: Three.DoubleSide,
            depthTest: true,
            depthWrite: false,
            transparent: false,
            opacity: 0.9,
        });
        var meshregion = new Three.Mesh(regionGeometry, matregion);

        this.group.add(meshregion);

        sumpos = sumpos + jcount*2;
    }
};

export {Polygon};
