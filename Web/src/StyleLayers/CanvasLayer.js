import {Layer} from '../Layer/Layer';
/***
 *
 * @author yqq
 */

var canvasLayer = 1;
function  CanvasLayer(options) {
    Layer.call(this);
    options = options || {};
    var colorMap ={
        "-2":"#020C64",
        "-1": "#071E78",
        "0": "#11318B",
        "1": "#1B449F",
        "2":"#2657B3",
        "3": "#306AC7",
        "4":"#3B7EDB",
        "5": "#4E8ADD",
        "6": "#6196E0",
        "7": "#747BE2",
        "8": "#87AFE5",
        "9": "#9BBCE8",
        "10":"#99CDD0",
        "11": "#98D6D4",
        "12": "#97E8AD",
        "13": "#D7DE7E",
        "14": "#EADB70",
        "15":"#F4D9C7",
        "16": "#F4D963",
        "17": "#FAD64F",
        "18": "#F7B42D",
        "19": "#F29B00",
        "20": "#F19303",
        "21": "#F0840A",
        "22": "#EF7511",
        "23": "#EE6618",
        "24": "#EE581F",
        "25": "#E74B1A",
        "26": "#E03F16",
        "27": "#D93312",
        "28": "#D0240E",
        "29": "#C20003",
        "30": "#B50109",
        "31": "#A90210",
        "32": "#8A0519",
        "33":  "#6F0015",
        "34":  "#50000f"
    };
    this.type = "fillLayer";
    this.url = options.url !== undefined ? options.url : "";
    this.id = options.id !== undefined ? options.id : "canvasLayer"+canvasLayer++;
    this.data = options.data !== undefined ? options.data : "";
    //this.symbol = options.symbol !== undefined ? options.symbol : new PIE.FillSymbol({color:"blue"});
    this.colorPath = options.colorPath !== undefined ? options.colorPath : colorMap ;
    this.opacity  = options.opacity !== undefined ? options.opacity : 1;
    this.initData(options);
    //map.addLayer(layer);
};
CanvasLayer.prototype = Object.assign( Object.create( Layer.prototype ),{
   
    initLayer : function (data) {
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
            "type":"fill",
            "paint":{
                'fill-color':{ "type": "identity", "property": "valueColor" },
                "fill-opacity":this.opacity
            },
            "layout":{
                "visibility":this.visible
            }
        };
    },
   
    handleData:function (self) {
        for (var i =0 ;i<self.data.features.length;i++){
            if(self.data.features[i].properties){

            }else{
                self.data.features[i].properties = {};
            }
            if(self.data.features[i].properties.colorIndex){
                self.data.features[i].properties.valueColor =self.colorPath[self.data.features[i].properties.colorIndex]
            }
            else{
                if(self.color !=""){
                    self.data.features[i].properties.valueColor = self.color;
                }else{
                    self.data.features[i].properties.valueColor = "#dddddd";
                }

            }

        }
        self.initLayer(self.data);
        self.setLoad();
    },

});
export { CanvasLayer };