define(function (require) {
  return require('echarts').extendComponentView({
    type: 'GLGlobe',

    render: function (GLGlobeModel, ecModel, api) {
      var rendering = true

      var glGlobe = echarts.glGlobe
      var glContainer = echarts.glContainer;
      var viewportRoot = api.getZr().painter.getViewportRoot()
      var coordSys = GLGlobeModel.coordinateSystem
      var moveHandler = function (type, target) {
        if (rendering) {
          return
        }
        var offsetEl = glContainer;

        var mapOffset = [
          -parseInt(offsetEl.style.left, 10) || 0,
          -parseInt(offsetEl.style.top, 10) || 0
        ]
        viewportRoot.style.left = mapOffset[0] + 'px'
        viewportRoot.style.top = mapOffset[1] + 'px'

        coordSys.setMapOffset(mapOffset)
        GLGlobeModel.__mapOffset = mapOffset

        api.dispatchAction({
          type: 'GLGlobeRoam'
        })
      }

      function zoomEndHandler () {
        if (rendering) {
          return
        }
        api.dispatchAction({
          type: 'GLGlobeRoam'
        })
      }

      glGlobe.scene.postRender.removeEventListener(moveHandler);
      glGlobe.scene.postRender.addEventListener(moveHandler);

      //glGlobe.scene.camera.changed.removeEventListener(moveHandler);
      //glGlobe.scene.camera.changed.addEventListener(moveHandler);

      this._oldMoveHandler = moveHandler
      this._oldZoomEndHandler = zoomEndHandler

      var roam = GLGlobeModel.get('roam')
      if (roam && roam !== 'scale') {
        // todo 允许拖拽
      }else {
        // todo 不允许拖拽
      }
      if (roam && roam !== 'move') {
        // todo 允许移动
      }else {
        // todo 不允许允许移动
      }

      rendering = false
    }
  })
})
