function WindEvent(map,mapAnimator,display,addImage,ne,sw,leftbottom) {
  this.map = map;
  this.mapAnimator = mapAnimator;
  this.display = display;
  this.addImage = addImage;
  this.ne = ne;
  this.sw = sw;
  this.leftbottom = leftbottom;
  var self = this;
  this.stopDraw = function () {
    self.mapAnimator.addStatus("pan");
    self.clearcanvas(self.display.canvas,self.display.imageCanvas);
  };
  this.startDraw = function() {
    self.addImage(self.display,self.ne,self.sw,self.map,self.leftbottom)
    self.display.makeNewParticles(mapAnimator);
    self.mapAnimator.addStatus("animate");
  };
  this.addEventMapLayer();
}

WindEvent.prototype.clearcanvas =function (canvas,imageCanvas) {
  var g = canvas.getContext('2d');
  var w = canvas.width;
  var h = canvas.height;
  g.clearRect(0, 0, w ,h );
  var gimg = imageCanvas.getContext('2d');
  var wimg = imageCanvas.width;
  var himg = imageCanvas.height;
  gimg.clearRect(0, 0, wimg ,himg );
};

WindEvent.prototype.addEventMapLayer = function () {
  this.map.on('movestart',this.stopDraw);
  this.map.on('mouseup',this.startDraw);
  this.map.on('wheel',this.stopDraw);
  this.map.on('zoomstart',this.stopDraw);
  this.map.on('zoomend',this.startDraw);
};
WindEvent.prototype.removeEventMapLayer = function () {
  this.map.off('movestart',this.stopDraw);
  this.map.off('mouseup',this.startDraw);
  this.map.off('wheel',this.stopDraw);
  this.map.off('zoomstart',this.stopDraw);
  this.map.off('zoomend',this.startDraw);
  this.mapAnimator.setAnimatStatus(true);
};
export {WindEvent}
