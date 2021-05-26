
function StreamMeshLine() {

    this.positions = [];

    this.previous = [];
    this.next = [];
    this.side = [];
    this.width = [];
    this.indices_array = [];
    this.uvs = [];
    this.counters = [];
    this.times = [];
    this.geometry = new Three.BufferGeometry();

    this.widthCallback = null;

}

StreamMeshLine.prototype.setGeometry = function( g, t, c ) {

    this.widthCallback = c;

    this.positions = [];
    this.counters = [];
    this.times = [];

    if( g instanceof Three.Geometry ) {
        for( var j = 0; j < g.vertices.length; j++ ) {
            var v = g.vertices[ j ];
            var ti = t[j];
            var c = j/g.vertices.length;
            this.positions.push( v.x, v.y, v.z );
            this.positions.push( v.x, v.y, v.z );
            this.counters.push(c);
            this.counters.push(c);
            this.times.push(ti);
            this.times.push(ti);
        }
    }

    if( g instanceof Three.BufferGeometry ) {
        // read attribute positions ?
    }

    if( g instanceof Float32Array || g instanceof Array ) {
        for( var j = 0; j < g.length; j += 3 ) {
            var c = j/g.length;
            this.positions.push( g[ j ], g[ j + 1 ], g[ j + 2 ] );
            this.positions.push( g[ j ], g[ j + 1 ], g[ j + 2 ] );
            this.counters.push(c);
            this.counters.push(c);
            this.times.push(t[j]);
            this.times.push(t[j]);
        }
    }

    this.process();

}

StreamMeshLine.prototype.compareV3 = function( a, b ) {

    var aa = a * 6;
    var ab = b * 6;
    return ( this.positions[ aa ] === this.positions[ ab ] ) && ( this.positions[ aa + 1 ] === this.positions[ ab + 1 ] ) && ( this.positions[ aa + 2 ] === this.positions[ ab + 2 ] );

}

StreamMeshLine.prototype.copyV3 = function( a ) {

    var aa = a * 6;
    return [ this.positions[ aa ], this.positions[ aa + 1 ], this.positions[ aa + 2 ] ];

}

StreamMeshLine.prototype.copyArray = function( a, b ) {
    for (var i = 0; i < a.length; i++) {
        a[i] = b[i];
    }
}

