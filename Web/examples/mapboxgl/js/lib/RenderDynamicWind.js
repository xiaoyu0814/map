
var TRANSPARENT_BLACK = [0, 0, 0, 0];
var HOLE_VECTOR = [NaN, NaN, null];  
var NULL_WIND_VECTOR = [NaN, NaN, null];
 
var SECOND = 1000;
var MINUTE = 60 * SECOND;
var HOUR = 60 * MINUTE;
var MAX_TASK_TIME = 10;
var RTOD = 57.29578049044297;

var τ = 2 * Math.PI;
var H = 0.0000360;  // 0.0000360°φ ~= 4m
var OVERLAY_ALPHA = Math.floor(0.4*255);
var MIN_SLEEP_TIME = 2;

//每帧调用
var INTENSITY_SCALE_STEP = 10;
var maxIntensity = 17;
var PARTICLE_MULTIPLIER = 5;
var INTERPOLATEDIV = 2;
   

var MAX_PARTICLE_AGE = 100;
var fadeFillStyle = "rgba(0, 0, 0, 0.95)" ;
var PARTICLE_LINEWIDTH = 2; 
var WindScale = 1.0*6; 
 

/* PARTICLE_MULTIPLIER = 10;
var WindScale = 1.0*1; 
var MAX_PARTICLE_AGE = 5;
var fadeFillStyle = "rgba(0, 0, 0, 0.85)" ;
var PARTICLE_LINEWIDTH = 10;   */

function floorMod(a, n) {
	var f = a - n * Math.floor(a / n);
	// HACK: when a is extremely close to an n transition, f can be equal to n. This is bad because f must be
	//       within range [0, n). Check for this corner case. Example: a:=-1e-16, n:=10. What is the proper fix?
	return f === n ? 0 : f;
}

function isValue(x){
  return x !== null && x !== undefined;
}
	
function bilinearInterpolateVector(x, y, g00, g10, g01, g11) {
	var rx = (1 - x);
	var ry = (1 - y);
	var a = rx * ry,  b = x * ry,  c = rx * y,  d = x * y;
	var u = g00[0] * a + g10[0] * b + g01[0] * c + g11[0] * d;
	var v = g00[1] * a + g10[1] * b + g01[1] * c + g11[1] * d;
	return [u, v, Math.sqrt(u * u + v * v)];
}


function RenderDynamicWind(viewer)
{
	this._field = undefined;
	this._imageMask = undefined; 
	this._particleNum = undefined;
	this._mapCenter = undefined;
	this._mapScale = undefined;
	this._windowWidth = undefined;
	this._windowheight = undefined;
	this._bounds = {
		x:0,
		y:0,
		xMax:0,
		yMax:0,
		width:0,
		height:0
	}
	
	this._viewer = viewer;
	this._builder = undefined;
	this._cancel = false;
	this._centerPnt = new Cesium.Cartographic();
}

function WindData()
{
	this._header = undefined;
	this._grid = undefined;
}

function buildGrid(builder) {
       
	var header = builder.header;
	var λ0 = header.lo1, φ0 = header.la1;  // the grid's origin (e.g., 0.0E, 90.0N)
	var Δλ = header.dx, Δφ = header.dy;    // distance between grid points (e.g., 2.5 deg lon, 2.5 deg lat)
	var ni = header.nx, nj = header.ny;    // number of grid points W-E and N-S (e.g., 144 x 73)
	//var date = new Date(header.refTime);
	//date.setHours(date.getHours() + header.forecastTime);

	// Scan mode 0 assumed. Longitude increases from λ0, and latitude decreases from φ0.
	// http://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_table3-4.shtml
	var grid = [], p = 0;
	var isContinuous = Math.floor(ni * Δλ) >= 360;
	for (var j = 0; j < nj; j++) {
		var row = [];
		for (var i = 0; i < ni; i++, p++) {
			row[i] = builder.data(p);
		}
		if (isContinuous) {
			// For wrapped grids, duplicate first column as last column to simplify interpolation logic
			row.push(row[0]);
		}
		grid[j] = row;
	}

	this.interpolate = function(λ, φ) {
		var i = floorMod(λ - λ0, 360) / Δλ;  // calculate longitude index in wrapped range [0, 360)
		var j = (φ0 - φ) / Δφ;                 // calculate latitude index in direction +90 to -90

		//         1      2           After converting λ and φ to fractional grid indexes i and j, we find the
		//        fi  i   ci          four points "G" that enclose point (i, j). These points are at the four
		//         | =1.4 |           corners specified by the floor and ceiling of i and j. For example, given
		//      ---G--|---G--- fj 8   i = 1.4 and j = 8.3, the four surrounding grid points are (1, 8), (2, 8),
		//    j ___|_ .   |           (1, 9) and (2, 9).
		//  =8.3   |      |
		//      ---G------G--- cj 9   Note that for wrapped grids, the first column is duplicated as the last
		//         |      |           column, so the index ci can be used without taking a modulo.

		var fi = Math.floor(i), ci = fi + 1;
		var fj = Math.floor(j), cj = fj + 1;

		var row;
		if ((row = grid[fj])) {
			var g00 = row[fi];
			var g10 = row[ci];
			if (isValue(g00) && isValue(g10) && (row = grid[cj])) {
				var g01 = row[fi];
				var g11 = row[ci];
				if (isValue(g01) && isValue(g11)) {
					// All four points found, so interpolate the value.
					return builder.interpolate(i - fi, j - fj, g00, g10, g01, g11);
				}
			}
		}
		// console.log("cannot interpolate: " + λ + "," + φ + ": " + fi + " " + ci + " " + fj + " " + cj);
		return null;
	}

}
	
