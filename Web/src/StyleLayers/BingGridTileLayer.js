import {Layer} from '../Layer/Layer';
import {path} from "../core/path";
/***
 *
 * @param options
 * @author xll
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
var bingGridTileLayer =1;
function BingLayer(options) {
    Layer.call(this);
    options = options || {};
    this.type = "BingLayer";
    this.url = options.url !== undefined ? options.url : "";
    this.tileSize = options.tileSize !== undefined ?options.tileSize : 256;
    this.id = options.id !== undefined ?options.id : "bingGridTileLayer"+bingGridTileLayer++;
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
BingLayer.prototype =Object.assign(Object.create(Layer.prototype),{
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
            var projection = PIE.ol.proj.get("EPSG:4326");
            var resolutions = [];
            for(var i=0; i<19; i++){
                resolutions[i] = Math.pow(2, 18-i);
            }
            var tilegrid  = new PIE.ol.tilegrid.TileGrid({
                origin: [0,0],
                resolutions: resolutions
            });
            this.olSource = new PIE.ol.source.XYZ({
                tilePixelRatio: 2,
                tileUrlFunction: function(tileCoord){
                    var z = tileCoord[0];
                    var x = tileCoord[1];
                    var y = -tileCoord[2] - 1;
                    var result='', zIndex=0;
                    
                    for(; zIndex<z; zIndex++) {
                        result = ((x&1)+2*(y&1)).toString() + result;
                        x >>= 1;
                        y >>= 1;
                    }
                    //return 'http://dynamic.t0.tiles.ditu.live.com/comp/ch/' + result + '?it=G,VE,BX,L,LA&mkt=zh-cn,syr&n=z&og=111&ur=CN';
                    return path.BingMap.tiles + result + '?it=G,VE,BX,L,LA&mkt=zh-cn,syr&n=z&og=111&ur=CN';
                }
            });
           return this.olSource;
        }else if(type == 3){

        }
    },
    innerLayer:function(type){
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
                zIndex: 0
            });
            this.olLayer.id = this.id;
            return this.olLayer;
        }else if(type == 3){
            var _url = path.BingMap.tiles + "{Timex}?it=G,VE,BX,L,LA&mkt=zh-cn,syr&n=z&og=111&ur=CN";
            this.cesLayer = new Cesium.UrlTemplateImageryProvider({
                //url : "http://rsapp.nsmc.org.cn/swapQuery/public/tileServer/getTile/fy-4a/prj_gll/NOMChannel12/20190813030000/jpg/{Time}/{Timey}/{Timex}.png",
                url : _url,
                customTags : {       
                   Timex:function(imageryProvider, x, y, level){ 
                    var result='', zIndex=0; 
                    for(; zIndex<level; zIndex++) {
                        result = ((x&1)+2*(y&1)).toString() + result;
                        x >>= 1;
                        y >>= 1;
                    }
                    return result;
                   }
               },
                hasAlphaChannel:true,
                alpha:1,  
            });
            return this.cesLayer;
        }
    },
    onAdd:function(map,type){
        this._map = map;
        if(type ==1){
            
        }else if(type ==2){
            map.addLayer(this.olLayer);
        }else if(type ==3){
            var _layer =  map.imageryLayers.addImageryProvider(this.cesLayer);
            _layer.id = this.id;
            return _layer;
        }
    }
});

export {BingLayer}