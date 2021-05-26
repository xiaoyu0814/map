import {Layer} from '../Layer/Layer';

import {OpenLayer} from '../OpenLayer/openLayer';
/***
 *
 * @author yqq
 */

 /**
 * @module Layer
 */
/**
 * HeatmapLayer
 *
 * @class HeatmapLayer
 * @extends Layer
 * @param {Object} options <br/>
 * [url] — 图层的URL，或者用于渲染图层的样式资源的URL。<br/>
 * [id] — 图层的唯一id。<br/>
 * [data] — 图层的geojson数据。<br/>
 * [maxzoom] —图层的最大显示级别。<br/>
 * [radius] —圆形图斑半径大小。<br/>
 * [color] — 图层的颜色。<br/>
 * [opacity] — 图层的透明度。<br/>
 * [intensity] — 热力强度，可选数字大于或等于0，默认为1。<br/>
 * [weights] — 热力图点的权重。<br/>
 * [visible] — 图层的显隐性，默认为true。
 * @constructor
 */
var lineLayer = 1;
var weights = []
var intensitys = []
var densityColors = []
var radiuses = []
var opacitys = []
var weight = {
    dataType : "mag",
    mag : [0,6],
    size: [0,1]
}
var intensity = {
    zoom: [0,9],
    size: [1,3]
}
var color = {
    density:[0, 0.1, 0.3, 0.5, 0.7, 1],
    colors: [
        "rgba(33,102,172,0)",
        "rgb(103,169,207)",
        "rgb(209,229,240)",
        "rgb(253,219,199)",
        "rgb(239,138,98)",
        "rgb(178,24,43)"
    ]
}
var radius = {
    zoom:[0,9],
    size:[9,20]
}
var opacity = {
    zoom:[7,9],
    size:[1,0]
}

