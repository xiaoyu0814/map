/***
 *
 * @author yqq
 */
var pointLayer = 1;
PIE.MetoStyle.PointLayer = function (options) {
    PIE.Layer.call(this);
    options = options || {};
    this.url = options.url !== undefined ? options.url : "";
    this.id = options.id !== undefined ? options.id : "pointLayer"+pointLayer++;
    this.data = options.data !== undefined ? options.data : "";
    this.color =  options.color !== undefined ? options.color : "#00ffff";
    this.size =  options.size !== undefined ? options.size : 5;
   // this.symbol = options.symbol !== undefined ? options.symbol : new PIE.MarketSymbol({color:"blue",width:1});
    this.initData(options);

    //map.addLayer(layer);
};
PIE.MetoStyle.PointLayer.prototype =  Object.assign( Object.create( PIE.Layer.prototype ), {
    initLayer:function (data) {
        this.source= {
            "id":this.id,
            "source":{
                "type":"geojson",
                "data":data
            }
        };
        this.layer = {
            "id":this.id,
            "source":this.id,
            "type":"circle",
            "paint":{
                "circle-radius": this.size,
                "circle-color": { "type": "identity", "property": "valueColor" }
            },
            "layout":{

            },
            "filter": ["==", "$type", "Point"]
        };
    },
    handleData:function (self) {
        var data = self.data;
        for (var i =0 ;i<data.features.length;i++){
            if(self.data.features[i].properties){

            }else{
                self.data.features[i].properties = {};
            }
            if(data.features[i].properties.valueColor){
               // data.features[i].properties.valueColor =this.colorPath[data.features[i].properties.colorIndex]
            }
            else{
                data.features[i].properties.valueColor = self.color;
            }
            if(data.features[i].properties.angle){
               // data.features[i].properties.angle =this.colorPath[data.features[i].properties.angle]
            }
            else{
                data.features[i].properties.angle = 0;
            }
            if(data.features[i].properties.colorIndex){
                // data.features[i].properties.angle =this.colorPath[data.features[i].properties.angle]
            }
            else{
                data.features[i].properties.colorIndex = "";
            }
            if(data.features[i].properties[self.text]){
                // data.features[i].properties.angle =this.colorPath[data.features[i].properties.angle]
            }
            else{
                data.features[i].properties[self.text] = "";
            }

        }
    },
});
