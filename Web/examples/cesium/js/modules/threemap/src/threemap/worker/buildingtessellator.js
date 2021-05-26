function BuildingTessellator() {

}

Object.assign(BuildingTessellator.prototype, {

	process: function (vertexs, indexs, points, height, local, scale) {
		var nCount = points.length;
		if (nCount < 3) {
			return false;
		}

		var triangulator = new Triangulator();
		var indices = triangulator.process(points);
		if (indices == null || indices.length < 3) {
			return false;
		}

		var bClockwise = false;
		if (triangulator.area(points) < 0.0) {
			bClockwise = true;
		}

		var topPositions = [];
		var bottomPositions = [];
		for (var i = 0; i < nCount; i++) {
			var x = (points[i].x - local.x) * scale;
			var y = (points[i].y - local.y) * scale;

			topPositions.push(new Vector4(x, y, 0.0, height));
			bottomPositions.push(new Vector4(x, y, 0.0, 0.0));
		}

		var dTotalLength = 0.0;
		var subTexCoordsOffsets = [];
		for (var i = 0; i < nCount - 1; i++) {
			var x = points[i+1].x - points[i].x;
			var y = points[i+1].y - points[i].y;
			var dSubLength = Math.sqrt(x * x + y * y);
			subTexCoordsOffsets.push(dSubLength);
			dTotalLength += dSubLength;
		}
		var dCurrentLength = 0.0;
		var texCoordsOffsets = [];
		texCoordsOffsets.push(0.0);
		for (var i = 0; i < nCount - 1; i++) {
			dCurrentLength += subTexCoordsOffsets[i];
			texCoordsOffsets.push(dCurrentLength / dTotalLength);
		}

		var nVertexCount = vertexs.length;
		this.processBuilding(vertexs, points, height, topPositions, bottomPositions, texCoordsOffsets);


		for (var i = 0; i < nCount; i++) {
			if (i != 0) {
				var vec1 = vertexs[nVertexCount + nCount + 4*(i-1) + 0].position;
				var vec2 = vertexs[nVertexCount + nCount + 4*(i-1) + 1].position;
				var vec3 = vertexs[nVertexCount + nCount + 4*(i-1) + 2].position;

				var vecResult = null;
				if (bClockwise) {
					vecResult = this.computeFaceNormal(new Vector3(vec1.x, vec1.y, vec1.z+vec1.w), new Vector3(vec3.x, vec3.y, vec3.z+vec3.w), new Vector3(vec2.x, vec2.y, vec2.z+vec2.w));
				} else {
					vecResult = this.computeFaceNormal(new Vector3(vec1.x, vec1.y, vec1.z+vec1.w), new Vector3(vec2.x, vec2.y, vec2.z+vec2.w), new Vector3(vec3.x, vec3.y, vec3.z+vec3.w));
				}
				vertexs[nVertexCount + nCount + 4*(i-1) + 0].normal = vecResult;
				vertexs[nVertexCount + nCount + 4*(i-1) + 1].normal = vecResult;
				vertexs[nVertexCount + nCount + 4*(i-1) + 2].normal = vecResult;
				vertexs[nVertexCount + nCount + 4*(i-1) + 3].normal = vecResult;
			}
		}

		for (var i = 0; i < indices.length; i++) {
			indexs.push(nVertexCount + indices[i]);
		}

		indices.length = 6 * (nCount-1);
		for (var i = 0, nOffset = 0; i < nCount-1; i++) {
			if (bClockwise) {
				indices[nOffset + 0] = nCount + 4*i;
				indices[nOffset + 1] = nCount + 4*i + 2;
				indices[nOffset + 2] = nCount + 4*i + 1;

				indices[nOffset + 3] = nCount + 4*i + 2;
				indices[nOffset + 4] = nCount + 4*i + 3;
				indices[nOffset + 5] = nCount + 4*i + 1;
			} else {
				indices[nOffset + 0] = nCount + 4*i;
				indices[nOffset + 1] = nCount + 4*i + 1;
				indices[nOffset + 2] = nCount + 4*i + 3;

				indices[nOffset + 3] = nCount + 4*i + 2;
				indices[nOffset + 4] = nCount + 4*i;
				indices[nOffset + 5] = nCount + 4*i + 3;
			}
			nOffset += 6;
		}
		for (var i = 0; i < indices.length; i++) {
			indexs.push(nVertexCount + indices[i]);
		}
		return true;
	},

	processBuilding: function (vertexs, points, height, topPositions, bottomPositions, texCoordsOffsets) {
		var nCount = points.length;
		var nVertexCount = vertexs.length;
		vertexs.length = nVertexCount + nCount + 4*nCount - 4;
		for (var i = nVertexCount; i < vertexs.length; i++) {
			vertexs[i] = {};
		}

		for (var i = 0; i < nCount; i++) {
			var position = topPositions[i];
			vertexs[nVertexCount + i].position = new Vector4(position.x, position.y, position.z, position.w);
			vertexs[nVertexCount + i].normal = new Vector3(0, 0, 1);
			vertexs[nVertexCount + i].uv = new Vector2(0.0, 1.0);

			var texCoordX = texCoordsOffsets[i];
			if (i != 0) {
				position = topPositions[i];
				vertexs[nVertexCount + nCount + 4*i - 2].position = new Vector4(position.x, position.y, position.z, position.w);
				vertexs[nVertexCount + nCount + 4*i - 2].uv = new Vector2(texCoordX, 1.0);

				position = bottomPositions[i];
				vertexs[nVertexCount + nCount + 4*i - 1].position = new Vector4(position.x, position.y, position.z, position.w);
				vertexs[nVertexCount + nCount + 4*i - 1].uv = new Vector2(texCoordX, 0.0);
			}
			if (i != nCount-1) {
				position = topPositions[i];
				vertexs[nVertexCount + nCount + 4*i].position = new Vector4(position.x, position.y, position.z, position.w);
				vertexs[nVertexCount + nCount + 4*i].uv = new Vector2(texCoordX, 1.0);

				position = bottomPositions[i];
				vertexs[nVertexCount + nCount + 4*i + 1].position = new Vector4(position.x, position.y, position.z, position.w);
				vertexs[nVertexCount + nCount + 4*i + 1].uv = new Vector2(texCoordX, 0.0);
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
			}
			for (var j = 0; j < indexBuffers[i].length; j++) {
				indices[j] = indexBuffers[i][j];
			}

			transferableObjects.push(vertices.buffer);
			transferableObjects.push(normals.buffer);
			transferableObjects.push(uvs.buffer);
			transferableObjects.push(indices.buffer);

			var layout = {
				attribs: [
					{name: 'position', itemSize: 3, normalized: 0, type: 0, index: 4 * i + 0},
					{name: 'normal', itemSize: 3, normalized: 0, type: 0, index: 4 * i + 1},
					{name: 'uv', itemSize: 2, normalized: 0, type: 0, index: 4 * i + 2}
				],
				index: {name: 'index', itemSize: 1, normalized: 0, type: 0, index: 4 * i + 3}
			};
			layouts.push(layout);
		}

		return layouts;
	},

	computeFaceNormal: function (vec1, vec2, vec3) {
		return (vec2.sub(vec1)).cross(vec3.sub(vec2)).normalized();
	},

} );



