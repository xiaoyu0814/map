function EchartsMapLayer(map) {
  const mapContainer = map.getCanvasContainer();
  this._container = document.createElement('div');
  this._container.style.width = map.getCanvas().style.width;
  this._container.style.height = map.getCanvas().style.height;
  this._container.setAttribute('id', 'echarts');
  this._container.setAttribute('class', 'echartMap');
  this._container.setAttribute('style', 'position:absolute;top:0;bottom:0;');
  this._map = map;
  mapContainer.appendChild(this._container);
  this.chart = echarts.init(this._container);
  echarts.glMap = map;
  this.resize();
}
EchartsMapLayer.prototype.remove = function() {
  var _this = this;
  this._map._listeners.move.forEach(function(element) {
    if (element.name === 'moveHandler') {
      _this._map.off('move', element);
    }
  });
  this._map._listeners.move.forEach(function(element) {
    if (element.name === 'zoomEndHandler') {
      _this._map.off('zoomend', element);
    }
  });
  this.chart.clear();
  if(this._container.parentNode)
  this._container.parentNode.removeChild(this._container);
  this._map = undefined;
};
EchartsMapLayer.prototype.resize = function() {
  const me = this;
  window.onresize = function() {
    me._container.style.width = me._map.getCanvas().style.width;
    me._container.style.height = me._map.getCanvas().style.height;
    me.chart.resize();
  };
};
module.exports = EchartsMapLayer;
