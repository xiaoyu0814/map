function Matrix4d() {
    this.m = new Float64Array(16);
    {
        this.m[0] = 1;
        this.m[1] = 0;
        this.m[2] = 0;
        this.m[3] = 0;
        this.m[4] = 0;
        this.m[5] = 1;
        this.m[6] = 0;
        this.m[7] = 0;
        this.m[8] = 0;
        this.m[9] = 0;
        this.m[10] = 1;
        this.m[11] = 0;
        this.m[12] = 0;
        this.m[13] = 0;
        this.m[14] = 0;
        this.m[15] = 1;
    }
}

Object.assign(Matrix4d.prototype, {

    create: function (m0, m4, m8, m12,
                       m1, m5, m9, m13,
                       m2, m6, m10, m14,
                       m3, m7, m11, m15) {
        this.m[0] = m0;
        this.m[1] = m1;
        this.m[2] = m2;
        this.m[3] = m3;
        this.m[4] = m4;
        this.m[5] = m5;
        this.m[6] = m6;
        this.m[7] = m7;
        this.m[8] = m8;
        this.m[9] = m9;
        this.m[10] = m10;
        this.m[11] = m11;
        this.m[12] = m12;
        this.m[13] = m13;
        this.m[14] = m14;
        this.m[15] = m15;
    },

    assignMatrix: function (matrix) {
        this.m[0] = matrix.m[0];
        this.m[1] = matrix.m[1];
        this.m[2] = matrix.m[2];
        this.m[3] = matrix.m[3];
        this.m[4] = matrix.m[4];
        this.m[5] = matrix.m[5];
        this.m[6] = matrix.m[6];
        this.m[7] = matrix.m[7];
        this.m[8] = matrix.m[8];
        this.m[9] = matrix.m[9];
        this.m[10] = matrix.m[10];
        this.m[11] = matrix.m[11];
        this.m[12] = matrix.m[12];
        this.m[13] = matrix.m[13];
        this.m[14] = matrix.m[14];
        this.m[15] = matrix.m[15];
    },

    identity: function () {
        this.m[0] = 1;
        this.m[1] = 0;
        this.m[2] = 0;
        this.m[3] = 0;
        this.m[4] = 0;
        this.m[5] = 1;
        this.m[6] = 0;
        this.m[7] = 0;
        this.m[8] = 0;
        this.m[9] = 0;
        this.m[10] = 1;
        this.m[11] = 0;
        this.m[12] = 0;
        this.m[13] = 0;
        this.m[14] = 0;
        this.m[15] = 1;
    },

    zero: function () {
        this.m[0] = 0;
        this.m[1] = 0;
        this.m[2] = 0;
        this.m[3] = 0;
        this.m[4] = 0;
        this.m[5] = 0;
        this.m[6] = 0;
        this.m[7] = 0;
        this.m[8] = 0;
        this.m[9] = 0;
        this.m[10] = 0;
        this.m[11] = 0;
        this.m[12] = 0;
        this.m[13] = 0;
        this.m[14] = 0;
        this.m[15] = 0;
    },

    translation: function (x, y, z) {
        this.m[0] = 1;
        this.m[1] = 0;
        this.m[2] = 0;
        this.m[3] = 0;
        this.m[4] = 0;
        this.m[5] = 1;
        this.m[6] = 0;
        this.m[7] = 0;
        this.m[8] = 0;
        this.m[9] = 0;
        this.m[10] = 1;
        this.m[11] = 0;
        this.m[12] = x;
        this.m[13] = y;
        this.m[14] = z;
        this.m[15] = 1;
    },

    scaling: function (x, y, z) {
        this.m[0] = x;
        this.m[1] = 0;
        this.m[2] = 0;
        this.m[3] = 0;
        this.m[4] = 0;
        this.m[5] = y;
        this.m[6] = 0;
        this.m[7] = 0;
        this.m[8] = 0;
        this.m[9] = 0;
        this.m[10] = z;
        this.m[11] = 0;
        this.m[12] = 0;
        this.m[13] = 0;
        this.m[14] = 0;
        this.m[15] = 1;
    },

    rotationX: function (radian) {
        var s = Math.sin(radian);
        var c = Math.cos(radian);
        this.m[0] = 1;
        this.m[1] = 0;
        this.m[2] = 0;
        this.m[3] = 0;
        this.m[4] = 0;
        this.m[5] = c;
        this.m[6] = s;
        this.m[7] = 0;
        this.m[8] = 0;
        this.m[9] = -s;
        this.m[10] = c;
        this.m[11] = 0;
        this.m[12] = 0;
        this.m[13] = 0;
        this.m[14] = 0;
        this.m[15] = 1;
    },

    rotationY: function (radian) {
        var s = Math.sin(radian);
        var c = Math.cos(radian);
        this.m[0] = c;
        this.m[1] = 0;
        this.m[2] = -s;
        this.m[3] = 0;
        this.m[4] = 0;
        this.m[5] = 1;
        this.m[6] = 0;
        this.m[7] = 0;
        this.m[8] = s;
        this.m[9] = 0;
        this.m[10] = c;
        this.m[11] = 0;
        this.m[12] = 0;
        this.m[13] = 0;
        this.m[14] = 0;
        this.m[15] = 1;
    },

    rotationZ: function (radian) {
        var s = Math.sin(radian);
        var c = Math.cos(radian);
        this.m[0] = c;
        this.m[1] = s;
        this.m[2] = 0;
        this.m[3] = 0;
        this.m[4] = -s;
        this.m[5] = c;
        this.m[6] = 0;
        this.m[7] = 0;
        this.m[8] = 0;
        this.m[9] = 0;
        this.m[10] = 1;
        this.m[11] = 0;
        this.m[12] = 0;
        this.m[13] = 0;
        this.m[14] = 0;
        this.m[15] = 1;
    },

    invert: function () {
        var result = new Matrix4d();
        Matrix4d.prototype.invertM(this.m, result.m);
        return result;
    },

    fromRotationMatrix: function (matrix) {
        this.m[0] = matrix.m[0];
        this.m[1] = matrix.m[1];
        this.m[2] = matrix.m[2];
        this.m[3] = matrix.m[4];
        this.m[4] = matrix.m[5];
        this.m[5] = matrix.m[6];
        this.m[6] = matrix.m[8];
        this.m[7] = matrix.m[9];
        this.m[8] = matrix.m[10];
    },

    toRotationMatrix: function () {
        var matrix = new Matrix3d();
        matrix.m[0] = this.m[0];
        matrix.m[1] = this.m[1];
        matrix.m[2] = this.m[2];
        matrix.m[3] = this.m[4];
        matrix.m[4] = this.m[5];
        matrix.m[5] = this.m[6];
        matrix.m[6] = this.m[8];
        matrix.m[7] = this.m[9];
        matrix.m[8] = this.m[10];
        return matrix;
    },

    transpose: function () {
        var matrix = new Matrix4d();
        for (var i = 0; i < 4; i++) {
            var nBase = i * 4;
            matrix.m[i] = this.m[nBase];
            matrix.m[i + 4] = this.m[nBase + 1];
            matrix.m[i + 8] = this.m[nBase + 2];
            matrix.m[i + 12] = this.m[nBase + 3];
        }
        return matrix;
    },

    ortho: function (left, right, bottom, top, nearly, faraway) {
        var a = 2.0 / (right - left);
        var b = 2.0 / (top - bottom);
        var c = -2.0 / (faraway - nearly);
        var tx = (right + left) / (right - left);
        var ty = (top + bottom) / (top - bottom);
        var tz = (faraway + nearly) / (faraway - nearly);

        this.m[0] = a;
        this.m[1] = 0;
        this.m[2] = 0;
        this.m[3] = 0;
        this.m[4] = 0;
        this.m[5] = b;
        this.m[6] = 0;
        this.m[7] = 0;
        this.m[8] = 0;
        this.m[9] = 0;
        this.m[10] = c;
        this.m[11] = 0;
        this.m[12] = tx;
        this.m[13] = ty;
        this.m[14] = tz;
        this.m[15] = 1;
    },

    frustum: function (left, right, bottom, top, nearly, faraway) {
        var a = 2 * nearly / (right - left);
        var b = 2 * nearly / (top - bottom);
        var c = (right + left) / (right - left);
        var d = (top + bottom) / (top - bottom);
        var e = -(faraway + nearly) / (faraway - nearly);
        var f = -2 * faraway * nearly / (faraway - nearly);

        this.m[0] = a;
        this.m[1] = 0;
        this.m[2] = 0;
        this.m[3] = 0;
        this.m[4] = 0;
        this.m[5] = b;
        this.m[6] = 0;
        this.m[7] = 0;
        this.m[8] = c;
        this.m[9] = d;
        this.m[10] = e;
        this.m[11] = -1;
        this.m[12] = 0;
        this.m[13] = 0;
        this.m[14] = f;
        this.m[15] = 1;
    },

    perspective: function (fovy, aspect, zNear, zFar) {
        var f = 1.0 / Math.tan(fovy / 2);
        var rangeReciprocal = 1.0 / (zNear - zFar);

        this.m[0] = f / aspect;
        this.m[1] = 0.0;
        this.m[2] = 0.0;
        this.m[3] = 0.0;

        this.m[4] = 0.0;
        this.m[5] = f;
        this.m[6] = 0.0;
        this.m[7] = 0.0;

        this.m[8] = 0.0;
        this.m[9] = 0.0;
        this.m[10] = (zFar + zNear) * rangeReciprocal;
        this.m[11] = -1.0;

        this.m[12] = 0.0;
        this.m[13] = 0.0;
        this.m[14] = 2.0 * zFar * zNear * rangeReciprocal;
        this.m[15] = 0.0;
    },

    clone: function () {
        var matrix = new Matrix4d();
        for (var i = 0; i < 16; i++) {
            matrix.m[i] = this.m[i];
        }
        return matrix;
    },

} );

