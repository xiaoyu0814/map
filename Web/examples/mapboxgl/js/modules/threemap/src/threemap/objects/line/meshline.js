
function MeshLine() {

	this.curr = [];
	this.prev = [];
	this.next = [];
	this.side = [];
	this.time = [];
	this.indices = [];
	this.geometry = new Three.BufferGeometry();
}

MeshLine.prototype.setGeometry = function( g, t ) {
	this.process( g, t );
};

MeshLine.prototype.compareV3 = function( a, b ) {
	var aa = a * 6;
	var ab = b * 6;
	return ( this.positions[ aa ] === this.positions[ ab ] ) && ( this.positions[ aa + 1 ] === this.positions[ ab + 1 ] ) && ( this.positions[ aa + 2 ] === this.positions[ ab + 2 ] );
};

MeshLine.prototype.copyV3 = function( a ) {
	var aa = a * 6;
	return [ this.positions[ aa ], this.positions[ aa + 1 ], this.positions[ aa + 2 ] ];
};

MeshLine.prototype.copyArray = function( a, b ) {
	for (var i = 0; i < a.length; i++) {
		a[i] = b[i];
	}
};

MeshLine.prototype.isEq = function(x, y) {
	if (x > y - 0.0001 && x < y + 0.0001) {
		return true;
	}
	return false;
};

MeshLine.prototype.isTrue = function(x) {
	if (this.isEq(x, 0.0)) {
		return true;
	}
	if (this.isEq(x, 1.0)) {
		return true;
	}
	return false;
};

MeshLine.prototype.processNodes = function(nodes) {
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
			var vertexSize = this.time.length;
			this.indices.push(vertexSize + 0, vertexSize + 2, vertexSize + 1);
			this.indices.push(vertexSize + 1, vertexSize + 2, vertexSize + 4);
			this.indices.push(vertexSize + 1, vertexSize + 4, vertexSize + 3);
			this.indices.push(vertexSize + 3, vertexSize + 4, vertexSize + 5);
		}

		this.prev.push(prev.x, prev.y, prev.z);
		this.curr.push(curr.x, curr.y, curr.z);
		this.next.push(next.x, next.y, next.z);
		this.side.push(sideX, sideY, role);
		this.time.push(time);
	}
};

MeshLine.prototype.processLine = function(g, t) {

	var nodes = [];
	var count = g.vertices.length;
	for (var i = 0; i < count - 1; i++) {

		var start = g.vertices[i];
		var end = g.vertices[i+1];
		var startTime = t[i];
		var endTime = t[i+1];

		var startA = start;
		if (i > 0) {
			startA = g.vertices[i-1];
		}
		var startB = end;

		var endA = start;
		var endB = end;
		if (i < count - 2) {
			endB = g.vertices[i+2];
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

	this.processNodes(nodes);
};

MeshLine.prototype.process = function(g, t) {

	this.processLine(g, t);

	this.attributes = {
		prev: new Three.BufferAttribute( new Float32Array( this.prev ), 3 ),
		curr: new Three.BufferAttribute( new Float32Array( this.curr ), 3 ),
		next: new Three.BufferAttribute( new Float32Array( this.next ), 3 ),
		side: new Three.BufferAttribute( new Float32Array( this.side ), 3 ),
		time: new Three.BufferAttribute( new Float32Array( this.time ), 1 ),
		index: new Three.BufferAttribute( new Uint16Array( this.indices ), 1 )
	}

	this.geometry.addAttribute( 'prev', this.attributes.prev );
	this.geometry.addAttribute( 'curr', this.attributes.curr );
	this.geometry.addAttribute( 'next', this.attributes.next );
	this.geometry.addAttribute( 'side', this.attributes.side );
	this.geometry.addAttribute( 'time', this.attributes.time );

	this.geometry.setIndex( this.attributes.index );

	var offset = { start: 0, index: 0, count: this.indices.length };
	this.geometry.offsets = [];
	this.geometry.offsets.push( offset );

};

export { MeshLine };
