
import {IconLayer} from "../StyleLayers/IconLayer";
import {TextLayer} from "../StyleLayers/TextLayer";
function  MapboxGroundStationStyle(symbol,feature,id) {
	var groundFeilds = symbol;
	var properties = feature.properties;
    var Layers = [];
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
           	Layers.push(iconLayer);

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
            Layers.push(textLayer);

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
       Layers.push(N);
    }
	return Layers;
}

export { MapboxGroundStationStyle }