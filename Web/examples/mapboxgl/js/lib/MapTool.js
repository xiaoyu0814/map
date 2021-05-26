function MapTool(map) {
	var self = this;
	this.map = map;
	// body...
}

MapTool.prototype={
	change:function(type){
		console.log(type);
		console.log(this.map);
		this.map.changeMapType(type)
	},
	projectionModes:function(project){
		this.map.projectionModes(project);
	}
}

var MapToolManger = new MapTool(map);

var btn3W = document.createElement("button")
btn3W.style.position = "absolute";
btn3W.style.top = "9%";
btn3W.style.right = "1%";
btn3W.style.width = "100px";
btn3W.style.height = "30px";
btn3W.style.background = "rgb(64, 52, 216)";
btn3W.style.border = "none";
btn3W.style.padding = "5px 10px";
btn3W.style.color = "#fff";
btn3W.style.zIndex = "9999"
btn3W.innerText = "三维"
btn3W.onclick = function () { 
	MapToolManger.change(3)
	btn3W.style.background = "rgb(64, 52, 216)";
	btnMKT.style.background = "rgba(60, 141, 188, 1.0)";
	btnLBT.style.background = "rgba(60, 141, 188, 1.0)";

	//var provider=new WMTSImageryProvider({url :'/fy3dimg/getTile?date=20190831'});
	//map.map._cesiumViewer.imageryLayers.addImageryProvider(provider);
 }
document.body.appendChild(btn3W)

var btnMKT = document.createElement("button")
btnMKT.style.position = "absolute";
btnMKT.style.top = "1%";
btnMKT.style.right = "1%";
btnMKT.style.width = "100px";
btnMKT.style.height = "30px";
btnMKT.style.background = "rgba(60, 141, 188, 1.0)";
btnMKT.style.border = "none";
btnMKT.style.padding = "5px 10px";
btnMKT.style.color = "#fff";
btnMKT.style.zIndex = "9999"
btnMKT.innerText = "墨卡托"
btnMKT.onclick = function () { 
	MapToolManger.projectionModes('EPSG:3857');
	
	btn3W.style.background = "rgba(60, 141, 188, 1.0)";
	btnMKT.style.background = "rgb(64, 52, 216)"
	btnLBT.style.background = "rgba(60, 141, 188, 1.0)";
 }
document.body.appendChild(btnMKT)

var btnLBT = document.createElement("button")
btnLBT.style.position = "absolute";
btnLBT.style.top = "5%";
btnLBT.style.right = "1%";
btnLBT.style.width = "100px";
btnLBT.style.height = "30px";
btnLBT.style.background = "rgba(60, 141, 188, 1.0)";
btnLBT.style.border = "none";
btnLBT.style.padding = "5px 10px";
btnLBT.style.color = "#fff";
btnLBT.style.zIndex = "9999"
btnLBT.innerText = "兰伯特"
btnLBT.onclick = function () { 
	MapToolManger.projectionModes('EPSG:4326')
	btn3W.style.background = "rgba(60, 141, 188, 1.0)";
	btnMKT.style.background = "rgba(60, 141, 188, 1.0)";
	btnLBT.style.background = "rgb(64, 52, 216)"

	var GridTileLayer = new PIE.ol.layer.Tile({
		source: new PIE.ol.source.XYZ({
			url :"/fy3dimg/getTile?X={x}&Y={y}&Z={z}&date=20190831",
			projection: 'EPSG:4326'
		})
	});
	//map.map.addLayer(GridTileLayer);
 }
document.body.appendChild(btnLBT)


