var measureHelper=function  (options) {
    this._viewer = options.viewer;
    this._scene=this._viewer.scene;
    this._handler = options.handler
    this._geodesic=new Cesium.EllipsoidGeodesic();
    this._options = options;
    this._lineCount= 0;//测距时记录，所画折线的个数。
    this.AllEnities = [];//面积测量中，存储所有的实体及用到的对象
    this._pointsCartesian3Array=[];//当点击左键后，存放点的Cartesian3坐标
    this._mouseCurrentCartesian=null;//记录鼠标的当前Cartesian坐标
    };
measureHelper.prototype.measureDistance=function () {
    var _self = this;
    //清空以前的
    this.clearAll();
    $('body').addClass('measureCur');

    //当左键单击事件
    this._handler.setInputAction(function (movement) {
        var startCartesian = null;
        var ray = _self._viewer.camera.getPickRay(movement.position);
        if (ray) {
            startCartesian = _self._scene.globe.pick(ray, _self._scene);
            _self._pointsCartesian3Array.push(startCartesian);
        } else {
            return;
        }

        //增加一个点
        _self.addPointByCartesianDegree_CallBack("pointDistance"+_self._lineCount,startCartesian);
        _self._lineCount++;
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    //当鼠标移动时
    this._handler.setInputAction(function (movement) {
        //说明还没有第一个点
        if (_self._pointsCartesian3Array.length == 0) {
            return;
        }
        var endCartesian = null;
        var ray = _self._viewer.camera.getPickRay(movement.endPosition);
        if (ray) {
            endCartesian = _self._scene.globe.pick(ray, _self._scene);
        } else {
            return;
        }
        if (endCartesian) {
            _self._mouseCurrentCartesian = endCartesian;
        }
        //增加点
        _self.addPointByCartesianDegree_CallBack("pointDistance"+_self._lineCount,_self._mouseCurrentCartesian);
        //增加折线
        _self.addLineByCartesianDegree_CallBack("lineDistance" + _self._lineCount, _self._pointsCartesian3Array[_self._pointsCartesian3Array.length - 1],_self._mouseCurrentCartesian);
        // 增加标签
        _self.addLabel_CallBack("lableDistance", _self._mouseCurrentCartesian,_self.getDynamicTotalDistance());

    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    //当点鼠标右键时，去掉鼠标样式，停止画点
    this._handler.setInputAction(function (movement) {
        //消毁相关事件
        $('body').removeClass('measureCur');
        _self._handler.destroy();
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
};
//增加测量高度的事件
measureHelper.prototype.measureHeight=function () {
    var _self = this;
    //清空以前的
    this.clearAll();
    $('body').addClass('measureCur');

    //当左键单击事件
    this._handler.setInputAction(function (movement) {
        var startCartesian = null;
        var ray = _self._viewer.camera.getPickRay(movement.position);
        if (ray) {
            startCartesian =_self._scene.globe.pick(ray, _self._scene);
            _self._pointsCartesian3Array.push(startCartesian);
        } else {
            return;
        }

        //把第一个点做实际点增加到地图上
        _self.addPointByCartesianDegree_CallBack("firstPoint"+_self._lineCount,startCartesian);
        _self._lineCount++;
        //代表第二次单击，这时会有固定的线加到地图上
        if (_self._pointsCartesian3Array.length >= 2) {
            //消毁相关事件
            $('body').removeClass('measureCur');
            _self._handler.destroy();
        }

    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    //当鼠标移动时
    this._handler.setInputAction(function (movement) {//此时界面上应该有三个点，三条线构成三角形
        //说明还没有第一个点
        if (_self._pointsCartesian3Array.length == 0) {
            return;
        }
        var endCartesian = null;
        var ray = _self._scene.camera.getPickRay(movement.endPosition);
        if (ray) {
            endCartesian = _self._scene.globe.pick(ray, _self._scene);
            _self._mouseCurrentCartesian=endCartesian;
        } else {
            return;
        }

        //去除掉除第一个点之外的其他点坐标，使其最多只保存三个点。
        if (_self._pointsCartesian3Array.length > 1) {
            _self._pointsCartesian3Array.pop();
            _self._pointsCartesian3Array.pop();
        }
        //根据第一个点的维度，当前点的经度，求出中间点,此处后期要算出中间点的选择标准
        var firstPointLatitude_Cartographic=Cesium.Cartographic.fromCartesian(_self._pointsCartesian3Array[0]).height;//第一个点的纬度
        console.log(firstPointLatitude_Cartographic)
        var mouseCurrentPoint_Cartographic=Cesium.Cartographic.fromCartesian(_self._mouseCurrentCartesian);//当前鼠标点的制图坐标
        var secPointCartographic = new Cesium.Cartographic(mouseCurrentPoint_Cartographic.longitude,mouseCurrentPoint_Cartographic.latitude,firstPointLatitude_Cartographic);
        var secPointCartesian=Cesium.Cartographic.toCartesian(secPointCartographic);
        _self._pointsCartesian3Array.push(secPointCartesian);
        //增加中间点到地图上
        _self.addPointByCartesianDegree_CallBack("secPoint"+_self._lineCount,secPointCartesian);
        //当前点当作第三个点
        _self._pointsCartesian3Array.push(_self._mouseCurrentCartesian);
        //增加第三个点到地图上
        _self.addPointByCartesianDegree_CallBack("thirdPoint"+_self._lineCount, _self._mouseCurrentCartesian);

        //增加折线,要增加三条折线，构成三角形。
        //第一个与第三个点
        _self.addLineByCartesianDegree_CallBack("firstLine"+_self._lineCount, _self._pointsCartesian3Array[0], _self._pointsCartesian3Array[2]);
        var midPoint1 = Cesium.Cartesian3.midpoint(_self._pointsCartesian3Array[0],_self._pointsCartesian3Array[2], new Cesium.Cartesian3());
        _self.addLabel_CallBack("firstLable", midPoint1, _self.getSpaceDistance("空间距离：", _self._pointsCartesian3Array[2], _self._pointsCartesian3Array[0]));

        //第一个与第二个中间点
        _self.addLineByCartesianDegree_CallBack("secLine"+_self._lineCount, _self._pointsCartesian3Array[0],_self._pointsCartesian3Array[1]);
        var midPoint2 = Cesium.Cartesian3.midpoint(_self._pointsCartesian3Array[0],_self._pointsCartesian3Array[1], new Cesium.Cartesian3());
        _self.addLabel_CallBack("secLable", midPoint2, _self.getDistanceByPoint("水平距离：", _self._pointsCartesian3Array[0], _self._pointsCartesian3Array[1]))
        //第二个点与第三个点
        _self.addLineByCartesianDegree_CallBack("thirdLine"+_self._lineCount, _self._pointsCartesian3Array[1], _self._pointsCartesian3Array[2]);
        var midPoint3 = Cesium.Cartesian3.midpoint(_self._pointsCartesian3Array[1],_self._pointsCartesian3Array[2], new Cesium.Cartesian3());
        _self.addLabel_CallBack("thirdLable", midPoint3, _self.getHeight("垂直距离：", _self._pointsCartesian3Array[2], _self._pointsCartesian3Array[1]));
        //增加坡度的计算
        _self.addLabel_CallBack("slopeAngleLabel",_self._pointsCartesian3Array[0], _self.getSlopeAngle());
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    //当点鼠标右键时，去掉鼠标样式，停止画点
    this._handler.setInputAction(function (movement) {
        //消毁相关事件
        $('body').removeClass('measureCur');
        _self._handler.destroy();
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
};

measureHelper.prototype.measureArea=function () {
    var _self = this;
    //清空以前的
    this.clearAll();
    $('body').addClass('measureCur');

    var tooltip = document.getElementById(this._options.toolTipId);
    var isDraw = false;
    var polygonPath = [];
    var polygon = null;
    this._handler.setInputAction(function (movement) {
        //新增部分
        var cartesian3;
        var cartographic;
        var ray = _self._viewer.scene.camera.getPickRay(movement.endPosition);
        if (ray)
            cartesian3 = _self._viewer.scene.globe.pick(ray, _self._viewer.scene);
        if (cartesian3)
            cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(cartesian3);
        if (cartographic) {
            //海拔
            var height = _self._viewer.scene.globe.getHeight(cartographic);
            var point = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, height);
            if (isDraw) {
                tooltip.style.left = movement.endPosition.x + 10 + "px";
                tooltip.style.top = movement.endPosition.y + 20 + "px";
                tooltip.style.display = "block";

                if (polygonPath.length < 2) {
                    return;
                }
                if (!Cesium.defined(polygon)) {
                    polygonPath.push(point);
                    polygon = new CreatePolygon(polygonPath, Cesium);
                     _self.AllEnities.push(polygon);
                } else {
                    polygon.path.pop();
                    polygon.path.push(point);
                     _self.AllEnities.push(polygon);
                }
                if (polygonPath.length >= 2) {
                    tooltip.innerHTML = '<p>右键确定终点</p>';
                }
            }
        }

    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    this._handler.setInputAction(function (movement) {
        isDraw = true;
        //新增部分
        var cartesian3;
        var cartographic;
        var ray = _self._viewer.scene.camera.getPickRay(movement.position);
        if (ray)
            cartesian3 = _self._viewer.scene.globe.pick(ray, _self._viewer.scene);
        if (cartesian3)
            cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(cartesian3);
        if (cartographic) {
            //海拔
            var height = _self._viewer.scene.globe.getHeight(cartographic);
            var point = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude,height);
            if (isDraw) {
                polygonPath.push(point);
                var tmep = _self._viewer.entities.add({
                    position: point,
                    point: {
                        show: true,
                        color: Cesium.Color.YELLOW,
                        pixelSize: 7,
                        outlineColor: Cesium.Color.YELLOW,
                        outlineWidth: 1
                    },
                });

                 _self.AllEnities.push(tmep);
            }
        }


    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    this._handler.setInputAction(function () {
        // 取消鼠标样式
        $('body').removeClass('measureCur')
        _self.clearMouseEvent()

        if (polygonPath.length >= 2) {
            var label = String(countAreaInCartesian3(polygon.path));
            label = label.substr(0, label.indexOf(".", 0));
            var text;
            if (label.length < 6)
                text = label + "平方米";
            else {
                label = String(label / 1000000);
                label = label.substr(0, label.indexOf(".", 0) + 3);
                text = label + "平方公里"
            }

            var textArea = text;
            var lastpoint = _self._viewer.entities.add({
                name: '多边形面积',
                position: polygon.path[polygon.path.length - 1],
                point: {
                    show: true,
                    color: Cesium.Color.YELLOW,
                    pixelSize: 7,
                    outlineColor: Cesium.Color.YELLOW,
                    outlineWidth: 1,
                    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
                },
                label: {
                    text: textArea,
                    font: '18px sans-serif',
                    fillColor: Cesium.Color.GOLD,
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    outlineWidth: 2,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    pixelOffset: new Cesium.Cartesian2(20, -40)
                }
            });

             _self.AllEnities.push(lastpoint);

        }

        this._viewer.trackedEntity = undefined;
        isDraw = false;
        tooltip.style.display = 'none';

    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);


    // 创建多边形
    // noinspection ES6ConvertVarToLetConst
    var CreatePolygon = (function () {
        function _ (positions, cesium) {
            this.options = {
                polygon: {
                    hierarchy: new Cesium.CallbackProperty(function () {
                        return new Cesium.PolygonHierarchy(positions)
                    }, false),
                    material: Cesium.Color.CHARTREUSE.withAlpha(0.5)
                }
            }
            this.path = positions
            this.hierarchy = positions
            var oo = _self._viewer.entities.add(this.options)
            _self.AllEnities.push(oo)
        }

        return _
    })()

    //微元法求面积
    var countAreaInCartesian3 = function (ps) {
        var s = 0;
        for (var i = 0; i < ps.length; i++) {
            var p1 = ps[i];
            var p2;
            if (i < ps.length - 1)
                p2 = ps[i + 1];
            else
                p2 = ps[0];
            s += p1.x * p2.y - p2.x * p1.y;
        }
        return Math.abs(s / 2);
    }
};

// 清除鼠标事件
measureHelper.prototype.clearMouseEvent = function () {
    var _self = this
    _self._handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
    _self._handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    _self._handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK)
}

measureHelper.prototype.addPointByCartesianDegree_CallBack=function (id, position_Cartesian)//增加点到地图上
{
    if (this._viewer.entities.getById(id) == null) {
        this._viewer.entities.add({
            id:id,
            position: position_Cartesian,
            point: {
                pixelSize: 7,
                color: Cesium.Color.YELLOW,
                outlineColor: Cesium.Color.YELLOW,
                outlineWidth: 0.5,
                disableDepthTestDistance: Number.POSITIVE_INFINITY,//禁用深度测试
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, Number.MAX_VALUE)
            }
        });
    } else {
        var entity = this._viewer.entities.getById(id);
        entity.position =position_Cartesian;
    }
};
//通过传入两个点的笛卡尔坐标,增加用于自动回调生成的线
measureHelper.prototype.addLineByCartesianDegree_CallBack=function (id, firstPoint, secPoint)
{
    if (this._viewer.entities.getById(id) == null) {
        //增加折线,要增加三条折线，构成三角形，第三个点根据第一个点的纬度，第二个点的经度求得。
        this._viewer.entities.add({
            id: id,
            polyline: {
                // This callback updates positions each frame.
                positions: new Cesium.CallbackProperty(function () {
                    return [firstPoint,secPoint];
                }, false),
                width: 3,
                material: Cesium.Color.CHARTREUSE,
                depthFailMaterial: Cesium.Color.CHARTREUSE,
                // clampToGround: new Cesium.ConstantProperty(true),
                // disableDepthTestDistance: Number.POSITIVE_INFINITY,//禁用深度测试，折线没有此属性，但点有
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, Number.MAX_VALUE)
            }
        });
    } else {
        var entity = this._viewer.entities.getById(id);
        entity.polyline.positions =[firstPoint,secPoint];
    }

    // var polyline_P=null;
    // var primitives = this._viewer.scene.primitives;
    // var length = primitives.length;
    // for (var i = 0; i < length; i++) {
    //     var p = primitives.get(i);
    //     if (p._instanceIds == id)
    //     {
    //         polyline_P=p;
    //     }
    // }
    // if(!polyline_P)
    // {
    //     _scene.primitives.add(new Cesium.Primitive({
    //         geometryInstances : new Cesium.GeometryInstance({
    //             id:id,
    //             geometry : new Cesium.PolylineGeometry({
    //                 positions : new Cesium.CallbackProperty(function (){
    //                                 return Cesium.Cartesian3.fromRadiansArrayHeights([firstLon,firstLat,firstHeight,secLon,secLat,secHeight]);
    //                             },false),
    //                 width : 5.0,
    //                 vertexFormat : Cesium.PolylineColorAppearance.VERTEX_FORMAT
    //             }),
    //             attributes: {
    //                 color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.CHARTREUSE)
    //             }
    //         }),
    //         appearance : new Cesium.PolylineColorAppearance()
    //     }));
    // }else
    // {
    //     polyline_P.geometryInstances.geometry._positions=Cesium.Cartesian3.fromRadiansArrayHeights([firstLon,firstLat,firstHeight,secLon,secLat,secHeight]);
    // }
};
//通过传入的标签的cartesian位置、标签内容动态生成标签
measureHelper.prototype.addLabel_CallBack=function (id, lablePosition, title) {
    if (this._viewer.entities.getById(id) == null) {
        this._viewer.entities.add({
            id: id,
            position: new Cesium.CallbackProperty(function () {
                return lablePosition;
            }, false),
            label: {
                // This callback updates the length to print each frame.
                text: new Cesium.CallbackProperty(function () {
                    return title;
                }, false),
                font: '15px sans-serif',
                showBackground: true,
                disableDepthTestDistance: Number.POSITIVE_INFINITY,//禁用深度测试
                //disableDepthTestDistance:0,
                // eyeOffset:new Cesium.Cartesian3(0.0,0.3,0.0)
                pixelOffset: new Cesium.Cartesian2(0.0, -20)
            }
        });
    } else {
        var entity = this._viewer.entities.getById(id);
        entity.position = lablePosition;
        entity.label.text = title;
    }
};
measureHelper.prototype.getDistanceByPoint=function (title, firstCartesian, secCartesian) {
    console.log(title,firstCartesian,secCartesian)
    this._geodesic.setEndPoints(Cesium.Cartographic.fromCartesian(firstCartesian),Cesium.Cartographic.fromCartesian(secCartesian));
    var distance = Math.round(this._geodesic.surfaceDistance);
    return title + (distance > 1000 ? (distance / 1000).toFixed(2) + 'km' : distance + 'm');
};
measureHelper.prototype.getHeight = function(title, firstCartesian, secCartesian){
    var cartographic = Cesium.Cartographic.fromCartesian(firstCartesian);
    var cartographic1 = Cesium.Cartographic.fromCartesian(secCartesian);
    var height_temp = cartographic1.height - cartographic.height;
    var distance = Math.abs(Math.round(height_temp));
    return title + (distance > 1000 ? (distance / 1000).toFixed(2) + 'km' : distance + 'm');		
}
measureHelper.prototype.getSpaceDistance = function(title, firstCartesian, secCartesian){
    var cartographic = Cesium.Cartographic.fromCartesian(firstCartesian);
    var cartographic1 = Cesium.Cartographic.fromCartesian(secCartesian);
    var height_temp = cartographic1.height - cartographic.height;
    this._geodesic.setEndPoints(Cesium.Cartographic.fromCartesian(firstCartesian),Cesium.Cartographic.fromCartesian(secCartesian));
    var distance = this._geodesic.surfaceDistance;
    var spaceDistance = Math.round(Math.sqrt(Math.pow(height_temp,2)+Math.pow(distance,2)));
    return title + (spaceDistance > 1000 ? (spaceDistance / 1000).toFixed(2) + 'km' : spaceDistance + 'm');		
}

measureHelper.prototype.getSlopeAngle=function ()//获得坡度的正切值
{
    //获得垂直距离
    var cartographic = Cesium.Cartographic.fromCartesian(this._pointsCartesian3Array[2]);
    var cartographic1 = Cesium.Cartographic.fromCartesian(this._pointsCartesian3Array[1]);
    var verticalDistance = cartographic1.height - cartographic.height;

    //获得水平距离
    this._geodesic.setEndPoints(Cesium.Cartographic.fromCartesian(this._pointsCartesian3Array[0]), Cesium.Cartographic.fromCartesian(this._pointsCartesian3Array[1]));
    var horizontalDistance = Math.round(this._geodesic.surfaceDistance);

    var angle = (Math.atan(verticalDistance / horizontalDistance)).toFixed(2);
    return  "坡度：" + Math.abs(angle *180/ Math.PI).toFixed(2)+"度";
};
measureHelper.prototype.getDynamicTotalDistance=function () {//计算两点间的距离
    //总点数
    var totalLength = 0;
    //点击右键之前，是上一个点与当前鼠标之间的距离
    var len = this._pointsCartesian3Array.length;
    for (var i = 0; i <= len - 1; i = i + 1) {
        if (i == len - 1)//代表到了数组中的最后一个点，则用当前鼠标位置与其配对
        {
            this._geodesic.setEndPoints(Cesium.Cartographic.fromCartesian(this._pointsCartesian3Array[i]),Cesium.Cartographic.fromCartesian(this._mouseCurrentCartesian));
            totalLength = totalLength + this._geodesic.surfaceDistance;
        } else {
            this._geodesic.setEndPoints(Cesium.Cartographic.fromCartesian(this._pointsCartesian3Array[i]), Cesium.Cartographic.fromCartesian(this._pointsCartesian3Array[i + 1]));
            totalLength = totalLength + this._geodesic.surfaceDistance;
        }

    }
    totalLength = Math.round(totalLength);
    return "距离:" + (totalLength > 1000 ? (totalLength / 1000).toFixed(2) + 'km' : totalLength + 'm');
};

measureHelper.prototype.getDynamicTotalHeight=function () {//计算两点间的高度
    //总点数
    var totalLength = 0;
    //点击右键之前，是上一个点与当前鼠标之间的距离
    var len = this._pointsCartesian3Array.length;
    for (var i = 0; i <= len - 1; i = i + 1) {
        if (i == len - 1)//代表到了数组中的最后一个点，则用当前鼠标位置与其配对
        {
                var high = Math.abs(Cesium.Cartographic.fromCartesian(_self._mouseCurrentCartesian).height - Cesium.Cartographic.fromCartesian(this._pointsCartesian3Array[i].height));
                totalLength = totalLength + high;

        } else {
                var high = Math.abs(Cesium.Cartographic.fromCartesian(this._pointsCartesian3Array[i + 1]).height - Cesium.Cartographic.fromCartesian(this._pointsCartesian3Array[i]).height);
                totalLength = totalLength + high;
        }
    }
    totalLength = Math.round(totalLength);
    return "距离:" + (totalLength > 1000 ? (totalLength / 1000).toFixed(2) + 'km' : totalLength + 'm');

};

//清除所有的监听事件，及样式，相关增加的点线面
measureHelper.prototype.clearAll=function () {
    this._lineCount=0;
    //取消测距的监听事件
    this._handler.destroy();
    this._handler = new Cesium.ScreenSpaceEventHandler(this._viewer.canvas);
    //取消鼠标样式
    $('body').removeClass('measureCur');

    //清空数组中存放的值
    this._pointsCartesian3Array = [];
    this._mouseCurrentCartesian = null;
    //取消增加的实体
    this._viewer.entities.removeAll();
};

measureHelper.prototype.flyTo=function(destination,head,pitch,roll,duration,call) {
    this._viewer.camera.flyTo({
        destination:destination,    //Cartesian3 | Rectangle
        orientation: {
            heading:head,
            pitch:pitch,
            roll:roll,
        },
        duration: duration,
        complete: function ()//飞行完毕后执行的动作
        {
            if(call)//如果有回调函数
            {
                call();
            }
        }

    });
};