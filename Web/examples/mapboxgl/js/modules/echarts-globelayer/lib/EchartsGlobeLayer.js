function EchartsGlobeLayer(globe) {
  const globeContainer = globe.container;
  //this._container = document.createElement('div');
  this._container = document.getElementById("EchartsContainer");
  this._container.style.width = globe.canvas.clientWidth + "px";
  this._container.style.height = globe.canvas.clientHeight + "px";
  this._container.setAttribute('id', 'echarts');
  this._container.setAttribute('class', 'echartGlobe');
  this._globe = globe;
  globeContainer.appendChild(this._container);
  this.chart = echarts.init(this._container);
  echarts.glGlobe = globe;
  echarts.glContainer = this._container;
  this.resize();
}
EchartsGlobeLayer.prototype.remove = function() {
  var _this = this;
  this.chart.clear();
  if (this._container.parentNode)
    this._container.parentNode.removeChild(this._container);
  this._globe = undefined;
};
EchartsGlobeLayer.prototype.resize = function() {
  const _this = this;
  window.onresize = function() {
    _this._container.style.width = _this._globe.canvas.clientWidth + "px";
    _this._container.style.height = _this._globe.canvas.clientHeight + "px";
    _this.chart.resize();
  };
};
module.exports = EchartsGlobeLayer;