function HeatmapLayer (options) {
    Layer.call(this);
    options = options || {};
    this.openLayer = new OpenLayer()
    this.url = options.url !== undefined ? options.url : "";
    this.id = options.id !== undefined ? options.id : "heatmap"+lineLayer++;
    this.data = options.data !== undefined ? options.data : "";
    this.type = "heatmap";
    this.maxzoom = options.maxzoom !== undefined ? options.maxzoom : 9;
    this.radius = options.radius !== undefined ? options.radius : radius;
    this.weight = options.weight !== undefined ? options.weight : weight;
    this.intensity = options.intensity !== undefined ? options.intensity : intensity;
    this.color = options.color !== undefined ? options.color : color;
    this.opacity  = options.opacity !== undefined ? options.opacity : opacity;
    this.visible = options.visible !== undefined ? options.visible : true;
    this.filter = options.filter !== undefined?options.filter:false;
    if(this.radius.zoom !== undefined && this.radius.size !== undefined){
        if(this.radius.zoom.length === this.radius.size.length){
            for(var i=0;i<this.radius.zoom.length;i++){
                radiuses.push(this.radius.zoom[i])
                radiuses.push(this.radius.size[i])
            }
        }else{
            console.error("[object Error]: new PIE.MetoStyle.HeatmapLayer{radius参数的zoom长度与size长度不匹配，例:%o",radius)
            return
        }
    }else{
        console.error("[object Error]: new PIE.MetoStyle.HeatmapLayer{radius的参数结构不正确，例:%o",radius)
        return
    }
    if(this.weight.mag !== undefined && this.weight.size !== undefined){
        if(this.weight.mag.length === this.weight.size.length){
            for(var i=0;i<this.weight.mag.length;i++){
                weights.push(this.weight.mag[i])
                weights.push(this.weight.size[i])
            }
        }else{
            console.error("[object Error]: new PIE.MetoStyle.HeatmapLayer{weight参数的mag长度与size长度不匹配，例:%o",weight)
            return
        }
    }else{
        console.error("[object Error]: new PIE.MetoStyle.HeatmapLayer{weight的参数结构不正确，例:%o",weight)
        return
    }
    if(this.intensity.zoom !== undefined && this.intensity.size !== undefined){
        if(this.intensity.zoom.length === this.intensity.size.length){
            for(var i=0;i<this.intensity.zoom.length;i++){
                intensitys.push(this.intensity.zoom[i])
                intensitys.push(this.intensity.size[i])
            }
        }else{
            console.error("[object Error]: new PIE.MetoStyle.HeatmapLayer{intensity参数的zoom长度与size长度不匹配，例:%o",intensity)
            return
        }
    }else{
        console.error("[object Error]: new PIE.MetoStyle.HeatmapLayer{intensity的参数结构不正确，例:%o",intensity)
        return
    }
    if(this.color.density !== undefined && this.color.colors !== undefined){
        if(this.color.density.length === this.color.colors.length){
            for(var i=0;i<this.color.density.length;i++){
                densityColors.push(this.color.density[i])
                densityColors.push(this.color.colors[i])
            }
        }else{
            console.error("[object Error]: new PIE.MetoStyle.HeatmapLayer{color参数的density长度与colors长度不匹配，例:%o",color)
            return
        }
    }else{
        console.error("[object Error]: new PIE.MetoStyle.HeatmapLayer{color的参数结构不正确，例:%o",color)
        return
    }
    if(this.opacity.zoom !== undefined && this.opacity.size !== undefined){
        if(this.opacity.zoom.length === this.opacity.size.length){
            for(var i=0;i<this.opacity.zoom.length;i++){
                opacitys.push(this.opacity.zoom[i])
                opacitys.push(this.opacity.size[i])
            }
        }else{
            console.error("[object Error]: new PIE.MetoStyle.HeatmapLayer{opacity参数的zoom长度与size长度不匹配，例:%o",opacity)
            return
        }
    }else{
        console.error("[object Error]: new PIE.MetoStyle.HeatmapLayer{opacity的参数结构不正确，例:%o",opacity)
        return
    }
    
    this.initData(options);
};
HeatmapLayer.prototype = Object.assign( Object.create( Layer.prototype ), {
 /**
     * initLayer
     * <p>初始化图层。</p>
     * @method initLayer
     * @param{Object} options 对象
     */
    initLayer:function (data) {
        if(PIE.MAPTYPE == 1){
            this.source= {
                "id":this.id,
                "source":{
                    "type":"geojson",
                    "data":data
                }
            };
            this.layer = {
                "id": this.id,
                "type": this.type,
                "source": this.id,
                "maxzoom": this.maxzoom,
                "layout":{
                    "visibility":this.visible,
                },
                "paint": {
                    // Increase the heatmap weight based on frequency and property magnitude
                    "heatmap-weight": [
                        "interpolate",
                        ["linear"],
                        ["get", this.weight.dataType]
                    ],
                    // Increase the heatmap color weight weight by zoom level
                    // heatmap-intensity is a multiplier on top of heatmap-weight
                    "heatmap-intensity": [
                        "interpolate",
                        ["linear"],
                        ["zoom"]
                    ],
                    // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
                    // Begin color ramp at 0-stop with a 0-transparancy color
                    // to create a blur-like effect.
                    "heatmap-color": [
                        "interpolate",
                        ["linear"],
                        ["heatmap-density"]
                    ],
                    // Adjust the heatmap radius by zoom level
                    "heatmap-radius": [
                        "interpolate",
                        ["linear"],
                        ["zoom"]
                    ],
                    // Transition from heatmap to circle layer by zoom level
                    "heatmap-opacity": [
                        "interpolate",
                        ["linear"],
                        ["zoom"]
                    ],
                }
            };
            if(this.filter) this.layer.filter = this.filter;
            console.log(weights)
            for(var i in weights){
                // this.layer.paint["heatmap-weight"] = [
                //     "interpolate",
                //     ["linear"],
                //     ["get", this.weight.dataType]
                // ],
                this.layer.paint["heatmap-weight"].push(weights[i]);
            }
            for(var i in intensitys){
                // this.layer.paint["heatmap-intensity"] = [
                //     "interpolate",
                //     ["linear"],
                //     ["zoom"]
                // ],
                this.layer.paint["heatmap-intensity"].push(intensitys[i]);
            }
            for(var i in densityColors){
                // this.layer.paint["heatmap-color"] = [
                //     "interpolate",
                //     ["linear"],
                //     ["heatmap-density"]
                // ],
                this.layer.paint["heatmap-color"].push(densityColors[i]);
            }
            for(var i in radiuses){
                // this.layer.paint["heatmap-radius"] = [
                //     "interpolate",
                //     ["linear"],
                //     ["zoom"]
                // ],
                this.layer.paint["heatmap-radius"].push(radiuses[i]);
            }
            for(var i in opacitys){
                // this.layer.paint["heatmap-opacity"] = [
                //     "interpolate",
                //     ["linear"],
                //     ["zoom"]
                // ],
                this.layer.paint["heatmap-opacity"].push(opacitys[i]);
            }
    
        }else if(PIE.MAPTYPE == 2){
            this.layer = new PIE.ol.layer.Heatmap({
                source: new PIE.ol.source.Vector({
                    features: (new PIE.ol.format.GeoJSON()).readFeatures(data, {
                        featureProjection: this.openLayer.projection
                    })
                }),
                radius: this.radius.size[0],
                gradient:this.color.colors,
                weight:this.weight.dataType,
                opacity:this.opacity.size[0],
                visible:this.visible,
            });
            // this.source = false;
        }
        
    },
    handleData:function (self,callback) {
        for (var i =0 ;i<self.data.features.length;i++){
            if(self.data.features[i].properties){

            }else{
                self.data.features[i].properties = {};
            }
            if(self.color !=""){
                self.data.features[i].properties.valueColor = self.color;
            }else{
                if(!self.data.features[i].properties.valueColor){
                    self.data.features[i].properties.valueColor = "#00ffff";
                }
            }

            if(self.data.features[i].properties.lineWidth){
                //self.data.features[i].properties.LineTypeString =self.data.features[i].properties.LineTypeString
            }
            else{
                self.data.features[i].properties.lineWidth = self.width;
            }
        }

    },
});
export {HeatmapLayer}