import {Layer} from './Layer';
/**
 * @module Layer
 */
/***
 *
 * @param options
 * @author yqq
 */
/**
 * VectorTileLayer访问缓存的数据块并以矢量格式呈现它。WebTileLayer呈现为一系列图像，而不是矢量数据。 使用与图块分开的样式信息渲染每个图层。这意味着可以通过多种方式设置一组矢量图块，而不必为每种样式生成新的图像缓存。这节省了空间并加快了创建新地图样式的过程。
 * <a href="../../examples/Layer_VectorTileLayer.html">vectorTileLayer.html</a>
 * 
 * @class VectorTileLayer
 * @extends Layer
 * @param {Object} options <br/>
 * [type] — 对于VectorTileLayer，类型默认是VectorTileLayer。<br/>
 * [url] — 矢量切片服务的URL，或者用于渲染图层的矢量切片的样式资源的URL</br>
 * [style] — 矢量图层的样式。</br>
 * [title] — 标识矢量图层的标题。</br>
 * [sprite] — 矢量图层的元素，用于检索图层和元数据的基本URL。</br>
 * [minScale] — 栅格图层在视图中可见的最小比例（最大缩小），没设置时默认为0。</br>
 * [maxScale] — 栅格图层在视图中可见的最大比例（放大最多），没设置时默认为0。</br>
 * @constructor
 */
function VectorTileLayer(options) {
    Layer.call(this);
    options = options || {};
    var self = this
    this.type = "VectorTileLayer";
    this.url = options.url !== undefined ? options.url:"";
    this.style = options.style !== undefined ? options.style : "";
    this.title = options.title !== undefined ?options.title:"";
    this.sprite = options.sprite !== undefined ?options.sprite:"";
    this.minScale = options.minScale !== undefined ? options.minScale : 0;
    this.maxScale = options.maxScale !== undefined ? options.maxScale : 0;
    this.getData( this.url, self.addStyle)
    // .then(this.addStyle);
}

VectorTileLayer.prototype =Object.assign(Object.create(Layer.prototype),{
    /**
     * addStyle
     * <p>给矢量图层增加样式。</p>
     * @method addStyle
     * @param{Object} self 矢量图层的样式设置，包含sprite元素和style样式。
     */
    addStyle:function (self) {
        console.log(self);
        if(self.sprite != ""){
            self.data.sprite = self.sprite;
        }
        self.style = self.data;
        self.setLoad();
    }
});

export {VectorTileLayer}