RenderDynamicWind.prototype.parseData = function(file)
{
	
	if(file != null)
	{
		var udatas = [],vdatas = [],ydatas = [],xdatas = [];
		var _length = file.field.length;
		for(var y = file.h-1;y>=0;y--){
			for(var x = 0;x<file.w;x++){
				xdatas.push(file.field[x][y].x);
				ydatas.push(file.field[x][y].y);
			}
		}
		var header = {
			"nx": file.w,
			"ny": file.h,
			"basicAngle": 0,
			"subDivisions": 0,
			"lo1": 0,
			"la1": 90,
			"lo2": 359,
			"la2": -90,
			"dx": 8,
			"dy": 8
		}
	
	/*	var uData = file[0].data;
		var vData = file[1].data;*/
		var uData = xdatas;
		var vData = ydatas;
		var builder = {};
		//builder.header = file[0].header;
		builder.header = header;
		builder.data = function(i){
				return [uData[i], vData[i]];
		}
		builder.interpolate = bilinearInterpolateVector;
		
		this._builder = new buildGrid(builder);
		
	}
}

	
RenderDynamicWind.prototype.getScreenToGeoMatrix = function()
{
	var sreenToGeo = new Cesium.Matrix4() ;
	var inverseProjectionM = new Cesium.Matrix4();
	inverseProjectionM = Cesium.Matrix4.inverse(this._viewer.camera.frustum.projectionMatrix,inverseProjectionM); 
	var modelViewMatrix = this._viewer.camera.inverseViewMatrix;
	sreenToGeo = Cesium.Matrix4.multiply(modelViewMatrix,inverseProjectionM,sreenToGeo);
	return sreenToGeo;
}

RenderDynamicWind.prototype.getGeoToScreenMatrix = function()
{
	var geoTosreen = new Cesium.Matrix4() ;
	var projectionM = new Cesium.Matrix4();
	projectionM = this._viewer.camera.frustum.projectionMatrix; 
	var modelViewMatrix = this._viewer.camera.viewMatrix;
	geoTosreen = Cesium.Matrix4.multiply(projectionM,modelViewMatrix,geoTosreen);
	return geoTosreen;
}


//屏幕坐标转经纬度,返回值为角度
function ScreenToLonlat(scene,ellipsoid,pos)
{ 
    var resultRay = scene.camera.getPickRay(pos);
	var posStart = resultRay.origin;
	var direction = resultRay.direction;
	
	var cartoScratch = new Cesium.Cartographic();
	
	if(scene.mode == Cesium.SceneMode.SCENE3D)
	{
		var cartesian = Cesium.IntersectionTests.rayEllipsoid(resultRay,ellipsoid);
		if(cartesian != null)
		{
			var lonLatPos = new Cesium.Cartesian4();
			resultRay.origin
			lonLatPos.x = posStart.x + direction.x * cartesian.start;
			lonLatPos.y = posStart.y + direction.y * cartesian.start;
			lonLatPos.z = posStart.z + direction.z * cartesian.start;
			
			var cartographic = ellipsoid.cartesianToCartographic(lonLatPos);
			cartographic.longitude *= RTOD;
			cartographic.latitude *= RTOD;
			
			return cartographic;
		}
	
	}
	else
	{    var result = posStart;
		 result = Cesium.Cartesian3.fromElements(posStart.y, posStart.z, posStart.x, result);
		 var cartographic = scene.mapProjection.unproject(result, cartoScratch);
		 cartographic.longitude *= RTOD;
	     cartographic.latitude *= RTOD;
		 
		 return cartographic;
	}
	
	
	
	return null;
			 
}

