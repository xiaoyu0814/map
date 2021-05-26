/***
 *
 * @author yqq
 */
var lineLayer = 1;
PIE.MetoStyle.LineLayer = function (options) {
    PIE.Layer.call(this);
    options = options || {};
    this.url = options.url !== undefined ? options.url : "";
    this.id = options.id !== undefined ? options.id : "lineLayer"+lineLayer++;
    this.data = options.data !== undefined ? options.data : "";
    this.type = "lineLayer";
    this.symbol = options.symbol !== undefined ? options.symbol : new PIE.LineSymbol({color:"blue",width:1});
    this.width = options.width !== undefined ? options.width : 1;
    this.opacity  = options.opacity !== undefined ? options.opacity : 1;
    this.initData(options);
};
PIE.MetoStyle.LineLayer.prototype = Object.assign( Object.create( PIE.Layer.prototype ), {

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
            "type":"line",
            "paint":{
                'line-color':{ "type": "identity", "property": "valueColor" },
                "line-width":{ "type": "identity", "property": "LineTypeString" },
                /*"line-dasharray":[2,4]*/
            },
            "layout":{
                "visibility":this.visible,
                "line-join": "round",
                "line-cap": "round"
            },
            /*"filter": ["==", "$type", "LineString"]*/
        };
    },
    handleData:function (self,callback) {
        for (var i =0 ;i<self.data.features.length;i++){
            if(self.data.features[i].properties){

            }else{
                self.data.features[i].properties = {};
            }
            if(self.color !=""){
                self.data.features[i].properties.valueColor = self.color;
            }else{
                if(!self.data.features[i].properties.valueColor){
                    self.data.features[i].properties.valueColor = "#00ffff";
                }
            }

            if(self.data.features[i].properties.LineTypeString){
                //self.data.features[i].properties.LineTypeString =self.data.features[i].properties.LineTypeString
            }
            else{
                self. data.features[i].properties.LineTypeString = self.width;
            }
        }

    },
});
