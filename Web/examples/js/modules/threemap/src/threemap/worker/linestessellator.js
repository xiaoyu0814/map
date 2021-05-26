function LinesTessellator() {

}

Object.assign(LinesTessellator.prototype, {

	process: function (tessellator, vertexDatas, indexDatas, points, times, local, scale) {
		var result = false;

		var createVertex = false;
		var vertexData = null;
		var indexData = null;
		var indexSize = indexDatas.length;
		if (indexSize > 0) {
			vertexData = vertexDatas[indexSize - 1];
			indexData = indexDatas[indexSize - 1];
			if (indexData.length > 65000) {
				createVertex = true;
			}
		} else {
			createVertex = true;
		}
		if (createVertex) {
			vertexData = [];
			indexData = [];
		}

		result = tessellator.process(vertexData, indexData, points, times, local, scale);

		if (createVertex) {
			if (result) {
				vertexDatas.push(vertexData);
				indexDatas.push(indexData);
			} else {
				vertexData = null;
				indexData = null;
			}
		}
		return result;
	},

} );



