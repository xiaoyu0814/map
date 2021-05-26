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
var baiduGridTileLayer =1;
//var baiduUrl="http://online1.map.bdimg.com/onlinelabel/?qt=tile&{x}&y={y}&z={z}&styles=pl&udt=20170408&scaler=1&p=1";
var baiduUrl= path.BaiduURL.tile1;
// var baiduUrl="http://online6.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles=pl&udt=20150815&scaler=1&p=1"; //备用URL，防止过期
function BaiduLayer(options) {
    Layer.call(this);
    options = options || {};
    this.type = "BaiduLayer";
    this.url = options.url !== undefined ? options.url : baiduUrl;
    this.tileSize = options.tileSize !== undefined ?options.tileSize : 256;
    this.id = options.id !== undefined ?options.id : "baiduGridTileLayer"+baiduGridTileLayer++;
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
BaiduLayer.prototype =Object.assign(Object.create(Layer.prototype),{
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
            var projection = PIE.ol.proj.get("EPSG:3857");
            var resolutions = [];
            for(var i=0; i<19; i++){
                resolutions[i] = Math.pow(2, 18-i);
            }
            var tilegrid  = new PIE.ol.tilegrid.TileGrid({
                origin: [0,0],
                resolutions: resolutions
            });

            this.olSource = new PIE.ol.source.TileImage({
                projection: projection,
                tileGrid: tilegrid,
                tileUrlFunction: function(tileCoord, pixelRatio, proj){
                    if(!tileCoord){
                        return "";
                    }
                    var z = tileCoord[0];
                    var x = tileCoord[1];
                    var y = tileCoord[2];

                    if(x<0){
                        x = "M"+(-x);
                    }
                    if(y<0){
                        y = "M"+(-y);
                    }
                    //return "http://online6.map.bdimg.com/onlinelabel/?qt=tile&x="+x+"&y="+y+"&z="+z+"&styles=pl&udt=20150815&scaler=1&p=1";
                    return path.BaiduURL.tile + "&x="+x+"&y="+y+"&z="+z+"&styles=pl&udt=20150815&scaler=1&p=1";
                }
            });
           return this.olSource;
        }else if(type == 3){}
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
            var _url = path.BaiduURL.tile + "&x={Timex}&y={Timey}&z={z}&styles=pl&udt=20150815&scaler=1&p=1";
            this.cesLayer = new Cesium.UrlTemplateImageryProvider({
                url : _url,  
                hasAlphaChannel:true,
                tileMatrixSetID: "GoogleCRS84Quad",
                tileMatrixLabels : ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21'],
                //minimumLevel:0,
                tilingScheme : new Cesium.GeographicTilingScheme(),
                customTags : {       
                    Timex:function(imageryProvider, x, y, level){ 
                        if(x<0){
                            x = "M"+(-x);
                        }
                        return x;
                    },
                    Timey:function(imageryProvider, x, y, level){ 
                        if(y<0){
                            y = "M"+(-y);
                        }
                        return y;
                    }
                },
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

export {BaiduLayer}