StreamMeshLine.prototype.process = function() {

    var l = this.positions.length / 6;

    this.previous = [];
    this.next = [];
    this.side = [];
    this.width = [];
    this.indices_array = [];
    this.uvs = [];

    for( var j = 0; j < l; j++ ) {
        this.side.push( 1 );
        this.side.push( -1 );
    }

    var w;
    for( var j = 0; j < l; j++ ) {
        if( this.widthCallback ) w = this.widthCallback( j / ( l -1 ) );
        else w = 1;
        this.width.push( w );
        this.width.push( w );
    }

    for( var j = 0; j < l; j++ ) {
        this.uvs.push( j / ( l - 1 ), 0 );
        this.uvs.push( j / ( l - 1 ), 1 );
    }

    var v;

    if( this.compareV3( 0, l - 1 ) ){
        v = this.copyV3( l - 2 );
    } else {
        v = this.copyV3( 0 );
    }
    this.previous.push( v[ 0 ], v[ 1 ], v[ 2 ] );
    this.previous.push( v[ 0 ], v[ 1 ], v[ 2 ] );
    for( var j = 0; j < l - 1; j++ ) {
        v = this.copyV3( j );
        this.previous.push( v[ 0 ], v[ 1 ], v[ 2 ] );
        this.previous.push( v[ 0 ], v[ 1 ], v[ 2 ] );
    }

    for( var j = 1; j < l; j++ ) {
        v = this.copyV3( j );
        this.next.push( v[ 0 ], v[ 1 ], v[ 2 ] );
        this.next.push( v[ 0 ], v[ 1 ], v[ 2 ] );
    }

    if( this.compareV3( l - 1, 0 ) ){
        v = this.copyV3( 1 );
    } else {
        v = this.copyV3( l - 1 );
    }
    this.next.push( v[ 0 ], v[ 1 ], v[ 2 ] );
    this.next.push( v[ 0 ], v[ 1 ], v[ 2 ] );

    for( var j = 0; j < l - 1; j++ ) {
        var n = j * 2;
        this.indices_array.push( n, n + 1, n + 2 );
        this.indices_array.push( n + 2, n + 1, n + 3 );
    }

    if (!this.attributes) {
        this.attributes = {
            position: new Three.BufferAttribute( new Float32Array( this.positions ), 3 ),
            previous: new Three.BufferAttribute( new Float32Array( this.previous ), 3 ),
            next: new Three.BufferAttribute( new Float32Array( this.next ), 3 ),
            side: new Three.BufferAttribute( new Float32Array( this.side ), 1 ),
            width: new Three.BufferAttribute( new Float32Array( this.width ), 1 ),
            uv: new Three.BufferAttribute( new Float32Array( this.uvs ), 2 ),
            index: new Three.BufferAttribute( new Uint16Array( this.indices_array ), 1 ),
            counters: new Three.BufferAttribute( new Float32Array( this.counters ), 1 ),
            times: new Three.BufferAttribute( new Float32Array( this.times ), 1 )
        }
    } else {
        this.attributes.position.copyArray(new Float32Array(this.positions));
        this.attributes.position.needsUpdate = true;
        this.attributes.previous.copyArray(new Float32Array(this.previous));
        this.attributes.previous.needsUpdate = true;
        this.attributes.next.copyArray(new Float32Array(this.next));
        this.attributes.next.needsUpdate = true;
        this.attributes.side.copyArray(new Float32Array(this.side));
        this.attributes.side.needsUpdate = true;
        this.attributes.width.copyArray(new Float32Array(this.width));
        this.attributes.width.needsUpdate = true;
        this.attributes.uv.copyArray(new Float32Array(this.uvs));
        this.attributes.uv.needsUpdate = true;
        this.attributes.times.copyArray(new Float32Array(this.times));
        this.attributes.times.needsUpdate = true;
        this.attributes.index.copyArray(new Uint16Array(this.indices_array));
        this.attributes.index.needsUpdate = true;
    }

    this.geometry.addAttribute( 'position', this.attributes.position );
    this.geometry.addAttribute( 'previous', this.attributes.previous );
    this.geometry.addAttribute( 'next', this.attributes.next );
    this.geometry.addAttribute( 'side', this.attributes.side );
    this.geometry.addAttribute( 'width', this.attributes.width );
    this.geometry.addAttribute( 'uv', this.attributes.uv );
    this.geometry.addAttribute( 'times', this.attributes.times );
    this.geometry.addAttribute( 'width', this.attributes.width );

    this.geometry.setIndex( this.attributes.index );


    /*
    this.geometry.addAttribute( 'position', Float32Array, this.positions.length / 3, 3 );
    this.geometry.addAttribute( 'previous', Float32Array, this.previous.length / 3, 3 );
    this.geometry.addAttribute( 'next', Float32Array, this.next.length / 3, 3 );
    this.geometry.addAttribute( 'side', Float32Array, this.side.length, 1 );
    this.geometry.addAttribute( 'width', Float32Array, this.width.length, 1 );
    this.geometry.addAttribute( 'uv', Float32Array, this.uvs.length / 2, 2 );
    this.geometry.addAttribute( 'counters', Float32Array, this.counters.length, 1 );
    this.geometry.addAttribute( 'times', Float32Array, this.times.length, 1 );
    this.geometry.addAttribute( 'index', Uint16Array, this.indices_array.length, 1 );

    this.copyArray(this.geometry.attributes.position.array, this.positions);
    this.copyArray(this.geometry.attributes.previous.array, this.previous);
    this.copyArray(this.geometry.attributes.next.array, this.next);
    this.copyArray(this.geometry.attributes.side.array, this.side);
    this.copyArray(this.geometry.attributes.width.array, this.width);
    this.copyArray(this.geometry.attributes.uv.array, this.uvs);
    this.copyArray(this.geometry.attributes.counters.array, this.counters);
    this.copyArray(this.geometry.attributes.times.array, this.times);
    this.copyArray(this.geometry.attributes.index.array, this.indices_array);
    */

    var offset = {
        start: 0,
        index: 0,
        count: this.indices_array.length
    };
    this.geometry.offsets = [];
    this.geometry.offsets.push( offset );
}


export {StreamMeshLine};
