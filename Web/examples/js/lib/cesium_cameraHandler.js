var cameraTool = function (option) {
    this._option = option
    this._viewer=option.viewer
}
//获取鼠标经纬度
cameraTool.prototype.init = function () {
    var _self = this;
    //增加div提示
    var divTip=document.createElement("div");
    divTip.style.visibility="hidden";
    divTip.className="talk-bubble tri-right border round btm-left-in";
    var divContent=document.createElement("div");
    divContent.id="camera_content";
    divContent.className="talktext";
    divTip.appendChild(divContent);
    _self._viewer.container.appendChild(divTip);
}

//获取鼠标经纬度
cameraTool.prototype.getPosition = function (callback) {
    var _self = this;
    //得到当前三维场景
    var scene = _self._viewer.scene;
    var viewer = _self._viewer;
    //得到当前三维场景的椭球体
    var ellipsoid = scene.globe.ellipsoid;
    var longitudeString = null;
    var latitudeString = null;
    var height = null;
    var heading = null;
    var pitch = null;
    var cartographic = null;
    var altitude = null;
    var startCartesian = null;
    // 定义当前场景的画布元素的事件处理
    var handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
    //设置鼠标移动事件的处理函数，这里负责监听x,y坐标值变化
    handler.setInputAction(function (movement) {
        //通过指定的椭球或者地图对应的坐标系，将鼠标的二维坐标转换为对应椭球体三维坐标
        //cartesian = viewer.camera.pickEllipsoid(movement.endPosition, ellipsoid);

        var ray = viewer.camera.getPickRay(movement.endPosition)
        if (ray) {
            startCartesian = scene.globe.pick(ray, scene)
        }
        if (startCartesian) {
            cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(startCartesian)
        }
        if (cartographic) {
            // 海拔
            altitude = scene.globe.getHeight(cartographic).toFixed(2);
            longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
            latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
            //获取相机高度
            height = Math.ceil(viewer.camera.positionCartographic.height);
            heading = Cesium.Math.toDegrees(viewer.camera.heading).toFixed(2)
            pitch = Cesium.Math.toDegrees(viewer.camera.pitch).toFixed(2)
            let zoom = _self.altitudeToZoom(height);
            var position = {
                lon: longitudeString,
                lat: latitudeString,
                height: height,
                altitude: Number(altitude),
                heading: Number(heading),
                pitch: Number(pitch),
                zoom:Number(zoom)
            }
            if (callback && typeof callback == 'function') { callback(position) }
        }
        else {

        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    //设置鼠标滚动事件的处理函数，这里负责监听高度值变化
    handler.setInputAction(function (wheelment) {
        height = Math.ceil(viewer.camera.positionCartographic.height);
        heading = Cesium.Math.toDegrees(viewer.camera.heading).toFixed(2)
        pitch = Cesium.Math.toDegrees(viewer.camera.pitch).toFixed(2)
        let zoom = _self.altitudeToZoom(height);
        var position = {
            lon: longitudeString,
            lat: latitudeString,
            height: height,
            altitude: Number(altitude),
            heading: Number(heading),
            pitch: Number(pitch),
            zoom:Number(zoom)
        }
        let rec = viewer.camera.computeViewRectangle();
        let ws_Point=[rec.west / Math.PI * 180,rec.south / Math.PI * 180];
        let en_Point=[rec.east / Math.PI * 180,rec.north / Math.PI * 180];

        //console.log(ws_Point,en_Point)
        if (callback && typeof callback == 'function') { callback(position) }
    }, Cesium.ScreenSpaceEventType.WHEEL);

}
cameraTool.prototype.altitudeToZoom = function (altitude) {
    var A = 40487.57;
    var B = 0.00007096758;
    var C = 91610.74;
    var D = -40467.74;

    return Math.round(D +(A-D)/(1 + Math.pow(altitude / C,B)))
}

