import {MathEngine} from "./mathengine.js";
import {Vector2} from "./vector2";

function Bounds(l, t, r, b) {
    this.left = l;
    this.top = t;
    this.right = r;
    this.bottom = b;
}

Object.assign(Bounds.prototype, {

    setEmpty: function () {
        this.left = this.top = this.right = this.bottom = 0;
    },

    isEmpty: function () {
        return this.left >= this.right || this.bottom >= this.top;
    },

    isNull: function () {
        return MathEngine.isZero(this.left) && MathEngine.isZero(this.right) && MathEngine.isZero(this.bottom) && MathEngine.isZero(this.top);
    },

    isEqual: function (other) {
        return MathEngine.isEqual(this.left, other.left) && MathEngine.isEqual(this.right, other.right) && MathEngine.isEqual(this.bottom, other.bottom) && MathEngine.isEqual(this.top, other.top);
    },

    getWidth: function () {
        return this.right - this.left;
    },

    getHeight: function () {
        return this.top - this.bottom;
    },

    unionPoint: function (point) {
        if (this.left > point.x) {
            this.left = point.x;
        }
        if (this.right < point.x) {
            this.right = point.x;
        }
        if (this.top < point.y) {
            this.top = point.y;
        }
        if (this.bottom > point.y) {
            this.bottom = point.y;
        }
    },

    unionBounds: function (bounds) {
        if (this.left > bounds.left) {
            this.left = bounds.left;
        }
        if (this.right < bounds.right) {
            this.right = bounds.right;
        }
        if (this.top < bounds.top) {
            this.top = bounds.top;
        }
        if (this.bottom > bounds.bottom) {
            this.bottom = bounds.bottom;
        }
    },

    inflate: function (leftmargin, topmargin, rightmargin, bottommargin) {
        this.left -= leftmargin;
        this.top += topmargin;
        this.right += rightmargin;
        this.bottom -= bottommargin;
    },

    deflate: function (leftmargin, topmargin, rightmargin, bottommargin) {
        this.inflate(-leftmargin, -topmargin, -rightmargin, -bottommargin);
    },

    isIntersect: function (r) {
        return this.right>=r.left && this.left<=r.right && this.top>=r.bottom && this.bottom<=r.top;
    },

    intersectRect: function (r) {
        if (this.isIntersect(r)) {
            this.left = Math.max(this.left, r.left);
            this.top = Math.min(this.top, r.top);
            this.right = Math.min(this.right, r.right);
            this.bottom = Math.max(this.bottom, r.bottom);
            return true;
        }
        return false;
    },

    getCenter: function () {
        return new Vector2((this.right + this.left)/2, (this.top + this.bottom)/2);
    },

    copy: function (bounds) {
        this.left = bounds.left;
        this.top = bounds.top;
        this.right = bounds.right;
        this.bottom = bounds.bottom;
    },

} );

export { Bounds };
