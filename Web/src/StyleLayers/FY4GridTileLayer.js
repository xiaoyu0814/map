import {Layer} from '../Layer/Layer';
/***
 *
 * @param options
 * @author yqq
 */
  /**
 * @module Layer
 */
/**
 * GridTileLayer栅格数据是将空间看做离散的像元，由二维数组或者其他数据组织方式来进行表达。
 * 
 * @class GridTileLayer
 * @extends Layer
 * @param {Object} options </br>
 * [url] — 栅格图层数据的来源地址url。</br>
 * [tileSize] — 瓦片尺寸，如果没有设置，默认为256。</br>
 * [id] — 图层的唯一id。</br>
 * [opacity] — 图层的透明度，不透明默认为1。</br>
 * [region] - 栅格图层的范围，默认范围[-180,-90,180,90]
 * @constructor
 */
var fY4GridTileLayer =1;
function FY4GridTileLayer(options) {
    Layer.call(this);
    options = options || {};
    this.type = "FY4GridTileLayer";
    this.url = options.url !== undefined ? options.url : "";
    this.tileSize = options.tileSize !== undefined ?options.tileSize : 256;
    this.id = options.id !== undefined ?options.id : "fY4GridTileLayer"+fY4GridTileLayer++;
    this.opacity = options.opacity !== undefined ? options.opacity : 1;
    this.projection  = options.projection !== undefined ? options.projection : "EPSG:4326";
	this.region = options.region !== undefined ? options.region : [-111.3 ,-72 ,176.7 , 72];
    this.bounds = options.bounds !== undefined ? options.bounds : [ -20037508.3427892,-20037508.3427892,20037508.3427892, 20037508.3427892];
    if(this.url != ""){
        this.initLayer()
    }
    else{
        this.source = false;
    }

}
FY4GridTileLayer.prototype =Object.assign(Object.create(Layer.prototype),{
    /**
     * initLayer
     * <p>初始化图层，根据传参option对数据进行重新赋值。</p>
     */
    initLayer:function () {
 
        this.source= {
            "id":this.id,
            "source":{
                "type":"raster",
                "tiles": [this.url],
                "bounds":this.bounds,
                "tileSize":this.tileSize
            }
        };
        this.layer = {
            "id": this.id,
            "type": "raster",
            "source": this.id,
            'paint':{"raster-opacity":this.opacity}
        };
    },
    innerSource:function(type){

        if(type ==1){
            this.mapSource ={
                id:this.id,
                source:{
                    "type":"raster",
                    "tiles": [this.url],
                    "bounds":this.bounds,
                    "tileSize":this.tileWidth
                }
            };
            return this.mapSource;

        }else if(type==2){
            var tileGrid = new PIE.ol.tilegrid.TileGrid({
                extent:  [32.7 ,-72 , 176.7 , 72],
                resolutions:[0.32, 0.16 ,0.08 , 0.04, 0.02 , 0.01, 0.005 , 0.0025 ],
                tileSize: 450
            });
            var _FY4OLURL =  this.url.substr(0,this.url.indexOf("{"));
            console.log(_FY4OLURL);
            this.olSource = new PIE.ol.source.XYZ({
                    url: this.url,
                    projection:this.projection,
                    //tileSize:[256,256],
                    //resolutions: resolutions ,
                    tileGrid:tileGrid,
                    tileUrlFunction:function(src,t,r){
                        console.log(r)
                           var pow = Math.pow(2 , src[0]);
                            var y = -1- src[2]  ;
                            var z = src[0];
                            if(y < 0 ){
                                y = y + pow;
                            }else if(x > pow){
                                y = y - pow;
                            }

                            var x = 0
                            x = src[1]
                            // 需要加入动画的图层产品  --首页
                          return _FY4OLURL+z+"/"+y+"/"+x+".png"
                
                    }
                }),
            this.olSource.id = this.id;
            return this.olSource;
        }else if(type == 3){

        }
    },
    innerLayer:function(type){
       
        //"http://211.154.196.253:6080/arcgis/rest/services/EDATA/lspop2013/ImageServer/exportImage/export?bbox=98.701171875%2C31.102294921874996%2C98.71215820312499%2C31.113281250000004&size=256%2C256&format=png&transparent=true&f=image&bboxSR=4326&imageSR=4326"
       
         if(type==1){ 
            this.layer = {
                "id": this.id,
                "source":this.id,
                "type": "raster", 
                'paint':{"raster-opacity":this.opacity}
            };
            return this.layer;
        }else if(type ==2){

            this.olLayer = new PIE.ol.layer.Tile({
                source: this.olSource,
                extent: [32.7 ,-72 , 176.7 , 72],
                zIndex: 0
            });
        
            this.olLayer.id = this.id;
            return this.olLayer;
        }else if(type == 3){
            var _url = this.url.replace("{X}","{Timex}");
            _url = _url.replace("{x}","{Timex}");
            this.cesLayer = new Cesium.UrlTemplateImageryProvider({
                //url : "http://rsapp.nsmc.org.cn/swapQuery/public/tileServer/getTile/fy-4a/prj_gll/NOMChannel12/20190813030000/jpg/{Time}/{Timey}/{Timex}.png",
                url : _url,
                tileWidth:450,
                tileHeight:450,
                tilingScheme:new Cesium.GeographicTilingScheme({
                    rectangle:Cesium.Rectangle.fromDegrees(-111.3 ,-72 ,176.7 , 72),
                }),
                customTags : {       
                   Timex:function(imageryProvider, x, y, level){
                        var pow = Math.pow(2 , level);
                            if(x>pow){
                            x = x-pow
                            }else {
                                x = pow-x
                            }
                        return  x
                   }
               },
                hasAlphaChannel:true,
                alpha:1,
                rectangle:Cesium.Rectangle.fromDegrees(32.7 ,-72 , 176.7 , 72),
                
            });
            return this.cesLayer;
        }
    }
});

export {FY4GridTileLayer}