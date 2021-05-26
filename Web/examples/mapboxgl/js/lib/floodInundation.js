var floodHelper = function (options) {
  this._viewer = options.viewer
  this._scene = this._viewer.scene
  this._handler = options.handler
  this._options = options
  this.extrudedHeight = 0.0// 河流的初始水位
  this.floodTimer = null// 计时器
  this.floodEntity = null// 河流实体
  this.riverPoints = []//
  this.mytest = []
  this.AllEnities = []
}

// 绘制河流多边形
floodHelper.prototype.drawPolygon = function () {
  var _self = this
  $('body').addClass('measureCur')
  // 清除鼠标左键事件
  _self.clearMouseEvent()

  var isDraw = false
  var polygonPath = []
  var polygon = null
  _self._handler.setInputAction(function (movement) {
    // 新增部分
    var position1
    var cartographic
    var ray = _self._viewer.scene.camera.getPickRay(movement.endPosition)
    if (ray) { position1 = _self._viewer.scene.globe.pick(ray, _self._viewer.scene) }
    if (position1) { cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position1) }
    if (cartographic) {
      // 海拔
      var height = _self._viewer.scene.globe.getHeight(cartographic)
      var point = Cesium.Cartesian3.fromDegrees(cartographic.longitude / Math.PI * 180, cartographic.latitude / Math.PI * 180, height)
      if (isDraw) {
        if (polygonPath.length < 2) {
          return
        }
        if (!Cesium.defined(polygon)) {
          polygonPath.push(point)
          polygon = new CreatePolygon(polygonPath, Cesium)
          _self.AllEnities.push(polygon)
        } else {
          polygon.path.pop()
          polygon.path.push(point)
          _self.AllEnities.push(polygon)
        }
      }
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
  _self._handler.setInputAction(function (movement) {
    isDraw = true
    // 新增部分
    var position1
    var cartographic
    var ray = _self._viewer.scene.camera.getPickRay(movement.position)
    if (ray) { position1 = _self._viewer.scene.globe.pick(ray, _self._viewer.scene) }
    if (position1) { cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position1) }
    if (cartographic) {
      // 海拔
      var height = _self._viewer.scene.globe.getHeight(cartographic)
      var point = Cesium.Cartesian3.fromDegrees(cartographic.longitude / Math.PI * 180, cartographic.latitude / Math.PI * 180, height)
      if (isDraw) {
        polygonPath.push(point)
        _self.riverPoints.push(point)
        _self.mytest.push(cartographic)
        var tmep = _self._viewer.entities.add({
          name: 'point',
          position: point,
          point: {
            show: true,
            color: Cesium.Color.YELLOW,
            pixelSize: 3,
            outlineColor: Cesium.Color.YELLOW,
            outlineWidth: 1
          }
        })

        _self.AllEnities.push(tmep)
      }
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

  _self._handler.setInputAction(function (movement) {
    // 取消鼠标样式
    $('body').removeClass('measureCur')
    _self.clearMouseEvent()

    if (polygonPath.length >= 2) {
      var lastpoint = _self._viewer.entities.add({
        name: 'point',
        position: polygon.path[polygon.path.length - 1],
        point: {
          pixelSize: 3,
          color: Cesium.Color.YELLOW,
          outlineColor: Cesium.Color.YELLOW,
          outlineWidth: 1,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
        }
      })

      _self.AllEnities.push(lastpoint)
      // 重新取下当前点
      _self.riverPoints.push(polygon.path[polygon.path.length - 1])
      _self.mytest.push(polygon.path[polygon.path.length - 1])
    }
    _self._viewer.trackedEntity = undefined
    isDraw = false
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
  // 创建多边形
  // noinspection ES6ConvertVarToLetConst
  var CreatePolygon = (function () {
    function _ (positions, cesium) {
      this.options = {
        polygon: {
          hierarchy: new Cesium.CallbackProperty(function () {
            return new Cesium.PolygonHierarchy(positions)
          }, false),
          material: Cesium.Color.CYAN.withAlpha(0.2)
        }
      }
      this.path = positions
      this.hierarchy = positions
      var oo = _self._viewer.entities.add(this.options)
      _self.AllEnities.push(oo)
    }

    return _
  })()
}

// 开始模拟
floodHelper.prototype.startFlood = function (options) {
  var _self = this
  var _options = options
  _self.extrudedHeight = _options.height_min
  // 增加河流的实体
  if (_self.floodEntity == null && _self.riverPoints.length>0) {
    _self.floodEntity = _self._viewer.entities.add({
      name: 'river_CallBack_Polygon',
      polygon: {
        hierarchy: _self.riverPoints,
        material: Cesium.Color.BLUE.withAlpha(0.5),
        perPositionHeight: false,
        // heightReference : Cesium.HeightReference.RELATIVE_TO_GROUND,//默认是HeightReference.NONE，绝对高度
        // extrudedHeightReference : Cesium.HeightReference.CLAMP_TO_GROUND,//默认是HeightReference.NONE，绝对高度
        extrudedHeight: new Cesium.CallbackProperty(function () {
          return _self.extrudedHeight
        }, false)
      }
    })
    _self.AllEnities.push(_self.floodEntity)
  }
  //先清除一下计时器
  clearInterval(_self.floodTimer)

  _self.floodTimer = setInterval(function () {
    if (_options.height_max > _self.extrudedHeight) {
      _self.extrudedHeight = parseFloat(_self.extrudedHeight) + parseFloat(_options.step)
    } else {
      clearInterval(_self.floodTimer)
    }
  }, _options.speed * 1000)
},
floodHelper.prototype.FSWaterFace=function() {
      return 'varying vec3 v_positionMC;\n\
varying vec3 v_positionEC;\n\
varying vec2 v_st;\n\
\n\
void main()\n\
{\n\
    czm_materialInput materialInput;\n\
    vec3 normalEC = normalize(czm_normal3D * czm_geodeticSurfaceNormal(v_positionMC, vec3(0.0), vec3(1.0)));\n\
#ifdef FACE_FORWARD\n\
    normalEC = faceforward(normalEC, vec3(0.0, 0.0, 1.0), -normalEC);\n\
#endif\n\
    materialInput.s = v_st.s;\n\
    materialInput.st = v_st;\n\
    materialInput.str = vec3(v_st, 0.0);\n\
    materialInput.normalEC = normalEC;\n\
    materialInput.tangentToEyeMatrix = czm_eastNorthUpToEyeCoordinates(v_positionMC, materialInput.normalEC);\n\
    vec3 positionToEyeEC = -v_positionEC;\n\
    materialInput.positionToEyeEC = positionToEyeEC;\n\
    czm_material material = czm_getMaterial(materialInput);\n\
#ifdef FLAT\n\
    gl_FragColor = vec4(material.diffuse + material.emission, material.alpha);\n\
#else\n\
    gl_FragColor = czm_phong(normalize(positionToEyeEC), material);\n\
    gl_FragColor.a = 0.5;\n\
#endif\n\
}\n\
';
},

// 清除鼠标事件
floodHelper.prototype.clearMouseEvent = function () {
  var _self = this
  _self._handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
  _self._handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE)
  _self._handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK)
}

// 清除所有的监听事件，及样式，相关增加的点线面
floodHelper.prototype.clearAll = function () {
  var _self = this
  // 取消鼠标样式
  $('body').removeClass('measureCur')
  _self.clearMouseEvent()

  // 清除计时器
  if (_self.floodTimer) {
    clearInterval(_self.floodTimer)
  }
  // 清除因此次模拟增加的实体
  _self.floodEntity = null
  _self.AllEnities.forEach(function (entity) {
    if (_self._viewer.entities.contains(entity)) {
      _self._viewer.entities.remove(entity)
    }
  })

  // 清除数据
  _self.riverPoints = []//
  _self.AllEnities = []
  _self.extrudedHeight = 0
  _self._viewer.skyAtmosphere = true
}

// 拾取位置
floodHelper.prototype.pickUp = function () { // 拾取位置
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
floodHelper.prototype.flyTo = function (destination, head, pitch, roll, duration, call) {
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