RenderDynamicWind.prototype.CreateMask = function()
{
	var width = this._windowWidth;
	var height = this._windowheight;
	
	var canvas = document.createElement("canvas");
	canvas.width = width,canvas.height = height;
	var context = canvas.getContext("2d");
	context.fillStyle = "rgba(255, 0, 0, 0)";
	context.fill();
   
	var imageData = context.getImageData(0, 0, width, height);
	var data = imageData.data;  // layout: [r, g, b, a, r, g, b, a, ...]
	
	return {
		imageData: imageData,
		isVisible: function(x, y) {
			var i = (y * width + x) * 4;
			return data[i + 3] > 0;  // non-zero alpha means pixel is visible
		},
		set: function(x, y, rgba) {
			var i = (y * width + x) * 4;
			data[i    ] = rgba[0];
			data[i + 1] = rgba[1];
			data[i + 2] = rgba[2];
			data[i + 3] = rgba[3];
			return this;
		}
	};
}


function createField(columns, bounds, mask) {

	/**
	 * @returns {Array} wind vector [u, v, magnitude] at the point (x, y), or [NaN, NaN, null] if wind
	 *          is undefined at that point.
	 */
	function field(x, y) {
		var column = columns[Math.round(x)];
		return column && column[Math.round(y)] || NULL_WIND_VECTOR;
	}

	/**
	 * @returns {boolean} true if the field is valid at the point (x, y)
	 */
	field.isDefined = function(x, y) {
		return field(x, y)[2] !== null;
	};

	/**
	 * @returns {boolean} true if the point (x, y) lies inside the outer boundary of the vector field, even if
	 *          the vector field has a hole (is undefined) at that point, such as at an island in a field of
	 *          ocean currents.
	 */
	field.isInsideBoundary = function(x, y) {
		return field(x, y) !== NULL_WIND_VECTOR;
	};

	// Frees the massive "columns" array for GC. Without this, the array is leaked (in Chrome) each time a new
	// field is interpolated because the field closure's context is leaked, for reasons that defy explanation.
	field.release = function() {
		columns = [];
	};

	field.randomize = function(o) {  // UNDONE: this method is terrible
		var x, y;
		var safetyNet = 0;
		do {
			x = Math.round(random(bounds.x, bounds.xMax));
			y = Math.round(random(bounds.y, bounds.yMax));
		} while (!field.isDefined(x, y) && safetyNet++ < 30);
		o.x = x;
		o.y = y;
		return o;
	};

	field.overlay = mask.imageData;
	return field;
}
	
	
function colorInterpolator(start, end) {
        var r = start[0], g = start[1], b = start[2];
        var Δr = end[0] - r, Δg = end[1] - g, Δb = end[2] - b;
        return function(i, a) {
            return [Math.floor(r + i * Δr), Math.floor(g + i * Δg), Math.floor(b + i * Δb), a];
        };
    }
	
 /**
     * Produces a color style in a rainbow-like trefoil color space. Not quite HSV, but produces a nice
     * spectrum. See http://krazydad.com/tutorials/makecolors.php.
     *
     * @param hue the hue rotation in the range [0, 1]
     * @param a the alpha value in the range [0, 255]
     * @returns {Array} [r, g, b, a]
     */
function sinebowColor(hue, a) {
	// Map hue [0, 1] to radians [0, 5/6τ]. Don't allow a full rotation because that keeps hue == 0 and
	// hue == 1 from mapping to the same color.
	var rad = hue * τ * 5/6;
	rad *= 0.75;  // increase frequency to 2/3 cycle per rad

	var s = Math.sin(rad);
	var c = Math.cos(rad);
	var r = Math.floor(Math.max(0, -c) * 255);
	var g = Math.floor(Math.max(s, 0) * 255);
	var b = Math.floor(Math.max(c, 0, -s) * 255);
	return [r, g, b, a];
}

