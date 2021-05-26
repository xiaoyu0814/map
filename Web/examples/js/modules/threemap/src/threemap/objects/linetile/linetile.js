
function LineTile(parent, map, threemap, material) {
    this.parent = parent;
	this.map = map;
    this.threemap = threemap;
    this.material = material;

    this.geometry = null;
    this.mesh = null;
    this.group = null;
}

LineTile.prototype.setVisible = function(visible) {
    if (this.group != null) {
        this.group.visible = visible;
    }
};

LineTile.prototype.isVisible = function() {
    if (this.group != null) {
        return this.group.visible;
    }
    return false;
};

LineTile.prototype.create = function(message, buffers) {

    if (buffers.length >= 4) {
        var origin = [message.center.x, message.center.y];
        this.group = this.threemap.createGeoGroup(origin, {preScale: 1, scaleToLatitude: false});
        this.group.visible = false;
        this.parent.add(this.group);

        var layouts = message.layouts;
        for (var i = 0; i < layouts.length; i++) {
            var layout = layouts[i];
            if (layout != null) {
                var geometry = new Three.BufferGeometry();
                var attribs = layout.attribs;
                for (var j = 0; j < attribs.length; j++) {
                    var attrib = attribs[j];
                    geometry.addAttribute(attrib.name, new Three.Float32BufferAttribute(new Float32Array(buffers[attrib.index]), attrib.itemSize, attrib.normalized));
                }
                var index = layout.index;
                geometry.setIndex(new Three.Uint16BufferAttribute(new Uint16Array(buffers[index.index]), index.itemSize));

                geometry.boundingSphere = new Three.Sphere(new Three.Vector3(0, 0, 0), message.radius);
                var mesh = new Three.Mesh(geometry, this.material);
                this.group.add(mesh);
            }
        }
    }
};

LineTile.prototype.destroy = function() {

};

export { LineTile };
