function Matrix3f() {
    this.m = new Float32Array(9);
    {
        this.m[0] = 1;
        this.m[1] = 0;
        this.m[2] = 0;
        this.m[3] = 0;
        this.m[4] = 1;
        this.m[5] = 0;
        this.m[6] = 0;
        this.m[7] = 0;
        this.m[8] = 1;
    }
}

Object.assign(Matrix3f.prototype, {

    create: function (m0, m1, m2,
                      m3, m4, m5,
                      m6, m7, m8) {
        this.m[0] = m0;
        this.m[1] = m1;
        this.m[2] = m2;
        this.m[3] = m3;
        this.m[4] = m4;
        this.m[5] = m5;
        this.m[6] = m6;
        this.m[7] = m7;
        this.m[8] = m8;
    },

    identity: function () {
        this.m[0] = 1;
        this.m[1] = 0;
        this.m[2] = 0;
        this.m[3] = 0;
        this.m[4] = 1;
        this.m[5] = 0;
        this.m[6] = 0;
        this.m[7] = 0;
        this.m[8] = 1;
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
    },

    translation: function (x, y, z) {
        this.m[0] = 1;
        this.m[1] = 0;
        this.m[2] = 0;
        this.m[3] = 0;
        this.m[4] = 1;
        this.m[5] = 0;
        this.m[6] = x;
        this.m[7] = y;
        this.m[8] = 1;
    },

    scaling: function (x, y, z) {
        this.m[0] = x;
        this.m[1] = 0;
        this.m[2] = 0;
        this.m[3] = 0;
        this.m[4] = y;
        this.m[5] = 0;
        this.m[6] = 0;
        this.m[7] = 0;
        this.m[8] = z;
    },

    rotationX: function (radian) {
        var s = Math.sin(radian);
        var c = Math.cos(radian);
        this.m[0] = 1;
        this.m[1] = 0;
        this.m[2] = 0;
        this.m[3] = 0;
        this.m[4] = c;
        this.m[5] = s;
        this.m[6] = 0;
        this.m[7] = -s;
        this.m[8] = c;
    },

    rotationY: function (radian) {
        var s = Math.sin(radian);
        var c = Math.cos(radian);
        this.m[0] = c;
        this.m[1] = 0;
        this.m[2] = -s;
        this.m[3] = 0;
        this.m[4] = 1;
        this.m[5] = 0;
        this.m[6] = s;
        this.m[7] = 0;
        this.m[8] = c;
    },

    rotationZ: function (radian) {
        var s = Math.sin(radian);
        var c = Math.cos(radian);
        this.m[0] = c;
        this.m[1] = s;
        this.m[2] = 0;
        this.m[3] = -s;
        this.m[4] = c;
        this.m[5] = 0;
        this.m[6] = 0;
        this.m[7] = 0;
        this.m[8] = 1;
    },

    decomposition: function (kQ, kD, kU) {
        var kM = this;

        var fInvLength = this.invertSqrt(kM.m[0]*kM.m[0] + kM.m[3]*kM.m[3] + kM.m[6]*kM.m[6]);
        kQ.m[0] = kM.m[0]*fInvLength;
        kQ.m[3] = kM.m[3]*fInvLength;
        kQ.m[6] = kM.m[6]*fInvLength;

        var fDot = kQ.m[0]*kM.m[1] + kQ.m[3]*kM.m[4] + kQ.m[6]*kM.m[7];
        kQ.m[1] = kM.m[1]-fDot*kQ.m[0];
        kQ.m[4] = kM.m[4]-fDot*kQ.m[3];
        kQ.m[7] = kM.m[7]-fDot*kQ.m[6];
        fInvLength = this.invertSqrt(kQ.m[1]*kQ.m[1] + kQ.m[4]*kQ.m[4] + kQ.m[7]*kQ.m[7]);
        kQ.m[1] *= fInvLength;
        kQ.m[4] *= fInvLength;
        kQ.m[7] *= fInvLength;

        fDot = kQ.m[0]*kM.m[2] + kQ.m[3]*kM.m[5] + kQ.m[6]*kM.m[8];
        kQ.m[2] = kM.m[2]-fDot*kQ.m[0];
        kQ.m[5] = kM.m[5]-fDot*kQ.m[3];
        kQ.m[8] = kM.m[8]-fDot*kQ.m[6];
        fDot = kQ.m[1]*kM.m[2] + kQ.m[4]*kM.m[5] + kQ.m[7]*kM.m[8];
        kQ.m[2] -= fDot*kQ.m[1];
        kQ.m[5] -= fDot*kQ.m[4];
        kQ.m[8] -= fDot*kQ.m[7];
        fInvLength = this.invertSqrt(kQ.m[2]*kQ.m[2] + kQ.m[5]*kQ.m[5] + kQ.m[8]*kQ.m[8]);
        kQ.m[2] *= fInvLength;
        kQ.m[5] *= fInvLength;
        kQ.m[8] *= fInvLength;

        // guarantee that orthogonal matrix has determinant 1 (no reflections)
        var fDet = kQ.m[0]*kQ.m[4]*kQ.m[8] + kQ.m[1]*kQ.m[5]*kQ.m[6] +
            kQ.m[2]*kQ.m[3]*kQ.m[7] - kQ.m[2]*kQ.m[4]*kQ.m[6] -
            kQ.m[1]*kQ.m[3]*kQ.m[8] - kQ.m[0]*kQ.m[5]*kQ.m[7];

        if (fDet < 0.0)
        {
            for (var iRow = 0; iRow < 3; iRow++)
            {
                for (var iCol = 0; iCol < 3; iCol++)
                {
                    kQ.m[3*iRow+iCol] = -kQ.m[3*iRow+iCol];
                }
            }
        }

        // build "right" matrix R
        var kR = new Matrix3f();
        kR.m[0] = kQ.m[0]*kM.m[0] + kQ.m[3]*kM.m[3] + kQ.m[6]*kM.m[6];
        kR.m[1] = kQ.m[0]*kM.m[1] + kQ.m[3]*kM.m[4] + kQ.m[6]*kM.m[7];
        kR.m[4] = kQ.m[1]*kM.m[1] + kQ.m[4]*kM.m[4] + kQ.m[7]*kM.m[7];
        kR.m[2] = kQ.m[0]*kM.m[2] + kQ.m[3]*kM.m[5] + kQ.m[6]*kM.m[8];
        kR.m[5] = kQ.m[1]*kM.m[2] + kQ.m[4]*kM.m[5] + kQ.m[7]*kM.m[8];
        kR.m[8] = kQ.m[2]*kM.m[2] + kQ.m[5]*kM.m[5] + kQ.m[8]*kM.m[8];

        // the scaling component
        kD.x = kR.m[0];
        kD.y = kR.m[4];
        kD.z = kR.m[8];

        // the shear component
        var fInvD0 = 1.0/kD.x;
        kU.x = kR.m[1]*fInvD0;
        kU.y = kR.m[2]*fInvD0;
        kU.z = kR.m[5]/kD.y;
    },

    transpose: function () {
        var matrix = new Matrix3f();
        for (var i = 0; i < 3; i++) {
            var nBase = i * 3;
            matrix.m[i] = this.m[nBase];
            matrix.m[i + 3] = this.m[nBase + 1];
            matrix.m[i + 6] = this.m[nBase + 2];
        }
        return matrix;
    },

    invertSqrt: function (r) {
        return 1.0 / Math.sqrt(r);
    },

} );

Matrix3f.prototype.multiplyMV = function (v, matrix) {
    var m11 = 0, m12 = 0, m13 = 0;
    m11 = v.x * matrix.m[0] + v.y * matrix.m[3] + v.z * matrix.m[6];
    m12 = v.x * matrix.m[1] + v.y * matrix.m[4] + v.z * matrix.m[7];
    m13 = v.x * matrix.m[2] + v.y * matrix.m[5] + v.z * matrix.m[8];
    return new Vector3(m11, m12, m13);
};
