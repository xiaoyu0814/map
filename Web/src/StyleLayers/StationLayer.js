import {Layer} from '../Layer/Layer';
import {GeoJsonFormatFeilds} from '../Symbol/StyleFeilds'
import {TextLayer} from "./TextLayer";
import {IconLayer} from "./IconLayer";
/***
 *
 * @author yqq
 */
 /**
 * @module Layer
 */
/**
 * StationLayer
 *
 * @class StationLayer
 * @extends Layer
 * @param {Object} options <br/>
 * [url] — 图层的URL，或者用于渲染图层的样式资源的URL。<br/>
 * [id] — 图层的唯一id。<br/>
 * [data] — 图层的geojson数据。<br/>
 * [symbol] —符号填充设置。默认为GeoJsonFormatFeilds.groundStationFeilds<br/>
 * @constructor
 */
var stationLayer = 1;
function StationLayer(options) {
    Layer.call(this);
    options = options || {};
    this.url = options.url !== undefined ? options.url : "";
    this.id = options.id !== undefined ? options.id : "stationLayer"+stationLayer++;
    this.data = options.data !== undefined ? options.data : "";
    this.type = "StationLayer";
    this.overlap = options.overlap !== undefined ? options.overlap : false;
    this.Layers = [];
    this.symbol = options.symbol !== undefined ? options.symbol : GeoJsonFormatFeilds.groundStationFeilds;
    this.initData(options);
};
StationLayer.prototype =  Object.assign( Object.create( Layer.prototype ), {
	/**
     * initLayer
     * <p>初始化图层。</p>
     * @method initLayer
     * @param{Object} options 对象
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
    handleData:function (self) {

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
           
        }else if(type == 3){
            var layerSymbol={
                show:true,
                stroke:Cesium.Color.BLACK,
                fill: Cesium.Color.BLACK,
                markerColor:Cesium.Color.BLACK,
                strokeWidth: 0,
                markerSize:0,
                clampToGround:true
            };
            var _this = this;
            if(!_this.data) {console.error("数据源错误");return;}
            var sourceTemp = new Cesium.GeoJsonDataSource.load(_this.data,layerSymbol);
            
            sourceTemp.id =_this.id;
            _this.cesiumSource = sourceTemp;
            return _this.cesiumSource;
        }
    },
    innerLayer:function(type){
       
        if(type==1){ 
            this.layers = this.MapboxGroundStationStyle();
            return this.layers;
        }else if(type ==2){
            this.ollayers = this.MapboxGroundStationStyle();
            return this.ollayers;
        }else if(type == 3){
            this._cesiumlayers = this.CesiumGroundStationStyle();
            return this._cesiumlayers;
        }
    },
    onAdd:function(map,type,cesiummap){
        this._map = map;
        if(type == 1){
            for(var i=0;i<this.layers.length;i++){
                map.addLayer(this.layers[i].layer);
            }
            
        }else if(type==2){
            
        }else if(type ==3){
            for(var i=0;i<this._cesiumlayers.length;i++){
                cesiummap.add(this._cesiumlayers[i]);
            }

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
export { StationLayer };