Matrix4d.prototype.multiply = function (lhs, rhs) {
    var result = new Matrix4d();
    multiplyMM(lhs.m, rhs.m, result.m);
    return result;
};

Matrix4d.prototype.multiplyMM = function (lhs, rhs, result) {
    multiplyMM(lhs.m, rhs.m, result.m);
};

Matrix4d.prototype.multiplyMV = function (v, matrix) {
    var w = 1;
    var m11 = 0, m12 = 0, m13 = 0, m14 = 0;

    m11 = v.x * matrix.m[0] + v.y * matrix.m[4] + v.z * matrix.m[8] + w * matrix.m[12];
    m12 = v.x * matrix.m[1] + v.y * matrix.m[5] + v.z * matrix.m[9] + w * matrix.m[13];
    m13 = v.x * matrix.m[2] + v.y * matrix.m[6] + v.z * matrix.m[10] + w * matrix.m[14];
    m14 = v.x * matrix.m[3] + v.y * matrix.m[7] + v.z * matrix.m[11] + w * matrix.m[15];

    return new Vector3(m11 / m14, m12 / m14, m13 / m14);
};

Matrix4d.prototype.invertM = function (m, out) {
    var det = 0;
    var inv = new Float64Array(16);

    inv[0] = m[5] * m[10] * m[15] - m[5] * m[11] * m[14] - m[9] * m[6] * m[15]
        + m[9] * m[7] * m[14] + m[13] * m[6] * m[11] - m[13] * m[7] * m[10];
    inv[4] = -m[4] * m[10] * m[15] + m[4] * m[11] * m[14] + m[8] * m[6] * m[15]
        - m[8] * m[7] * m[14] - m[12] * m[6] * m[11] + m[12] * m[7] * m[10];
    inv[8] = m[4] * m[9] * m[15] - m[4] * m[11] * m[13] - m[8] * m[5] * m[15]
        + m[8] * m[7] * m[13] + m[12] * m[5] * m[11] - m[12] * m[7] * m[9];
    inv[12] = -m[4] * m[9] * m[14] + m[4] * m[10] * m[13] + m[8] * m[5] * m[14]
        - m[8] * m[6] * m[13] - m[12] * m[5] * m[10] + m[12] * m[6] * m[9];
    inv[1] = -m[1] * m[10] * m[15] + m[1] * m[11] * m[14] + m[9] * m[2] * m[15]
        - m[9] * m[3] * m[14] - m[13] * m[2] * m[11] + m[13] * m[3] * m[10];
    inv[5] = m[0] * m[10] * m[15] - m[0] * m[11] * m[14] - m[8] * m[2] * m[15]
        + m[8] * m[3] * m[14] + m[12] * m[2] * m[11] - m[12] * m[3] * m[10];
    inv[9] = -m[0] * m[9] * m[15] + m[0] * m[11] * m[13] + m[8] * m[1] * m[15]
        - m[8] * m[3] * m[13] - m[12] * m[1] * m[11] + m[12] * m[3] * m[9];
    inv[13] = m[0] * m[9] * m[14] - m[0] * m[10] * m[13] - m[8] * m[1] * m[14]
        + m[8] * m[2] * m[13] + m[12] * m[1] * m[10] - m[12] * m[2] * m[9];
    inv[2] = m[1] * m[6] * m[15] - m[1] * m[7] * m[14] - m[5] * m[2] * m[15]
        + m[5] * m[3] * m[14] + m[13] * m[2] * m[7] - m[13] * m[3] * m[6];
    inv[6] = -m[0] * m[6] * m[15] + m[0] * m[7] * m[14] + m[4] * m[2] * m[15]
        - m[4] * m[3] * m[14] - m[12] * m[2] * m[7] + m[12] * m[3] * m[6];
    inv[10] = m[0] * m[5] * m[15] - m[0] * m[7] * m[13] - m[4] * m[1] * m[15]
        + m[4] * m[3] * m[13] + m[12] * m[1] * m[7] - m[12] * m[3] * m[5];
    inv[14] = -m[0] * m[5] * m[14] + m[0] * m[6] * m[13] + m[4] * m[1] * m[14]
        - m[4] * m[2] * m[13] - m[12] * m[1] * m[6] + m[12] * m[2] * m[5];
    inv[3] = -m[1] * m[6] * m[11] + m[1] * m[7] * m[10] + m[5] * m[2] * m[11]
        - m[5] * m[3] * m[10] - m[9] * m[2] * m[7] + m[9] * m[3] * m[6];
    inv[7] = m[0] * m[6] * m[11] - m[0] * m[7] * m[10] - m[4] * m[2] * m[11]
        + m[4] * m[3] * m[10] + m[8] * m[2] * m[7] - m[8] * m[3] * m[6];
    inv[11] = -m[0] * m[5] * m[11] + m[0] * m[7] * m[9] + m[4] * m[1] * m[11]
        - m[4] * m[3] * m[9] - m[8] * m[1] * m[7] + m[8] * m[3] * m[5];
    inv[15] = m[0] * m[5] * m[10] - m[0] * m[6] * m[9] - m[4] * m[1] * m[10]
        + m[4] * m[2] * m[9] + m[8] * m[1] * m[6] - m[8] * m[2] * m[5];

    det = m[0] * inv[0] + m[1] * inv[4] + m[2] * inv[8] + m[3] * inv[12];
    if (det == 0) {
        return;
    }

    det = 1.0 / det;
    for (var i = 0; i < 16; i++) {
        out[i] = inv[i] * det;
    }
};
