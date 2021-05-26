function Vector4(x, y, z, w) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
}

Object.assign(Vector4.prototype, {

    clone: function () {
        return new Vector4(this.x, this.y, this.z, this.w);
    },

    multiply: function (v, matrix) {
        var m11 = 0, m12 = 0, m13 = 0, m14 = 0;

        m11 = v.x * matrix.m[0] + v.y * matrix.m[4] + v.z * matrix.m[8] + v.w * matrix.m[12];
        m12 = v.x * matrix.m[1] + v.y * matrix.m[5] + v.z * matrix.m[9] + v.w * matrix.m[13];
        m13 = v.x * matrix.m[2] + v.y * matrix.m[6] + v.z * matrix.m[10] + v.w * matrix.m[14];
        m14 = v.x * matrix.m[3] + v.y * matrix.m[7] + v.z * matrix.m[11] + v.w * matrix.m[15];

        return new Vector4(m11, m12, m13, m14);
    },

} );
