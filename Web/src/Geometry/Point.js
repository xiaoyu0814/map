import {
    Geometry
} from "./Geometry"
/**
 * @module Geometry
 */
/**
 * Geometry的子级，它具有x和y属性表示屏幕坐标中的像素
 * <a href="../../examples/Test_LayerSet.html">LayerSet.html:39</a>
 *
 * @class Point
 * @param {Number} x 点的经度位置数值
 * @param {Number} y 点的纬度位置数值
 * @constructor
 * @extends Geometry
 */
function Point(x, y) {
    Geometry.call(this);
    this.type = "Point";
    this.x = 0 || x;
    this.y = 0 || y;
    if (x instanceof Array) {
        this.x = x[0];
        this.y = x[1];
    }

}

Point.prototype = Object.assign(Object.create(Geometry.prototype), {
    isPoint: true,

    /**
     * 设置点的经度纬度
     * 
     * @method set
     * @param {Number} x 点的经度位置数值
     * @param {Number} y 点的纬度位置数值
     * @return {Object} Point对象
     */
    set: function (x, y) {

        this.x = x;
        this.y = y;

        return this;

    },

    /**
     * 设置经度位置
     * 
     * @method setX
     * @param {Number} x 经度位置数值
     * @return {Object} Point对象
     */
    setX: function (x) {

        this.x = x;

        return this;

    },

    /**
     * 设置纬度位置
     * 
     * @method setY
     * @param {Number} y 纬度位置数值
     * @return {Object} Point对象
     */
    setY: function (y) {

        this.y = y;

        return this;

    },

    /**
     * 获取符号信息
     * 
     * @method getSymbol
     * @return {Object} Symbol对象
     */
    getSymbol: function () {
        return this.Symbol;
    },

    /**
     * 设置符号信息
     * 
     * @method setSymbol
     * @param {Object} symbol symbol对象
     */
    setSymbol: function (symbol) {
        this.Symbol.set(symbol);
    },

    /**
     * 传入的点位置与当前点位置对比
     * 
     * @method equals
     * @param {Object} p 要对比度点位置信息
     * @return {Boole} 返回 true：一样，false：不一样
     */
    equals: function (p) {
        return ((p.x === this.x) && (p.y === this.y));
    },

    /**
     * 获取传入点与当前点的距离
     * 
     * @method distance
     * @param {Object} p 要对比度点位置信息
     * @return {Number} 返回 传入点与当前点的距离
     */
    distance: function (p) {
        return Math.sqrt(this.distanceToSquared(p));
    },

    /**
     * 获取传入点与当前点的距离的平方
     * 
     * @method distanceToSquared
     * @param {Object} p 要对比度点位置信息
     * @return {Number} 返回 传入点与当前点的距离的平方
     */
    distanceToSquared: function (p) {

        var dx = this.x - p.x,
            dy = this.y - p.y;

        return dx * dx + dy * dy;

    },
    normalize: function () {

    },

    /**
     * 克隆点的位置信息
     * 
     * @method clone
     * @return {Object} 返回 传入点与当前点的距离的平方
     */
    clone: function () {

        return new this.constructor(this.x, this.y);

    },

    /**
     * 复制点的位置信息
     * 
     * @method copy
     * @param {Object} p 点的经纬度位置信息
     * @return {Object} 返回 Point对象
     */
    copy: function (p) {
        this.x = p.x;
        this.y = p.y;

        return this;
    }
});

export {
    Point
}