var BOUNDARY = 0.45;
var fadeToWhite = colorInterpolator(sinebowColor(1.0, 0), [255, 255, 255]);

/**
 * Interpolates a sinebow color where 0 <= i <= j, then fades to white where j < i <= 1.
 *
 * @param i number in the range [0, 1]
 * @param a alpha value in range [0, 255]
 * @returns {Array} [r, g, b, a]
 */
function extendedSinebowColor(i, a) {
	return i <= BOUNDARY ?
		sinebowColor(i / BOUNDARY*2, a) :
		fadeToWhite((i - BOUNDARY) / (1 - BOUNDARY), a);
}

//屏幕坐标转经纬度,返回值为角度
function LonlatToScreen(scene,pos)
{ 
   var position = new Cesium.Cartographic(Cesium.Math.toRadians(pos[0]),Cesium.Math.toRadians(pos[1]), 0.0);
   var cartesianPosition = Cesium.Ellipsoid.WGS84.cartographicToCartesian(position);
   
   var posEnd = Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, cartesianPosition);			
   return posEnd;				 
}

function distortion(scene,λ, φ, x, y) {
        var hλ = λ < 0 ? H : -H;
        var hφ = φ < 0 ? H : -H;
        var pλ = LonlatToScreen(scene,[λ + hλ, φ]);
        var pφ = LonlatToScreen(scene,[λ, φ + hφ]);

        // Meridian scale factor (see Snyder, equation 4-3), where R = 1. This handles issue where length of 1° λ
        // changes depending on φ. Without this, there is a pinching effect at the poles.
        var k = Math.cos(φ / 360 * τ);

        return [
            (pλ.x - x) / hλ / k,
            (pλ.y - y) / hλ / k,
            (pφ.x - x) / hφ,
            (pφ.y - y) / hφ
        ];
    }
	
 function distort(scene, λ, φ, x, y, scale, wind) {
	var u = wind[0] * scale;
	var v = wind[1] * scale;
	var d = distortion(scene, λ, φ, x, y);

	// Scale distortion vectors by u and v, then add.
	wind[0] = d[0] * u + d[2] * v;
	wind[1] = d[1] * u + d[3] * v;
	return wind;
}

var velocityScale_o = 0.000016666666666666667*0.1;

RenderDynamicWind.prototype.interpolateField = function(builder)
{
	//这个纹理重复每次生成，也可以生成一次
	var mask = this._imageMask = this.CreateMask();
	var scene = this._viewer.scene;
	var ellipsoid = scene.globe.ellipsoid;
	
	var renderObject = this;
    var velocityScale = renderObject._bounds.height * velocityScale_o;

	var columns = [];
    var point = new Cesium.Cartesian2;
	
	/* var worker = new Worker('./Source/Workers/interpolateForRenderWind.js');
	worker.postMessage({ scene});

        worker.onmessage = function (event) {
           var af = 56;
        } */
		
		
	function interpolateColumn(x) {
		var column = [];
		for (var y = renderObject._bounds.y; y <= renderObject._bounds.yMax; y += INTERPOLATEDIV) {
			//var value = mask.isVisible(x, y);
			if (true) {
				point.x = x; point.y = y;
				var a = this;
			    var coord = ScreenToLonlat(scene,ellipsoid,point);
				var color = TRANSPARENT_BLACK;
				
				var wind = null;
				if (coord) {
					var λ = coord.longitude, φ = coord.latitude;
					if (isFinite(λ)) {
						wind = builder.interpolate(λ, φ);
						var scalar = null;
						if (wind) {
							wind = distort(scene,λ, φ, x, y, velocityScale, wind);
							scalar = wind[2];
						}
						//if (hasDistinctOverlay) {
							//scalar = overlayInterpolate(λ, φ);
						//}
						if (isValue(scalar)) {
							color = extendedSinebowColor(Math.min(scalar, 100) / 100,OVERLAY_ALPHA);
						}
					}
				}
				column[y+1] = column[y] = wind || HOLE_VECTOR;
				mask.set(x, y, color).set(x+1, y, color).set(x, y+1, color).set(x+1, y+1, color);
			}
		}
		columns[x+1] = columns[x] = column;
	}
	
	 var x = renderObject._bounds.x;
	 
	while (x < renderObject._bounds.xMax && !this._cancel) {
	
	   interpolateColumn(x);
		x += INTERPOLATEDIV;	
	}
	renderObject._field = createField(columns, renderObject._bounds, mask);	


	/* (function create() {
		var start = Date.now();	
	    while (x < renderObject._bounds.xMax && !this._cancel) {
		
		   interpolateColumn(x);
		    x += INTERPOLATEDIV;
			if ((Date.now() - start) > MAX_TASK_TIME)
			{
				setTimeout(create, MIN_SLEEP_TIME);
				return;
			} 
				
	    }
		
		renderObject._field = createField(columns, renderObject._bounds, mask);	
			
	})(); */
	
  		
}

   function asColorStyle(r, g, b, a) {
        return "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
    }
	
 function windIntensityColorScale(step, maxWind) {
	var result = [];
	for (var j = 85; j <= 255; j += step) {
		result.push(asColorStyle(j, j, j, 1.0));
	}
	result.indexFor = function(m) {  // map wind speed to a style
		return Math.floor(Math.min(m, maxWind) / maxWind * (result.length - 1));
	};
	return result;
}

