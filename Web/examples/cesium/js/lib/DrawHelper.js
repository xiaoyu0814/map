var drawHelper = {
    defaults: {
        _viewer: null,
        activeShapePoints: [],//激活状态形状的点
        activeShape: null,//激活状态的形状
        floatingPoint: null,//激活状态的点实体对象，改变其位置，即可以改变实体点的位置
        activeRadius:0,//圆选时圆的动态半径
        EntityArr:[],//存放新增的实体，方便删除
        billboardGroup:null//存放增加的标注图元，方便删除
    },
    init: function (options) {
        var _self = this;
        drawHelper.defaults._viewer = options.viewer;
        _self.initHandlers(drawHelper.defaults);
        _self.extendPrimitivePrototype(drawHelper.defaults);
    },
    createMarker: function (options) {
        var _self = this;
        var settings = $.extend({}, _self.defaults, options);
        var marker = new drawHelper.Marker.Constructor(settings);
        marker.init();
        return marker;
    },
    createPolygon: function (options) {
        var _self = this;
        var settings = $.extend({}, _self.defaults, options);
        var polygon = new drawHelper.Polygon.Constructor(settings);
        polygon.init();
        return polygon;
    },
    createCircle: function (options) {
        var _self = this;
        var settings = $.extend({}, _self.defaults, options);
        var circle = new drawHelper.Circle.Constructor(settings);
        circle.init();
        return circle;
    },
    createRectangle: function (options) {
        var _self = this;
        var settings = $.extend({}, _self.defaults, options);
        var rectangle = new drawHelper.Rectangle.Constructor(settings);
        rectangle.init();
        return rectangle;
    },
    drawShape: function (positionData, drawingMode) {//绘制点、线、面等形状
        var shape;
        if (drawingMode === 'point') {
            shape = this.defaults._viewer.entities.add({
                position: positionData,
                point: {
                    color: Cesium.Color.YELLOW,
                    pixelSize: 5,
                    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
                }
            });

        } else if (drawingMode === 'line') {
            shape = this.defaults._viewer.entities.add({
                polyline: {
                    positions: positionData,
                    clampToGround: true,
                    width: 3,
                    material: Cesium.Color.CHARTREUSE,
                    depthFailMaterial: Cesium.Color.CHARTREUSE,
                    clampToGround: new Cesium.ConstantProperty(true)
                }
            });
        } else if (drawingMode === 'circle') {
            shape = this.defaults._viewer.entities.add({
                position:this.defaults.activeShapePoints[0],
                ellipse : {
                    semiMinorAxis :positionData,
                    semiMajorAxis :positionData,
                    material:Cesium.Color.CHARTREUSE.withAlpha( 0.3),
                    extrudedHeight: 0,
                    outline : true,
                    outlineColor :Cesium.Color.RED
                }
            });
        }  else if (drawingMode === 'rectangle') {
            shape = this.defaults._viewer.entities.add({
                rectangle : {
                    coordinates :positionData,
                    fill:false,
                    outline : true, // height must be set for outline to display
                    outlineColor : Cesium.Color.RED
                }
            });
        }
        else if (drawingMode === 'polygon') {
            shape = this.defaults._viewer.entities.add({
                polygon: {
                    hierarchy: positionData,
                    material:Cesium.Color.CHARTREUSE.withAlpha( 0.3),
                    extrudedHeight: 0,
                    outline : true,
                    outlineColor :Cesium.Color.RED
                }
            });
        }
        return shape;
    },
    terminateShape: function (drawingMode) {//绘制形状结束
        var shape=null;
        //this.defaults.activeShapePoints.pop();
        if(drawingMode=="circle"){
            //计算两个点之间的距离，做为半径
            var geodesic=new Cesium.EllipsoidGeodesic(Cesium.Cartographic.fromCartesian(drawHelper.defaults.activeShapePoints[0]),Cesium.Cartographic.fromCartesian(drawHelper.defaults.activeShapePoints[1]));
            shape=this.drawShape(geodesic.surfaceDistance, drawingMode);
        }else if(drawingMode=="rectangle"){
            var coordinates =Cesium.Rectangle.fromCartesianArray(drawHelper.defaults.activeShapePoints);
            shape=this.drawShape(coordinates, drawingMode);
        }
        else{//针对圆，不需要补最后的右键点击点
            var point=this.drawShape(this.defaults.activeShapePoints[this.defaults.activeShapePoints.length-1],"point");
            this.defaults.EntityArr.push(point);
            shape=this.drawShape(this.defaults.activeShapePoints, drawingMode);
        }

        this.defaults.EntityArr.push(shape);
        this.defaults._viewer.entities.remove(this.defaults.floatingPoint);
        this.defaults._viewer.entities.remove(this.defaults.activeShape);
        this.defaults.floatingPoint = undefined;
        this.defaults.activeShape = undefined;
        this.defaults.activeRadius=0;
        this.defaults.activeShapePoints = [];
    },
    clearAll: function () {
        var _self=this;
        $('body').removeClass('measureCur');
        //删除圆选、框选、多边形选择中新增加的圆、多边形、矩形实体
        if(this.defaults.EntityArr.length>0){
            this.defaults.EntityArr.forEach(function (o) {
                if(_self.defaults._viewer.entities.contains(o)){
                    _self.defaults._viewer.entities.remove(o);
                }
            })
        }
        //删除新增加的标注
        if(_self.defaults.billboardGroup.length>0){
            _self.defaults._viewer.scene.primitives.remove(_self.defaults.billboardGroup);
        }
    }
};
drawHelper.Marker = {};
drawHelper.Polygon = {};
drawHelper.Circle = {};
drawHelper.Rectangle = {};
drawHelper.init.prototype.initHandlers = function (options) {
    function callPrimitiveCallBack(eventName, position) {//当响应鼠标事件时，执行相应图元注册的回调函数
        var pickedObject = options._viewer.scene.pick(position);
        //如果针对此图元注册过，相应的事件处理函数，则执行相应的事件处理函数
        if (pickedObject && pickedObject.primitive && pickedObject.primitive[eventName]) {
            pickedObject.primitive[eventName](position);
        }
    }

    //创建局部handler变量
    var _handler = new Cesium.ScreenSpaceEventHandler(options._viewer.canvas);
    _handler.setInputAction(function (movment) {//左键单击
        // alert("原型上注册的鼠标事件");
        callPrimitiveCallBack("leftClick", movment.position);
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    _handler.setInputAction(function (movment) {//左键按下
        callPrimitiveCallBack('leftDown', movment.position);
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

    _handler.setInputAction(function (movment) {//左键松起
        callPrimitiveCallBack('leftUp', movment.position);
    }, Cesium.ScreenSpaceEventType.LEFT_UP);

    _handler.setInputAction(function (movment) {//右键单击

    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

    _handler.setInputAction(function (movment) {//鼠标移动

    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
}
drawHelper.init.prototype.extendPrimitivePrototype = function (options) {//扩展基本图元的原型方法
    var _self = this;
    //扩展标注的原型方法:增加针对鼠标响应的监听事件，实现标注的托拽功能。
    Cesium.Billboard.prototype.setEditable = function () {
        var billboard = this;
        //设置针对标注的新增属性leftDown：鼠标左键监听事件，当鼠标坐键按下，且托动时，调用此处注册的匿名函数，更新标注位置
        drawHelper.primitive.setListener(billboard, 'leftDown', function (position) {
            function onDrag(position) {
                //console.log(_handler0)
                billboard.position = position;
                //_self.executeListeners({name: 'drag', positions: position});
            }

            function onDragEnd(position) {
                _handler0.destroy();
                options._viewer.scene.screenSpaceCameraController.enableRotate = true;
                //console.log(_handler0)
                //_self.executeListeners({name: 'dragEnd', positions: position});
            }

            var _handler0 = new Cesium.ScreenSpaceEventHandler(options._viewer.canvas);
            _handler0.setInputAction(function (movement) {
                // console.log("为啥没销毁还执行");
                var cartesian = options._viewer.scene.camera.pickEllipsoid(movement.endPosition);
                if (cartesian) {
                    onDrag(cartesian);
                } else {
                    onDragEnd(cartesian);
                }
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

            _handler0.setInputAction(function (movement) {
                console.log("鼠标弹起事件为啥不执行");
                onDragEnd(options._viewer.scene.camera.pickEllipsoid(movement.position));
            }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

            //当按住鼠标左键托动时禁止三维球旋转
            options._viewer.scene.screenSpaceCameraController.enableRotate = false;
        });

        //针对标注图元本身，增加事件监听与执行函数
        drawHelper.primitive.addPrimitiveListener(billboard);
    }

}
drawHelper.primitive = {
    setListener: function (primitive, type, callback) {//针对图元原型上新增加的属性设置监听事件，例：针对图元设置响应鼠标的leftDown事件
        primitive[type] = callback;
    },
    addPrimitiveListener: function (element) {//针对图元本身的创建，移除等等，增加相应的监听事件
        element._listeners = {};

        element.addListener = function (name, callback) {
            this._listeners[name] = (this._listeners[name] || []);
            this._listeners[name].push(callback);
            return this._listeners[name].length;
        }

        element.executeListeners = function (event, defaultCallback) {
            if (this._listeners[event.name] && this._listeners[event.name].length > 0) {
                var index = 0;
                for (; index < this._listeners[event.name].length; index++) {
                    this._listeners[event.name][index](event);
                }
            } else {
                if (defaultCallback) {
                    defaultCallback(event);
                }
            }
        }

    }
}

//增加标注构造函数
drawHelper.Marker.Constructor = function (options) {
    this.settings = options;
};
drawHelper.Marker.Constructor.prototype = {
    init: function () {
        var _self = this;
        drawHelper.defaults.billboardGroup=new Cesium.BillboardCollection();
        _self.settings._viewer.scene.primitives.add(drawHelper.defaults.billboardGroup);
        _self.create(_self.settings);
    },
    create: function (options) {
        var _self = this;
        var _handler = new Cesium.ScreenSpaceEventHandler(options._viewer.canvas);
        _handler.setInputAction(function (movment) {//左键单击,增加标注
            // alert("鼠标上注册的单击事件");
            var startCartesian = null;
            var ray = options._viewer.scene.camera.getPickRay(movment.position);
            if (ray) {
                startCartesian = options._viewer.scene.globe.pick(ray, options._viewer.scene);
            } else {
                return;
            }

            var billboard =drawHelper.defaults.billboardGroup.add({
                show: true,
                position: startCartesian,
                pixelOffset: new Cesium.Cartesian2(0, 0),
                eyeOffset: new Cesium.Cartesian3(0.0, 0.0, 0.0),
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                verticalOrigin: Cesium.VerticalOrigin.CENTER,
                scale: 1.0,
                image: options.iconUrl,
                color: new Cesium.Color(1.0, 1.0, 1.0, 1.0)
            });
            billboard.setEditable();

        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        _handler.setInputAction(function () {
            _handler.destroy();
            $("body").removeClass("measureCur");
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
    }
}

//增加多边形构造函数
drawHelper.Polygon.Constructor = function (options) {
    this.settings = options;
};
drawHelper.Polygon.Constructor.prototype = {
    init: function () {
        var _self = this;
        var setting = _self.settings;
        _self.create(setting);
    },
    create: function (options) {
        var _self = this;
        var _handler = new Cesium.ScreenSpaceEventHandler(options._viewer.canvas);
        _handler.setInputAction(function (event) {//
            // We use `viewer.scene.pickPosition` here instead of `viewer.camera.pickEllipsoid` so that
            // we get the correct point when mousing over terrain.
            var earthPosition = null;
            var ray = options._viewer.scene.camera.getPickRay(event.position);
            if (ray) {
                earthPosition = options._viewer.scene.globe.pick(ray, options._viewer.scene);
            } else {
                return;
            }

            // `earthPosition` will be undefined if our mouse is not over the globe.
            if (Cesium.defined(earthPosition)) {
                if (drawHelper.defaults.activeShapePoints.length === 0) {
                    drawHelper.defaults.floatingPoint = drawHelper.drawShape(earthPosition, "point");
                    drawHelper.defaults.activeShapePoints.push(earthPosition);
                    var dynamicPositions = new Cesium.CallbackProperty(function () {
                        return new Cesium.PolygonHierarchy(drawHelper.defaults.activeShapePoints);
                    }, false);
                    drawHelper.defaults.activeShape = drawHelper.drawShape(dynamicPositions, "polygon");
                }
                drawHelper.defaults.activeShapePoints.push(earthPosition);
                var point= drawHelper.drawShape(earthPosition, "point");
                drawHelper.defaults.EntityArr.push(point);
            }

        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        _handler.setInputAction(function (event) {
            if (Cesium.defined(drawHelper.defaults.floatingPoint)) {
                var newPosition =null;
                var ray = options._viewer.scene.camera.getPickRay(event.endPosition);
                if (ray) {
                    newPosition = options._viewer.scene.globe.pick(ray, options._viewer.scene);
                } else {
                    return;
                }
                if (Cesium.defined(newPosition)) {
                    drawHelper.defaults.floatingPoint.position.setValue(newPosition);
                    options.activeShapePoints.pop();
                    options.activeShapePoints.push(newPosition);
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        _handler.setInputAction(function () {
            drawHelper.terminateShape("polygon");
            _handler.destroy();
            $("body").removeClass("measureCur");

        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
    }
}

//增加圆的构造函数
drawHelper.Circle.Constructor = function (options) {
    this.settings = options;
};
drawHelper.Circle.Constructor.prototype = {
    init: function () {
        var _self = this;
        var setting = _self.settings;
        _self.create(setting);
    },
    create: function (options) {
        var _self = this;
        var _handler = new Cesium.ScreenSpaceEventHandler(options._viewer.canvas);
        _handler.setInputAction(function (event) {//
            // We use `viewer.scene.pickPosition` here instead of `viewer.camera.pickEllipsoid` so that
            // we get the correct point when mousing over terrain.
            var earthPosition = null;
            var ray = options._viewer.scene.camera.getPickRay(event.position);
            if (ray) {
                earthPosition = options._viewer.scene.globe.pick(ray, options._viewer.scene);
            } else {
                return;
            }

            // `earthPosition` will be undefined if our mouse is not over the globe.
            if (Cesium.defined(earthPosition)) {
                if (drawHelper.defaults.activeShapePoints.length === 0) {
                    var point=drawHelper.drawShape(earthPosition, "point");
                    drawHelper.defaults.EntityArr.push(point);
                    drawHelper.defaults.activeShapePoints.push(earthPosition);
                    var dynamicPositions = new Cesium.CallbackProperty(function () {
                        return drawHelper.defaults.activeRadius;
                       }, false);
                    drawHelper.defaults.activeShape = drawHelper.drawShape(dynamicPositions,"circle");
                }
                drawHelper.defaults.activeShapePoints.push(earthPosition);
            }

        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        _handler.setInputAction(function (event) {
            if (drawHelper.defaults.activeShapePoints.length>0) {
                var newPosition =null;
                var ray = options._viewer.scene.camera.getPickRay(event.endPosition);
                if (ray) {
                    newPosition = options._viewer.scene.globe.pick(ray, options._viewer.scene);
                } else {
                    return;
                }
                if (Cesium.defined(newPosition)) {
                    drawHelper.defaults.activeShapePoints.pop();
                    drawHelper.defaults.activeShapePoints.push(newPosition);
                    //计算两个点之间的距离，做为半径
                    var geodesic=new Cesium.EllipsoidGeodesic(Cesium.Cartographic.fromCartesian(drawHelper.defaults.activeShapePoints[0]),Cesium.Cartographic.fromCartesian(newPosition));
                    drawHelper.defaults.activeRadius=geodesic.surfaceDistance;
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        _handler.setInputAction(function () {
            drawHelper.terminateShape("circle");
            _handler.destroy();
            $("body").removeClass("measureCur");

        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
    }
}

//增加框选构造函数
drawHelper.Rectangle.Constructor = function (options) {
    this.settings = options;
};
drawHelper.Rectangle.Constructor.prototype = {
    init: function () {
        var _self = this;
        var setting = _self.settings;
        _self.create(setting);
    },
    create: function (options) {
        var _self = this;
        var _handler = new Cesium.ScreenSpaceEventHandler(options._viewer.canvas);
        _handler.setInputAction(function (event) {//
            // We use `viewer.scene.pickPosition` here instead of `viewer.camera.pickEllipsoid` so that
            // we get the correct point when mousing over terrain.
            var earthPosition = null;
            var ray = options._viewer.scene.camera.getPickRay(event.position);
            if (ray) {
                earthPosition = options._viewer.scene.globe.pick(ray, options._viewer.scene);
            } else {
                return;
            }

            // `earthPosition` will be undefined if our mouse is not over the globe.
            if (Cesium.defined(earthPosition)) {
                if (drawHelper.defaults.activeShapePoints.length === 0) {
                    drawHelper.defaults.activeShapePoints.push(earthPosition);
                    var dynamicPositions = new Cesium.CallbackProperty(function () {
                        return Cesium.Rectangle.fromCartesianArray(drawHelper.defaults.activeShapePoints);
                    }, false);
                    drawHelper.defaults.activeShape = drawHelper.drawShape(dynamicPositions,"rectangle");
                }
                drawHelper.defaults.activeShapePoints.push(earthPosition);
            }

        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        _handler.setInputAction(function (event) {
            if (drawHelper.defaults.activeShapePoints.length>0) {
                var newPosition =null;
                var ray = options._viewer.scene.camera.getPickRay(event.endPosition);
                if (ray) {
                    newPosition = options._viewer.scene.globe.pick(ray, options._viewer.scene);
                } else {
                    return;
                }
                if (Cesium.defined(newPosition)) {
                    drawHelper.defaults.activeShapePoints.pop();
                    drawHelper.defaults.activeShapePoints.push(newPosition);
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        _handler.setInputAction(function () {
            drawHelper.terminateShape("rectangle");
            _handler.destroy();
            $("body").removeClass("measureCur");

        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
    }
}