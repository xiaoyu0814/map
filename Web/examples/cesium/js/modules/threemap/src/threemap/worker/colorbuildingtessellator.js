function ColorBuildingTessellator() {
	BuildingTessellator.call(this);
}

ColorBuildingTessellator.prototype = Object.assign(Object.create(BuildingTessellator.prototype),{

	processBuilding: function (vertexs, points, height, topPositions, bottomPositions, texCoordsOffsets) {
		var nCount = points.length;
		var nVertexCount = vertexs.length;
		vertexs.length = nVertexCount + nCount + 4*nCount - 4;
		for (var i = nVertexCount; i < vertexs.length; i++) {
			vertexs[i] = {};
		}

		var value = 1 - Math.random() * Math.random();
		var color = new Vector4(value + Math.random() * 0.1, value, value + Math.random() * 0.1, 1.0);

		for (var i = 0; i < nCount; i++) {
			var position = topPositions[i];
			vertexs[nVertexCount + i].position = new Vector4(position.x, position.y, position.z, position.w);
			vertexs[nVertexCount + i].normal = new Vector3(0, 0, 1);
			vertexs[nVertexCount + i].uv = new Vector2(0.0, 1.0);
			vertexs[nVertexCount + i].color = new Vector4(color.x, color.y, color.z, color.w);

			var texCoordX = texCoordsOffsets[i];
			if (i != 0) {
				position = topPositions[i];
				vertexs[nVertexCount + nCount + 4*i - 2].position = new Vector4(position.x, position.y, position.z, position.w);
				vertexs[nVertexCount + nCount + 4*i - 2].uv = new Vector2(texCoordX, 1.0);
				vertexs[nVertexCount + nCount + 4*i - 2].color = new Vector4(color.x, color.y, color.z, color.w);

				position = bottomPositions[i];
				vertexs[nVertexCount + nCount + 4*i - 1].position = new Vector4(position.x, position.y, position.z, position.w);
				vertexs[nVertexCount + nCount + 4*i - 1].uv = new Vector2(texCoordX, 0.0);
				vertexs[nVertexCount + nCount + 4*i - 1].color = new Vector4(color.x, color.y, color.z, color.w);
			}
			if (i != nCount-1) {
				position = topPositions[i];
				vertexs[nVertexCount + nCount + 4*i].position = new Vector4(position.x, position.y, position.z, position.w);
				vertexs[nVertexCount + nCount + 4*i].uv = new Vector2(texCoordX, 1.0);
				vertexs[nVertexCount + nCount + 4*i].color = new Vector4(color.x, color.y, color.z, color.w);

				position = bottomPositions[i];
				vertexs[nVertexCount + nCount + 4*i + 1].position = new Vector4(position.x, position.y, position.z, position.w);
				vertexs[nVertexCount + nCount + 4*i + 1].uv = new Vector2(texCoordX, 0.0);
				vertexs[nVertexCount + nCount + 4*i + 1].color = new Vector4(color.x, color.y, color.z, color.w);
			}
		}
	},

	toTransferableObjects: function (vertexBuffers, indexBuffers, transferableObjects) {
		var layouts = [];
		for (var i = 0; i < vertexBuffers.length; i++) {
			var indices = new Uint16Array(indexBuffers[i].length);
			var vertices = new Float32Array(vertexBuffers[i].length * 3);
			var normals = new Float32Array(vertexBuffers[i].length * 3);
			var uvs = new Float32Array(vertexBuffers[i].length * 2);
			var colors = new Float32Array(vertexBuffers[i].length * 4);

			for (var j = 0; j < vertexBuffers[i].length; j++) {
				var vertex = vertexBuffers[i][j];

				vertices[j * 3 + 0] = vertex.position.x;
				vertices[j * 3 + 1] = vertex.position.y;
				vertices[j * 3 + 2] = vertex.position.z + vertex.position.w;

				normals[j * 3 + 0] = vertex.normal.x;
				normals[j * 3 + 1] = vertex.normal.y;
				normals[j * 3 + 2] = vertex.normal.z;

				uvs[j * 2 + 0] = vertex.uv.x;
				uvs[j * 2 + 1] = vertex.uv.y;

				colors[j * 4 + 0] = vertex.color.x;
				colors[j * 4 + 1] = vertex.color.y;
				colors[j * 4 + 2] = vertex.color.z;
				colors[j * 4 + 3] = vertex.color.w;
			}
			for (var j = 0; j < indexBuffers[i].length; j++) {
				indices[j] = indexBuffers[i][j];
			}

			transferableObjects.push(vertices.buffer);
			transferableObjects.push(normals.buffer);
			transferableObjects.push(uvs.buffer);
			transferableObjects.push(colors.buffer);
			transferableObjects.push(indices.buffer);

			var layout = {
				attribs: [
					{name: 'position', itemSize: 3, normalized: 0, type: 0, index: 5 * i + 0},
					{name: 'normal', itemSize: 3, normalized: 0, type: 0, index: 5 * i + 1},
					{name: 'uv', itemSize: 2, normalized: 0, type: 0, index: 5 * i + 2},
					{name: 'color', itemSize: 4, normalized: 0, type: 0, index: 5 * i + 3}
				],
				index: {name: 'index', itemSize: 1, normalized: 0, type: 0, index: 5 * i + 4}
			};
			layouts.push(layout);
		}

		return layouts;
	},

} );



