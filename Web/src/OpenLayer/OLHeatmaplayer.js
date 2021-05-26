import {OLLayer} from './OLLayer';
/***
 *
 * @author yqq
 */
var lineLayer = 1;

function HeatmapLayer (options) {
    OLLayer.call(this);
    options = options || {};
    this.url = options.url !== undefined ? options.url : "";
    this.id = options.id !== undefined ? options.id : "heatmap"+lineLayer++;
    this.data = options.data !== undefined ? options.data : "";
    this.type = "heatmap";
    this.blur = options.blur !== undefined ? options.blur : 15;
    this.shadow = options.shadow !== undefined ? options.shadow : 250;
    this.extent = options.extent !== undefined ? options.extent : 100;
    this.minResolution = options.minResolution !== undefined ? options.minResolution : 0;
    this.maxResolution = options.maxResolution !== undefined ? options.maxResolution : 0;
    this.source = options.source !== undefined ? options.source : "";
    this.visible = options.visible !== undefined ? options.visible : true;
    for( item in options){
        if(item == "opacity"){
            this.opacity = options.opacity !== undefined ? options.opacity : 1;
        }else if(item == "color"){
            this.gradient = options.color !== undefined ? options.color : ['#00f', '#0ff', '#0f0', '#ff0', '#f00'];
        }else if(item == "radius"){
            this.radius = options.radius !== undefined ? options.radius : 8;
        }else if(item == "maxzoom"){
            this.zIndex = options.maxzoom !== undefined ? options.maxzoom : 9;
        }else if(item == "weight"){
            this.weight = options.weight !== undefined ? options.weight : "";
        }
    }

    this.initData(options);
};
HeatmapLayer.prototype = Object.assign( Object.create( Layer.prototype ), {
    initLayer:function (data) {
        this.layer = new ol.layer.Heatmap({
            source: new ol.source.Vector({
                features: (new ol.format.GeoJSON()).readFeatures(data, {
                    featureProjection: "EPSG:3857"
                })
            }),
            blur: this.blur,
            radius: this.radius,
            gradient:this.gradient,
            shadow:this.shadow,
            weight:this.weight,
            extent:this.extent,
            minResolution:this.minResolution,
            maxResolution:this.maxResolution,
            opacity:this.opacity,
            source:this.source,
            visible:this.visible,
            zIndex:this.zIndex,
        });
    },
});
export {HeatmapLayer}