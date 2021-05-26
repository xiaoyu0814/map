import {
  EventDispatcher
} from "../core/EventDispatcher";
/**
 * @module Geometry
 */
/**
 * 几何对象用于表示对象的显示形式，在PIE-MAP API for JavaScript中的Geometry大体上可以分为下面几类：点、多点、线、矩形、多边形等。
 * 
 * @class Geometry
 * @constructor
 * @extends EventDispatcher
 */
var geometryId = 1;

function Geometry() {
  EventDispatcher.call(this)

  Object.defineProperty(this, 'id', {
    value: "Geometry" + geometryId++
  });
  this.type = "Geometry";

  this.extent = "";
  this.spatialReference = "WDS";

}

Geometry.prototype = Object.assign(Object.create(EventDispatcher.prototype), {
  clone: function () {

  },

  /**
   * 依据type属性创建不同属性的数据结构
   * <a href="../../examples/measure_Distance.html">distance.html:96</a>
   * 
   * @method toJSON
   * @return {object} 返回 Source对象此类型的数据
   */
  toJSON: function () {
    var self = this;
    if (this.type == "Point") {
      var point_data = {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [this.x, this.y]
        }
      }
	  if(this.properties){
				point_data.properties=this.properties;
			}
      return point_data;
    } else if (this.type == "Line") {
      if (this.path[0][0] instanceof Array) {
        var lineArray = [];
        // this.path.forEach((item, index) => {
        //   var line_data = {
        //     "type": "Feature",
        //     "geometry": {
        //       "type": "LineString",
        //       "coordinates": item
        //     }
        //   }
        //   lineArray.push(line_data);
        // })
        for(var i=0; i<this.path.length; i++){
          var line_data = {
            "type": "Feature",
            "geometry": {
              "type": "LineString",
              "coordinates": this.path[i]
            }
          }
		   if(this.properties){
					line_data.properties=this.properties;
			  }
                  
          lineArray.push(line_data);
        }
        return lineArray;
      } else {
        var line_data = {
          "type": "Feature",
          "geometry": {
            "type": "LineString",
            "coordinates": this.path
          }
        }
		    if(this.properties){
					line_data.properties=this.properties;
				}
        return line_data
      }

    } else if (this.type == "Polygon") {
      var polygon_data = {
        "type": "Feature",
        "geometry": {
          "type": "Polygon",
          "coordinates": this.path
        }
      }
	  if(this.properties){
				polygon_data.properties=this.properties;
			}
      return polygon_data;
    }
    return self.data;

  },
  fromJSON: function () {

  }
});
export {
  Geometry
}