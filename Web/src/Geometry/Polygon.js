import {
    Geometry
} from "./Geometry"
import {
    Point
} from "./Point"
/**
 * @module Geometry
 */
/**
 * Geometry的子级，他具有将线连接为一个闭合的多边形
 * <a href="../../examples/Test_Polygon.html">Polygon.html:40</a>
 * 
 * @class Polygon
 * @param {Array} path 三维数组，每个点由经度、纬度两个值组成，两个点之绘制线，最后线的起点和终点闭合为一个面层
 * @constructor
 * @extends Geometry
 */
function Polygon(path) {
    Geometry.call(this);
    this.type = "Polygon";
    this.path = path !== undefined ? path : [];

}

Polygon.prototype = Object.assign(Object.create(Geometry.prototype), {
    isPolygon: true,

    /**
     * 添加多边形的经度纬度信息
     * 
     * @method addPath
     * @param {Array} points 多边形的经度位置数值
     * @return {Object} 返回 Polygon对象
     */
    addPath: function (points) {
        this.path = points;
        return this;

    },

    /**
     * 获取点坐标对象
     * 
     * @method getPoint
     * @param {Int} pathIndex 多边形数据源索引
     * @param {Int} pointIndex 多边形数据源里点的索引
     * @return {Object} 返回 Point对象
     */
    getPoint: function (pathIndex, pointIndex) {
        return new Point(this.path[pathIndex - 1][pointIndex - 1]);
    },
    insertPoint: function () {

    },
    removeRing: function (index) {

    },
    removePoint: function () {

    },

    /**
     * 线追加点
     * 
     * @method setPoint
     * @param {Object} point 点的经纬度位置信息
     * @param {Number} index 要插入的位置索引
     */
    setPoint: function (point, index) {
        var _index = index !== undefined ? index : 0;
        this.path[_index].splice(this.path[_index].length - 2, 0, [point.x, point.y]);
        this.dispatchEvent({
            type: "addPoint"
        });
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

    clone: function () {

        return new this.constructor(this.path);

    },

    /**
     * 复制线的位置信息
     * 
     * @method copy
     * @param {Object} p 线的经纬度位置信息
     * @return {Object} 返回 Line对象
     */
    copy: function (p) {
        this.path = p.path;
        return this;
    }
});

export {
    Polygon
}