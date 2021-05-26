function ModelVisiableTool(options) {
	this.viewer = options.viewer;
	this.enable = false;
	this.handler = null;


	this.lng_start = null;
	this.lat_start = null;
	this.height_start = null;
	this.lng_stop = null;
	this.lat_stop = null;
	this.height_stop = null;
	this.lon_lerp = [];
	this.lat_lerp = [];
	this.height_lerp = [];
	this.position_lerp = [];
	this.buildingHeight_lerp = [];
	this.cartographicArray = [];
	this.isSeen = true;
	this.pArray = [];
	this.inPoint = [];
	this.outPoint = [];
	this.m = 0;
	this.n = 0;
	this.visiableOrNot;
	this.cartographic = [];
	this.cartographic_lerp = [];
	this.ellipsoid = this.viewer.scene.globe.ellipsoid;
	this.start = null;
	this.stop = null;
	this.partvisiableLine = null;
	this.invisiableLine = null;
	this.div = null;
	this.visiableLine = null;

}
ModelVisiableTool.prototype.isEnable = function () {
	return this.enable;
}
ModelVisiableTool.prototype.setEnable = function (enable) {
	this.enable = enable;

	if (enable) {
		if (this.handler == null) {
			this.modelVisiable();
		}
	} else {
		if (this.handler != null) {

			this.viewer.entities.remove(this.start);
			this.viewer.entities.remove(this.stop);
			this.viewer.entities.remove(this.partvisiableLine);
			this.viewer.entities.remove(this.invisiableLine);
			this.viewer.entities.remove(this.visiableLine);
			// var pop = document.getElementById("pop");
			// pop.style.display = "none";
			this.handler.destroy();
			this.m = 0;
			this.n = 0;
			this.handler = null;
			this.lon_lerp = [];
			this.lat_lerp = [];
			this.height_lerp = [];
			this.position_lerp = [];
			this.buildingHeight_lerp = [];
			this.cartographicArray = [];
			this.pArray = [];
			this.inPoint = [];
			this.outPoint = [];
			this.cartographic = [];
			this.cartographic_lerp = [];
			this.lng_start = null;
			this.lat_start = null;
			this.height_start = null;
			this.lng_stop = null;
			this.lat_stop = null;
			this.height_stop = null;
			this.start = null;
			this.stop = null;
			this.partvisiableLine = null;
			this.invisiableLine = null;
			this.visiableOrNot="";
			this.isSeen = true;
			if (this.div) {
				this.div.style.display = "none";
			}
		}
	}
}
ModelVisiableTool.prototype.modelVisiable = function () {
	this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
	var that = this;
	this.handler.setInputAction(function (movement) {
		if (Cesium.defined(that.start)) { return }
		var adaptivePosition = that.viewer.scene.pickPosition(movement.position);
		if (this.viewer.scene.pickPositionSupported && Cesium.defined(adaptivePosition)) {
			/* 转弧度 */
			var positionCarto = Cesium.Cartographic.fromCartesian(adaptivePosition);
			that.lng_start = Cesium.Math.toDegrees(positionCarto.longitude).toFixed(8);
			that.lat_start = Cesium.Math.toDegrees(positionCarto.latitude).toFixed(8);
			that.height_start = positionCarto.height;
			/* 转经纬度 */
			//var degree = { longitude: positionCarto.longitude / Math.PI * 180, latitude: positionCarto.latitude / Math.PI * 180, height: positionCarto.height };
			that.cartographicArray.push(positionCarto);
			var point_start = {
				position: adaptivePosition,
				point: {
					color: Cesium.Color.CRIMSON,
					pixelSize: 9,
					outlineColor: Cesium.Color.ALICEBLUE,
					outlineWidth: 2
				}

			}
			that.start = that.viewer.entities.add(point_start);
		}
	}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

	this.handler.setInputAction(function (movement) {
		var adaptivePosition = that.viewer.scene.pickPosition(movement.position);
		if (Cesium.defined(that.stop)) { return }
		if (this.viewer.scene.pickPositionSupported && Cesium.defined(adaptivePosition)) {
			/* 转制图 */
			var positionCarto = Cesium.Cartographic.fromCartesian(adaptivePosition);
			that.lng_stop = Cesium.Math.toDegrees(positionCarto.longitude).toFixed(8);
			that.lat_stop = Cesium.Math.toDegrees(positionCarto.latitude).toFixed(8);
			that.height_stop = positionCarto.height;
			/* 转经纬度 */
			//var degree = { longitude: positionCarto.longitude / Math.PI * 180, latitude: positionCarto.latitude / Math.PI * 180, height: positionCarto.height };
			that.cartographicArray.push(positionCarto);
			var point_stop = {
				position: adaptivePosition,
				point: {
					color: Cesium.Color.CRIMSON,
					pixelSize: 9,
					outlineColor: Cesium.Color.ALICEBLUE,
					outlineWidth: 2
				}
			}
			that.stop = that.viewer.entities.add(point_stop);
		}
		visiableAnalysis();
	}, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

	function visiableAnalysis() {

		for (var i = 0; i <= 100; i++) {
			that.lon_lerp[i] = parseFloat(that.lng_start) + parseFloat(i * (that.lng_stop - that.lng_start) / 100);
			that.lat_lerp[i] = parseFloat(that.lat_start) + parseFloat(i * (that.lat_stop - that.lat_start) / 100);
			that.height_lerp[i] = parseFloat(that.height_start+0.1) + parseFloat(i * (that.height_stop - that.height_start) / 100);
			that.cartographic_lerp.push(Cesium.Cartographic.fromDegrees(that.lon_lerp[i], that.lat_lerp[i], that.height_lerp[i]));
		}
		for (let i = 0; i < that.cartographic_lerp.length; i++) {
			var cartographicHight = that.viewer.scene.sampleHeight(that.cartographic_lerp[i]);
			that.buildingHeight_lerp.push(cartographicHight);
		}
		var degree1 = that.cartographicArray[0];
		var degree2 = that.cartographicArray[1];

		var worldCoor1 = Cesium.Cartographic.toCartesian(degree1);
		var worldCoor2 = Cesium.Cartographic.toCartesian(degree2);
		/* 	for (var i = 0; i < 100; i++) {
	
				//插值经纬度数组 和 插值高程数组、切片实际高程数组
				that.lon_lerp[i] = Cesium.Math.lerp(degree1.x, degree2.longitude, 0.01 * (i + 1));
				that.lat_lerp[i] = Cesium.Math.lerp(degree1.latitude, degree2.latitude, 0.01 * (i + 1));
				that.height_lerp[i] = degree1.height - (degree1.height - degree2.height) * 0.01 * (i + 1);
	
				that.position_lerp[i] = new Cesium.Cartesian3.fromDegrees(that.lon_lerp[i], that.lat_lerp[i], that.height_lerp[i]);
				var ellipsoid = that.viewer.scene.globe.ellipsoid;
				that.cartographic[i] = ellipsoid.cartesianToCartographic(that.position_lerp[i]);
				var trueHeight = that.viewer.scene.sampleHeightMostDetailed(that.cartographic[i]);
				that.buildingHeight_lerp.push(trueHeight);
			} */
		for (let i = 1; i <= that.height_lerp.length; i++) {
			var hl = that.height_lerp[i - 1];
			var bl = that.buildingHeight_lerp[i - 1];
			if (bl - hl >= 0) {
				that.isSeen = false;
			}
		}
		if (that.isSeen == true) {

			that.visiableLine = that.viewer.entities.add({
				name: 'polyline',
				polyline: {
					positions: [worldCoor1, worldCoor2],
					width: 3,
					material: Cesium.Color.GREEN
				}
			});
			that.visiableOrNot = "通视";
		}
		else {
			for (let i = 1; i <= that.height_lerp.length; i++) {
				var forward_hl2 = that.height_lerp[i - 1];
				var forward_ht2 = that.buildingHeight_lerp[i - 1];
				var backward_ht2 = that.buildingHeight_lerp[i];
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
					width: 3,
					material: Cesium.Color.GREEN
				}
			});
			var outLine_Positions = Cesium.Ellipsoid.WGS84.cartographicArrayToCartesianArray(outLine);
			that.invisiableLine = that.viewer.entities.add({
				name: 'polyline',
				polyline: {
					positions: outLine_Positions,
					width: 5,
					material: Cesium.Color.RED
				}
			});
			that.visiableOrNot = "不通视";
		}


		var box2 = document.getElementById('cesiumContainer');

		that.div = document.createElement('div');
		var length_ping = Math.sqrt(Math.pow(worldCoor1.x - worldCoor2.x, 2) + Math.pow(worldCoor1.y - worldCoor2.y, 2) + Math.pow(worldCoor1.z - worldCoor2.z, 2));
		var length_h = Math.abs(degree2.height - degree1.height);
		var length = Math.sqrt(Math.pow(length_ping, 2) + Math.pow(length_h, 2));

		var text =
			'起点坐标: ' + ('   (' + that.lng_start) + '\u00B0' + ',' + (that.lat_start) + '\u00B0' + ',' + that.height_start + ')' +
			'\n终点坐标: ' + ('   (' + that.lng_stop) + '\u00B0' + ',' + (that.lat_stop) + '\u00B0' + ',' + that.height_stop + ')' +
			'\n垂直距离: ' + '   ' + length_h +
			'\n水平距离: ' + '   ' + length_ping +
			'\n空间距离: ' + '   ' + length +
			'\n是否可视: ' + '   ' + that.visiableOrNot;
		that.div.innerText = text;
		that.div.style.display = "block";
		that.div.style.position = "absolute";
		var changedC = Cesium.SceneTransforms.wgs84ToWindowCoordinates(that.viewer.scene, worldCoor2);
		that.div.style.left = changedC.x + 3 + "px";
		that.div.style.top = changedC.y - 3 + "px";
		that.div.style.color = "#fff";
		that.div.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
		that.div.style.zIndex = '99999999';
		that.div.id = "pop";
		box2.appendChild(that.div);
		/* 	//在第二点处放置一个label说明一些信息
			var entity = that.viewer.entities.add({
				label: {
					name: 'tongshifenxi',
					show: false,
					showBackground: true,
	
					font: '14px monospace',
					horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
					verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
					pixelOffset: new Cesium.Cartesian2(15, -10)
				}
			});
			entity.position = worldCoor2;
			entity.label.show = true; */



	}

}

// ModelVisiable.prototype.cleanEntites=function(){
// 	this.viewer.entities.remove(this.start);
// 	this.viewer.entities.remove(this.stop);
// 	this.viewer.entities.remove(this.partvisiableLine);
// 	this.viewer.entities.remove(this.invisiableLine);
// 	var pop=document.getElementById("pop");
// 	pop.style.display = "none";
// 	this.handler.destroy();
//     this.handler = null;
// }






