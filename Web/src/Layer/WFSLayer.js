import {Layer} from './Layer';

/***
 *
 * @param options
 * @author xll
 */
/**
 * @module Layer
 */
/**
 * WFSLayerWeb要素服务（WFS）返回的是要素级的GML编码，并提供对要素的增加、修改、删除等事务操作，是对Web地图服务的进一步深入。
 * OGC Web要素服务允许客户端从多个Web要素服务中取得使用地理标记语言（GML）编码的地理空间数据，
 * GetCapabilites返回Web要素服务性能描述文档（用XML描述）；
 * DescribeFeatureType返回描述可以提供服务的任何要素结构的XML文档；
 * GetFeature为一个获取要素实例的请求提供服务；Transaction为事务请求提供服务；
 * LockFeature处理在一个事务期间对一个或多个要素类型实例上锁的请求。
 *
 * @class WFSLayer
 * @extends Layer
 * @param {Object} options </br>
 * [url] — 栅格图层数据的来源地址url。</br>
 * [tileSize] — 瓦片尺寸，如果没有设置，默认为256。</br>
 * [id] — 图层的唯一id。</br>
 * [opacity] — 图层的透明度，不透明默认为1。</br>
 * [region] - 栅格图层的范围，默认范围[-180,-90,180,90]
 * @constructor
 */
var wfsLayer = 1;

function WFSLayer(options) {
    Layer.call(this);
    options = options || {};
    this.type = "WFSLayer";
    this.url = options.url !== undefined ? options.url : "";
    this.tileSize = options.tileSize !== undefined ? options.tileSize : 256;
    this.id = options.id !== undefined ? options.id : "wfsLayer" + wfsLayer++;
    this.opacity = options.opacity !== undefined ? options.opacity : 1;
    this.projection = options.projection !== undefined ? options.projection : "EPSG:4326";
    this.region = options.region !== undefined ? options.region : [-180, -90, 180, 90];
    // this.bounds = options.bounds !== undefined ? options.bounds : [ -20037508.3427892,-20037508.3427892,20037508.3427892, 20037508.3427892];

}

WFSLayer.prototype = Object.assign(Object.create(Layer.prototype), {
    innerSource: function (type) {
        if (type == 1) {
            this.mapSource = {
                id: this.id,
                source: {
                    "type": "geojson",
                    "data":this.url
                }
            };
            return this.mapSource;
        } else if (type == 2) {
            
            this.olSource = new PIE.ol.source.Vector({
                format: new PIE.ol.format.GeoJSON(),
                url: this.url,
                strategy: PIE.ol.loadingstrategy.bbox
            });
            this.olSource.id = this.id;
            return this.olSource;
        } else if (type == 3) {
            var styleDefault = {
                show:true,
                stroke:Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString('#00f'),1),
                fill: Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString('#00f'),1),
                strokeWidth:2,
                markerSize:0,
                clampToGround:true
            }
            this.promiseSource = Cesium.GeoJsonDataSource.load(this.url,styleDefault)
            this.promiseSource.id=this.id;
            return  this.promiseSource;
        }
    },
    innerLayer: function (type) {
        if (type == 1) {
            this.layer = {
                "id": this.id,
                "type": "line",
                "source": this.id,
                'paint': {
                    "line-opacity": this.opacity,
                    "line-color": 'rgba(0, 0, 255, 1.0)',
                    "line-width": 2
                    }
            };
            //if()
            return this.layer;
        } else if (type == 2) {
           
            this.olLayer = new PIE.ol.layer.Vector({
                source: this.olSource,
                style: new PIE.ol.style.Style({
                    stroke: new PIE.ol.style.Stroke({
                        color: 'rgba(0, 0, 255, 1.0)',
                        width: 2
                    }),

                    fill: new PIE.ol.style.Fill({ //矢量图层填充颜色，以及透明度
                        color: 'rgba(255,113,252,0.6)'
                    }),

                    text: new PIE.ol.style.Text({ //文本样式
                        font: '12px Calibri,sans-serif',
                        fill: new PIE.ol.style.Fill({
                            color: '#000'
                        }),
                        stroke: new PIE.ol.style.Stroke({
                            color: '#fff',
                            width: 3
                        })
                    }),

                    image: new PIE.ol.style.Circle({//点的半径及颜色
                        radius: 5,
                        fill: new PIE.ol.style.Fill({
                            color: '#f0ff14'
                        })
                    }),
                })
            });
            this.olLayer.id = this.id;
            return this.olLayer;

        } else if (type == 3) {
            this.ceLayer={
                id:this.id,
            }
           return  this.ceLayer;
        }
    },
    onAdd: function (map, type) {
        this._map = map;
        let _this = this;
        if (type == 1) {
            map.addLayer(this.layer);
        } else if (type == 2) {
            map.addLayer(this.olLayer);
        } else if (type == 3) {
            this.promiseSource.then(function(dataSource){
                map.dataSources.add(dataSource);
                _this.ceLayer = dataSource;
                console.log("添加图层成功");
            })
        }
    }
});

export {WFSLayer}