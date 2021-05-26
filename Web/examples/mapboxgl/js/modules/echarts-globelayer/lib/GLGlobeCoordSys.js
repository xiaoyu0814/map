define(function (require) {
  var echarts = require('echarts')

  function GLGlobeCoordSys (GLGlobe, api) {
    this._GLGlobe = GLGlobe
    this.dimensions = ['lng', 'lat']
    this._mapOffset = [0, 0]

    this._api = api
  }

  GLGlobeCoordSys.prototype.dimensions = ['lng', 'lat']

  GLGlobeCoordSys.prototype.setMapOffset = function (mapOffset) {
    this._mapOffset = mapOffset
  }

  GLGlobeCoordSys.prototype.getBMap = function () {
    return this._GLGlobe
  }

  GLGlobeCoordSys.prototype.dataToPoint = function (data) {
    var position = Cesium.Cartesian3.fromDegrees(data[0], data[1]);
    var cameraPosition = this._GLGlobe.scene.camera.positionWC;
    var dot = Cesium.Cartesian3.dot(Cesium.Cartesian3.subtract(cameraPosition, position, new Cesium.Cartesian3()), position);
    if (dot > 0.0) {
      var px = Cesium.SceneTransforms.wgs84ToWindowCoordinates(this._GLGlobe.scene, position);
      var mapOffset = this._mapOffset
      return [px.x - mapOffset[0], px.y - mapOffset[1]]
    }
    return [1e308, 1e308];
  }

  GLGlobeCoordSys.prototype.pointToData = function (pt) {
    var mapOffset = this._mapOffset
    var worldSpace  = this._GLGlobe.scene.camera.pickEllipsoid(new Cesium.Cartesian2(pt[0] + mapOffset[0], pt[1] + mapOffset[1]), this._GLGlobe.scene.globe.ellipsoid);
    var geographySpace = this._GLGlobe.scene.globe.ellipsoid.cartesianToCartographic(worldSpace);
    var pt = [geographySpace.x + mapOffset[0], geographySpace.y + mapOffset[1]];
    return pt
  }

  GLGlobeCoordSys.prototype.getViewRect = function () {
    var api = this._api
    return new echarts.graphic.BoundingRect(0, 0, api.getWidth(), api.getHeight())
  }

  GLGlobeCoordSys.prototype.getRoamTransform = function () {
    return echarts.matrix.create()
  }


  // For deciding which dimensions to use when creating list data
  GLGlobeCoordSys.dimensions = GLGlobeCoordSys.prototype.dimensions

  GLGlobeCoordSys.create = function (ecModel, api) {
    var coordSys;

    ecModel.eachComponent('GLGlobe', function (GLGlobeModel) {
      var viewportRoot = api.getZr().painter.getViewportRoot()
      var glGlobe = echarts.glGlobe;
      coordSys = new GLGlobeCoordSys(glGlobe, api)
      coordSys.setMapOffset(GLGlobeModel.__mapOffset || [0, 0])
      GLGlobeModel.coordinateSystem = coordSys
    })

    ecModel.eachSeries(function (seriesModel) {
      if (seriesModel.get('coordinateSystem') === 'GLGlobe') {
        seriesModel.coordinateSystem = coordSys
      }
    })
  }

  return GLGlobeCoordSys
})
