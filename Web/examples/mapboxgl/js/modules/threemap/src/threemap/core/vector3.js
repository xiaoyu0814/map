import {Matrix4d} from "./matrix4d";
//import {MathEngine} from "./mathengine";
import {Vector4} from "./vector4";

function Vector3(x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
}

Object.assign(Vector3.prototype, {

    normalize: function () {
        var length = this.length();
        if (length != 0) {
            this.x /= length;
            this.y /= length;
            this.z /= length;
        }
    },

    normalized: function () {
        var v = new Vector3(this.x, this.y, this.z);
        v.normalize();
        return v;
    },

    length: function () {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    },

    scale: function (s) {
        return new Vector3(this.x*s, this.y*s, this.z*s);
    },

    isZero: function () {
        //return MathEngine.isZero(this.length());
        var value = this.length();
        return ((value<1e-13) && (value>-1e-13));
    },

    cross: function (vec) {
        return new Vector3(this.y * vec.z - this.z * vec.y, this.z * vec.x - this.x * vec.z, this.x * vec.y - this.y * vec.x);
    },

    dot: function (vec) {
        return (this.x * vec.x + this.y * vec.y + this.z * vec.z);
    },

    sub: function (vec) {
        return new Vector3(this.x-vec.x, this.y-vec.y, this.z-vec.z);
    },

    add: function (vec) {
        return new Vector3(this.x+vec.x, this.y+vec.y, this.z+vec.z);
    },

    subVectors: function (a, b) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.z = a.z - b.z;
        return this;
    },

    crossVectors: function ( a, b ) {
        var ax = a.x, ay = a.y, az = a.z;
        var bx = b.x, by = b.y, bz = b.z;

        this.x = ay * bz - az * by;
        this.y = az * bx - ax * bz;
        this.z = ax * by - ay * bx;

        return this;
    },

    copy: function (vec) {
        vec.x = this.x;
        vec.y = this.y;
        vec.z = this.z;
        return vec;
    },

    clone: function () {
        return new Vector3(this.x, this.y, this.z);
    },

    multiply: function (v, matrix) {
        var w = 1;
        var m11 = 0, m12 = 0, m13 = 0;

        m11 = v.x * matrix.m[0] + v.y * matrix.m[4] + v.z * matrix.m[8] + w * matrix.m[12];
        m12 = v.x * matrix.m[1] + v.y * matrix.m[5] + v.z * matrix.m[9] + w * matrix.m[13];
        m13 = v.x * matrix.m[2] + v.y * matrix.m[6] + v.z * matrix.m[10] + w * matrix.m[14];

        return new Vector3(m11, m12, m13);
    },

    project: function (viewport, projection, view, world) {
        var m = Matrix4d.prototype.multiply(view, world);
        var v = new Vector4(this.x, this.y, this.z, 1.0);

        v = Vector4.prototype.multiply(v, m);
        v = Vector4.prototype.multiply(v, projection);
        if (v.w == 0) {
            return;
        }

        v.x /= v.w;
        v.y /= v.w;
        v.z /= v.w;

        /* Map x, y and z to range 0-1 */
        v.x = v.x * 0.5 + 0.5;
        v.y = v.y * 0.5 + 0.5;
        v.z = v.z * 0.5 + 0.5;

        /* Map x,y to viewport */
        v.x = v.x * viewport[2] + viewport[0];
        v.y = v.y * viewport[3] + viewport[1];

        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
    },

    unProject: function (viewport, projection, view, world) {
        var m = Matrix4d.prototype.multiply(view, world);
        var m = Matrix4d.prototype.multiply(projection, m);
        var m = m.invert();

        var v = new Vector4();
        v.x = 2.0 * (this.x - viewport[0]) / viewport[2] - 1.0;
        v.y = 2.0 * (this.y - viewport[1]) / viewport[3] - 1.0;
        v.z = 2.0 * this.z - 1.0;
        v.w = 1.0;

        v = Vector4.prototype.multiply(v, m);
        if (v.w == 0.0) {
            return;
        }

        this.x = v.x / v.w;
        this.y = v.y / v.w;
        this.z = v.z / v.w;
    },

} );

export  { Vector3 };
