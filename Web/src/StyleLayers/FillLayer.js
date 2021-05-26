import {Layer} from '../Layer/Layer';
/***
 *
 * @author yqq
 */
 /**
 * @module Layer
 */
/**
 * FillLayer
 * <a href="../../examples/Layer_GeoJsonLayer.html">geoJsonFillLayer.html</a>
 * 
 * @class FillLayer
 * @extends Layer
 * @param {Object} options <br/>
 * [url] — 图层的URL，或者用于渲染图层的样式资源的URL。<br/>
 * [id] — 图层的唯一id。<br/>
 * [color] — 图层的图例色带（json格式）。<br/>
 * [data] — 图层的geojson数据。<br/>
 * [opacity] — 图层的透明度。<br/>
 * [visible] — 图层的隐藏可见（继承父级layer）
 * @constructor
 */
var fillLayer = 1;
function FillLayer(options) {
    Layer.call(this);
    options = options || {};
    var colorMap ={
        "-2":"#020C64",
        "-1":"#071E78",
        "0": "#11318B",
        "1": "#1B449F",
        "2": "#2657B3",
        "3": "#306AC7",
        "4": "#3B7EDB",
        "5": "#4E8ADD",
        "6": "#6196E0",
        "7": "#747BE2",
        "8": "#87AFE5",
        "9": "#9BBCE8",
        "10":"#99CDD0",
        "11":"#98D6D4",
        "12":"#97E8AD",
        "13":"#D7DE7E",
        "14":"#EADB70",
        "15":"#F4D9C7",
        "16":"#F4D963",
        "17":"#FAD64F",
        "18":"#F7B42D",
        "19":"#F29B00",
        "20":"#F19303",
        "21":"#F0840A",
        "22":"#EF7511",
        "23":"#EE6618",
        "24":"#EE581F",
        "25":"#E74B1A",
        "26":"#E03F16",
        "27":"#D93312",
        "28":"#D0240E",
        "29":"#C20003",
        "30":"#B50109",
        "31":"#A90210",
        "32":"#8A0519",
        "33":"#6F0015",
        "34":"#50000f"
    };
    this.type = "fillLayer";
    this.url = options.url !== undefined ? options.url : "";
    this.id = options.id !== undefined ? options.id : "fillLayer"+fillLayer++;
    this.data = options.data !== undefined ? options.data : "";
    //this.symbol = options.symbol !== undefined ? options.symbol : new PIE.FillSymbol({color:"blue"});
    this.colorPath = options.colorPath !== undefined ? options.colorPath : colorMap ;
    this.strokeWidth = options.strokeWidth !== undefined ? options.strokeWidth : 0;
    this.strokeColor =  options.color !== undefined ? options.color : "#000000";
    this.opacity  = options.opacity !== undefined ? options.opacity : 1;
    this.isFill = options.isFill !== undefined ? options.isFill : true;
    this.fillColor =  options.color !== undefined ? options.color : "#000000";
    this.sourceId = options.sourceId !== undefined ? options.sourceId : false;
    this.filter = options.filter !== undefined?options.filter:false;
    this.color =  options.color !== undefined ? options.color : "#000000";
    this.initData(options);
    //map.addLayer(layer);
};
FillLayer.prototype = Object.assign( Object.create( Layer.prototype ),{
    /**
     * initLayer
     * <p>初始化图层，根据传参data对数据进行赋值。</p>
     * 
     * @method initLayer
     * @param{Object} data 对象
     */
    initLayer : function (data) {

        if(this.sourceId){
        }else{
            this.source= {
                "id":this.id,
                "source":{
                    "type":"geojson",
                    "data":data
                }
            };
            this.sourceId = this.id;
           
        }
        this.layer = {
            "id":this.id,
            "source":this.sourceId,
            "type":"fill",
            "paint":{
                'fill-color':{ "type": "identity", "property": "valueColor" },
                "fill-opacity":this.opacity
            },
            "layout":{
                "visibility":this.visible
            }
        };
        if(this.filter) this.layer.filter = this.filter;
    },
    innerLayer:function (type) {
        //Cesium.Color.fromAlpha(new Cesium.Color(color.r, color.g, color.b),geoObject.material.getValue().color.alpha)
        let _fillColor = this.isFill ===true ? this.opacity : 0;
        this.styleDefault = {
            show:true,
            stroke:  Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(this.strokeColor),this.opacity),
            fill:  Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(this.fillColor),_fillColor),
            strokeWidth: this.strokeWidth,
           
        }
        if(type == 3){
            this.promiseLayer = Cesium.GeoJsonDataSource.load(this.data,this.styleDefault)
            return  this.promiseLayer;
        }
    },
    /**
     * handleData
     * <p>处理图层数据，根据传参self对数据进行赋值。</p>
     * @method handleData
     * @param{Object} self 对象
     */
    handleData:function (self) {
        for (var i =0 ;i<self.data.features.length;i++){
            if(self.data.features[i].properties){
                self.data.features[i].properties.index = i;
            }else{
                self.data.features[i].properties = {index:i};
            }
            if(self.data.features[i].properties.colorIndex){
                if(self.data.features[i].properties.colorIndex.toString().indexOf("rgb")>-1 || self.data.features[i].properties.colorIndex.toString().indexOf("#")>-1){
                    self.data.features[i].properties.valueColor =self.data.features[i].properties.colorIndex;
                }else{
                    self.data.features[i].properties.valueColor =self.colorPath[self.data.features[i].properties.colorIndex]
                }
                
            }
            else{
                if(self.color !=""){
                    self.data.features[i].properties.valueColor = self.color;
                }else{
                    self.data.features[i].properties.valueColor = "#dddddd";
                }

            }

        }
    },
    /**
     * 合并
     * @param {FillLayer} layer 
     */
    union:function(layer){
        console.log(layer);
        if(this.data.features[0].geometry.type == "Polygon" && layer.data.features[0].geometry.type == "Polygon" ){
           let feature_1=  this.getSource();
           let feature_2=  layer.getSource();
           let union_features = [];
           turf.featureEach(feature_1, function (currentFeature, featureIndex) {
                turf.featureEach(feature_2, function (currentFeature2, featureIndex2) {
                    let union_feature = turf.union(currentFeature,currentFeature2);
                    if(union_feature){
                        union_features.push(union_feature)
                    }else{
                        union_features.push(currentFeature)  
                        union_features.push(currentFeature2)  
                    }
                });
            });
           let add_feature = turf.featureCollection(union_features);
           this.setSource(add_feature);
           layer.setVisible(false);
        }
    },
     /**
     * 求交
     * @param {FillLayer} layer 
     */
    intersect:function(layer){
        console.log(layer);
        if(this.data.features[0].geometry.type == "Polygon" && layer.data.features[0].geometry.type == "Polygon" ){
           let feature_1=  this.getSource();
           let feature_2=  layer.getSource();
           let intersect_features = [];
           turf.featureEach(feature_1, function (currentFeature, featureIndex) {
                turf.featureEach(feature_2, function (currentFeature2, featureIndex2) {
                    let union_feature = turf.intersect(currentFeature,currentFeature2);
                    if(union_feature){
                        intersect_features.push(union_feature)
                    }
                });
            });
           let add_feature = turf.featureCollection(intersect_features);
           this.setSource(add_feature);
           layer.setVisible(false);
        }
    },
    /**
     * 裁切
     * @param {LineLayer} layer 
     */
    split:function(layer,callback){
        if(this.data.features[0].geometry.type == "Polygon" && layer.data.features[0].geometry.type == "LineString" ){
            let feature_1=  this.data.features[0];
            let splitter_feature=  layer.data.features[0];
            let poly_lineFeature = turf.polygonToLineString(feature_1)
            let split_feature = turf.lineSplit(poly_lineFeature,splitter_feature);
            console.log(split_feature)
            if(split_feature.features.length==0){
                return;
            }
            split_feature.features[0].geometry.coordinates.push(split_feature.features[2].geometry.coordinates[0],split_feature.features[2].geometry.coordinates[1])
            let oldFeature = turf.lineToPolygon(split_feature.features[0]);
            let newFeature = split_feature.features[1];
            console.log(newFeature)
            let add_feature = turf.featureCollection([oldFeature]);
            this.setSource(add_feature);
            if(callback){
                callback(split_feature,this)
            }
           
         }
    }
});
export { FillLayer };