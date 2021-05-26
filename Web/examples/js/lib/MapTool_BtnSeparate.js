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

 var MapSwitch_3W=function(mapToolManger)
{
	var btn3W = document.createElement("button");
	btn3W.id="btn3W";
	btn3W.style.position = "absolute";
	btn3W.style.top = "9%";
	btn3W.style.right = "1%";
	btn3W.style.width = "100px";
	btn3W.style.height = "30px";
	btn3W.style.background =  "rgba(60, 141, 188, 1.0)";
	btn3W.style.border = "none";
	btn3W.style.padding = "5px 10px";
	btn3W.style.color = "#fff";
	btn3W.style.zIndex = "9999"
	btn3W.innerText = "三维"
	btn3W.onclick = function () {
		mapToolManger.change(3)
		btn3W.style.background = "rgb(64, 52, 216)";
		{
			var btnMKT=document.getElementById("btnMKT");
			if(btnMKT!=null)
			{
				btnMKT.style.background = "rgba(60, 141, 188, 1.0)";
			}

			var btnLBT=document.getElementById("btnLBT");
			if(btnLBT!=null)
			{
				btnLBT.style.background = "rgba(60, 141, 188, 1.0)";
			}
		}

	}
	document.body.appendChild(btn3W)
    return btn3W;
}

 var MapSwitch_MKT=function(mapToolManger)
{

	var btnMKT = document.createElement("button")
	btnMKT.id="btnMKT";
	btnMKT.style.position = "absolute";
	btnMKT.style.top = "1%";
	btnMKT.style.right = "1%";
	btnMKT.style.width = "100px";
	btnMKT.style.height = "30px";
	btnMKT.style.background ="rgb(64, 52, 216)";
	btnMKT.style.border = "none";
	btnMKT.style.padding = "5px 10px";
	btnMKT.style.color = "#fff";
	btnMKT.style.zIndex = "9999"
	btnMKT.innerText = "墨卡托"
	btnMKT.onclick = function () {
		mapToolManger.change(1);
		//mapToolManger.projectionModes('EPSG:3857');
		btnMKT.style.background = "rgb(64, 52, 216)"
		{
			var btn3W=document.getElementById("btn3W");
			if(btn3W!=null)
			{
				btn3W.style.background = "rgba(60, 141, 188, 1.0)";
			}

			var btnLBT=document.getElementById("btnLBT");
			if(btnLBT!=null)
			{
				btnLBT.style.background = "rgba(60, 141, 188, 1.0)";
			}
		}

	}
	document.body.appendChild(btnMKT)
     return btnMKT;
}

 var MapSwitch_LBT=function(mapToolManger)
{

	var btnLBT = document.createElement("button")
	btnLBT.id="btnLBT";
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
		// mapToolManger.change(2);
		mapToolManger.projectionModes('EPSG:2700')

		btnLBT.style.background = "rgb(64, 52, 216)"
		{
			var btn3W=document.getElementById("btn3W");
			if(btn3W!=null)
			{
				btn3W.style.background = "rgba(60, 141, 188, 1.0)";
			}

			var btnMKT=document.getElementById("btnMKT");
			if(btnMKT!=null)
			{
				btnMKT.style.background = "rgba(60, 141, 188, 1.0)";
			}
		}
	}
	document.body.appendChild(btnLBT)
	return btnLBT;
}

export {MapToolManger,MapSwitch_3W,MapSwitch_MKT,MapSwitch_LBT}