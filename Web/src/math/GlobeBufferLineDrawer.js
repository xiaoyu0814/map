var GlobeBufferLineDrawer = function () {
    this.init.apply(this, arguments);
};

GlobeBufferLineDrawer.prototype = {
    viewer: null,
    scene: null,
    clock: null,
    canvas: null,
    camera: null,
    ellipsoid: null,
    tooltip: null,
    entity: null,
    positions: [],
    tempPositions: [],
    drawHandler: null,
    modifyHandler: null,
    okHandler: null,
    cancelHandler: null,
    dragIcon: "images/circle_gray.png",
    dragIconLight: "images/circle_red.png",
    material: null,
    lineMaterial: null,
    fill: true,
    line: true,
    lineWidth: 2,
    extrudedHeight: 0,
    radius: 1000,
    toolBarIndex: null,
    markers: {},
    pointLayers:'',
    layerId: "globeDrawerLayer",
    init: function (map,radius) {
        var _this = this;
        _this.map = map;
        _this.radius = radius*1000;
    },
    clear: function () {
        var _this = this;
       
    },
    showModifyBufferLine: function (positions, radius, okHandler, cancelHandler) {
        var _this = this;
        _this.positions = positions;
        _this.radius = radius;
        _this.okHandler = okHandler;
        _this.cancelHandler = cancelHandler;
        _this._showModifyRegion2Map();
    },
    startDrawBufferLine: function (okHandler, cancelHandler) {
        var _this = this;
        _this.okHandler = okHandler;
        _this.cancelHandler = cancelHandler;

        _this.positions = [];
        var floatingPoint = null;
        var drawStart = true;
        _this.map.on('mousedown',function(event){
            console.log('mousedown',event)
            var position = event.coordinate;
            if(position[0]>180||position[0]<-180){
                position = turf.toWgs84(position)   
            }
            if(!drawStart) return;
            if(event.originalEvent.button == 0){
                var num = _this.positions.length;
                if (num == 0) {
                    _this.positions.push(position);
                    _this._createPoint(position, -1);
                    _this._showRegion2Map();
                }
                _this.positions.push(position);
                var oid = _this.positions.length - 2;
                _this._createPoint(position, oid);
            }else if(event.originalEvent.button == 2){
                drawStart = false;
                var oid = _this.positions.length - 2;
                _this._createPoint(position, oid);
                let _points = _this._showRegion2Map();
               
                okHandler(_points,_this.radius)
            }
           
        })
        _this.map.on('mousemove',function(event){
            var position = event.coordinate;
            if(position[0]>180||position[0]<-180){
                position = turf.toWgs84(position)   
            }
            if(drawStart){
                 //floatingPoint.position.setValue(position);
                _this.positions.pop();
                _this.positions.push(position);
                
                _this._showRegion2Map();
            }
           
          
        })
    },
    _startModify: function () {
        var _this = this;
        var isMoving = false;
        var pickedAnchor = null;
        if (_this.drawHandler) {
            _this.drawHandler.destroy();
            _this.drawHandler = null;
        }
        _this._showToolBar();

        _this.modifyHandler = new Cesium.ScreenSpaceEventHandler(_this.canvas);

        _this.modifyHandler.setInputAction(function (event) {
            var position = event.position;
            if (!Cesium.defined(position)) {
                return;
            }
            var ray = _this.camera.getPickRay(position);
            if (!Cesium.defined(ray)) {
                return;
            }
            var cartesian = _this.scene.globe.pick(ray, _this.scene);
            if (!Cesium.defined(cartesian)) {
                return;
            }
            if (isMoving) {
                isMoving = false;
                pickedAnchor.position.setValue(cartesian);
                var oid = pickedAnchor.oid;
                _this.tempPositions[oid] = cartesian;
                _this.tooltip.setVisible(false);
                if (pickedAnchor.flag == "mid_anchor") {
                    _this._updateModifyAnchors(oid);
                }
            } else {
                var pickedObject = _this.scene.pick(position);
                if (!Cesium.defined(pickedObject)) {
                    return;
                }
                if (!Cesium.defined(pickedObject.id)) {
                    return;
                }
                var entity = pickedObject.id;
                if (entity.layerId != _this.layerId) {
                    return;
                }
                if (entity.flag != "anchor" && entity.flag != "mid_anchor") {
                    return;
                }
                pickedAnchor = entity;
                isMoving = true;
                if (entity.flag == "anchor") {
                    _this.tooltip.showAt(position, "<p>移动控制点</p>");
                }
                if (entity.flag == "mid_anchor") {
                    _this.tooltip.showAt(position, "<p>移动创建新的控制点</p>");
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        _this.modifyHandler.setInputAction(function (event) {
            if (!isMoving) {
                return;
            }
            var position = event.endPosition;
            if (!Cesium.defined(position)) {
                return;
            }
            _this.tooltip.showAt(position, "<p>移动控制点</p>");

            var ray = _this.camera.getPickRay(position);
            if (!Cesium.defined(ray)) {
                return;
            }
            var cartesian = _this.scene.globe.pick(ray, _this.scene);
            if (!Cesium.defined(cartesian)) {
                return;
            }
            var oid = pickedAnchor.oid;
            if (pickedAnchor.flag == "anchor") {
                pickedAnchor.position.setValue(cartesian);
                _this.tempPositions[oid] = cartesian;
                //左右两个中点
                _this._updateNewMidAnchors(oid);
            } else if (pickedAnchor.flag == "mid_anchor") {
                pickedAnchor.position.setValue(cartesian);
                _this.tempPositions[oid] = cartesian;
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    },
    _showRegion2Map: function () {
        var _this = this;
        
        if (_this.positions.length > 1) {
        
            var positions = _this.positions;
            console.log(positions);
         
            
            let line =turf.featureCollection([turf.lineString(_this.positions)])
            if(_this.map.getLayer('_jiantouLine')){
                _this.map.getLayer('_jiantouLine').setSource(line)
            }else{
                let lineLayer = new PIE.MetoStyle.LineLayer({
                    id:"_jiantouLine",
                    color:'#00f',
                    opacity:0.6,
                    data:line,
                })
                _this.map.add(lineLayer);
            }
           
            return _this.positions;
        } else {
            return null;
        }
    },
    _showModifyRegion2Map: function () {
        var _this = this;

        _this._startModify();
        _this._computeTempPositions();

        if (_this.material == null) {
            _this.material = Cesium.Color.fromCssColorString('#ff0').withAlpha(0.5);
        }
        if (_this.lineMaterial == null) {
            _this.lineMaterial = new Cesium.PolylineDashMaterialProperty({
                dashLength: 16,
                color: Cesium.Color.fromCssColorString('#00f').withAlpha(0.7)
            });
        }

        var linePositions = new Cesium.CallbackProperty(function () {
            return _this.tempPositions;
        }, false);
        var dynamicHierarchy = new Cesium.CallbackProperty(function () {
            var pnts = _this.computeBufferLine(_this.tempPositions, _this.radius || 1000);
            var pHierarchy = new Cesium.PolygonHierarchy(pnts);
            return pHierarchy;
        }, false);
        var bData = {
            polygon: new Cesium.PolygonGraphics({
                hierarchy: dynamicHierarchy,
                material: _this.material,
                show: _this.fill
            }),
            polyline: {
                positions: linePositions,
                clampToGround: true,
                width: _this.lineWidth || 2,
                material: _this.lineMaterial,
                show: _this.line
            }
        };
        _this.entity = _this.viewer.entities.add(bData);
        _this.entity.layerId = _this.layerId;
        var positions = _this.tempPositions;
        for (var i = 0; i < positions.length; i++) {
            var ys = i % 2;
            if (ys == 0) {
                _this._createPoint(positions[i], i);
            } else {
                _this._createMidPoint(positions[i], i);
            }
        }
    },
    _updateModifyAnchors: function (oid) {
        var _this = this;
        var num = _this.tempPositions.length;
        if (oid == 0 || oid == num - 1) {
            return;
        }
        //重新计算tempPositions
        var p = _this.tempPositions[oid];
        var p1 = _this.tempPositions[oid - 1];
        var p2 = _this.tempPositions[oid + 1];

        //计算中心
        var cp1 = _this._computeCenterPotition(p1, p);
        var cp2 = _this._computeCenterPotition(p, p2);

        //插入点
        var arr = [cp1, p, cp2];
        _this.tempPositions.splice(oid, 1, cp1, p, cp2);

        //重新加载锚点
        _this._clearAnchors(_this.layerId);
        var positions = _this.tempPositions;
        for (var i = 0; i < positions.length; i++) {
            var ys = i % 2;
            if (ys == 0) {
                _this._createPoint(positions[i], i);
            } else {
                _this._createMidPoint(positions[i], i);
            }
        }
    },
    _updateNewMidAnchors: function (oid) {
        var _this = this;
        if (oid == null || oid == undefined) {
            return;
        }
        //左边两个中点，oid2为临时中间点
        var oid1 = null;
        var oid2 = null;
        //右边两个中点，oid3为临时中间点
        var oid3 = null;
        var oid4 = null;

        var num = _this.tempPositions.length;
        if (oid == 0) {
            oid1 = num - 2;
            oid2 = num - 1;
            oid3 = oid + 1;
            oid4 = oid + 2;
        } else if (oid == num - 2) {
            oid1 = oid - 2;
            oid2 = oid - 1;
            oid3 = num - 1;
            oid4 = 0;
        } else {
            oid1 = oid - 2;
            oid2 = oid - 1;
            oid3 = oid + 1;
            oid4 = oid + 2;
        }

        var c1 = _this.tempPositions[oid1];
        var c = _this.tempPositions[oid];
        var c4 = _this.tempPositions[oid4];

        if (oid == 0) {
            var c3 = _this._computeCenterPotition(c4, c);
            _this.tempPositions[oid3] = c3;
            _this.markers[oid3].position.setValue(c3);
        } else if (oid == num - 1) {
            var c2 = _this._computeCenterPotition(c1, c);
            _this.tempPositions[oid2] = c2;
            _this.markers[oid2].position.setValue(c2);
        } else {
            var c2 = _this._computeCenterPotition(c1, c);
            var c3 = _this._computeCenterPotition(c4, c);
            _this.tempPositions[oid2] = c2;
            _this.tempPositions[oid3] = c3;
            _this.markers[oid2].position.setValue(c2);
            _this.markers[oid3].position.setValue(c3);
        }
    },
    _createPoint: function (cartesian, oid) {
        var _this = this;
        if(this.pointLayers){
            let _pointfeature = turf.point(cartesian);
            this.pointLayers.features.push(_pointfeature);
        }else {
            let _pointfeature = turf.point(cartesian);
            this.pointLayers = turf.featureCollection([_pointfeature]);
        }
        if(this.map.getLayer(this.layerId + "_points")){
            this.map.getLayer(this.layerId + "_points").setSource(this.pointLayers)
        }else{
            let pointLayer = new PIE.MetoStyle.PointLayer({
                id:this.layerId + "_points",
                data: this.pointLayers,
                color:"#00f",
                opacity:0.6,
            })
            this.map.add(pointLayer);
        }
        _this.markers[oid] =  this.pointLayers;
        //_this.markers[oid] = point;
      
    },
    _createMidPoint: function (cartesian, oid) {
        var _this = this;
        var point = viewer.entities.add({
            position: cartesian,
            billboard: {
                image: _this.dragIcon,
                eyeOffset: new Cesium.ConstantProperty(new Cesium.Cartesian3(0, 0, -500)),
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
            }
        });
        point.oid = oid;
        point.layerId = _this.layerId;
        point.flag = "mid_anchor";
        _this.markers[oid] = point;
        return point;
    },
    _computeTempPositions: function () {
        var _this = this;

        var pnts = [].concat(_this.positions);
        var num = pnts.length;
        _this.tempPositions = [];
        for (var i = 1; i < num; i++) {
            var p1 = pnts[i - 1];
            var p2 = pnts[i];
            p1.sid = i - 1;
            p2.sid = i;
            var cp = _this._computeCenterPotition(p1, p2);
            _this.tempPositions.push(p1);
            _this.tempPositions.push(cp);
        }
        var last = pnts[num - 1];
        _this.tempPositions.push(last);
    },
    _computeCenterPotition: function (p1, p2) {
        var _this = this;
        var c1 = _this.ellipsoid.cartesianToCartographic(p1);
        var c2 = _this.ellipsoid.cartesianToCartographic(p2);
        var cm = new Cesium.EllipsoidGeodesic(c1, c2).interpolateUsingFraction(0.5);
        var cp = _this.ellipsoid.cartographicToCartesian(cm);
        return cp;
    },
    _showToolBar: function () {
        var _this = this;
        _this._createToolBar();
        var width = $(window).width();
        var wTop = 60;
        var wLeft = parseInt((width - 145) / 2);
        _this.toolBarIndex = layer.open({
            title: false,
            type: 1,
            fixed: true,
            resize: false,
            shade: 0,
            content: $("#shapeEditContainer"),
            offset: [wTop + "px", wLeft + "px"],
            move: "#shapeEditRTCorner"
        });
        var cssSel = "#layui-layer" + _this.toolBarIndex + " .layui-layer-close2";
        $(cssSel).hide();
    },
    _createToolBar: function () {
        var _this = this;
        var objs = $("#shapeEditContainer");
        objs.remove();
        var html = '<div id="shapeEditContainer" style="padding: 10px 10px;">'
            + '    <button name="btnOK" class="layui-btn layui-btn-xs layui-btn-normal"> <i class="layui-icon"></i> 确定 </button>'
            + '    <button name="btnCancel" class="layui-btn layui-btn-xs layui-btn-danger"> <i class="layui-icon">ဆ</i> 取消 </button>'
            + '    <div id="shapeEditRTCorner" style="width: 16px; position: absolute; right: 0px; top: 0px; bottom: 0px">'
            + '    </div>'
            + '</div>';
        $("body").append(html);

        var btnOK = $("#shapeEditContainer button[name='btnOK']");
        var btnCancel = $("#shapeEditContainer button[name='btnCancel']");
        btnOK.unbind("click").bind("click", function () {
            _this.clear();
            layer.close(_this.toolBarIndex);
            if (_this.okHandler) {
                var positions = [];
                for (var i = 0; i < _this.tempPositions.length; i += 2) {
                    var p = _this.tempPositions[i];
                    positions.push(p);
                }
                _this.positions = positions;
                _this.okHandler(positions, _this.radius);
            }
        });
        btnCancel.unbind("click").bind("click", function () {
            _this.clear();
            layer.close(_this.toolBarIndex);
            if (_this.cancelHandler) {
                _this.cancelHandler();
            }
        });
    },
    computeBufferLine: function (positions, radius) {
        var _this = this;
        var line = turf.lineString(positions);
        var feature = turf.buffer(line, radius * 1, { units: 'meters' });
        var coordinates = feature.geometry.coordinates;
        if (!coordinates || coordinates.length < 1) {
            return null;
        }
        var pnts = coordinates[0];
        if (!pnts || pnts.length < 3) {
            return null;
        }
        return feature;
    },
    _cartesian2LonLat: function (cartesian) {
        var _this = this;
        //将笛卡尔坐标转换为地理坐标
        var cartographic = _this.ellipsoid.cartesianToCartographic(cartesian);
        //将弧度转为度的十进制度表示
        var pos = {
            lon: Cesium.Math.toDegrees(cartographic.longitude),
            lat: Cesium.Math.toDegrees(cartographic.latitude),
            alt: Math.ceil(cartographic.height)
        };
        return pos;
    },
    _getLonLat: function (cartesian) {
        var _this = this;
        var cartographic = _this.ellipsoid.cartesianToCartographic(cartesian);
        cartographic.height = _this.viewer.scene.globe.getHeight(cartographic);
        var pos = {
            lon: cartographic.longitude,
            lat: cartographic.latitude,
            alt: cartographic.height
        };
        pos.lon = Cesium.Math.toDegrees(pos.lon);
        pos.lat = Cesium.Math.toDegrees(pos.lat);
        return pos;
    },
    _getLonLats: function (positions) {
        var _this = this;
        var arr = [];
        for (var i = 0; i < positions.length; i++) {
            var c = positions[i];
            var p = _this._getLonLat(c);
            p.sid = c.sid;
            p.oid = c.oid;
            arr.push(p);
        }
        return arr;
    },
    _isSimpleXYZ: function (p1, p2) {
        if (p1.x == p2.x && p1.y == p2.y && p1.z == p2.z) {
            return true;
        }
        return false;
    },
    _clearMarkers: function (layerName) {
        var _this = this;
        var viewer = _this.viewer;
        var entityList = viewer.entities.values;
        if (entityList == null || entityList.length < 1)
            return;
        for (var i = 0; i < entityList.length; i++) {
            var entity = entityList[i];
            if (entity.layerId == layerName) {
                viewer.entities.remove(entity);
                i--;
            }
        }
    },
    _clearAnchors: function () {
        var _this = this;
        for (var key in _this.markers) {
            var m = _this.markers[key];
            _this.viewer.entities.remove(m);
        }
        _this.markers = {};
    },
    CLASS_NAME: "GlobeBufferLineDrawer"
};

export {GlobeBufferLineDrawer}