/***
 *
 * @author yqq
 */
var iconLayer = 1;
PIE.MetoStyle.IconLayer = function (options) {
    PIE.Layer.call(this);
    options = options || {};
    this.url = options.url !== undefined ? options.url : "";
    this.id = options.id !== undefined ? options.id : "iconLayer"+iconLayer++;
    this.data = options.data !== undefined ? options.data : "";
    this.opacity  = options.opacity !== undefined ? options.opacity : 1;
    this.visible = options.visible !== undefined ?options.visible : "visible";
    this.iconUrl =  options.iconUrl !== undefined ? options.iconUrl : "iconUrl";//WindSpeed
    this.rotate = options.rotate !==undefined ? options.rotate : "angle";//WindDirection
    this.imageName =  options.imageName !==undefined ? options.imageName : "";
    //this.symbol = options.symbol !== undefined ? options.symbol : new PIE.MarketSymbol({color:"blue",width:1});
    this.initData(options);
    //map.addLayer(layer);
};
PIE.MetoStyle.IconLayer.prototype =  Object.assign( Object.create( PIE.Layer.prototype ), {
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

            },
            "layout":{
                "icon-image": this.imageName+"{"+this.iconUrl+"}",
                "icon-rotate":{ "type": "identity", "property": ""+this.rotate+ ""},
                "icon-allow-overlap" : true,
                "icon-offset":[0,0],
                "icon-anchor" : "bottom",
                "icon-size":  0.8
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
            if(data.features[i].properties.angle){
                //data.features[i].properties.angle =this.colorPath[data.features[i].properties.angle]
            }
            else{
                data.features[i].properties.angle = 0;
            }
            if(data.features[i].properties.iconUrl){
                //data.features[i].properties.angle =this.colorPath[data.features[i].properties.angle]
            }
            else{
                data.features[i].properties.iconUrl = "";
            }
        }
    },
});
