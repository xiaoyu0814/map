import {Layer} from '../Layer/Layer';

var splitLayer = 1;
function SplitLayers(map) {
    this.map = map;
    this.layers = [];
}
SplitLayers.prototype = Object.assign( Object.create( Layer.prototype ), {
    startSplit:function(layer){
        var _this = this; 
        let _features = layer.data;
        let _layers = [];
        turf.featureEach(_features, function (currentFeature, featureIndex) {
            let newLayer = Object.assign({},layer,{id:"split_" + layer.id + featureIndex}); 
            newLayer.source.source.data = turf.featureCollection([currentFeature]);
            newLayer.source.id = newLayer.id;
            newLayer.layer.id = newLayer.id;
            _this.map.add(newLayer);
            _layers.push(newLayer)
        });
        _this.layers = _layers;
        _this.map.remove(layer);
    },
})

export {SplitLayers}