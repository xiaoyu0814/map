import {
    Geometry
} from "../Geometry/Geometry"
import {
    Symbol
} from "../Symbol/Symbol"
import {
    Layer
} from "../Layer/Layer"

/**
 * @module Graphics
 */
/***
 *
 * @param options
 * @author yqq
 */

/**
 * Geometry定义了对象的形状
 * Symbol定义了图形是如何显示的
 * Graphic可以包含一些属性信息，并且在Javascript中还可以使用infoTemplate（一个infoTemplate包含标题和内容模板字符串，该内容模板字符串用于将Graphics的属性转换成HTML表达式）定义如何对属性信息进行显示，最终的Graphics则被添加到GraphicsLayer中，GraphicsLayer允许对Graphics进行监听，对于Graphicsde的描述可以用一个数学表达式来表示：
Graphics=Geometry + Attribute + Symbol + infoTemplate<br/>
 *
 * @class Graphics
 * @param {Object} options 
 * [attributes] — 介绍属性信息（可选）<br/>
 * [geometry] — 定义了对象的形状（必选）<br/>
 * [symbol] — 几何体样式（必选）<br/>
 * [id] — 绘制类型的id（可选）<br/>
 * [opacity] — 透明度0-1（可选）<br/>
 * [visible] — 是否显示（可选）<br/>
 * @constructor
 * @extends Layer
 */
function Graphics(options) {
    options = options || {};
    Layer.call(this);
    this.attributes = "" || options.attributes;
    this.geometry = options.geometry !== undefined ? options.geometry : new Geometry();
    this.symbol = options.symbol !== undefined ? options.symbol : new Symbol();
    this.type = "Graphics";
    this.id = options.id !== undefined ? options.id : this.geometry.id;
    this.opacity = options.opacity !== undefined ? options.opacity : 1;
    this.visible = options.visible!== undefined ? options.visible : "visible";
    this.data = {
        "type": "FeatureCollection",
        "features": []
    };
}
Graphics.prototype = Object.assign(Object.create(Layer.prototype), {
    /**
     * 初始化当前图层数据，合并数据源与图层源为一个整体的图层
     * 
     * @method initData
     */
    initData: function () {
        var self = this;
        console.log(this);
        var source_data = this.geometry.toJSON();
        if (source_data instanceof Array) {
            this.data.features = source_data
        } else {
            this.data.features.push(source_data)
        }
        this.source = {
            "id": this.id,
            "source": {
                "type": "geojson",
                "data": this.data
            }
        };
        this.layer = Object.assign({
            "id": this.id,
            "source": this.id,
        }, this.symbol.toJSON());
        if(this.visible !== undefined){
            if(this.visible == "none" || this.visible == false){
                this.visible = "none"
            }else if(this.visible == "visible" || this.visible == true){
                this.visible = "visible"
            }
            if(this.layer.layout)
            {
                this.layer.layout.visibility = this.visible
            }
            
        }
        if(this.opacity !== undefined){
            if(this.layer.type == "circle"){
                this.layer.paint["circle-opacity"] = this.opacity
            }else if(this.layer.type == "line"){
                this.layer.paint["line-opacity"] = this.opacity
            }else if(this.layer.type == "fill"){
                this.layer.paint["fill-opacity"] = this.opacity
            }
        }
        this.color=this.symbol.getColor();

    },
    clone: function () {

    },
    fromJSON: function () {

    },
    getAttribute: function () {

    },
    setAttribute: function () {

    },

    /**
     * 获取当前图层的样式信息
     * 
     * @method getStyle
     */
    getStyle: function () {
        return this.symbol.toJSON().style
    },
    toJSON: function () {

    }
});

export {
    Graphics
}