/**
 * 几何对象用于表示对象的显示形式，在PIE-MAP API for JavaScript中的Geometry大体上可以分为下面几类：点、多点、线、矩形、多边形等。
 *
 
 */
function OLSymbol(options) {
	this.options = options;
}
OLSymbol.prototype={
    fromJSON:function () {
        
	},
	/**
	 * 依据type属性创建不同属性的数据结构
	
	 */
    toJSON:function () {
        if(this.options.type=="MarketSymbol"){
        	var tempColor = this.options.color.toArray();
        	tempColor[0] = (tempColor[0]*255)|0;
        	tempColor[1] = (tempColor[1]*255)|0;
        	tempColor[2] = (tempColor[2]*255)|0;
        	
        	var colorString = 'rgba('+tempColor[0]+','+tempColor[1]+','+tempColor[2]+','+this.options.opacity+')'
            return {
	           	"style":new PIE.ol.style.Style({
	                image:new PIE.ol.style.Circle({
	                    radius: this.options.size,
	                    fill: new PIE.ol.style.Fill({
	                        color: colorString
	                    })
	                })
	            })
            } 
	         

        }else if(this.options.type=="LineSymbol"){
          
			var tempColor = this.options.color.toArray();
			tempColor[0] = (tempColor[0]*255)|0;
        	tempColor[1] = (tempColor[1]*255)|0;
        	tempColor[2] = (tempColor[2]*255)|0;
        	var colorString = 'rgba('+tempColor[0]+','+tempColor[1]+','+tempColor[2]+','+this.options.opacity+')'
          
            return {
	           	"style":new PIE.ol.style.Style({
	                stroke:new PIE.ol.style.Stroke({
	                    color: colorString,
	                    width: this.options.width
	                })
	            })
            } 
        

        }else if(this.options.type=="FillSymbol"){
           	var tempColor = this.options.color.toArray();
           	tempColor[0] = (tempColor[0]*255)|0;
        	tempColor[1] = (tempColor[1]*255)|0;
        	tempColor[2] = (tempColor[2]*255)|0;
        	var colorString = 'rgba('+tempColor[0]+','+tempColor[1]+','+tempColor[2]+','+this.options.opacity+')'
            
            return {
	           	"style":new PIE.ol.style.Style({
	                fill:new PIE.ol.style.Fill({
	                    color: colorString
	                })
            	})
            } 
           

        }
    }
};

export {OLSymbol}