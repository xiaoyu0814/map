import {Layer} from '../Layer/Layer';
import {IconLayer} from "./IconLayer";
import {GeoJsonFormatFeilds} from '../Symbol/StyleFeilds'
/***
 *
 * @author yqq
 */
 /**
 * @module Layer
 */
/**
 * UpperstationLayer
 * @extends Layer
 * @class UpperstationLayer
 * @param {Object} options <br/>
 * [url] — 图层的URL，或者用于渲染图层的样式资源的URL。<br/>
 * [id] — 图层的唯一id。<br/>
 * [data] — 图层的geojson数据。<br/>
 * [symbol] —符号填充设置。默认为GeoJsonFormatFeilds.groundStationFeilds<br/>
 * @constructor
 */
var upperstationLayer = 1;
function UpperStationLayer(options) {
    Layer.call(this);
    options = options || {};
    this.url = options.url !== undefined ? options.url : "";
    this.id = options.id !== undefined ? options.id : "upperstationLayer"+upperstationLayer++;
    this.data = options.data !== undefined ? options.data : "";
    this.type = "StationLayer";
    this.overlap = options.overlap !== undefined ? options.overlap : false;
    this.symbol = options.symbol !== undefined ? options.symbol : GeoJsonFormatFeilds.upperStationFeilds;
    this.Layers = [];
    this.initData(options);
};
UpperStationLayer.prototype =  Object.assign( Object.create( Layer.prototype ), {
    /**
     * initLayer
     * <p>初始化图层。</p>
     * @method initLayer
     */
    initLayer:function () {
      this.source = {
          "id":this.id,
          "source":{
              "type":"geojson",
              "data":this.data
          }
      }
    },
    /**
     * handleData
     * <p>处理图层数据，根据传参self对数据进行赋值。</p>
     * @method handleData
     * @param{Object} self 对象
     */
    handleData:function (self) {
       
        /*var N = new IconLayer({
            sourceId:self.id,
            id : self.id+"_N",
            imageUrl:"N00",
            overlap:true,
            size:0.4
        });
        self.Layers.push(N);*/
    },
    innerSource:function(type){

            if(type ==1){
                this.mapSource ={
                    "id":this.id,
                    "source":{
                        "type":"geojson",
                        "data":this.data
                    }
                };
                return this.mapSource;

            }else if(type==2){
                this.olSource = new PIE.ol.source.ImageWMS({
                    url: this.url,
                    params: {'LAYERS': this.layers},
                    ratio: 1,
                    //serverType: 'geoserver'
                  })
                this.olSource.id = this.id;
                return this.olSource;
            }else if(type == 3){

            }
        },
        innerLayer:function(type){
           
            //"http://211.154.196.253:6080/arcgis/rest/services/EDATA/lspop2013/ImageServer/exportImage/export?bbox=98.701171875%2C31.102294921874996%2C98.71215820312499%2C31.113281250000004&size=256%2C256&format=png&transparent=true&f=image&bboxSR=4326&imageSR=4326"
           
             if(type==1){ 

                this.layers = this.MapboxGroundStationStyle();
                return this.layers;
            }else if(type ==2){
                this.olLayer =   new PIE.ol.layer.Image({
                    //extent: [-13884991, 2870341, -7455066, 6338219],
                    source: this.olSource
                })
                this.olLayer.id = this.id;
                return this.olLayer;
            }else if(type == 3){
                this._cesiumlayers = this.CesiumGroundStationStyle();
                return this._cesiumlayers;
            }
        },
        onAdd:function(map,type){
            this._map = map;
            if(type == 1){
                for(var i=0;i<this.layers.length;i++){
                    map.addLayer(this.layers[i].layer);
                }
                
            }else if(type==2){
                
            }else if(type ==3){

            }
        },
    MapboxGroundStationStyle:function() {
      var groundFeilds = this.symbol;
      var properties = this.data.features[0].properties;
      var id = this.id;
      var layers = [];
      for (var key in groundFeilds) {
      var styleType = groundFeilds[key];
      if(styleType.type == "icon"){
        var iconrotate = styleType.rotate;
        if(iconrotate){
          iconrotate = styleType.rotate;
        }else{
          iconrotate = undefined;
        }
        var iconLayer = new IconLayer({
                  sourceId:id,
                  id : id+"_"+key,
                  iconUrl:styleType.iconImage,
                  imageName:styleType.iconName,
                  rotate:iconrotate,
                  offset:styleType.offset,
                  anchor:styleType.anchor,
                  overlap:styleType.overlap,
                  size:styleType.size
            });
           layers.push(iconLayer);

      }else if(styleType.type == "text"){
        var textLayer = new TextLayer({
                  sourceId:id,
                  id :  id+"_"+key,
                  color :styleType.color,
                  text:styleType.text,
                  overlap:styleType.overlap,
                  offset:styleType.offset,
                  size:styleType.size
              });
            layers.push(textLayer);

      }

    }
      if(groundFeilds["H"]){
          var N = new IconLayer({
              sourceId:id,
              id : id+"_N",
              imageUrl:"N00",
              overlap:true,
              size:0.4
          });
         layers.push(N);
      }
    return layers;
    },
    CesiumGroundStationStyle:function() {
        var groundFeilds = this.symbol;
        var properties = this.data.features[0].properties;
        var id = this.id;
        var layers = [];
        for (var key in groundFeilds) {
        var styleType = groundFeilds[key];
        if(styleType.type == "icon"){
          var iconrotate = styleType.rotate;
          if(iconrotate){
            iconrotate = styleType.rotate;
          }else{
            iconrotate = undefined;
          }
          var iconLayer = new IconLayer({
                    data:this.data,
                    id : id+"_"+key,
                    iconUrl:styleType.iconImage,
                    imageName:styleType.iconName,
                    rotate:iconrotate,
                    offset:styleType.offset,
                    anchor:styleType.anchor,
                    overlap:styleType.overlap,
                    size:styleType.size
              });
             layers.push(iconLayer);
  
        }else if(styleType.type == "text"){
          var textLayer = new TextLayer({
                    data:this.data,
                    id :  id+"_"+key,
                    color :styleType.color,
                    text:styleType.text,
                    overlap:styleType.overlap,
                    offset:styleType.offset,
                    size:styleType.size
                });
              layers.push(textLayer);
  
        }
  
      }
        if(groundFeilds["H"]){
            var N = new IconLayer({
                data:this.data,
                id : id+"_N",
                imageUrl:"N00",
                overlap:true,
                size:0.4
            });
           layers.push(N);
        }
      return layers;
      }
});
export { UpperStationLayer };