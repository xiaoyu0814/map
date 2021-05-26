import {Color} from '../math/Color';
/**
 * @author yqq
 */
function OLStyle() {
}

OLStyle.prototype={
	 /**
     * 将定义的Style 添加到openlayer对象中。
     * 
     * 
     */
	StyleFormat:function(layerStyle,feature,iconUrl,iconJson){
        var properties = feature.getProperties();
        var style, stroke, fill, text;
        var paint = layerStyle.layer.paint;
        var layout = layerStyle.layer.layout;
        var type = layerStyle.type
        if (type == "lineLayer") {
            var lineColor, lineWidth, lineOpacity, lineVisible;
            for (var item in paint) {
                if (item == "line-color") {
                    lineColor = paint[item];

                }
                if (item == "line-width") {
                    lineWidth = paint[item];
                }
                if (item == "line-opacity") {
                    lineOpacity = paint[item];
                }
            }

            lineColor = this.Typeof(lineColor, properties)
            lineColor = new Color(lineColor).getStyle()
            lineColor = this.RgbToRgba(lineColor, lineOpacity)
            style = new PIE.ol.style.Style({
                stroke: new PIE.ol.style.Stroke({
                    color: lineColor,
                    width: lineWidth
                })
            });
            return style;
        } else if (type == "fillLayer") {
            var fillColor, fillOpacity, fillVisible;
            for (var item in paint) {
                if (item == "fill-color") {
                    fillColor = paint[item];

                }
                if (item == "fill-opacity") {
                    fillOpacity = paint[item];
                }
            }
            fillColor = this.Typeof(fillColor, properties)
            fillColor = new Color(fillColor).getStyle()
            fillColor = this.RgbToRgba(fillColor, fillOpacity)
            style = new PIE.ol.style.Style({
                fill: new PIE.ol.style.Fill({
                    color: fillColor
                })
            })
            return style;
        } else if (type == "pointLayer") {
            var circleColor, circleOpacity =1, circleVisible, circleSize,strokeColor,strokeWidth =0 ;

            for (var item in paint) {
                if (item == "circle-color") {
                    circleColor = paint[item];

                }
                if (item == "circle-opacity") {
                    circleOpacity = paint[item];
                }
                if (item == "circle-stroke-color") {
                    strokeColor = paint[item];
                }
                if (item == "circle-stroke-width") {
                    strokeWidth = paint[item];
                }
                if (item == "circle-radius") {
                  if(typeof(paint[item]) == "object"){
                      circleSize = paint[item].base;
                  }else{
                    
                    circleSize = paint[item];
                  }
                }
            }
            var fill;
            if(circleColor){
              circleColor = this.Typeof(circleColor, properties)
              circleColor = new Color(circleColor).getStyle()
              circleColor = this.RgbToRgba(circleColor, circleOpacity)
              fill =  new PIE.ol.style.Fill({
                        color: circleColor
                    })
            }
            var stroke;
            if(circleColor){
              strokeColor = this.Typeof(strokeColor, properties)
              strokeColor = new Color(strokeColor).getStyle()
              strokeColor = this.RgbToRgba(strokeColor, 1)
              stroke = new PIE.ol.style.Stroke({
                      color:strokeColor,
                      width:strokeWidth
                    })
            }

            style = new PIE.ol.style.Style({
                image: new PIE.ol.style.Circle({
                    radius: circleSize,
                    stroke: stroke,
                    fill:fill
                })
            })
            return style;
        }else if(type == "textLayer"){
            var textColor,textSize=16,textValue="",textOffset=[0,0];
            for (var item in paint) {
                if (item == "text-color") {
                    textColor = paint[item];

                }
            
            }
            for(var item in layout){
                if(item == "text-size"){
                    textSize = layout[item]
                }
                if(item == "text-field")
                {
                    textValue = layout[item].replace("{","").replace("}","");
                    // console.log(textValue);
                }
                if(item == "text-offset"){
                    textOffset = layout[item];
                }
            }
            // console.log(textOffset);
            var value = properties[textValue] !==undefined?  properties[textValue] :"";
            style = new PIE.ol.style.Style({
              text: new PIE.ol.style.Text({
                text: value.toString(),
                font: textSize + 'px sans-serif',
                overflow: true,
                offsetX:textOffset[0]*textSize,
                offsetY:textOffset[1]*textSize,
                fill: new PIE.ol.style.Fill({
                  color: '#000'
                })
              })
            })
            return style;
        }else if(type == "iconLayer"){

            var iconSize=1,iconValue="",iconOffset=[0,0],iconRotate =0,iconData = "";
            
            for(var item in layout){
                if(item == "icon-image"){
                    iconData = layout[item].substr(0,layout[item].indexOf("{"));
                    iconValue = layout[item].substr(layout[item].indexOf("{")+1,(layout[item].indexOf("}")-layout[item].indexOf("{"))-1);
                }
                if(item == "icon-rotate")
                {
                    iconRotate = layout[item].property;
                }
                if(item == "icon-offset"){
                    iconOffset =[-layout[item][0],-layout[item][1]] ;
                }
                if(item == "icon-size"){
                    iconSize = layout[item];
                }
            }
            if(properties[iconRotate]){
                iconRotate = properties[iconRotate]
            }else{
                iconRotate = 0;
            }
            console.log(layerStyle.loadImageUrl)
            if(layerStyle.loadImageUrl){
               
                var style = new PIE.ol.style.Style({
                    image: new PIE.ol.style.Icon({
                      
                      rotateWithView: true,
                      rotation: iconRotate * Math.PI / 180,
                      scale: iconSize,
                      src: layerStyle.loadImageUrl
                    }),
                });
                return style;
            }
          
            if(iconJson[iconData + properties[iconValue]]){
                var _x = iconJson[iconData + properties[iconValue]].x;
                var _y = iconJson[iconData + properties[iconValue]].y;
                var style = new PIE.ol.style.Style({
                    image: new PIE.ol.style.Icon({
                      anchor:iconOffset,
                      offset: [_x, _y],
                      rotateWithView: true,
                      rotation: iconRotate * Math.PI / 180,
                      size: [32, 32],
                      scale: iconSize,
                      src: iconUrl
                    }),
                });
                return style;
            }else{

            }   

        }
	},
      /**
     * 转换颜色数据类型
   
     */
    Typeof: function (typecolor, color) {
        if (typeof (typecolor) == "object") {
            return typecolor = color[typecolor.property]
        } else {
            return typecolor
        }
    },

    /**
     * RGB颜色转换为RGBA颜色
     * 
   
     */
    RgbToRgba: function (color, Opacity) {
        var rgbaColor = color.substring(4, color.length - 1)
        var arrColor = rgbaColor.split(",")
        
        return color = "rgba("+arrColor[0]+","+arrColor[1]+","+arrColor[2]+","+Opacity+")"
    },
    /**
     *图片图层处理
     *
     */
    initImage:function(layer,projection){
      var leftbottom = PIE.ol.proj.fromLonLat([layer.region[0],layer.region[1]], projection);
      var righttop = PIE.ol.proj.fromLonLat([layer.region[2],layer.region[3]], projection);
     
      var _layer = new PIE.ol.layer.Image({
          source: new PIE.ol.source.ImageStatic({
              url: layer.url,
              projection: projection,
              imageExtent: [leftbottom[0],leftbottom[1],righttop[0],righttop[1]]
          })
      });
      _layer.id = layer.id;
      return _layer;

    },
    initIsoLine:function(layerStyle,feature){

      var properties = feature.getProperties();
      var colorline = properties[layerStyle.line.lineColor]!==undefined?properties[layerStyle.line.lineColor]:"#000";
      var colortext = properties[layerStyle.text.textColor]!==undefined?properties[layerStyle.text.textColor]:"#000";
      var lineWidth = properties[layerStyle.line.lineWidth]!==undefined?properties[layerStyle.line.lineWidth]:1;
      var font = 'bold '+ layerStyle.text.size+ 'px Arial';
      var style = new PIE.ol.style.Style({
          stroke: new PIE.ol.style.Stroke({ //边界样式
            color:colorline,
            width: lineWidth
          }),
          text: new PIE.ol.style.Text({
            text: properties[layerStyle.text.textName].toString(),
            fill: new PIE.ol.style.Fill({
              color: colortext
            }),
            font: '14px sans-serif',
          })

      });

      return style;
    }
}
export {OLStyle}