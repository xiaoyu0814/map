import {Layer} from '../Layer/Layer';
import {LineLayer} from "../StyleLayers/LineLayer";
import {FillLayer} from "../StyleLayers/FillLayer";



var splitLayer = 1;
function SplitLayer(map) {
    this.map = map;
    this.splitLayer = "";
    this.drawStart = false;

}
SplitLayer.prototype = Object.assign( Object.create( Layer.prototype ), {
    startSplit:function(){
        var _this = this; 
        var drawStart = false;
        var _lines = [];
        _this.map.on('mousedown',function(evt){
            if(!_this.drawStart)return
            let points =  evt.coordinate;
            if(points[0]>180||points[0]<-180){
                points = turf.toWgs84(points)   
            }
            if(evt.originalEvent.button == 0){
                if(_lines.length == 0){
                    drawStart = true;
                    _lines.push(points);
                }else{
                    _lines.push(points);
                }
            }else if(evt.originalEvent.button == 2){
                drawStart = false;
                if(_lines.length>1){
                    _lines.pop();
                 }
                _lines.push(points);
                if(_lines.length>=2){
                    _this.addLine(_lines);
                    _this.split();
                    _this.drawStart = false
                }
                _lines = []
            }
        })
        _this.map.on('mousemove',function(evt){
            if(!_this.drawStart)return
            var position = evt.coordinate;
            if(position[0]>180||position[0]<-180){
                position = turf.toWgs84(position)   
            }
            if(drawStart){
                 //floatingPoint.position.setValue(position);
                 if(_lines.length>1){
                    _lines.pop();
                 }
                _lines.push(position);
                _this.addLine(_lines);
                
            }
        })
    },
    startDraw:function(){
        this.drawStart = true;
        this.startSplit()
    },
    endDraw:function(){
        this.drawStart = false;
    },
    addLine:function (line){
        var _this = this; 
        let lineFeature = turf.lineString(line);
        let _features = turf.featureCollection([lineFeature]);
        if(this.map.getLayer('draw_line')){
            this.map.getLayer('draw_line').setSource(_features)
        }else{
            this.splitLayer = new LineLayer({
                data:_features,
                id:"draw_line",
                color:"#f00"
            })
            _this.map.add( this.splitLayer)
        }

    },
    split:function(){
        let _jsonLayers = this.map.getLayers();
        let length = _jsonLayers.length
        for(let i=0;i<length-1;i++){
            let _layer = _jsonLayers[i];
            if(_layer.id == 'draw_line')continue;
            if(_layer.type == "fillLayer"){  
              this.splitPolygon(_layer);
            }else if(_layer.type == "lineLayer"){
                this.splitLine(_layer)
            } 
        }
      
        
    },
    splitLine:function(_oldlineLayer){
        let _lineLayer = this.splitLayer;
        if(_oldlineLayer.data.features[0].geometry.type == "LineString" && _lineLayer.data.features[0].geometry.type == "LineString" ){
            let feature_1=  _oldlineLayer.data.features[0];
            let splitter_feature=  _lineLayer.data.features[0];
            let split_feature = turf.lineSplit(feature_1,splitter_feature);
            console.log(split_feature)
            if(split_feature.features.length==0){
                return;
            }
            let oldFeature = split_feature.features[0];
            let newFeature = split_feature.features[1];
            console.log(newFeature)
            let add_feature = turf.featureCollection([oldFeature]);
            _fillLayer.setSource(add_feature);
            this.addNewFill(split_feature,_oldlineLayer)  
        }
    },
    splitPolygon:function(_fillLayer){
        let _lineLayer = this.splitLayer;
        if(_fillLayer.data.features[0].geometry.type == "Polygon" && _lineLayer.data.features[0].geometry.type == "LineString" ){
            let feature_1=  _fillLayer.data.features[0];
            let splitter_feature=  _lineLayer.data.features[0];
            let poly_lineFeature = turf.polygonToLineString(feature_1)
            let split_feature = turf.lineSplit(poly_lineFeature,splitter_feature);
            console.log(split_feature)
            if(split_feature.features.length==0){
                return;
            }
            split_feature.features[0].geometry.coordinates.push(split_feature.features[2].geometry.coordinates[0],split_feature.features[2].geometry.coordinates[1])
            let oldFeature = turf.lineToPolygon(split_feature.features[0],_fillLayer.data.features[0].properties);
            let newFeature = split_feature.features[1];
            console.log(newFeature)
            let add_feature = turf.featureCollection([oldFeature]);
            _fillLayer.setSource(add_feature);
            this.addNewFill(split_feature,_fillLayer)  
        }
    },
    addNewLine:function(split_feature,targetLayer){
        if(split_feature.features.length==0){
            return;
        }
        let time = new Date();
        let add_feature = turf.featureCollection([split_feature]);
        let fill = new LineLayer({data:add_feature,id:"split_" + targetLayer.id+time.getTime(),color:targetLayer.color,opacity:targetLayer.opacity})
        this.map.add(fill);
        this.map.remove(this.splitLayer);
    },
    addNewFill:function(split_feature,targetLayer){
        if(split_feature.features.length==0){
            return;
        }
        let time = new Date();
        let _feature = turf.lineToPolygon(split_feature.features[1],targetLayer.data.features[0].properties);
        let add_feature = turf.featureCollection([_feature]);
        let fill = new FillLayer({data:add_feature,id:"split_" + targetLayer.id+time.getTime(),color:targetLayer.color,opacity:targetLayer.opacity})
        this.map.add(fill);
        this.map.remove(this.splitLayer);
    }

})

export {SplitLayer}