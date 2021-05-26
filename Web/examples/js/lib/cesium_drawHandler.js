var MouseEvent = function (viewer) {
  this._viewer = viewer
  this._scene = this._viewer.scene
  this._handler = new Cesium.ScreenSpaceEventHandler(this._viewer.canvas)
  this.activeShapePoints = []
  this.activeRadius=0//圆选时圆的动态半径
  this.activeShape = null
  this.floatingPoint = null
  this.curBoundingRectangle=null;//当前边界框，控制体，如果有的话
  this.EntityArr = [];//清除标绘中用到的实体
  this.PrimitiveArr = [];//清除标绘中用到的图元
  this.BoundingShape=[];//清除辅助旋转，缩放的图形
}
//获取鼠标经纬度
MouseEvent.prototype.getPosition = function (callback) {
  var _this = this;
  //得到当前三维场景
  var scene = _this._scene;
  var viewer = _this._viewer;
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
      let zoom = _this.altitudeToZoom(height);
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
    let zoom = _this.altitudeToZoom(height);
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
MouseEvent.prototype.altitudeToZoom = function (altitude) {
  var A = 40487.57;
  var B = 0.00007096758;
  var C = 91610.74;
  var D = -40467.74;

  return Math.round(D +(A-D)/(1 + Math.pow(altitude / C,B)))
}
// 绘制河流多边形
MouseEvent.prototype.drawPolygon = function (drawingMode, isFill) {
  var _self = this
  this._handler.setInputAction(function (event) {
    // We use `viewer.scene.pickPosition` here instead of `viewer.camera.pickEllipsoid` so that
    // we get the correct point when mousing over terrain.
    var earthPosition;
    var ray = _self._viewer.scene.camera.getPickRay(event.position);
    if (ray)
      earthPosition = _self._viewer.scene.globe.pick(ray, _self._viewer.scene);
    // earthPosition = _self._viewer.scene.camera.pickEllipsoid(event.position);
    if (Cesium.defined(earthPosition)) {
      let pointObj={
        color:Cesium.Color.WHITE.withAlpha(0),
        size:1
      }
      if (_self.activeShapePoints.length === 0) {
        _self.floatingPoint = _self.createPoint(earthPosition,pointObj);
        _self.activeShapePoints.push(earthPosition);
        var dynamicPositions = new Cesium.CallbackProperty(function () {
          if (drawingMode === 'polygon') {
            return new Cesium.PolygonHierarchy(_self.activeShapePoints);
          }
          return _self.activeShapePoints;
        }, false);
        _self.activeShape = _self.drawShape(drawingMode, dynamicPositions, isFill);
      }
      _self.activeShapePoints.push(earthPosition);
      var p = _self.createPoint(earthPosition,pointObj);
      _self.EntityArr.push(p);
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  this._handler.setInputAction(function (event) {
    if (Cesium.defined(_self.floatingPoint)) {
      var newPosition;
      var ray = _self._viewer.scene.camera.getPickRay(event.endPosition);
      if (ray)
        newPosition = _self._viewer.scene.globe.pick(ray, _self._viewer.scene);
      if (Cesium.defined(newPosition)) {
        _self.floatingPoint.position.setValue(newPosition);
        _self.activeShapePoints.pop();
        _self.activeShapePoints.push(newPosition);
      }
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
}
//绘制圆形
MouseEvent.prototype.drawCircle = function () {
  var _self = this
  this._handler.setInputAction(function (event) {
    var earthPosition;
    var ray = _self._viewer.scene.camera.getPickRay(event.position);
    if (ray)
      earthPosition = _self._viewer.scene.globe.pick(ray, _self._viewer.scene);
    if (Cesium.defined(earthPosition)) {
      if (_self.activeShapePoints.length === 0) {
        // var point=_self.drawShape("point",earthPosition);
        //_self.EntityArr.push(point);
        _self.activeShapePoints.push(earthPosition);
        var dynamicPositions = new Cesium.CallbackProperty(function () {
          return _self.activeRadius;
        }, false);
        _self.activeShape =_self.drawShape("circle",dynamicPositions);
      }
      _self.activeShapePoints.push(earthPosition);
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  this._handler.setInputAction(function (event) {
    if (_self.activeShapePoints.length>0) {
      var newPosition;
      var ray = _self._viewer.scene.camera.getPickRay(event.endPosition);
      if (ray)
        newPosition = _self._viewer.scene.globe.pick(ray, _self._viewer.scene);
      if (Cesium.defined(newPosition)) {
        _self.activeShapePoints.pop();
        _self.activeShapePoints.push(newPosition);
        //计算两个点之间的距离，做为半径
        var geodesic=new Cesium.EllipsoidGeodesic(Cesium.Cartographic.fromCartesian(_self.activeShapePoints[0]),Cesium.Cartographic.fromCartesian(newPosition));
        _self.activeRadius=geodesic.surfaceDistance;
      }
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
}

//绘制矩形
MouseEvent.prototype.drawRectangle = function () {
  var _self = this
  this._handler.setInputAction(function (event) {
    var earthPosition;
    var ray = _self._viewer.scene.camera.getPickRay(event.position);
    if (ray)
      earthPosition = _self._viewer.scene.globe.pick(ray, _self._viewer.scene);
    if (Cesium.defined(earthPosition)) {
      if (_self.activeShapePoints.length === 0) {
        _self.activeShapePoints.push(earthPosition);
        var dynamicPositions = new Cesium.CallbackProperty(function () {
          return Cesium.Rectangle.fromCartesianArray(_self.activeShapePoints);
        }, false);
        _self.activeShape =_self.drawShape("rectangle",dynamicPositions);
      }
      _self.activeShapePoints.push(earthPosition);
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  this._handler.setInputAction(function (event) {
    if (_self.activeShapePoints.length>0) {
      var newPosition;
      var ray = _self._viewer.scene.camera.getPickRay(event.endPosition);
      if (ray)
        newPosition = _self._viewer.scene.globe.pick(ray, _self._viewer.scene);
      if (Cesium.defined(newPosition)) {
        _self.activeShapePoints.pop();
        _self.activeShapePoints.push(newPosition);
      }
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
}

//绘制实体点
MouseEvent.prototype.createPoint = function (worldPosition,pointObj) {
  var _self = this;
  var point = _self._viewer.entities.add({
    name:pointObj.name,
    position: worldPosition,
    point: {
      color: pointObj.color,
      pixelSize: pointObj.size,
      // heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
    }
  });
  return point;
}
MouseEvent.prototype.createPoint_primitive = function (worldPosition,pointObj) {
  var _self = this;
  let instance =new Cesium.PointPrimitiveCollection();
  // Create a pointPrimitive collection with two points
  var points = _self._viewer.scene.primitives.add(instance);
  points.add({
    id:pointObj.id,
    position :worldPosition,
    color : Cesium.Color.WHITE.withAlpha(0.5), // default: WHITE,
    pixelSize: pointObj.size,
    outlineColor: pointObj.color, // default: BLACK
    outlineWidth: 1, // default: 0
    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
      0.0,
      Number.MAX_VALUE
    )
  });

  return points;
}
//绘制实体虚线矩形
MouseEvent.prototype.createBoundingRectangle = function (modelMatrix,rectangle) {
  var _self = this;
  //创建矩形
  let obj={
    rectangle:null,
    points:[]
  };
  let instance = new Cesium.GeometryInstance({
    id:"rectangle_forCompute",
    modelMatrix:modelMatrix,
    geometry : new Cesium.RectangleOutlineGeometry({
      rectangle :rectangle,
      // vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT
    }),
    attributes : {
      color : Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.RED)
    }
  });
  if(instance!=null){
    obj.rectangle=_self._viewer.scene.primitives.add(new Cesium.Primitive({
      geometryInstances : instance,
      releaseGeometryInstances:false,
      appearance : new Cesium.PerInstanceColorAppearance()
    }));
  }

  //创建用于缩放的8个点
  //
  let northeast=Cesium.Rectangle.northeast(rectangle);
  let northwest=Cesium.Rectangle.northwest(rectangle);
  let southeast=Cesium.Rectangle.southeast(rectangle);
  let southwest=Cesium.Rectangle.southwest(rectangle);
  let pointObj={
    id:"point_forCompute",
    color:Cesium.Color.RED,
    size:10,
    modelMatrix:modelMatrix
  }
  obj.points.push(this.createPoint_primitive(Cesium.Matrix4.multiplyByPoint(modelMatrix,Cesium.Cartesian3.fromRadians(northeast.longitude,northeast.latitude),new Cesium.Cartesian3()),pointObj));
  obj.points.push(this.createPoint_primitive(Cesium.Matrix4.multiplyByPoint(modelMatrix,Cesium.Cartesian3.fromRadians(northwest.longitude,northwest.latitude),new Cesium.Cartesian3()),pointObj));
  obj.points.push(this.createPoint_primitive(Cesium.Matrix4.multiplyByPoint(modelMatrix,Cesium.Cartesian3.fromRadians(southeast.longitude,southeast.latitude),new Cesium.Cartesian3()),pointObj));
  obj.points.push(this.createPoint_primitive(Cesium.Matrix4.multiplyByPoint(modelMatrix,Cesium.Cartesian3.fromRadians(southwest.longitude,southwest.latitude),new Cesium.Cartesian3()),pointObj));

  return obj;
}

MouseEvent.prototype.drawShape_primitive = function (drawingMode, positionData, isFill = true) {
  var _self = this;
  var shape;
  if (drawingMode === 'line') {
    let instance = new Cesium.GeometryInstance({
      id:"line",
      geometry: new Cesium.PolylineGeometry({
        positions: positionData,
        width:3,
        vertexFormat: Cesium.PolylineMaterialAppearance.VERTEX_FORMAT,
      }),
    });
    if(instance!=null){
      shape= _self._viewer.scene.primitives.add(new Cesium.Primitive({
        geometryInstances : instance,
        releaseGeometryInstances:false,
        appearance :  new Cesium.PolylineMaterialAppearance({
          material : Cesium.Material.fromType('Color', {
            color :Cesium.Color.CHARTREUSE
          })
        })
      }));
    }

  }
  else if (drawingMode === 'point') {
    let instance =new Cesium.PointPrimitiveCollection();
    // Create a pointPrimitive collection with two points
    shape=_self._viewer.scene.primitives.add(instance);
    shape.add({
      position :positionData,
      color : Cesium.Color.RED
    });
  }
  else if (drawingMode === 'circle') {
    let instance = new Cesium.GeometryInstance({
      geometry : new Cesium.CircleGeometry({
        center :_self.activeShapePoints[0],
        radius  : positionData,
        stRotation: Cesium.Math.toRadians(90),
        vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
      }),
      id : 'circle',
      attributes : {
        color : Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.CHARTREUSE.withAlpha( 0.5))
      }
    });
    if(instance!=null){
      shape= _self._viewer.scene.primitives.add(new Cesium.Primitive({
        geometryInstances : instance,
        releaseGeometryInstances:false,
        appearance : new Cesium.PerInstanceColorAppearance()
      }));
    }
  }  else if (drawingMode === 'rectangle') {
    let instance = new Cesium.GeometryInstance({
      id:"rectangle",
      geometry : new Cesium.RectangleGeometry({
        rectangle :positionData,
        vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT
      }),
      attributes : {
        color : Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.CHARTREUSE.withAlpha( 0.5))
      }
    });
    if(instance!=null){
      shape=_self._viewer.scene.primitives.add(new Cesium.Primitive({
        geometryInstances : instance,
        releaseGeometryInstances:false,
        appearance : new Cesium.PerInstanceColorAppearance()
      }));
    }
  }
  else if (drawingMode === 'polygon') {
    // 根据图形实例创建一个图元
    let instance= new Cesium.GeometryInstance({
      id:"polygon",
      geometry: new Cesium.PolygonGeometry({
        polygonHierarchy : new Cesium.PolygonHierarchy(positionData),
        perPositionHeight:true,
        material : Cesium.Color.CHARTREUSE.withAlpha( 0.5)
      }),
      id:"polygon",
      attributes: {
        color:Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.CHARTREUSE.withAlpha( 0.5))
      }
    });
    if(instance!=null){
      shape= _self._viewer.scene.primitives.add(new Cesium.Primitive({
        geometryInstances : instance,
        releaseGeometryInstances:false,
        appearance : new Cesium.PerInstanceColorAppearance()
      }));
    }
  }
  //测yaa
  return shape;
}
MouseEvent.prototype.drawShape = function (drawingMode, positionData, isFill = true) {
  var _self = this;
  var shape;
  if (drawingMode === 'line') {
    shape = _self._viewer.entities.add({
      polyline: {
        positions: positionData,
        clampToGround: true,
        material: Cesium.Color.CHARTREUSE,
        width: 3
      }
    });

  }
  else if (drawingMode === 'point') {
    shape = _self._viewer.entities.add({
      position: positionData,
      point: {
        color: Cesium.Color.YELLOW,
        pixelSize: 5,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
      }
    });
  }
  else if (drawingMode === 'circle') {
    shape=_self._viewer.entities.add({
      position:_self.activeShapePoints[0],
      ellipse : {
        semiMinorAxis :positionData,
        semiMajorAxis :positionData,
        material:Cesium.Color.CHARTREUSE.withAlpha( 0.5),
        extrudedHeight: 0,
        fill:true,
        outline : false,
        outlineColor :Cesium.Color.RED
      }
    });
  }  else if (drawingMode === 'rectangle') {
    shape = _self._viewer.entities.add({
      rectangle : {
        coordinates :positionData,
        material:Cesium.Color.CHARTREUSE.withAlpha( 0.5),
        fill:true,
        outline : true, // height must be set for outline to display
        outlineColor : Cesium.Color.RED
      }
    });
  }
  else if (drawingMode === 'polygon') {
    shape = _self._viewer.entities.add({
      polygon: {
        hierarchy: positionData,
        fill: isFill,
        material: Cesium.Color.CHARTREUSE.withAlpha(0.5),
        outline: true,
        outlineColor: Cesium.Color.RED
      }
    });
  }
  return shape;
}
MouseEvent.prototype.terminateShape = function (drawingMode, isFill) {//终结图形的绘制
  var _self = this;
  var shape=null;
  if(drawingMode=="circle"){
    //计算两个点之间的距离，做为半径
    var geodesic=new Cesium.EllipsoidGeodesic(Cesium.Cartographic.fromCartesian(_self.activeShapePoints[0]),Cesium.Cartographic.fromCartesian(_self.activeShapePoints[1]));
    shape=_self.drawShape_primitive(drawingMode,geodesic.surfaceDistance);
  }else if(drawingMode=="rectangle"){
    var coordinates =Cesium.Rectangle.fromCartesianArray(_self.activeShapePoints);
    shape=_self.drawShape_primitive(drawingMode,coordinates);
  }
  else{//针对圆，不需要补最后的右键点击点
    var point = _self.createPoint(_self.activeShapePoints[_self.activeShapePoints.length - 1],{
      color:Cesium.Color.WHITE.withAlpha(0),
      size:1
    });
    _self.EntityArr.push(point);
    shape = _self.drawShape_primitive(drawingMode, _self.activeShapePoints, isFill);
  }
  _self.PrimitiveArr.push(shape);
  //_self.EntityArr.push(shape);
  _self._viewer.entities.remove(_self.floatingPoint);
  _self._viewer.entities.remove(_self.activeShape);
  _self.floatingPoint = undefined;
  _self.activeShape = undefined;
  _self.activeShapePoints = [];
}

// 清除鼠标事件
MouseEvent.prototype.clearMouseEvent = function () {
  var _self = this
  _self._handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
  _self._handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE)
  _self._handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK)
}

// 清除所有的监听事件，及样式，相关增加的点线面
MouseEvent.prototype.clearAll = function () {
  var _self = this
  //禁用地形允许深度检测
  _self._viewer.scene.globe.depthTestAgainstTerrain = false
  _self.clearMouseEvent()
}

// 拾取位置
MouseEvent.prototype.pickUp = function () { // 拾取位置
  var _self = this
  // 当左键单击事件
  _self._handler.setInputAction(function (movement) {
    var startCartesian = null
    var cartographic = null
    var ray = _self._viewer.camera.getPickRay(movement.position)
    if (ray) {
      startCartesian = _self._viewer.scene.globe.pick(ray, _self._viewer.scene)
    }
    if (startCartesian) {
      cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(startCartesian)
    }
    if (cartographic) {
      // 海拔
      var height = _self._viewer.scene.globe.getHeight(cartographic).toFixed(3)
      alert(height)
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
}

// 飞到目的地
MouseEvent.prototype.flyTo = function (destination, head, pitch, roll, duration, call) {
  var _self = this
  _self._viewer.camera.flyTo({
    destination: destination, // Cartesian3 | Rectangle
    orientation: {
      heading: head,
      pitch: pitch,
      roll: roll
    },
    duration: duration,
    complete: function () {
      if (call) {
        call()
      }
    }

  })
}

//平移、旋转、缩放，相关方法
MouseEvent.prototype.translate=function () {
  let _self=this;
  //清除鼠标注册事件
  _self.clearMouseEvent();
  _self.removeBoundingShape();
  _self._handler.setInputAction((movement) => {
    let pick = _self._viewer.scene.pick(movement.position);
    if (pick && pick.primitive) {
      let firstPos=_self._viewer.scene.pickPosition(movement.position);
      let entityType="";
      let boundingCar3_arry=null;
      let smallestR=null;
      let modelMatrix_before=null;
      let objCenter=null;
      let originPos=null;
      if(pick.id.point!=undefined){
        entityType="point";
      }else if(pick.id =="circle"){
        entityType="circle";
        let circle_g=pick.primitive.geometryInstances.geometry._ellipseGeometry;
        smallestR=Cesium.EllipseGeometry.computeRectangle({ center :circle_g._center,
          semiMajorAxis : circle_g._semiMajorAxis,
          semiMinorAxis : circle_g._semiMinorAxis});
      }else if( pick.id=="rectangle"){
        entityType="rectangle";
        smallestR=pick.primitive.geometryInstances.geometry._rectangle;

      }else if(pick.id=="polygon"){
        entityType="polygon";
        boundingCar3_arry=pick.primitive.geometryInstances.geometry._polygonHierarchy.positions;
        smallestR= Cesium.Rectangle.fromCartesianArray(boundingCar3_arry);
      }else if(pick.id=="line"){
        entityType="line";
        boundingCar3_arry=pick.primitive.geometryInstances.geometry._positions;
        smallestR= Cesium.Rectangle.fromCartesianArray(boundingCar3_arry);
      }
      //移动前的模型矩阵
      if(pick.primitive.geometryInstances){
        modelMatrix_before= pick.primitive.geometryInstances.modelMatrix;
        objCenter=Cesium.Rectangle.center(smallestR);
        originPos = Cesium.Cartesian3.fromRadians(objCenter.longitude,objCenter.latitude);
        // var modelMatrix_before= Cesium.Transforms.eastNorthUpToFixedFrame(originPos)
      }

      let _handler0 = new Cesium.ScreenSpaceEventHandler(_self._viewer.canvas);
      function onDrag(position) {
        //console.log(_handler0)
        if(pick.id.position!=null){
          pick.id.position = position;
        }else
        {
          //移动后的模型矩阵
          var t_after = position;// 获取鼠标移动后的点
          if(t_after==undefined){
            return;
          }
          //
          //var sub=Cesium.Cartesian3.subtract(t_after,originPos,new Cesium.Cartesian3());
          //
          // var m=Cesium.Matrix4.multiplyByTranslation(modelMatrix_before,sub, new Cesium.Matrix4());//m = m X m1

          //求旋转角度
          var axis0 = Cesium.Ellipsoid.WGS84.geodeticSurfaceNormal(originPos);
          var axis1 = Cesium.Ellipsoid.WGS84.geodeticSurfaceNormal(t_after);
          var angle=Cesium.Cartesian3.angleBetween(axis0, axis1);//弧度值

          //求旋转轴
          var rotateAxis= Cesium.Cartesian3.cross(axis0, axis1,new Cesium.Cartesian3());
          var rotateAxis_normal= Cesium.Cartesian3.normalize(rotateAxis, new Cesium.Cartesian3());
          //求旋转矩阵
          var qua = Cesium.Quaternion.fromAxisAngle(rotateAxis_normal, angle);
          var modelMatrix3 = Cesium.Matrix3.fromQuaternion(qua);
          var modelMatrix4 = Cesium.Matrix4.fromRotationTranslation(modelMatrix3);

          var m=Cesium.Matrix4.multiply(modelMatrix_before,modelMatrix4, new Cesium.Matrix4());//m = m X m1
          pick.primitive.modelMatrix = m;
        }

      }

      function onDragEnd(position) {
        _handler0.destroy();
        _self._viewer.scene.screenSpaceCameraController.enableRotate = true;
      }

      _handler0.setInputAction(function (movement) {
        // console.log("为啥没销毁还执行");
        var cartesian = _self._viewer.scene.globe.pick(_self._viewer.camera.getPickRay(movement.endPosition), _self._viewer.scene);
        if (cartesian) {
          onDrag(cartesian);
        } else {
          onDragEnd(cartesian);
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

      _handler0.setInputAction(function (movement) {
        //let p=_self._viewer.scene.globe.pick(_self._viewer.camera.getPickRay(movement.position);
        onDragEnd(null);
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

      //当按住鼠标左键托动时禁止三维球旋转
      _self._viewer.scene.screenSpaceCameraController.enableRotate = false;

    }
  }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
}

//平移、旋转、缩放，相关方法
MouseEvent.prototype.rotate=function () {
  let _self=this;
  let modelMatrix_before=null;//多边形的模型矩阵
  let originPos="";//多边形的中心点
  //清除鼠标注册事件
  _self.clearMouseEvent();
  _self._handler.setInputAction((movement) => {
    let pick = _self._viewer.scene.pick(movement.position,6,6);
    if (pick && pick.primitive) {
      let entityType="";
      let boundingCar3_arry=null;
      let smallestR=null;//边界矩形
      let dragPoint="";//用于托动，缩放的点

      if(pick.id=="rectangle_forCompute")
      {
        return;
      }
      else if(pick.id=="point_forCompute"){
        dragPoint=pick.primitive._position;
      }
      else if(pick.id.point!=undefined){
        entityType="point";
        return;
      }else if(pick.id =="circle"){
        entityType="circle";
        let circle_g=pick.primitive.geometryInstances.geometry._ellipseGeometry;
        smallestR=Cesium.EllipseGeometry.computeRectangle({ center :circle_g._center,
          semiMajorAxis : circle_g._semiMajorAxis,
          semiMinorAxis : circle_g._semiMinorAxis});
      }else if( pick.id=="rectangle"){
        entityType="rectangle";
        smallestR=pick.primitive.geometryInstances.geometry._rectangle;

      }else if(pick.id=="polygon"){
        entityType="polygon";
        boundingCar3_arry=pick.primitive.geometryInstances.geometry._polygonHierarchy.positions;
        smallestR= Cesium.Rectangle.fromCartesianArray(boundingCar3_arry);
      }else if(pick.id=="line"){
        entityType="line";
        boundingCar3_arry=pick.primitive.geometryInstances.geometry._positions;
        smallestR= Cesium.Rectangle.fromCartesianArray(boundingCar3_arry);
      }

      //针对控制点、实体点之外的创建边界体
      if(pick.id!="point_forCompute" && pick.id!="rectangle_forCompute" && pick.id.point==undefined){
        //移动前的模型矩阵
        console.log(pick.id)
        primitive_convert=pick.primitive;
        //modelMatrix_before=Cesium.Matrix4.IDENTITY ;
        modelMatrix_before= pick.primitive.geometryInstances.modelMatrix;
        let objCenter=Cesium.Rectangle.center(smallestR);
        originPos = Cesium.Cartesian3.fromRadians(objCenter.longitude,objCenter.latitude,objCenter.height);

        //边界体
        _self.removeBoundingShape();
        if(_self.curBoundingRectangle==null){
          _self.curBoundingRectangle=_self.createBoundingRectangle(pick.primitive.modelMatrix,smallestR);
          _self.BoundingShape.push(_self.curBoundingRectangle);
          return;
        }
      }

      let _handler0 = new Cesium.ScreenSpaceEventHandler(_self._viewer.canvas);
      function onDrag(position) {
        if(dragPoint!=""){
          //移动后的模型矩阵
          var t_after = position;// 获取鼠标移动后的点
          if (t_after == undefined) {
            return;
          }

          //
          var sub1 = Cesium.Cartesian3.subtract(dragPoint, originPos, new Cesium.Cartesian3());
          var sub2 = Cesium.Cartesian3.subtract(t_after, originPos, new Cesium.Cartesian3());
          var angle = Cesium.Cartesian3.angleBetween(sub2, sub1);

          // var hpr = new Cesium.HeadingPitchRoll(angle,1,1);
          // var modelMatrix3=  Cesium.Matrix3.fromHeadingPitchRoll(hpr);


          //var axis = Cesium.Ellipsoid.WGS84.geodeticSurfaceNormal(originPos);
          var axis = Cesium.Ellipsoid.WGS84.geocentricSurfaceNormal(originPos,new Cesium.Cartesian3());
          var qua = Cesium.Quaternion.fromAxisAngle(axis, angle);
          var modelMatrix3 = Cesium.Matrix3.fromQuaternion(qua);
          var modelMatrix4 = Cesium.Matrix4.fromRotationTranslation(modelMatrix3);


          // var modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(originPos,new Cesium.HeadingPitchRoll());

          var m = Cesium.Matrix4.multiply(modelMatrix_before, modelMatrix4, new Cesium.Matrix4());//m = m X

          primitive_convert.modelMatrix = m;
          if (_self.curBoundingRectangle != null) {
            _self.curBoundingRectangle.rectangle.modelMatrix = m;
            for (var i = 0; i < _self.curBoundingRectangle.points.length; i++) {
              _self.curBoundingRectangle.points[i].modelMatrix = m;
            }
          }
        }
      }

      function onDragEnd(position) {
        _handler0.destroy();
        _self._viewer.scene.screenSpaceCameraController.enableRotate = true;
      }

      _handler0.setInputAction(function (movement) {
        // console.log("为啥没销毁还执行");
        var cartesian = _self._viewer.scene.globe.pick(_self._viewer.camera.getPickRay(movement.endPosition), _self._viewer.scene);
        if (cartesian) {
          onDrag(cartesian);
        } else {
          onDragEnd(cartesian);
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

      // _handler0.setInputAction(function (movement) {
      //    _self.removeBoundingShape();
      // }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      _handler0.setInputAction(function (movement) {
        //let p=_self._viewer.scene.globe.pick(_self._viewer.camera.getPickRay(movement.position);
        _self.removeBoundingShape();
        onDragEnd(null);
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);


      //当按住鼠标左键托动时禁止三维球旋转
      _self._viewer.scene.screenSpaceCameraController.enableRotate = false;

    }
  }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
}

//平移、旋转、缩放，相关方法
MouseEvent.prototype.scale=function () {
  let _self=this;
  let modelMatrix_before=null;//多边形的模型矩阵
  let originPos="";//多边形的中心点
  let center_utm=0.0;//计算多边形的utm中心点
  let epsgcode_utm="";//utm zone epsgcode
  let entityType="";
  let boundingCar3_arry=[];
  //清除鼠标注册事件
  _self.clearMouseEvent();
  _self._handler.setInputAction((movement) => {
    let pick = _self._viewer.scene.pick(movement.position,6,6);
    if (Cesium.defined( pick )  && pick.primitive) {
      let smallestR=null;//边界矩形
      let dragPoint="";//用于托动，缩放的点

      if(pick.id=="rectangle_forCompute")
      {
        //entityType="rectangle_forCompute";
        return;
      }
      else if(pick.id=="point_forCompute"){
        //entityType="point_forCompute";
        dragPoint=pick.primitive._position;
      }
      else if(pick.id.point!=undefined){
        entityType="point";
        return;
      }else if(pick.id =="circle"){
        entityType="circle";
        let circle_g=pick.primitive.geometryInstances.geometry._ellipseGeometry;
        smallestR=Cesium.EllipseGeometry.computeRectangle({ center :circle_g._center,
          semiMajorAxis : circle_g._semiMajorAxis,
          semiMinorAxis : circle_g._semiMinorAxis});
        boundingCar3_arry.push(circle_g._center);
        boundingCar3_arry.push(circle_g._semiMinorAxis);
      }else if( pick.id=="rectangle"){
        entityType="rectangle";
        smallestR=pick.primitive.geometryInstances.geometry._rectangle;
        //
        var northwest= Cesium.Rectangle.northwest(smallestR);
        boundingCar3_arry.push(Cesium.Cartesian3.fromRadians(northwest.longitude,northwest.latitude,northwest.height));
        // //
        var southeast= Cesium.Rectangle.southeast(smallestR);
        boundingCar3_arry.push(Cesium.Cartesian3.fromRadians(southeast.longitude,southeast.latitude,southeast.height));
      }else if(pick.id=="polygon"){
        entityType="polygon";
        boundingCar3_arry=pick.primitive.geometryInstances.geometry._polygonHierarchy.positions;
        smallestR= Cesium.Rectangle.fromCartesianArray(boundingCar3_arry);
      }else if(pick.id=="line"){
        entityType="line";
        boundingCar3_arry=pick.primitive.geometryInstances.geometry._positions;
        smallestR= Cesium.Rectangle.fromCartesianArray(boundingCar3_arry);
      }

      //针对控制点、实体点之外的创建边界体
      if(pick.id!="point_forCompute" && pick.id!="rectangle_forCompute" && pick.id.point==undefined){
        //移动前的模型矩阵
        console.log(pick.id)
        primitive_convert=pick.primitive;
        //modelMatrix_before=Cesium.Matrix4.IDENTITY ;
        modelMatrix_before= pick.primitive.geometryInstances.modelMatrix;
        let objCenter=Cesium.Rectangle.center(smallestR);
        originPos = Cesium.Cartesian3.fromRadians(objCenter.longitude,objCenter.latitude);
        //find a proper utm zone epsgcode based on the centroid of polygon
        var centerLon_wgs84=Cesium.Math.toDegrees(objCenter.longitude);
        var centerLat_wgs84=Cesium.Math.toDegrees(objCenter.latitude);
        epsgcode_utm = geoUtils.getUTMEPSGCode(centerLon_wgs84,centerLat_wgs84);
        // get the ploygon center coordinate (utm: x, y)
        var coords_wgs84=[];
        debugger;
        if(entityType!="circle")
        {
          for(var j=0;j<boundingCar3_arry.length;j++){
            var c=Cesium.Cartographic.fromCartesian(boundingCar3_arry[j]);
            coords_wgs84.push(Cesium.Math.toDegrees(c.longitude));
            coords_wgs84.push(Cesium.Math.toDegrees(c.latitude))
          }
          coords= geoUtils.projtransform_WGS84toUTM_pointarr(epsgcode_utm, coords_wgs84);
          // get the ploygon center coordinate (utm: x, y)
          var center_car=Cesium.Rectangle.center(smallestR);
          var cc= geoUtils.projtransform_WGS84toUTM_pointarr(epsgcode_utm, [Cesium.Math.toDegrees(center_car.longitude),Cesium.Math.toDegrees(center_car.latitude)]);
          // var center_lon = (coords[0][0]+coords[1][0])/2;
          // var center_lat = (coords[1][1]+coords[2][1])/2;
          center_utm=  new  Cesium.Cartesian3(cc[0][0],cc[0][1], 0);
        }else {

        }

        //测试是否与第一个算法一致
        //coords_utm2= geoUtils.projtransform_WGS84toUTM_pointarr(epsgcode_utm, [centerLon_wgs84,centerLat_wgs84]);

        //边界体
        _self.removeBoundingShape();
        if(_self.curBoundingRectangle==null){
          _self.curBoundingRectangle=_self.createBoundingRectangle(pick.primitive.modelMatrix,smallestR);
          _self.BoundingShape.push(_self.curBoundingRectangle);
          return;
        }
      }

      let _handler0 = new Cesium.ScreenSpaceEventHandler(_self._viewer.canvas);
      function onDrag(position) {
        if(dragPoint!="") {
          //移动后的模型矩阵
          var t_after = position;// 获取鼠标移动后的点
          if (t_after == undefined) {
              return;
          }

          //
          var sub1 = Cesium.Cartesian3.distance(dragPoint, originPos, new Cesium.Cartesian3());
          var sub2 = Cesium.Cartesian3.distance(t_after, originPos, new Cesium.Cartesian3());
          var scale = sub2/sub1;
          var scaleMatrix = new Cesium.Matrix4(
            scale,0,0,0,
            0,scale,0,0,
            0,0,1,0,
            0,0,0,1
          );
          if(entityType!="circle") {
            //计算多边形缩放后的顶点坐标
            var c_utm = [];
            for (let i = 0; i < coords.length; i++) {

              var p1 = new Cesium.Cartesian3(coords[i][0], coords[i][1], 0);
              Cesium.Cartesian3.subtract(p1, center_utm, p1);
              Cesium.Matrix4.multiplyByPointAsVector(scaleMatrix, p1, p1);
              Cesium.Cartesian3.add(p1, center_utm, p1);
              c_utm.push(p1.x);
              c_utm.push(p1.y);
            }
            //project from utm back to WGS84
            var coords_wgs84_scaled = geoUtils.projtransform_UTMtoWGS84_pointarr(epsgcode_utm, c_utm);
          }
          else {

          }
          //
          //删除增加的图元
          if (_self.PrimitiveArr.length > 0) {
             if (_self._viewer.scene.primitives.contains(primitive_convert)) {
                _self._viewer.scene.primitives.remove(primitive_convert);
              }
          }

          if(entityType=="line"){
            _self.delLineScale(coords_wgs84_scaled);
          }
          else if(entityType=="polygon"){
            _self.delPolygonScale(coords_wgs84_scaled);
          }
          else if(entityType=="rectangle"){
            _self.delRectangleScale(coords_wgs84_scaled);
          }
          else if(entityType=="circle"){
            _self.delCirclecale(boundingCar3_arry,scale);
          }
          else {

          }

          if (_self.curBoundingRectangle != null) {
            let newSmallestR=null;
            if(entityType=="circle"){
              //计算两个点之间的距离，做为半径
              var distance=boundingCar3_arry[boundingCar3_arry.length-1]*scale;
              newSmallestR=Cesium.EllipseGeometry.computeRectangle({ center :boundingCar3_arry[0],
                semiMajorAxis : distance,
                semiMinorAxis : distance});

            }else
            {
               newSmallestR=Cesium.Rectangle.fromCartesianArray(Cesium.Cartesian3.fromDegreesArray(coords_wgs84_scaled));
            }
            _self.delBoundingRectangleScale(Cesium.Matrix4.IDENTITY,newSmallestR);
          }
        }
      }

      function onDragEnd(position) {
        _handler0.destroy();
        _self._viewer.scene.screenSpaceCameraController.enableRotate = true;
      }

      _handler0.setInputAction(function (movement) {
        // console.log("为啥没销毁还执行");
        var cartesian = _self._viewer.scene.globe.pick(_self._viewer.camera.getPickRay(movement.endPosition), _self._viewer.scene);
        if (!Cesium.defined(cartesian)) {
          return;
        }
        if (cartesian) {
          onDrag(cartesian);
        } else {
          onDragEnd(cartesian);
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

      // _handler0.setInputAction(function (movement) {
      //     _self.removeBoundingShape();
      // }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      _handler0.setInputAction(function (movement) {
        //let p=_self._viewer.scene.globe.pick(_self._viewer.camera.getPickRay(movement.position);
        _self.removeBoundingShape();
        onDragEnd(null);
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

      //当按住鼠标左键托动时禁止三维球旋转
      _self._viewer.scene.screenSpaceCameraController.enableRotate = false;

    }
  }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
}

//针对线的缩放
MouseEvent.prototype.delLineScale=function(coords_wgs84_scaled)
{
  var _self=this;
  var shape= _self.drawShape_primitive("line", Cesium.Cartesian3.fromDegreesArray(coords_wgs84_scaled), false);
  primitive_convert=shape;
  _self.PrimitiveArr.push(shape);
}

//针对多边形的缩放
MouseEvent.prototype.delPolygonScale=function(coords_wgs84_scaled)
{
  var _self=this;
  var shape= _self.drawShape_primitive("polygon", Cesium.Cartesian3.fromDegreesArray(coords_wgs84_scaled), false);
  primitive_convert=shape;
  _self.PrimitiveArr.push(shape);
}

//针对矩形的缩放
MouseEvent.prototype.delRectangleScale=function(coords_wgs84_scaled)
{
  var _self=this;
  var coordinates =Cesium.Rectangle.fromCartesianArray(Cesium.Cartesian3.fromDegreesArray(coords_wgs84_scaled))
  var shape= _self.drawShape_primitive("rectangle",coordinates, false);
  primitive_convert=shape;
  _self.PrimitiveArr.push(shape);
}

//针对圆的缩放
MouseEvent.prototype.delCirclecale=function(boundingCar3_arry,scale)
{
  var _self=this;
  //计算两个点之间的距离，做为半径
  _self.activeShapePoints.push(boundingCar3_arry[0]);
  var surfaceDistance=boundingCar3_arry[1]*scale;
  var shape= _self.drawShape_primitive("circle",surfaceDistance);
  primitive_convert=shape;
  _self.PrimitiveArr.push(shape);
  _self.activeShapePoints=[];
}

//针对边界矩形的缩放
MouseEvent.prototype.delBoundingRectangleScale=function(modelMatrix,smallestR)
{
  var _self=this;
  //边界体
  _self.removeBoundingShape();
  if(_self.curBoundingRectangle==null){
    _self.curBoundingRectangle=_self.createBoundingRectangle(modelMatrix,smallestR);
    _self.BoundingShape.push(_self.curBoundingRectangle);
    return;
  }
}

//清除用于旋转、缩放的边界体
MouseEvent.prototype.removeBoundingShape=function(){
  var _self = this;
  for (let i=_self.BoundingShape.length-1;i>-1;i--){
    //清除边界矩形
    let rectangle=_self.BoundingShape[i].rectangle;
    if (_self._viewer.scene.primitives.contains(rectangle)) {
      _self._viewer.scene.primitives.remove(rectangle);
    }

    //清除控制点
    let points=_self.BoundingShape[i].points;
    for(var j=0;j<points.length;j++){
      if (_self._viewer.scene.primitives.contains(points[j])) {
        _self._viewer.scene.primitives.remove(points[j]);
      }
    }

  }
  _self.BoundingShape=[];
  _self.curBoundingRectangle=null;
}

MouseEvent.prototype.ClearShape= function () {//清除实体
  var _self = this;
  _self.clearMouseEvent();

  if (_self.EntityArr.length > 0) {
    _self.EntityArr.forEach(function (o) {
      if (_self._viewer.entities.contains(o)) {
        _self._viewer.entities.remove(o);
      }
    })
  }

  //删除增加的图元
  if (_self.PrimitiveArr.length > 0) {
    _self.PrimitiveArr.forEach(function (o) {
      if (_self._viewer.scene.primitives.contains(o)) {
        _self._viewer.scene.primitives.remove(o);
      }
    })
  }

  //清除控制体
  _self.removeBoundingShape();
}