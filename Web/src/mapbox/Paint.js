function Paint() {
    this.type = "fill";
}

Paint.prototype = {

    File_color: {
        get: function () {

            return self.file_color;
        },
        set:function (value) {
            this.file_color = value
        }
    },
    Line_color: {
        get: function () {
            return this.line_color;
        },
        set:function (value) {
            this.line_color = value
        }
    },
    Line_width: {
        get: function () {
            return this.line_width;
        },
        set:function (value) {
            this.line_width = value
        }
    },
    Raster_Opacity:{
        get: function () {
            return this.raster_opacity;
        },
        set:function (value) {
            this.raster_opacity = value
        }
    },
    Raster_Opacity_Transition:{
        get: function () {
            return this.raster_opacity_transition;
        },
        set:function (value) {
            this.raster_opacity_transition = value
        }
    }
};
Paint.prototype.toJson = function(){
    var strJson = JSON.stringify(this);
    var strReplace = "\"type\":"+JSON.stringify(this.type)+",";
    strJson = strJson.replace(strReplace,"");
    if(this.type=="line"){
        strJson = strJson.replace(/line_color/,"line-color");
        strJson = strJson.replace(/line_width/,"line-width");
    }else{
        strReplace = "\"line_color\":"+JSON.stringify(this.line_color)+",";
        strReplace += "\"line_width\":"+JSON.stringify(this.line_width)+",";
        strJson = strJson.replace(strReplace,"");
    }
    if(this.type=="fill"){
        strJson = strJson.replace(/fill_color/,"fill-color");
    }else{
        strReplace = "\"fill_color\":"+JSON.stringify(this.fill_color)+",";
        strJson = strJson.replace(strReplace,"");
    }

    if(this.type == "raster"){
        strJson = strJson.replace(/raster_opacity/,"raster-opacity");
        strJson = strJson.replace(/raster_opacity_transition/,"raster-opacity-transition");
    }else{
        strReplace = "\"raster_opacity\":"+JSON.stringify(this.raster_opacity)+",";
        strReplace = "\"raster_opacity_transition\":"+JSON.stringify(this.raster_opacity_transition)+",";
        strJson = strJson.replace(strReplace,"");
    }
    var strJson = JSON.parse(strJson);
    return strJson;
}
export {Paint}