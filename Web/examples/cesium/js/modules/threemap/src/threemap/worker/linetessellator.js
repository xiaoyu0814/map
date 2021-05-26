
function LineTessellator() {

}

Object.assign(LineTessellator.prototype, {

	process: function (vertexs, indexs, points, times, local, scale) {
		var nCount = points.length;
		if (nCount < 2) {
			return false;
		}

		var vertices = [];
		for (var i = 0; i < nCount; i++) {
			var x = (points[i].x - local.x) * scale;
			var y = (points[i].y - local.y) * scale;
			vertices.push(new Vector3(x, y, 0.0));
		}
		this.processLine(vertexs, indexs, vertices, times);

		return true;
	},

	processNodes: function (vertexs, indexs, nodes) {
		var count = nodes.length;
		for (var i = 0; i < count; i++) {
			var node = nodes[i];
			var sideX = node.sideX;
			var sideY = node.sideY;
			var role = node.role;
			var time = node.time;
			var prev = node.prev;
			var curr = node.curr;
			var next = node.next;

			if (i % 6 == 0) {
				var vertexSize = vertexs.length;
				indexs.push(vertexSize + 0, vertexSize + 2, vertexSize + 1);
				indexs.push(vertexSize + 1, vertexSize + 2, vertexSize + 4);
				indexs.push(vertexSize + 1, vertexSize + 4, vertexSize + 3);
				indexs.push(vertexSize + 3, vertexSize + 4, vertexSize + 5);
			}

			var vertex = {};
			vertex.prev = new Vector3(prev.x, prev.y, prev.z);
			vertex.curr = new Vector3(curr.x, curr.y, curr.z);
			vertex.next = new Vector3(next.x, next.y, next.z);
			vertex.side = new Vector3(sideX, sideY, role);
			vertex.time = time;
			vertexs.push(vertex);
		}
	},

	processLine: function(vertexs, indexs, vertices, times) {

		var nodes = [];
		var count = vertices.length;
		for (var i = 0; i < count - 1; i++) {

			var start = vertices[i];
			var end = vertices[i+1];
			var startTime = times[i];
			var endTime = times[i+1];

			var startA = start;
			if (i > 0) {
				startA = vertices[i-1];
			}
			var startB = end;

			var endA = start;
			var endB = end;
			if (i < count - 2) {
				endB = vertices[i+2];
			}

			var node0 = {};
			node0.isEnd = 0;
			node0.sideX = 0;
			node0.sideY = 0;
			node0.role = 1;
			node0.time = startTime;
			node0.prev = startA;
			node0.curr = start;
			node0.next = startB;
			nodes.push(node0);

			var node1 = {};
			node1.isEnd = 0;
			node1.sideX = 1;
			node1.sideY = 1;
			node1.role = 0;
			node1.time = startTime;
			node1.prev = startA;
			node1.curr = start;
			node1.next = startB;
			nodes.push(node1);

			var node2 = {};
			node2.isEnd = 0;
			node2.sideX = 1;
			node2.sideY = -1;
			node2.role = 0;
			node2.time = startTime;
			node2.prev = startA;
			node2.curr = start;
			node2.next = startB;
			nodes.push(node2);

			var node3 = {};
			node3.isEnd = 1;
			node3.sideX = -1;
			node3.sideY = 1;
			node3.role = 0;
			node3.time = endTime;
			node3.prev = endA;
			node3.curr = end;
			node3.next = endB;
			nodes.push(node3);

			var node4 = {};
			node4.isEnd = 1;
			node4.sideX = -1;
			node4.sideY = -1;
			node4.role = 0;
			node4.time = endTime;
			node4.prev = endA;
			node4.curr = end;
			node4.next = endB;
			nodes.push(node4);

			var node5 = {};
			node5.isEnd = 1;
			node5.sideX = 0;
			node5.sideY = 0;
			node5.role = 1;
			node5.time = endTime;
			node5.prev = endA;
			node5.curr = end;
			node5.next = endB;
			nodes.push(node5);
		}

		this.processNodes(vertexs, indexs, nodes);
	},

	toTransferableObjects: function (vertexBuffers, indexBuffers, transferableObjects) {
		var layouts = [];
		for (var i = 0; i < vertexBuffers.length; i++) {
			var indices = new Uint16Array(indexBuffers[i].length);
			var prev = new Float32Array(vertexBuffers[i].length * 3);
			var curr = new Float32Array(vertexBuffers[i].length * 3);
			var next = new Float32Array(vertexBuffers[i].length * 3);
			var side = new Float32Array(vertexBuffers[i].length * 3);
			var time = new Float32Array(vertexBuffers[i].length * 1);

			for (var j = 0; j < vertexBuffers[i].length; j++) {
				var vertex = vertexBuffers[i][j];

				prev[j * 3 + 0] = vertex.prev.x;
				prev[j * 3 + 1] = vertex.prev.y;
				prev[j * 3 + 2] = vertex.prev.z;

				curr[j * 3 + 0] = vertex.curr.x;
				curr[j * 3 + 1] = vertex.curr.y;
				curr[j * 3 + 2] = vertex.curr.z;

				next[j * 3 + 0] = vertex.next.x;
				next[j * 3 + 1] = vertex.next.y;
				next[j * 3 + 2] = vertex.next.z;

				side[j * 3 + 0] = vertex.side.x;
				side[j * 3 + 1] = vertex.side.y;
				side[j * 3 + 2] = vertex.side.z;

				time[j * 1 + 0] = vertex.time;
			}
			for (var j = 0; j < indexBuffers[i].length; j++) {
				indices[j] = indexBuffers[i][j];
			}

			transferableObjects.push(prev.buffer);
			transferableObjects.push(curr.buffer);
			transferableObjects.push(next.buffer);
			transferableObjects.push(side.buffer);
			transferableObjects.push(time.buffer);
			transferableObjects.push(indices.buffer);

			var layout = {
				attribs: [
					{name: 'prev', itemSize: 3, normalized: 0, type: 0, index: 6 * i + 0},
					{name: 'curr', itemSize: 3, normalized: 0, type: 0, index: 6 * i + 1},
					{name: 'next', itemSize: 3, normalized: 0, type: 0, index: 6 * i + 2},
					{name: 'side', itemSize: 3, normalized: 0, type: 0, index: 6 * i + 3},
					{name: 'time', itemSize: 1, normalized: 0, type: 0, index: 6 * i + 4}
				],
				index: {name: 'index', itemSize: 1, normalized: 0, type: 0, index: 6 * i + 5}
			};
			layouts.push(layout);
		}

		return layouts;
	},

} );



