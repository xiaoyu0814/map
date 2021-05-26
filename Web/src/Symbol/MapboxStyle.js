function MapboxStyle() {
    this.type ="MapboxStyle";
}
Object.assign( MapboxStyle.prototype, {
    getLineStyle:function(layerStyle){
        var layer = {
            "id":layerStyle.id,
            "source":layerStyle.sourceId,
            "type":"line",
            "paint":{
                'line-color':{ "type": "identity", "property": "valueColor" },
                "line-width":layerStyle.width,
                "line-opacity":layerStyle.opacity,
                /*"line-dasharray":[2,4]*/
            },
            "layout":{
                "visibility":layerStyle.visible,
                "line-join": "round",
                "line-cap": "round"
            }
        };
        if(layerStyle.dasharray){
          layer.paint["line-dasharray"] = layerStyle.dasharray
        }
        if(layerStyle.filter) layer.filter = layerStyle.filter;
        return layer;
    },
    getPointStyle:function(layerStyle){

        let layer = {
            "id":layerStyle.id,
            "source":layerStyle.sourceId,
            "type":"circle",
            "paint":{
                "circle-radius": layerStyle.size,
                "circle-stroke-color":layerStyle.strokeColor,
                "circle-stroke-width": layerStyle.strokeWidth,
                "circle-opacity":layerStyle.opacity,
                "circle-color": layerStyle.color
            },
            
            "layout":{
                "visibility":layerStyle.visible,
            }
        };
        if(layerStyle.filter) layer.filter = layerStyle.filter;
        return layer
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
        var layer = {
            "id":layerStyle.id,
            "source":layerStyle.sourceId,
            "type":"fill",
            "paint":{
                'fill-color':{ "type": "identity", "property": "valueColor" },
                "fill-opacity":layerStyle.opacity
            },
            "layout":{
                "visibility":layerStyle.visible
            }
        };
        if(layerStyle.filter) layer.filter = layerStyle.filter;
        return layer;
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
});
export {MapboxStyle}