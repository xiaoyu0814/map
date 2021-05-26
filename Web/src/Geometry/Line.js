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
 * Geometry的子级，将两个点之间绘制连接线
 * <a href="../../examples/Test_LayerSet.html">LayerSet.html:45</a>
 *
 * @class Line
 * @param {Array} path 二维数组，每个点由经度、纬度两个值组成，两个点之绘制线
 * @constructor
 * @extends Geometry 
 */
function Line(path) {
    Geometry.call(this);

    this.type = "Line";
    this.path = path !== undefined ? path : [];
}

Line.prototype = Object.assign(Object.create(Geometry.prototype), {
    isLine: true,

    /**
     * 添加并绘制线
     * 
     * @method addPath
     * @param {Array} points 点的经度位置数值
     * @return {Object} 返回 Line对象
     */
    addPath: function (points) {
        this.path = points;
        return this;
    },

    /**
     * 获取点坐标对象
     * 
     * @method getPoint
     * @param {Int} pathIndex 线数据源索引
     * @param {Int} pointIndex 线数据源里点的索引
     * @return {Object} 返回 Point对象
     */
    getPoint: function (pathIndex, pointIndex) {
        return new Point(this.path[pathIndex - 1][pointIndex - 1]);
    },

    /**
     * 线增加点
     * 
     * @method insertPoint
     * @param {Object} point 点的经纬度位置信息
     * @param {Int} index 要插入的线数据源索引位置
     */
    insertPoint: function (point, index) {
        this.path.splice(index, 0, [point.x, point.y]);
        this.dispatchEvent({
            type: "addPoint"
        });

    },

    removePath: function () {

    },
    
    removePoint: function (point, index) {

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
     * 线追加点
     * 
     * @method setPoint
     * @param {Object} point 点的经纬度位置信息
     */
    setPoint: function (point) {
        this.path.push([point.x, point.y]);
        this.dispatchEvent({
            type: "addPoint"
        });
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
    Line
}