import {Layer} from '../Layer/Layer';
import {OpenLayer} from '../OpenLayer/openLayer';
/***
 *
 * @param options
 * @author wy
 */
/**
 * @module Layer
 */
/**
 * ThemeLabelLayer是标签图层。
 * 
 * @class ThemeLabelLayer
 * @extends Layer
 * @param {Object} options </br>
 * [url] — 图层数据的来源地址url。</br>
 * [id] — 图层的唯一id。</br>
 * @constructor
 */

var themeLabelLayer =1;
function ThemeLabelLayer(options) {
    Layer.call(this);
    options = options || {};
    this.openLayer = new OpenLayer()
    this.type = "ThemeLabelLayer";
    this.url = options.url !== undefined ? options.url : "";
    this.data = options.data !== undefined ? options.data : "";
    this.id = options.id !== undefined ?options.id : "ThemeLabelLayer"+themeLabelLayer++;
    this.projection  = options.projection !== undefined ? options.projection : "EPSG:4326";
    this.initData(options);
}
ThemeLabelLayer.prototype =Object.assign(Object.create(Layer.prototype),{
    /**
     * initLayer
     * <p>初始化图层，根据传参option对数据进行重新赋值。</p>
     */
    initLayer:function () {

    },
    handleData:function (self) {

    },
    innerSource:function(type){
        if(type ==1){

        }else if(type==2){
            this.olSource = new PIE.ol.source.Cluster({
                distance: 40,
                source: new PIE.ol.source.Vector()
            });
            this.olSource.id = this.id;
            return this.olSource;

        }else if(type == 3){

            }
    },
    innerLayer:function(type){
         if(type==1){ 

        }else if(type ==2){
            var currentResolution;
            let _this=this;
            this.olLayer = new PIE.ol.layer.Vector({
                source: this.olSource,
                style: function (feature, resolution) {
                    if (resolution != currentResolution) {
                        var maxFeatureCount;
                        maxFeatureCount = 0;
                        var features = _this.olLayer.getSource().getFeatures();
                        var feature, radius;
                        for (var i = features.length - 1; i >= 0; --i) {
                            feature = features[i];
                            var originalFeatures = feature.get('features');
                            var extent = PIE.ol.extent.createEmpty();
                            var j, jj;
                            for (j = 0, jj = originalFeatures.length; j < jj; ++j) {
                                PIE.ol.extent.extend(extent, originalFeatures[j].getGeometry().getExtent());
                            }
                            maxFeatureCount = Math.max(maxFeatureCount, jj);
                            radius = 0.25 * (PIE.ol.extent.getWidth(extent) + PIE.ol.extent.getHeight(extent)) /
                                resolution;
                            feature.set('radius', radius);
                        }
                        currentResolution = resolution;
                    }
                    var style;
                    var size = feature.get('features').length;
                    if (size > 1) {
                        style = new PIE.ol.style.Style({
                          image: new PIE.ol.style.Circle({
                            radius: feature.get('radius'),
                            fill: new PIE.ol.style.Fill({
                              color: [255, 153, 0, 0.8]
                            })
                          }),
                          text: new PIE.ol.style.Text({
                            text: size.toString(),
                            fill: new PIE.ol.style.Fill({
                                color: '#fff'
                              }),
                            stroke: new PIE.ol.style.Stroke({
                                color: 'rgba(0, 0, 0, 0.6)',
                                width: 3
                              })
                          })
                        });
                    } else {
                        // var originalFeature = feature.get('features')[0];
                        // style = _this.createEarthquakeStyle(originalFeature);
                    }
                    return style;
                }
            });
            this.olLayer.id = this.id;
            return this.olLayer;
        }else if(type == 3){

        }
    },
    onAdd:function(map,type){
        this._map = map;
        if(type == 1){
            map.addLayer(this.layer);
        }else if(type==2){
            let _this = this;
            var features=new PIE.ol.format.GeoJSON().readFeatures(this.data, {
                featureProjection:"EPSG:3857"
            });
            _this.olSource.source=new PIE.ol.source.Vector({features:features});
            map.addLayer(this.olLayer);
            return  this.olLayer;
        }else if(type ==3){

        }
    },
    createEarthquakeStyle:function(feature) {
        var name = feature.get('mag');
        var magnitude = parseFloat(name);
        var radius = 5 + 20 * (magnitude - 5);
        return new PIE.ol.style.Style({
            geometry: feature.getGeometry(),
            image: new PIE.ol.style.RegularShape({
                radius1: radius,
                radius2: 3,
                points: 5,
                angle: Math.PI,
                fill: new PIE.ol.style.Fill({
                    color: 'rgba(255, 153, 0, 0.8)'
                }),
                stroke: new PIE.ol.style.Stroke({
                    color: 'rgba(255, 204, 0, 0.2)',
                    width: 1
                })
            })
        });
    }

});

export {ThemeLabelLayer}