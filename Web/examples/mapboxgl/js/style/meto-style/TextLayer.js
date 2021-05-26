/***
 *
 * @author yqq
 */
var textLayer = 1;
PIE.MetoStyle.TextLayer = function (options) {
    PIE.Layer.call(this);
    options = options || {};
    this.url = options.url !== undefined ? options.url : "";
    this.id = options.id !== undefined ? options.id : "textLayer"+textLayer++;
    this.data = options.data !== undefined ? options.data : "";
    this.color =  options.color !== undefined ? options.color : "#00ffff";
    this.text =  options.text !== undefined ? options.text : "colorIndex";
    this.overlap = options.overlap !== undefined ? options.overlap : false;
   // this.symbol = options.symbol !== undefined ? options.symbol : new PIE.MarketSymbol({color:"blue",width:1});
    this.initData(options);
    //map.addLayer(layer);
};
PIE.MetoStyle.TextLayer.prototype =  Object.assign( Object.create( PIE.Layer.prototype ), {
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
            "type":"symbol",
            "paint":{
                "text-color": { "type": "identity", "property": "valueColor" }
            },
            "layout":{
                "text-field": "{"+this.text+"}",
                "text-font":["KlokanTech Noto Sans CJK Regular"],
                "text-rotate":{ "type": "identity", "property": "angle" },
                "text-allow-overlap":this.overlap
            }
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
