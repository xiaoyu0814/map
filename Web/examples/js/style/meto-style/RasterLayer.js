/***
 *
 * @author yqq
 */
var RasterLayer = 1;
PIE.MetoStyle.RasterLayer = function (options) {
    PIE.Layer.call(this);
    options = options || {};
    this.url = options.url !== undefined ? options.url : "";
    this.id = options.id !== undefined ? options.id : "rasterLayer"+RasterLayer++;
    this.data = options.data !== undefined ? options.data : "";
    this.coordinates = options.coordinates !== undefined ? options.coordinates : [ [-80.425, 46.437], [-71.516, 46.437], [-71.516, 37.936], [-80.425, 37.936]];
    this.opacity = options.opacity !== undefined ? options.opacity : 1;
    this.type = "rasterLayer";
    if(this.url !== ""){

        this.initLayer(this.url);
        console.log("jjjj");
        this.dispatchEvent({type: "load"});
        //this.initLayer(this.url);
    }
    if(this.data !== ""){
        if(typeof( this.data) == "string"){
            this.initLayer(this.data);
        }else{
            this.initLayer(this);
        }

    }

};

PIE.MetoStyle.RasterLayer.prototype = Object.assign( Object.create( PIE.Layer.prototype ), {
    initLayer:function (data) {
        this.source= {
            "id":this.id,
            "source":{
                "type":"image",
                "url":data,
                "coordinates": this.coordinates
            }
        };
        this.layer = {
            "id":this.id,
            "source":this.id,
            "type":"raster",
            "paint":{
                "raster-opacity":this.opacity
            },
            "layout":{

            }
        };
    },
});
