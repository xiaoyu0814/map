
function  OLGroundStationStyle(symbol,feature,url,iconJson) {
	var groundFeilds = symbol;
	var properties = feature.getProperties();
	var styles = [];
	for(var item in groundFeilds){
		var propertieFeilds = properties[item];
		if(propertieFeilds){
			var styleType = groundFeilds[item];
			if(styleType.type == "icon"){
				var iconrotate = styleType.rotate;
				var anchor = [0.5,1],unit ="fraction";
				if(iconrotate){
					iconrotate = properties[iconrotate] * Math.PI / 180;
				}else{
					anchor = [-styleType.offset[0],-styleType.offset[1]];
					iconrotate = 0;
					unit = "pixels";
					if(anchor[0] == anchor[1]){
						anchor = [0.5,0.5];
						unit ="fraction";
					}
				}
				//console.log(styleType.offset);
				var offsetData = iconJson[styleType.iconName + properties[styleType.iconImage]];
				if(offsetData){
					var icon = new PIE.ol.style.Style({
						image : new PIE.ol.style.Icon({
							anchor: anchor,
					        offset: [offsetData.x,offsetData.y],
					        anchorXUnits: unit,
          					anchorYUnits: unit,
					        size: [offsetData.height, offsetData.width],
					        scale:styleType.size,
					        rotateWithView: true,
					        rotation: iconrotate,
					        src: url
						}) 
					})
					styles.push(icon);
				}	

			}else if(styleType.type == "text"){
				var value = properties[styleType.text].toString();
				var font = 'bold '+ styleType.size+ 'px Arial';

				var text = new PIE.ol.style.Style({
			      text: new PIE.ol.style.Text({
			        text: value,
			        offsetX:styleType.offset[0]*styleType.size+styleType.size,
			        offsetY:styleType.offset[1]*styleType.size,
			        fill:new PIE.ol.style.Fill({
			          color:styleType.color
			        }),
			        font: font,
			      })

				});
				styles.push(text);
			}
		}
	}
    if(groundFeilds["H"]){
       var style_N = new PIE.ol.style.Style({
        image: new PIE.ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
          offset: [iconJson["N00"].x, iconJson["N00"].y],
          size: [iconJson["N00"].height, iconJson["N00"].width],
          scale: 0.4,
          rotation: 0,
          src:url
        })),
      });
      styles.push(style_N)
    }
	return styles;
}

export { OLGroundStationStyle }