function random(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
 };

function reCreate(renderObject,newCenter)
{
	if(newCenter != null)
	{
		newCenter.clone(renderObject._centerPnt);
	}

	var width = renderObject._viewer.scene.canvas.clientWidth;
	var height = renderObject._viewer.scene.canvas.clientHeight;
	renderObject._windowWidth = width ;
	renderObject._windowheight = height ;
	renderObject._bounds.xMax = width;
	renderObject._bounds.yMax = height;
	renderObject._bounds.width = width;
	renderObject._bounds.height = height;
	
	if(renderObject._field != null)
	{
		renderObject._field.release();
	}
	
    renderObject.interpolateField(renderObject._builder); 

	var canvas = document.getElementById("animation");
	canvas.width = width;
	canvas.height = height;
	var g = canvas.getContext("2d");
	g.clearRect(0, 0, canvas.width, canvas.height);
	
	renderObject._lineCanvas = canvas;
	renderObject._g = g;
	renderObject._g.lineWidth = PARTICLE_LINEWIDTH;
	renderObject._g.fillStyle = fadeFillStyle;
	
	 var canvasOverLay = document.getElementById("overlay");
	canvasOverLay.width = width;
	canvasOverLay.height = height;
	var gOverlay = canvasOverLay.getContext("2d");
	gOverlay.clearRect(0, 0, canvasOverLay.width, canvasOverLay.height);
	
	renderObject._imageCanvas = canvasOverLay;
	renderObject._imageG = gOverlay;

	
}

