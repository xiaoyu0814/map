/**
 * GLMap component extension
 */
define(function (require) {
  require('echarts').registerCoordinateSystem(
    'GLGlobe', require('./GLGlobeCoordSys')
  )
  require('./GLGlobeModel')
  require('./GLGlobeView')

  // Action
  require('echarts').registerAction({
    type: 'GLGlobeRoam',
    event: 'GLGlobeRoam',
    update: 'updateLayout'
  }, function (payload, ecModel) {})

  return {
    version: '1.0.0'
  }
})


