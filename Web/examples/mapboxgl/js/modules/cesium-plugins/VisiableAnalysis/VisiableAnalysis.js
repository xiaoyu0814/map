//visiableAnalysis
//created by William 2018.05.03
function AnalysisTool(options) {
	this.viewer = options.viewer;
	this.enable = false;
	this.handler = null;

	this.clickTimes = true;
	this.lng_start;
	this.lat_start;
	this.height_start;
	this.lng_stop;
	this.lat_stop;
	this.height_stop;
	this.lng_lerp = [];
	this.lat_lerp = [];
	this.height_lerp = [];
	this.cartographic = [];
	this.cartographic_lerp = [];
	this.height_terrain = [];
	this.isSeen = true;
	this.visiableOrNot;
	this.inPoint = [];
	this.outPoint = [];
	this.m = 0;
	this.n = 0;
	this.point_start = null;
	this.point_stop = null;
	this.visiableLine = null;
	this.partvisiableLine = null;
	this.div = null;
	this.invisiableLine = null;

}
AnalysisTool.prototype.isEnable = function () {
	return this.enable;
}
AnalysisTool.prototype.setEnable = function (enable) {
	this.enable = enable;

	if (enable) {
		if (this.handler == null) {
			this.visiableAnalysis();
		}
	} else {
		this.viewer.entities.remove(this.point_start);
		this.viewer.entities.remove(this.point_stop);
		this.viewer.entities.remove(this.visiableLine);
		this.viewer.entities.remove(this.invisiableLine);
		this.viewer.entities.remove(this.partvisiableLine);

		if (this.handler != null) {
			this.handler.destroy();
			this.handler = null;
		}

		this.lng_start = null;
		this.lat_start = null;
		this.height_start = null;
		this.lng_stop = null;
		this.lat_stop = null;
		this.height_stop = null;
		this.lng_lerp = [];
		this.lat_lerp = [];
		this.height_lerp = [];
		this.cartographic = [];
		this.cartographic_lerp = [];
		this.height_terrain = [];
		this.inPoint = [];
		this.outPoint = [];
		this.point_start = null;
		this.point_stop = null;
		this.visiableLine = null;
		this.partvisiableLine = null;
		this.invisiableLine = null;
		this.m = 0;
		this.n = 0;
		this.isSeen = true;
		this.visiableOrNot = "";
		if (this.div) {
			this.div.style.display = "none";
		}
	}
}
AnalysisTool.prototype.visiableAnalysis = function () {

	var scene = this.viewer.scene;
	var ellipsoid = this.viewer.scene.globe.ellipsoid;
	var ellipsoidTerrainProvider = this.viewer.terrainProvider;
	this.viewer.scene.pickTranslucentDepth = true;
	this.viewer.scene.globe.depthTestAgainstTerrain = true;

	var horizonDistance, verticalDistance, spaceDistance;

	var clickTimes1 = true;

	this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
	var that = this;
	this.handler.setInputAction(function (movement) {
		if (that.point_start != null) {
			return;
		}
		var adaptivePosition = that.viewer.scene.pickPosition(movement.position);
		if (scene.pickPositionSupported && Cesium.defined(adaptivePosition)) {
			var positionCarto = Cesium.Cartographic.fromCartesian(adaptivePosition);
			that.lng_start = Cesium.Math.toDegrees(positionCarto.longitude).toFixed(8);
			that.lat_start = Cesium.Math.toDegrees(positionCarto.latitude).toFixed(8);
			that.height_start = positionCarto.height;
			that.point_start = that.viewer.entities.add({
				position: Cesium.Cartesian3.fromDegrees(parseFloat(that.lng_start), parseFloat(that.lat_start), parseFloat(that.height_start)),
				point: {
					color: Cesium.Color.CRIMSON,
					pixelSize: 9,
					outlineColor: Cesium.Color.ALICEBLUE,
					outlineWidth: 2
				}
			})
		}
	}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
	this.handler.setInputAction(function (movement) {
		if (that.point_stop != null) {
			return;
		}

		var adaptivePosition = that.viewer.scene.pickPosition(movement.position);
		if (scene.pickPositionSupported && Cesium.defined(adaptivePosition)) {
			var positionCarto = Cesium.Cartographic.fromCartesian(adaptivePosition);
			that.lng_stop = Cesium.Math.toDegrees(positionCarto.longitude).toFixed(8);
			that.lat_stop = Cesium.Math.toDegrees(positionCarto.latitude).toFixed(8);
			that.height_stop = positionCarto.height;
			that.point_stop = that.viewer.entities.add({
				position: Cesium.Cartesian3.fromDegrees(parseFloat(that.lng_stop), parseFloat(that.lat_stop), parseFloat(that.height_stop)),
				point: {
					color: Cesium.Color.CRIMSON,
					pixelSize: 9,
					outlineColor: Cesium.Color.ALICEBLUE,
					outlineWidth: 2
				}
			});
		}
		// visiableAnalysis();
		for (let i = 0; i <= 800; i++) {
			// that.lng_lerp.push(1);

			that.lng_lerp[i] = parseFloat(that.lng_start) + parseFloat(i * (that.lng_stop - that.lng_start) / 800);
			that.lat_lerp[i] = parseFloat(that.lat_start) + parseFloat(i * (that.lat_stop - that.lat_start) / 800);
			that.height_lerp[i] = parseFloat(that.height_start) + parseFloat(i * (that.height_stop - that.height_start) / 800);

			that.cartographic.push(Cesium.Cartographic.fromDegrees(that.lng_lerp[i], that.lat_lerp[i], that.height_lerp[i]));
			that.cartographic_lerp.push(Cesium.Cartographic.fromDegrees(that.lng_lerp[i], that.lat_lerp[i], that.height_lerp[i]));
		}

		Cesium.sampleTerrainMostDetailed(that.viewer.terrainProvider, that.cartographic)
			.then((raisedPositionsCartograhpic) => {
				var raisedPositions = Cesium.Ellipsoid.WGS84.cartographicArrayToCartesianArray(raisedPositionsCartograhpic);
				var a = raisedPositionsCartograhpic;
				for (i = 0; i < raisedPositionsCartograhpic.length; i++) {
					that.height_terrain.push(raisedPositionsCartograhpic[i].height);
				}
				for (var i = 1; i <= that.height_lerp.length; i++) {
					var forward_hl = that.height_lerp[i - 1];
					var forward_ht = that.height_terrain[i - 1];

					if (forward_ht - forward_hl >= 2) {
						that.isSeen = false;
					}

				}

				if (that.isSeen == true) {
					var visiableLine_Positions = Cesium.Ellipsoid.WGS84.cartographicArrayToCartesianArray(that.cartographic_lerp);
					that.visiableLine = that.viewer.entities.add({
						name: 'polyline',
						polyline: {
							positions: visiableLine_Positions,
							width: 5,
							material: Cesium.Color.GREEN
						}
					});
					that.visiableOrNot = "通视";
				}
				else {
					for (var i = 1; i <= that.height_lerp.length; i++) {
						var forward_hl2 = that.height_lerp[i - 1];
						var forward_ht2 = that.height_terrain[i - 1];
						var backward_ht2 = that.height_terrain[i];
						var backward_hl2 = that.height_lerp[i];
						if (forward_hl2 >= forward_ht2) {
							//入点
							if (backward_hl2 < backward_ht2) {
								that.inPoint[that.m] = i;
								that.m++;
							}
						}
						//出点
						else {
							if (backward_hl2 > backward_ht2) {
								that.outPoint[that.n] = i;
								that.n++;
							}
						}
					}
					var inLine = that.cartographic_lerp.slice(0, that.inPoint[0]);
					var outLine = that.cartographic_lerp.slice(that.inPoint[0]);
					var inLine_Positions = Cesium.Ellipsoid.WGS84.cartographicArrayToCartesianArray(inLine);
					that.partvisiableLine = that.viewer.entities.add({
						name: 'polyline',
						polyline: {
							positions: inLine_Positions,
							width: 5,
							material: Cesium.Color.GREEN,

						}
					});
					var outLine_Positions = Cesium.Ellipsoid.WGS84.cartographicArrayToCartesianArray(outLine);
					that.invisiableLine = that.viewer.entities.add({
						name: 'polyline',
						polyline: {
							positions: outLine_Positions,
							width: 5,
							material: Cesium.Color.RED,

						}
					});
					that.visiableOrNot = "不通视";
				}
			}).then(function () {
				distanceMeasurent();
				var box2 = document.getElementById('cesiumContainer');

				that.div = document.createElement('div');
				var text =
					"起点坐标:" + parseFloat(that.lng_start).toFixed(3) + "°" + "," + parseFloat(that.lat_start).toFixed(3) + "°" + "," + parseFloat(that.height_start / 1000).toFixed(3) + "Km" + "<br/>"
					+ "终点坐标:" + parseFloat(that.lng_stop).toFixed(3) + "°" + "," + parseFloat(that.lat_stop).toFixed(3) + "°" + "," + parseFloat(that.height_stop / 1000).toFixed(3) + "Km" + "<br/>"
					+ "水平距离:" + parseFloat(horizonDistance).toFixed(3) + "Km" + "<br/>"
					+ "垂直距离:" + parseFloat(verticalDistance).toFixed(3) + "Km" + "<br/>"
					+ "空间距离:" + parseFloat(spaceDistance).toFixed(3) + "Km" + "<br/>"
					+ "空间可视:" + that.visiableOrNot + "<br/>";
				that.div.innerHTML = text;
				that.div.style.display = "block";
				that.div.style.position = "absolute";
				that.div.id = "pop";

				that.div.style.zIndex = '99999999';

				box2.appendChild(that.div);

				var cartographic = Cesium.Cartographic.fromDegrees(that.lng_stop, that.lat_stop, that.height_stop + 200);
				var Cartesian3 = ellipsoid.cartographicToCartesian(cartographic);
				var removeHandler = that.viewer.scene.postRender.addEventListener(function () {
					var changedC = Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, Cartesian3);
					if (changedC == undefined) {
						return;
					}
					else {
						that.div.style.left = changedC.x + "px";
						that.div.style.top = changedC.y + "px";
					}
				});
			});

		if (that.handler != null) {
			that.handler.destroy();
			that.handler = null;
		}

	}, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

	function distanceMeasurent() {
		var line = turf.lineString([[that.lng_start, that.lat_start], [that.lng_stop, that.lat_stop]]);
		horizonDistance = turf.length(line, { units: 'kilometers' });
		verticalDistance = Math.abs(that.height_stop - that.height_start) / 1000;
		spaceDistance = Math.sqrt(horizonDistance * horizonDistance + verticalDistance * verticalDistance);
	}
}

