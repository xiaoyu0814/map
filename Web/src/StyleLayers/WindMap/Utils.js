import {MotionDisplay} from './MotionDisplay';
import {Vector} from './Vector';
import {Animator} from "./Animator";
import {WindEvent} from './WindEvent';
function Utils() {}

Object.assign( Utils.prototype, {
	addMapCanvas:function () {
	    var width_mapcanvas = document.getElementById("map").clientWidth;
        var height_mapcanvas = document.getElementById("map").clientHeight;
        if(document.getElementById('mapcanvas'))
        {
			document.getElementById("map").removeChild(document.getElementById('mapcanvas'))
        }
        var mapcanvas = document.createElement('canvas');
        document.getElementById("map").appendChild(mapcanvas);
        mapcanvas.id = "mapcanvas";
		mapcanvas.class = "unselectable";
		mapcanvas.style.position ='absolute';
		mapcanvas.style.top='0px';
		mapcanvas.style.pointerEvents = "none"
        mapcanvas.width  = width_mapcanvas;
        mapcanvas.height  = height_mapcanvas;

        var imageCanvas = document.createElement('canvas');
        imageCanvas.id ="image-canvas";
        imageCanvas.width  = width_mapcanvas;
        imageCanvas.height  = height_mapcanvas;

        return [mapcanvas,imageCanvas];

  	},
  	addCanvasLayer:function(map) {
	    var latlon = map.getBounds();
	    var leftbottom = latlon._sw.lng;
	    var boundsLeft = new Vector(latlon._sw.lng,latlon._sw.lat);
	    var boundsRight = new Vector(latlon._ne.lng,latlon._ne.lat);
	    var _sw = this.projto(latlon._sw.lng,latlon._sw.lat);
	   	var _ne = this.projto(latlon._ne.lng,latlon._ne.lat);
	    var mySource = map.getSource("mapdata");
	    if (map.getLayer("mapdata")) {
	      mySource.setCoordinates([
	        turf.toMercator([latlon._sw.lng, latlon._ne.lat]),
	        turf.toMercator([latlon._ne.lng, latlon._ne.lat]),
			turf.toMercator([latlon._ne.lng, latlon._sw.lat]),
			turf.toMercator([latlon._sw.lng, latlon._sw.lat])
	      ]);
	    } else {
	      map.addSource('mapdata', {
	        type: 'canvas',
	        canvas: 'mapcanvas',
	        animate: true,
	        coordinates: [
			turf.toMercator([latlon._sw.lng, latlon._ne.lat]),
			turf.toMercator([latlon._ne.lng, latlon._ne.lat]),
			turf.toMercator([latlon._ne.lng, latlon._sw.lat]),
			turf.toMercator([latlon._sw.lng, latlon._sw.lat])
	        ]
	      });
	      map.addLayer({
	        "id": "mapdata",
	        "type": "raster",
	        "source": "mapdata"

	      });
	    }

	    return [leftbottom,_sw,_ne];
	},
   	addAnimat:function(canvas,field,lnglat) {
	    var isMacFF = navigator.platform.indexOf('Mac') != -1 &&
	      navigator.userAgent.indexOf('Firefox') != -1;
	    var isWinFF = navigator.platform.indexOf('Win') != -1 &&
	      navigator.userAgent.indexOf('Firefox') != -1;
	    var isWinIE = navigator.platform.indexOf('Win') != -1 &&
	      navigator.userAgent.indexOf('MSIE') != -1;
	    var numParticles = isMacFF || isWinIE ? 3500 : 5000; // slowwwww browsers
	    var display = new MotionDisplay(canvas[0], canvas[1], field, numParticles,lnglat[1],lnglat[2]);

	    // IE & FF Windows do weird stuff with very low alpha.
	    if (isWinFF || isWinIE) {
	      display.setAlpha(.05);
	    }

	  	var mapAnimator = new Animator(canvas[0]);
	    mapAnimator.add(display);
	    mapAnimator.start(40);
	    return [display,mapAnimator];
  	},

   	projto:function(lng,lat) {

	    var mercator = new Vector(0, 0);
	    var x = lng * 20037508.34 / 180;
	    var y = Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180);
	    y = y * 20037508.34 / 180;
	    mercator.x = x;
	    mercator.y = y;
	    return mercator;
  	},
   getValue:function(value) {
	    if(value<field.x0)
	    {
	      return field.x0;
	    }
	    if(value>field.x1){
	      return field.x1;
	    }
	    return value;
  	},

   addImage:function(display,ne,sw,map,leftbottom){

	    var latlon = map.getBounds();
	    // update
	    var _oldne = ne.copy();
	    var _oldsw = sw.copy();
	    var boundsLeft = new Vector(latlon._sw.lng,latlon._sw.lat);
	    var boundsRight = new Vector(latlon._ne.lng,latlon._ne.lat);

	    function projto(lng,lat) {
		    var mercator = new Vector(0, 0);
		    var x = lng * 20037508.34 / 180;
		    var y = Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180);
		    y = y * 20037508.34 / 180;
		    mercator.x = x;
		    mercator.y = y;
		    return mercator;
  		}
	    sw = projto(latlon._sw.lng,latlon._sw.lat);
	    ne = projto(latlon._ne.lng,latlon._ne.lat);
	    var mySource = map.getSource("mapdata");
	    if(mySource&&latlon._sw.lng!=leftbottom )
	    {
	      display.setSwNe(sw,ne);
	      leftbottom = latlon._sw.lng;
	      mySource.setCoordinates([
			turf.toMercator([latlon._sw.lng, latlon._ne.lat]),
			turf.toMercator([latlon._ne.lng, latlon._ne.lat]),
			turf.toMercator([latlon._ne.lng, latlon._sw.lat]),
			turf.toMercator([latlon._sw.lng, latlon._sw.lat])
	      ]);
	    }

  	}
})

export {Utils}
