
function OdLine3D01() {

    this.curr = [];
    this.prev = [];
    this.next = [];
    this.side = [];
    this.timeOut = [];
    this.indices = [];
    this.geometry = new Three.BufferGeometry();
}

OdLine3D01.prototype.setGeometry = function( g,timeOutArr) {
    this.process( g,timeOutArr);
}

OdLine3D01.prototype.compareV3 = function( a, b ) {
    var aa = a * 6;
    var ab = b * 6;
    return ( this.curr[ aa ] === this.curr[ ab ] ) && ( this.curr[ aa + 1 ] === this.curr[ ab + 1 ] ) && ( this.curr[ aa + 2 ] === this.curr[ ab + 2 ] );
}

OdLine3D01.prototype.copyV3 = function( a ) {
    var aa = a * 6;
    return [ this.curr[ aa ], this.curr[ aa + 1 ], this.curr[ aa + 2 ] ];
}

OdLine3D01.prototype.copyArray = function( a, b ) {
    for (var i = 0; i < a.length; i++) {
        a[i] = b[i];
    }
}

OdLine3D01.prototype.processLine = function(g,timeOutArr) {
    this.curr = [];
    this.timeOut = timeOutArr;

    if ( g instanceof Float32Array || g instanceof Array ) {
        for( var j = 0; j < g.length; j += 3 ) {
            this.curr.push( g[ j ], g[ j + 1 ], g[ j + 2 ] );
            this.curr.push( g[ j ], g[ j + 1 ], g[ j + 2 ] );
        }
    } else {
        for( var j = 0; j < g.vertices.length; j++ ) {
            var v = g.vertices[ j ];
            this.curr.push( v.x, v.y, v.z );
            this.curr.push( v.x, v.y, v.z );
        }
    }

    var l = this.curr.length / 6;

    this.prev = [];
    this.next = [];
    this.side = [];
    this.indices = [];

    for( var j = 0; j < l; j++ ) {
        this.side.push( 1 );
        this.side.push( -1 );
    }

    var v;

    if( this.compareV3( 0, l - 1 ) ){
        v = this.copyV3( l - 2 );
    } else {
        v = this.copyV3( 0 );
    }
    this.prev.push( v[ 0 ], v[ 1 ], v[ 2 ] );
    this.prev.push( v[ 0 ], v[ 1 ], v[ 2 ] );
    for( var j = 0; j < l - 1; j++ ) {
        v = this.copyV3( j );
        this.prev.push( v[ 0 ], v[ 1 ], v[ 2 ] );
        this.prev.push( v[ 0 ], v[ 1 ], v[ 2 ] );
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
        this.indices.push( n, n + 1, n + 2 );
        this.indices.push( n + 2, n + 1, n + 3 );
    }
}

OdLine3D01.prototype.process = function( g,timeOut) {

    this.processLine(g,timeOut);

    if (!this.attributes) {
        this.attributes = {
            curr: new Three.BufferAttribute( new Float32Array( this.curr ), 3 ),
            prev: new Three.BufferAttribute( new Float32Array( this.prev ), 3 ),
            next: new Three.BufferAttribute( new Float32Array( this.next ), 3 ),
            side: new Three.BufferAttribute( new Float32Array( this.side ), 1 ),
            timeOut: new Three.BufferAttribute( new Float32Array( this.timeOut ), 1 ),
            index: new Three.BufferAttribute( new Uint16Array( this.indices ), 1 )
        }
    } else {
        this.attributes.curr.copyArray(new Float32Array(this.curr));
        this.attributes.curr.needsUpdate = true;
        this.attributes.prev.copyArray(new Float32Array(this.prev));
        this.attributes.prev.needsUpdate = true;
        this.attributes.next.copyArray(new Float32Array(this.next));
        this.attributes.next.needsUpdate = true;
        this.attributes.side.copyArray(new Float32Array(this.side));
        this.attributes.side.needsUpdate = true;
        this.attributes.timeOut.copyArray(new Float32Array(this.timeOut));
        this.attributes.timeOut.needsUpdate = true;
        this.attributes.index.copyArray(new Uint16Array(this.indices));
        this.attributes.index.needsUpdate = true;
    }

    this.geometry.addAttribute( 'curr', this.attributes.curr );
    this.geometry.addAttribute( 'prev', this.attributes.prev );
    this.geometry.addAttribute( 'next', this.attributes.next );
    this.geometry.addAttribute( 'side', this.attributes.side );
    this.geometry.addAttribute( 'timeOut', this.attributes.timeOut );

    this.geometry.setIndex( this.attributes.index );

    var offset = {
        start: 0,
        index: 0,
        count: this.indices.length
    };
    this.geometry.offsets = [];
    this.geometry.offsets.push( offset );
}

/**
 * @author DataStream.js
 */

function memcpy( dst, dstOffset, src, srcOffset, byteLength ) {

    var dstU8 = new Uint8Array( dst, dstOffset, byteLength );
    var srcU8 = new Uint8Array( src, srcOffset, byteLength );

    dstU8.set( srcU8 );

};


/**
 * Fast method to advance the line by one position.  The oldest position is removed.
 * @param position
 */
OdLine3D01.prototype.advance = function(position) {

    var curr = this.geometry.attributes.curr.array;
    var prev = this.geometry.attributes.prev.array;
    var next = this.geometry.attributes.next.array;
    var l = curr.length;

    // PREVIOUS
    memcpy( curr, 0, prev, 0, l );

    // POSITIONS
    memcpy( curr, 6, curr, 0, l - 6 );

    curr[l - 6] = position.x;
    curr[l - 5] = position.y;
    curr[l - 4] = position.z;
    curr[l - 3] = position.x;
    curr[l - 2] = position.y;
    curr[l - 1] = position.z;

    // NEXT
    memcpy( curr, 6, next, 0, l - 6 );

    next[l - 6]  = position.x;
    next[l - 5]  = position.y;
    next[l - 4]  = position.z;
    next[l - 3]  = position.x;
    next[l - 2]  = position.y;
    next[l - 1]  = position.z;

    this.geometry.attributes.curr.needsUpdate = true;
    this.geometry.attributes.prev.needsUpdate = true;
    this.geometry.attributes.next.needsUpdate = true;

};

export { OdLine3D01 };
