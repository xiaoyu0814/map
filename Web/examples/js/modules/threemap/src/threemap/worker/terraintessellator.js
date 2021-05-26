function TerrainTessellator() {

}

Object.assign(TerrainTessellator.prototype, {

	process: function (coordSys, vertexs, indexs, message, terrains, local) {
		var vertexsExt = [];
		var indicesExt = [];

		var left = 64;
		var top = 64;
		var width = 4096 + 2 * left;
		var height = 4096 + 2 * top;
		var gridX = 66;
		var gridY = 66;
		var gridX1 = gridX + 1;
		var gridY1 = gridY + 1;
		var segment_width = width / gridX;
		var segment_height = height / gridY;
		var ix, iy;

		// buffers
		for ( iy = 0; iy < gridY1; iy ++ ) {
			var y = -top + iy * segment_height;
			for ( ix = 0; ix < gridX1; ix ++ ) {
				var x = -left + ix * segment_width;

				var h = 0.00003 * (terrains[iy * gridX1 + ix] - 0);

				var point = new Vector2(x, y);
				coordSys.tileToWorld(message.z, message.y, message.x, point);

				var vertex = {};
				vertex.position = new Vector3(point.x-local.x, point.y-local.y, h);
				vertex.normal = new Vector3(0, 0, 0);
				vertex.uv = new Vector2(ix / gridX, 1 - ( iy / gridY ));
				vertexsExt.push(vertex);

				if ( 0 < ix && ix < gridX1 - 1 && 0 < iy && iy < gridY1 - 1 ) {
					vertexs.push(vertex);
				}
			}
		}

		// indices
		for ( iy = 0; iy < gridY; iy ++ ) {
			for ( ix = 0; ix < gridX; ix ++ ) {
				var a = ix + gridX1 * iy;
				var b = ix + gridX1 * ( iy + 1 );
				var c = ( ix + 1 ) + gridX1 * ( iy + 1 );
				var d = ( ix + 1 ) + gridX1 * iy;

				// faces
				indicesExt.push( a, b, d );
				indicesExt.push( b, c, d );
			}
		}


		var vA, vB, vC;
		var pA = new Vector3(), pB = new Vector3(), pC = new Vector3();
		var cb = new Vector3(), ab = new Vector3();
		for ( var i = 0, il = indicesExt.length; i < il; i += 3 ) {
			vA = indicesExt[ i + 0 ];
			vB = indicesExt[ i + 1 ];
			vC = indicesExt[ i + 2 ];

			vertexsExt[ vA ].position.copy( pA );
			vertexsExt[ vB ].position.copy( pB );
			vertexsExt[ vC ].position.copy( pC );

			cb.subVectors( pC, pB );
			ab.subVectors( pA, pB );
			cb.crossVectors( cb, ab );

			vertexsExt[ vA ].normal.x += cb.x;
			vertexsExt[ vA ].normal.y += cb.y;
			vertexsExt[ vA ].normal.z += cb.z;

			vertexsExt[ vB ].normal.x += cb.x;
			vertexsExt[ vB ].normal.y += cb.y;
			vertexsExt[ vB ].normal.z += cb.z;

			vertexsExt[ vC ].normal.x += cb.x;
			vertexsExt[ vC ].normal.y += cb.y;
			vertexsExt[ vC ].normal.z += cb.z;
		}


		for (var i = 0; i < vertexs.length; i++) {
			//vertexs[i].position.z = 0;
		}

		for ( iy = 0; iy < gridY - 2; iy ++ ) {
			for ( ix = 0; ix < gridX - 2; ix ++ ) {
				var a = ix + (gridX1 - 2) * iy;
				var b = ix + (gridX1 - 2) * ( iy + 1 );
				var c = ( ix + 1 ) + (gridX1 - 2) * ( iy + 1 );
				var d = ( ix + 1 ) + (gridX1 - 2) * iy;

				// faces
				indexs.push( a, b, d );
				indexs.push( b, c, d );
			}
		}
		return true;
	},

	toTransferableObjects: function (vertexBuffer, indexBuffer, transferableObjects, flat) {
		var layouts = [];

		var indices = new Uint16Array(indexBuffer.length);
		var vertices = new Float32Array(vertexBuffer.length * 3);
		var normals = new Float32Array(vertexBuffer.length * 3);
		var uvs = new Float32Array(vertexBuffer.length * 2);

		for (var j = 0; j < vertexBuffer.length; j++) {
			var vertex = vertexBuffer[j];

			vertices[j * 3 + 0] = vertex.position.x;
			vertices[j * 3 + 1] = vertex.position.y;
			if (flat) {
				vertices[j * 3 + 2] = 0;
			} else {
				vertices[j * 3 + 2] = vertex.position.z;
			}

			normals[j * 3 + 0] = vertex.normal.x;
			normals[j * 3 + 1] = vertex.normal.y;
			normals[j * 3 + 2] = vertex.normal.z;

			uvs[j * 2 + 0] = vertex.uv.x;
			uvs[j * 2 + 1] = vertex.uv.y;
		}
		for (var j = 0; j < indexBuffer.length; j++) {
			indices[j] = indexBuffer[j];
		}

		transferableObjects.push(vertices.buffer);
		transferableObjects.push(normals.buffer);
		transferableObjects.push(uvs.buffer);
		transferableObjects.push(indices.buffer);

		var layout = {
			attribs: [
				{name: 'position', itemSize: 3, normalized: 0, type: 0, index: 0},
				{name: 'normal', itemSize: 3, normalized: 0, type: 0, index: 1},
				{name: 'uv', itemSize: 2, normalized: 0, type: 0, index: 2}
			],
			index: {name: 'index', itemSize: 1, normalized: 0, type: 0, index: 3}
		};
		layouts.push(layout);

		return layouts;
	},

} );



