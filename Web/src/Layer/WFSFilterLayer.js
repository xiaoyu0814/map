import {Layer} from './Layer';
import {QueryFilter} from '../Filter/QueryFilter';

/***
 *
 * @param options
 * @author wy
 */
  /**
 * @module Layer
 */
/**
 * WFSFilterLayer是访问wfs服务，并根据要素进行查询。
 * 
 * @class WFSFilterLayer
 * @extends Layer
 * @param {Object} options </br>
 * [url] — 栅格图层数据的来源地址url。</br>
 * [id] — 图层的唯一id。</br>
 * [queryType] — 查询类型，1:范围查询;2:ID查询;3:字段查询;4:地物查询;5:绘制查询,如果没有设置，默认为1。</br>
 * [srsName] — 图层的投影类型，默认为"EPSG:4326"。</br>
 * [featureTypes] — 所访问的图层，默认为['GlobalLakesRegion-WGS1984']。</br>
 * @constructor
 */

var wfsFilterLayer =1;
function WFSFilterLayer(options) {
    Layer.call(this);
    options = options || {};
    this.type = "WFSFilterLayer";
    this.url = options.url !== undefined ? options.url : "";
    this.id = options.id !== undefined ?options.id : "WFSFilterLayer"+wfsFilterLayer++;
    this.projection  = options.projection !== undefined ? options.projection : "EPSG:4326";
    this.queryType = options.queryType !== undefined ? options.queryType : 1;
    this.srsName = options.srsName !== undefined ? options.srsName : "EPSG:4326";
    this.featureTypes = options.featureTypes !== undefined ? options.featureTypes : ['GlobalLakesRegion-WGS1984'];
    this.maxFeatures = options.maxFeatures !== undefined ? options.maxFeatures : 5000;
    this.outputFormat = options.outputFormat !== undefined ? options.outputFormat : "application/json";
 
    this.geometry = null;
    // if(this.queryType==1){
        var polygon = new PIE.ol.geom.Polygon([[[73, 46], [101, 46], [101, 28], [73, 28], [73, 46]]]);
        this.geometry = polygon;
    // }
    // console.log( this.geometry)
    var polygon1 = new PIE.ol.geom.Polygon([[[73, 46], [101, 46], [101, 28], [73, 28], [73, 46]]]);
    polygon1.applyTransform(PIE.ol.proj.getTransform('EPSG:4326', 'EPSG:3857'));
   //范围查询时，框选图层的source
    this.polygonSource = new PIE.ol.source.Vector({
        features: [new PIE.ol.Feature(polygon1)],
        wrapX: false
    });
    this.queryfilter = null;
    switch (this.queryType) {
        case 1: this.queryfilter=QueryFilter.intersects("the_geom", this.geometry);  break;
        case 2: this.queryfilter=QueryFilter.like("COLORID", "4"); break;
        //case 3: this.queryfilter=QueryFilter.like("COLORID", "4"); break; 
        case 4: this.queryfilter=QueryFilter.like('NAME', 'Koko Nor'); break;
        case 5: this.queryfilter=QueryFilter.intersects("the_geom", this.geometry);break;
        default: this.queryfilter=QueryFilter.intersects("the_geom", this.geometry); break;
    }

    this.featureRequest = new PIE.ol.format.WFS().writeGetFeature({
        srsName: this.srsName,//坐标系
        featureTypes: this.featureTypes,//所要访问的图层
        maxFeatures: this.maxFeatures,
        outputFormat: this.outputFormat,
        filter: this.queryfilter,
    });
}
WFSFilterLayer.prototype =Object.assign(Object.create(Layer.prototype),{
    /**
     * initLayer
     * <p>初始化图层，根据传参option对数据进行重新赋值。</p>
     */
    initLayer:function () {
    },
    innerSource:function(type){
        if(type ==1){
            this.mapSource = {
                id: this.id,
                source: {
                    "type": "geojson",
                    "data":{type:"FeatureCollection",features:[{type:"feature",geometry:{type:'LineString',coordinates:[]}}]}
                }
            };
            return this.mapSource;
        }else if(type==2){
            if(this.queryType==3){
                this.olSource = new PIE.ol.source.Vector({
                    format: new PIE.ol.format.GeoJSON(),
                    url: function(extent) {
                        return PIE.path.PIEVector.CityPoint;
                    },
                    strategy: PIE.ol.loadingstrategy.bbox
                });
            }else{
                this.olSource = new PIE.ol.source.Vector();
            }
            this.olSource.id = this.id;
            return this.olSource;
        }else if(type == 3){
            return 
        }
    },
    innerLayer:function(type){
         if(type==1){ 
            this.layer = {
                "id": this.id,
                "type": "line",
                "source": this.id,
                'paint': {
                    "line-opacity": 1,
                    "line-color": 'rgba(0, 0, 255, 1.0)',
                    "line-width": 2
                    }
            };
           return   this.layer
        }else if(type ==2){
            this.olLayer = new PIE.ol.layer.Vector({
                source: this.olSource,
                style: function (feature, resolution) {
                    return new PIE.ol.style.Style({
                        fill: new PIE.ol.style.Fill({
                            color: "rgba(0,0,0,0.5)"
                        }),
                        stroke: new PIE.ol.style.Stroke({
                            color: 'red',
                            width: 1
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
                                color: '#60ff24'
                            })
                        }),
                    });
                }
            });
            this.olLayer.id = this.id;
            if(this.queryType == 1){
                this.polygonLayer = new PIE.ol.layer.Vector({
                    source: this.polygonSource,
                    style: new PIE.ol.style.Style({
                        stroke: new PIE.ol.style.Stroke({
                            color: 'red',
                            width: 3
                        }),
                        fill: new PIE.ol.style.Fill({
                            color: 'rgba(0, 0, 255, 0.1)'
                        })
                    })
                });
                this.polygonLayer.id = this.id + "bound";
            }
            return this.olLayer;
        }else if(type == 3){
            return
        }
    },
    onAdd:function(map,type){
        this._map = map;
        if(type == 1){
           
            map.addLayer(this.layer)
            if(this.queryType!=3 && this.queryType!=5){
                this.post(1,this.featureRequest);
            }
        }else if(type==2){
            let Layers=[];
            Layers.push(this.olLayer);
            map.addLayer(this.olLayer);
            if(this.queryType == 1){
                Layers.push(this.polygonLayer);
                map.addLayer(this.polygonLayer);
            }
            if(this.queryType!=3 && this.queryType!=5){
                this.post(2,this.featureRequest);
            }
            let arr = {
                layers:Layers
            }
            return  arr;
        }else if(type ==3){

        }
    },
    onRemove:function(map,type){
        if(type == 1){
            
        }else if(type == 2){
            map.removeLayer(this.olLayer);
            if(this.queryType == 1){
                map.removeLayer(this.polygonLayer);
            }
           
        }else if(type == 3){

        }
    },
    post:function(type,featureRequest){
        let _this = this;
        fetch( PIE.path.PIEVector.wfs , {
            method: 'POST',
            body: new XMLSerializer().serializeToString(featureRequest)
        }).then(function (response) {
            return response.json();
        }).then(function (json) {
            if(type==1){
                console.log(_this.id);
                _this._map.getSource(_this.id).setData(json);
            }else if(type==2){
                console.log('post')
                var features = new PIE.ol.format.GeoJSON().readFeatures(json, {
                    featureProjection:"EPSG:3857"
                });
                _this.olSource.addFeatures(features);
            }else if(type==3){

            }
        });
    },
});

export {WFSFilterLayer}