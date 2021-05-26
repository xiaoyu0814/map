function Matrix4f() {
    this.m = new Float32Array(16);
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

Object.assign(Matrix4f.prototype, {

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
        // transpose matrix
        var src0 = this.m[0];
        var src4 = this.m[1];
        var src8 = this.m[2];
        var src12 = this.m[3];

        var src1 = this.m[4];
        var src5 = this.m[5];
        var src9 = this.m[6];
        var src13 = this.m[7];

        var src2 = this.m[8];
        var src6 = this.m[9];
        var src10 = this.m[10];
        var src14 = this.m[11];

        var src3 = this.m[12];
        var src7 = this.m[13];
        var src11 = this.m[14];
        var src15 = this.m[15];

        // calculate pairs for first 8 elements (cofactors)
        var atmp0 = src10 * src15;
        var atmp1 = src11 * src14;
        var atmp2 = src9 * src15;
        var atmp3 = src11 * src13;
        var atmp4 = src9 * src14;
        var atmp5 = src10 * src13;
        var atmp6 = src8 * src15;
        var atmp7 = src11 * src12;
        var atmp8 = src8 * src14;
        var atmp9 = src10 * src12;
        var atmp10 = src8 * src13;
        var atmp11 = src9 * src12;

        // calculate first 8 elements (cofactors)
        var dst0 = (atmp0 * src5 + atmp3 * src6 + atmp4 * src7)
            - (atmp1 * src5 + atmp2 * src6 + atmp5 * src7);
        var dst1 = (atmp1 * src4 + atmp6 * src6 + atmp9 * src7)
            - (atmp0 * src4 + atmp7 * src6 + atmp8 * src7);
        var dst2 = (atmp2 * src4 + atmp7 * src5 + atmp10 * src7)
            - (atmp3 * src4 + atmp6 * src5 + atmp11 * src7);
        var dst3 = (atmp5 * src4 + atmp8 * src5 + atmp11 * src6)
            - (atmp4 * src4 + atmp9 * src5 + atmp10 * src6);
        var dst4 = (atmp1 * src1 + atmp2 * src2 + atmp5 * src3)
            - (atmp0 * src1 + atmp3 * src2 + atmp4 * src3);
        var dst5 = (atmp0 * src0 + atmp7 * src2 + atmp8 * src3)
            - (atmp1 * src0 + atmp6 * src2 + atmp9 * src3);
        var dst6 = (atmp3 * src0 + atmp6 * src1 + atmp11 * src3)
            - (atmp2 * src0 + atmp7 * src1 + atmp10 * src3);
        var dst7 = (atmp4 * src0 + atmp9 * src1 + atmp10 * src2)
            - (atmp5 * src0 + atmp8 * src1 + atmp11 * src2);

        // calculate pairs for second 8 elements (cofactors)
        var btmp0 = src2 * src7;
        var btmp1 = src3 * src6;
        var btmp2 = src1 * src7;
        var btmp3 = src3 * src5;
        var btmp4 = src1 * src6;
        var btmp5 = src2 * src5;
        var btmp6 = src0 * src7;
        var btmp7 = src3 * src4;
        var btmp8 = src0 * src6;
        var btmp9 = src2 * src4;
        var btmp10 = src0 * src5;
        var btmp11 = src1 * src4;

        // calculate second 8 elements (cofactors)
        var dst8 = (btmp0 * src13 + btmp3 * src14 + btmp4 * src15)
            - (btmp1 * src13 + btmp2 * src14 + btmp5 * src15);
        var dst9 = (btmp1 * src12 + btmp6 * src14 + btmp9 * src15)
            - (btmp0 * src12 + btmp7 * src14 + btmp8 * src15);
        var dst10 = (btmp2 * src12 + btmp7 * src13 + btmp10 * src15)
            - (btmp3 * src12 + btmp6 * src13 + btmp11 * src15);
        var dst11 = (btmp5 * src12 + btmp8 * src13 + btmp11 * src14)
            - (btmp4 * src12 + btmp9 * src13 + btmp10 * src14);
        var dst12 = (btmp2 * src10 + btmp5 * src11 + btmp1 * src9 )
            - (btmp4 * src11 + btmp0 * src9 + btmp3 * src10);
        var dst13 = (btmp8 * src11 + btmp0 * src8 + btmp7 * src10)
            - (btmp6 * src10 + btmp9 * src11 + btmp1 * src8 );
        var dst14 = (btmp6 * src9 + btmp11 * src11 + btmp3 * src8 )
            - (btmp10 * src11 + btmp2 * src8 + btmp7 * src9 );
        var dst15 = (btmp10 * src10 + btmp4 * src8 + btmp9 * src9 )
            - (btmp8 * src9 + btmp11 * src10 + btmp5 * src8 );

        var matrix = new Matrix4f();
        // calculate determinant
        var det = src0 * dst0 + src1 * dst1 + src2 * dst2 + src3 * dst3;
        if (det == 0) {
            matrix.Identity();
            return matrix;
        }

        // calculate matrix inverse
        var invdet = 1.0 / det;
        matrix.m[0] = dst0 * invdet;
        matrix.m[1] = dst1 * invdet;
        matrix.m[2] = dst2 * invdet;
        matrix.m[3] = dst3 * invdet;

        matrix.m[4] = dst4 * invdet;
        matrix.m[5] = dst5 * invdet;
        matrix.m[6] = dst6 * invdet;
        matrix.m[7] = dst7 * invdet;

        matrix.m[8] = dst8 * invdet;
        matrix.m[9] = dst9 * invdet;
        matrix.m[10] = dst10 * invdet;
        matrix.m[11] = dst11 * invdet;

        matrix.m[12] = dst12 * invdet;
        matrix.m[13] = dst13 * invdet;
        matrix.m[14] = dst14 * invdet;
        matrix.m[15] = dst15 * invdet;

        return matrix;
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
        var matrix = new Matrix3f();
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
        var matrix = new Matrix4f();
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
        var matrix = new Matrix4f();
        for (var i = 0; i < 16; i++) {
            matrix.m[i] = this.m[i];
        }
        return matrix;
    },

} );

Matrix4f.prototype.multiply = function (lhs, rhs) {
    var result = new Matrix4f();
    multiplyMM(lhs.m, rhs.m, result.m);
    return result;
};

Matrix4f.prototype.multiplyMM = function (lhs, rhs, result) {
    multiplyMM(lhs.m, rhs.m, result.m);
};

Matrix4f.prototype.multiplyMV = function (v, matrix) {
    var w = 1;
    var m11 = 0, m12 = 0, m13 = 0, m14 = 0;

    m11 = v.x * matrix.m[0] + v.y * matrix.m[4] + v.z * matrix.m[8] + w * matrix.m[12];
    m12 = v.x * matrix.m[1] + v.y * matrix.m[5] + v.z * matrix.m[9] + w * matrix.m[13];
    m13 = v.x * matrix.m[2] + v.y * matrix.m[6] + v.z * matrix.m[10] + w * matrix.m[14];
    m14 = v.x * matrix.m[3] + v.y * matrix.m[7] + v.z * matrix.m[11] + w * matrix.m[15];

    return new Vector3(m11 / m14, m12 / m14, m13 / m14);
};
