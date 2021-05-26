function Vector2(x, y) {
    this.x = x || 0;
    this.y = y || 0;
}

Object.assign(Vector2.prototype, {

    normalize: function () {
        var length = this.length();
        if (length != 0) {
            this.x /= length;
            this.y /= length;
        }
    },

    normalized: function () {
        var v = new Vector2(this.x, this.y);
        v.normalize();
        return v;
    },

    length: function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    },

    scale: function (s) {
        return new Vector2(this.x*s, this.y*s);
    },

    sub: function (vec) {
        return new Vector2(this.x-vec.x, this.y-vec.y);
    },

    add: function (vec) {
        return new Vector2(this.x+vec.x, this.y+vec.y);
    },

    clone: function () {
        return new Vector2(this.x, this.y);
    },

} );

export { Vector2 };
