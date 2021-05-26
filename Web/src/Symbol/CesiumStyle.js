function CesiumStyle() {
    this.type ="Symbol";
}
CesiumStyle.prototype={
    getLineStyle:function(layerStyle){
        var styleDefault = {
            show:true,
            stroke:Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(layerStyle.color),layerStyle.opacity),
            fill: Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(layerStyle.color),layerStyle.opacity),
            strokeWidth: layerStyle.width,
            markerSize:0,
            clampToGround:true
        }
        var  promiseLayer = Cesium.GeoJsonDataSource.load(layerStyle.data,styleDefault)
        return  promiseLayer;
       
    },
    getPointStyle:function(layerStyle){
         var styleDefault = {
            show:true,
            stroke:Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(layerStyle.strokeColor),layerStyle.opacity),
            fill:Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(layerStyle.color),layerStyle.opacity),
            markerColor:Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(layerStyle.color),layerStyle.opacity),
            strokeWidth: layerStyle.strokeWidth,
            markerSymbol:"?",
            markerSize:layerStyle.size,
         
        }
        var promiseLayer = Cesium.GeoJsonDataSource.load(layerStyle.data,styleDefault)
        return  promiseLayer;
    },
    getTextStyle:function(layerStyle){
        var layer = {
            "id":layerStyle.id,
            "source":layerStyle.sourceId,
            "type":"symbol",
            "paint":{
                "text-color": layerStyle.color,
                "text-opacity":layerStyle.opacity,
            },
            "layout":{
                "text-field": "{"+layerStyle.text+"}",
                "text-font":["KlokanTech Noto Sans CJK Regular"],
                "text-rotate":{ "type": "identity", "property": "angle" },
                "text-allow-overlap":layerStyle.overlap,
                "text-offset":layerStyle.offset,
                "visibility":layerStyle.visible,
                "text-size":layerStyle.size/*{
                  "stops": [[0, 8], [5, 12], [11, 24]]
                }*/
            }
        };
        if(layerStyle.filter) layer.filter = layerStyle.filter;
        return layer;
    },
    getPolygonStyle:function(layerStyle) {
        // body...
        let _fillColor = layerStyle.isFill ===true ? layerStyle.opacity : 0;
        var styleDefault = {
            show:true,
            stroke:  Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(layerStyle.strokeColor),layerStyle.opacity),
            fill:  Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(layerStyle.color),_fillColor),
            strokeWidth: layerStyle.strokeWidth,
           
        }
        var promiseLayer = Cesium.GeoJsonDataSource.load(layerStyle.data,styleDefault)
        return  promiseLayer;
    },
    getIconStyle:function(layerStyle){
        var _url = layerStyle.imageName+"{"+layerStyle.iconUrl+"}";
        if(layerStyle.imageUrl){_url = layerStyle.imageUrl;}
        var layer = {
            "id":layerStyle.id,
            "source":layerStyle.sourceId,
            "type":"symbol",
            "paint":{
                "icon-opacity":layerStyle.opacity,
            },
            "layout":{
                "icon-image":_url ,
                "icon-rotate":{ "type": "identity", "property": ""+layerStyle.rotate+ ""},
                "icon-allow-overlap" : layerStyle.overlap,
                "icon-offset":layerStyle.offset,
                "icon-anchor" :  layerStyle.anchor,
                "icon-size": layerStyle.size,
                "visibility": layerStyle.visible,
            }
        };
        return layer;
    }
};
export {CesiumStyle}