RenderDynamicWind.prototype.Render = function() {
    if (!this._builder) return;

	var scene = this._viewer.scene;
	var ellipsoid = scene.globe.ellipsoid;
	
	var renderObject = this;
	renderObject._isRender = true;
	
	reCreate(renderObject,null);
	
   var particleCount = Math.round(renderObject._windowheight * PARTICLE_MULTIPLIER);
    //var particleCount = Math.round(100 * PARTICLE_MULTIPLIER);
	
	var particles = [];
	if(renderObject._field != null)
	{
		for (var i = 0; i < particleCount; i++) {
		particles.push(renderObject._field.randomize({age:random(0, MAX_PARTICLE_AGE)}));
	   }
	}
	
	
	scene.camera.moveEnd.addEventListener(function(){
	            //获取当前相机高度
	   var newCenter = scene.camera.positionCartographic;
	   
	   if(newCenter != renderObject._centerPnt)
	   {
		   reCreate(renderObject,newCenter); 
		   renderObject._isRender = true;
		   var scale = 1.0;
		   if(newCenter.height  > 3291072)
		   {
			   scale = 0.9;
		   }
		   else if(newCenter.height  > 3291072*0.5)
		   {
			    scale = 0.3;
		   }
		    else if(newCenter.height  > 3291072*0.05)
		   {
			    scale = 0.03;
		   }
		    else if(newCenter.height  > 3291072*0.005)
		   {
			    scale = 0.01;
				MAX_PARTICLE_AGE = 20;
				//WindScale = 0.05;
		   }
		   else
		   {
			   scale = 0.01;
			   MAX_PARTICLE_AGE = 20;
			  // WindScale = 0.05;
		   }
		   particles = [];
		   
		   particleCount = Math.round(renderObject._windowheight * PARTICLE_MULTIPLIER*scale);
		   if(renderObject._field != null)
		   {
			    for (var i = 0; i < particleCount; i++) {
				particles.push(renderObject._field.randomize({age:random(0, MAX_PARTICLE_AGE)}));
			   }
		   }
		   
	   }
	 })
	
	scene.camera.moveStart.addEventListener(function(){
	            //获取当前相机高度
	   var newCenter = scene.camera.positionCartographic;
	   
	   if(newCenter != renderObject._centerPnt)
	   {
		   if(renderObject._field != null)
		   {
			    renderObject._field.release();
		   }
		   renderObject._isRender = false;
		   renderObject._imageG.clearRect(0, 0, renderObject._windowWidth, renderObject._windowheight);
		   renderObject._g.clearRect(0, 0, renderObject._windowWidth, renderObject._windowheight);
	   }
	 })
	
	// maxIntensity is the velocity at which particle color intensity is maximum
	var colorStyles = windIntensityColorScale(INTENSITY_SCALE_STEP, maxIntensity);
	var buckets = colorStyles.map(function() { return []; });
	
	function evolve() {
		buckets.forEach(function(bucket) { bucket.length = 0; });
		particles.forEach(function(particle) {
			if (particle.age > MAX_PARTICLE_AGE) {
				renderObject._field.randomize(particle).age = 0;
			}
			var x = particle.x;
			var y = particle.y;
			var v = renderObject._field(x, y);  // vector at current position
			var m = v[2];
			if (m === null) {
				particle.age = MAX_PARTICLE_AGE;  // particle has escaped the grid, never to return...
			}
			else {
				var xt = x + v[0]*WindScale;
				var yt = y + v[1]*WindScale;
				if (renderObject._field.isDefined(xt, yt)) {
					// Path from (x,y) to (xt,yt) is visible, so add this particle to the appropriate draw bucket.
					particle.xt = xt;
					particle.yt = yt;
					buckets[colorStyles.indexFor(m)].push(particle);
				}
				else {
					// Particle isn't visible, but it still moves through the field.
					particle.x = xt;
					particle.y = yt;
				}
			}
			particle.age += 1;
		});
	}

	function draw() {
		
		// Fade existing particle trails.
		var g = renderObject._g;
		var bounds = renderObject._bounds;
		
		var prev = g.globalCompositeOperation;
		g.globalCompositeOperation = "destination-in";
		g.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
		//g.putImageData(renderObject._imageMask.imageData,0,0)
		g.globalCompositeOperation = prev;
		

		// Draw new particle trails.
		buckets.forEach(function(bucket, i) {
			if (bucket.length > 0) {
				g.beginPath();
				g.strokeStyle = colorStyles[i];
				bucket.forEach(function(particle) {
					g.moveTo(particle.x, particle.y);
					g.lineTo(particle.xt, particle.yt);
					particle.x = particle.xt;
					particle.y = particle.yt;
				});
				g.stroke();
			}
		});
		
		
	}

   
	
	(function frame() {
			evolve();
			draw();
			
			if(renderObject._isRender && renderObject._imageMask)
			{
				renderObject._imageG.putImageData(renderObject._imageMask.imageData,0,0);
			}
		
			setTimeout(frame, 10);
	})();
	
}
	
RenderDynamicWind.prototype.clone = function()
{
}
RenderDynamicWind.prototype.update = function()
{
	
     var RTOD = 180.0/3.1415926;
	 var canvas = document.getElementById("animation");
	 var g= canvas.getContext("2d");
	 g.fillStyle = "rgba(0, 0, 0, 0.97)";
	 g.lineWidth = 20;
	 
	  function draw() {
            // Fade existing particle trails.
            var prev = "source-over";
            g.globalCompositeOperation = "destination-in";
            g.fillRect(0,0, 800, 600);
            g.globalCompositeOperation = prev;
			g.beginPath();
			 g.strokeStyle = 0x111111;  
			for(var i = 0 ;i < 100; i++)
			{
				var x = Math.floor(Math.random()*800);
				var y = Math.floor(Math.random()*600);
				
				 g.moveTo(x,y);
                 g.lineTo(x+5, y+5);
				 
			}
			g.stroke();
		}
		
		(function frame() {
            try {
                draw();
                setTimeout(frame, 40);
            }
            catch (e) {
           
            }
        })();
			
}

	



