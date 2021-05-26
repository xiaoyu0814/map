function MBGeoJsonFormat(options) {
	this.options = options;

}
MBGeoJsonFormat.prototype={
    fromJSON:function () {
        
    },
    toJSON:function () {
        if(this.options.visible == "none" || this.options.visible == false){
            this.options.visible = "none"
        }else if(this.options.visible == "visible" || this.options.visible == true){
            this.options.visible = "visible"
        }
        console.log(this.options)
        if(this.options.type=="MarketSymbol"){
             return {
                "type":"circle",
                "paint":{
                    "circle-opacity": this.options.opacity,
                    "circle-radius": this.options.size,
                    "circle-color": "#"+this.options.color.getHexString()
                },
                "layout":{
                    "visibility": this.options.visible
                }
            }

        }else if(this.options.type=="LineSymbol"){
            return{
                "type":"line",
                "paint":{
                    "line-opacity": this.options.opacity,
                    "line-width": this.options.width,
                    "line-color": "#"+this.options.color.getHexString()
                },
                "layout":{
                    "line-join": "round",
                    "line-cap": "round",
                    "visibility": this.options.visible
                }
            }

        }else if(this.options.type=="FillSymbol"){
            return {
                "type":"fill",
                "paint":{
                    "fill-opacity": this.options.opacity,
                    "fill-color": "#"+this.options.color.getHexString()
                },
                "layout":{
                    "visibility": this.options.visible
                }
            }

        }
    }
};

export {MBGeoJsonFormat};