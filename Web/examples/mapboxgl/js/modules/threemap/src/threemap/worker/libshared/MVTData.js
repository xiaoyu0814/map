
function MVTData(pbf, end) {
	this.layers = pbf.readFields(readTile, {}, end);
}

function readTile(tag, layers, pbf) {
	if (tag === 3) {
		var layer = new MVTLayer(pbf, pbf.readVarint() + pbf.pos);
		if (layer.length) layers[layer.name] = layer;
	}
}
