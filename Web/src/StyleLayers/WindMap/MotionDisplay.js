import Test from './Test';
import {Vector} from './Vector'
import Particle from './Particle'
function MotionDisplay(canvas, imageCanvas, field, numParticles,sw,ne, opt_projection) {
  this.canvas = canvas;
  this.projection = Test//opt_projection || IDProjection;
  this.field = field;
  this.numParticles = numParticles;
  this.first = true;
  this.maxLength = field.maxLength;
  this.speedScale = 0.2;
  this.renderState = 'normal';
  this.imageCanvas = imageCanvas;
  this.x0 = this.field.x0;
  this.x1 = this.field.x1;
  this.y0 = this.field.y0;
  this.y1 = this.field.y1;
  this.sw =sw;
  this.ne = ne;
  this.color = false;
  this.colors = [];
  this.rgb = '0, 0, 0'; //��ͼ
  this.background = 'rgb(' + this.rgb + ')';
  this.backgroundAlpha = 'rgba(' + this.rgb + ', 0.01)';
  this.outsideColor = 'rgba(0,255,0,0)';
  for (var i = 0; i < 256; i++) {
    this.colors[i] = 'rgba(' + 255 + ',' + 255 + ',' + 255 +  ')';
  }

  this.lineWidth = 0.15;
  this.globalAlpha = 0.9;
  this.age = 15;
  this.opacity = 1;

  this.colorsCai = [
    'rgb(16,43,233)',
    'rgb(80,167,255)',
    'rgb(124,205,255)',
    'rgb(158,238,255)',
    'rgb(192,251,255)',
    'rgb(255,254,90)',
    'rgb(255,182,0)',
    'rgb(255,96,0)',
    'rgb(239,0,0)',
    'rgb(145,0,0)',
  ]
  this.makeNewParticles(null, true);
  if (this.projection) {
    this.startOffsetX = this.projection.offsetX;
    this.startOffsetY = this.projection.offsetY;
    this.startScale = this.projection.scale;
  }
}
MotionDisplay.prototype.setSwNe = function(sw,ne) {
 this.sw =sw;
 this.ne = ne;
};
MotionDisplay.prototype.setAlpha = function(alpha) {
  this.backgroundAlpha = 'rgba(' + this.rgb + ', ' +0 + ')';
};

MotionDisplay.prototype.makeNewParticles = function(animator) {

  this.particles = [];
  for (var i = 0; i < this.numParticles; i++) {
    this.particles.push(this.makeParticle(animator));
  }
};

MotionDisplay.prototype.makeParticle = function(animator) {
  var dx = animator ? animator.dx : 0;
  var dy = animator ? animator.dy : 0;
  var scale = animator ? animator.scale : 1;
  var safecount = 0;
  for (;;) {
    var a = Math.random();
    var b = Math.random();
    var x = a * this.x0 + (1 - a) * this.x1;
    var y = b * this.y0 + (1 - b) * this.y1;
    var v = this.field.getValue(x, y);
    if (this.field.maxLength == 0) {
      return new Particle(0, 0,x,y, 1 + 40 * Math.random());
    }
    var m = v.length() / this.field.maxLength;
    // The random factor here is designed to ensure that��������������Ϊ��ȷ��
    // more particles are placed in slower areas; this makes the��������ӱ������ڽ���������;��ʹ��
    // overall distribution appear more even.����ֲ������ȡ�
    if ((v.x || v.y) && (++safecount > 10 || Math.random() > m * .9)) {
      /*if((x<boundsLeft.x||x>boundsRight.x)||(y<boundsLeft.y||y>boundsRight.y)){

            }else {

            }*/
      var proj = this.projection.project(x, y,this.canvas.width,this.canvas.height,this.sw,this.ne);//生成散点 这里可以使用投影转化代码。

      var sx = proj.x * scale + dx;
      var sy = proj.y * scale + dy;
      if (++safecount > 10 || !(sx < 0 || sy < 0 || sx > this.canvas.width || sy > this.canvas.height)) {
        //return new Particle(x,y, 1 + 40 * Math.random());
        return new Particle(x,y, this.age);
      }

    }
  }
};


MotionDisplay.prototype.startMove = function(animator) {
  // Save screen.
  this.imageCanvas.getContext('2d').drawImage(this.canvas, 0, 0);
};


MotionDisplay.prototype.endMove  = function(animator) {
  if (animator.scale < 1.1) {
    this.x0 = this.field.x0;
    this.x1 = this.field.x1;
    this.y0 = this.field.y0;
    this.y1 = this.field.y1;
  } else {
    // get new bounds for making new particles.
    //var p = this.projection;
    var self = this;
    // function invert(x, y) {
    //   x = (x - animator.dx) / animator.scale;
    //   y = (y - animator.dy) / animator.scale;
    //   return self.projection.invert(x, y);
    // }
    var loc = self.invert1(0, 0);
    var x0 = loc.x;
    var x1 = loc.x;
    var y0 = loc.y;
    var y1 = loc.y;
    // function expand(x, y) {
    //   var v = invert(x, y);
    //   x0 = Math.min(v.x, x0);
    //   x1 = Math.max(v.x, x1);
    //   y0 = Math.min(v.y, y0);
    //   y1 = Math.max(v.y, y1);
    // }

    // This calculation with "top" is designed to fix a bug
    // where we were missing particles at the top of the
    // screen with north winds. This is a short-term fix,
    // it's dependent on the particular projection and
    // region, and we should figure out a more general
    // solution soon.
    var top = -.2 * this.canvas.height;
    var temp1 = self.expand1(top, this.canvas.height,x0,x1,y0,y1);
    var temp2 = self.expand1(this.canvas.width, top,temp1[0],temp1[1],temp1[2],temp1[3]);
    var temp3 = self.expand1(this.canvas.width, this.canvas.height, temp2[0], temp2[1], temp2[2], temp2[3]);
    this.x0 = Math.max(this.field.x0, temp3[0]);
    this.x1 = Math.min(this.field.x1, temp3[1]);
    this.y0 = Math.max(this.field.y0, temp3[2]);
    this.y1 = Math.min(this.field.y1, temp3[3]);
  }
  var tick = 0;
  this.makeNewParticles(animator);
};
MotionDisplay.prototype.invert1 = function(x,y) {
    x = (x - animator.dx) / animator.scale;
    y = (y - animator.dy) / animator.scale;
    return self.projection.invert(x, y);
}
MotionDisplay.prototype.expand1 = function(x,y,x0,x1,y0,y1) {
  var v = this.invert1(x, y);
  x0 = Math.min(v.x, x0);
  x1 = Math.max(v.x, x1);
  y0 = Math.min(v.y, y0);
  y1 = Math.max(v.y, y1);
  return [x0,x1,y0,y1]
}
MotionDisplay.prototype.animate = function(animator) {

 // var mySource = map.map.getSource("mapdata");
  //if(mySource){

    this.moveThings(animator);
    this.draw(animator);
    //addImage(this.canvas,this.imageCanvas);
 // }


};
MotionDisplay.prototype.setColor = function(color) {
  this.color = color;
  if(color){
    var values = Math.floor(this.maxLength/10);
    var temp={
      colors:this.colorsCai,
      value:values
    }
    tuli(temp);
  }else{
    var old = document.getElementById("tytuli");
    if (old) document.body.removeChild(old);
  }
};

MotionDisplay.prototype.move = function(animator) {
  var w = this.canvas.width;
  var h = this.canvas.height;
  var g = this.canvas.getContext('2d');

  g.fillStyle = this.outsideColor;
  var dx = animator.dx;
  var dy = animator.dy;
  var scale = animator.scale;

  g.fillRect(0, 0, w, h);
  g.fillStyle =  'rgba(0, 0, 0, 0.1)';
  //g.fillStyle =  'rgba(0, 0, 0, 0.02)';
  g.fillRect(dx, dy, w * scale, h * scale);
  var z = animator.relativeZoom();
  var dx = animator.dx - z * animator.dxStart;
  var dy = animator.dy - z * animator.dyStart;
  g.drawImage(this.imageCanvas, dx, dy, z * w, z * h);

};


MotionDisplay.prototype.moveThings = function(animator) {

  var speed = .05 * this.speedScale / animator.scale;
  for (var i = 0; i < this.particles.length; i++) {
    var p = this.particles[i];
    if (p.age > 0 && this.field.inBounds(p.x, p.y)) {
      var a = this.field.getValue(p.x, p.y);
      var wspeed = Math.sqrt(a.x*a.x+a.y*a.y);
      p.x +=  speed * a.x;
      p.y +=  speed * a.y;
     
      // var r = wspeed/15.0 * 255;
      // var g = (1-wspeed/15.0)* 255;
      // var b = 125;
      if(this.color){
        var c = Math.floor((wspeed/this.maxLength)*10);

        p.color = this.colorsCai[c];
      }
      p.age--;
    } else {
      this.particles[i] = this.makeParticle(animator);
    }
  }
};
MotionDisplay.prototype.setGlobalAlpha = function(num){
  this.globalAlpha = num;
}
MotionDisplay.prototype.setLineWidth = function(num){
  this.lineWidth = num;
}
MotionDisplay.prototype.setOpacity = function(num){
  this.opacity = num;
}
MotionDisplay.prototype.setAge = function(num){
    this.age = num;
   this.makeNewParticles(null,true);
}
MotionDisplay.prototype.setSpeedScale = function(num){
    this.speedScale = num;
   this.makeNewParticles(null,true);
}
MotionDisplay.prototype.setNumParticles = function(num) { 
  this.numParticles = num;
  this.makeNewParticles(null,true);
};
///�����ߵĺ���
MotionDisplay.prototype.draw = function(animator) {
  var g = this.canvas.getContext('2d');
  var w = this.canvas.width;
  var h = this.canvas.height;
  //console.log(w+","+h);
  var dx = animator.dx;
  var dy = animator.dy;
  var scale = animator.scale;
  if (this.first) {
    g.fillStyle =  'rgba(255,255, 255, 0.08)';
    g.fillRect(dx, dy, w * scale,h * scale);
    this.first = false;
  } else {

    addims(this.canvas,this.imageCanvas,this.globalAlpha);
    g.drawImage(this.imageCanvas,0,0);
  }
  // var dx = animator.dx;
  // var dy = animator.dy;
  // var scale = animator.scale;

  var proj = new Vector(0, 0);
  var val = new Vector(0, 0);
  for (var i = 0; i < this.particles.length; i++) {
    var p = this.particles[i];
    if (!this.field.inBounds(p.x, p.y)) {
      p.age = -2;

      continue;
    }
    //console.log(p);
    proj = Test.project(p.x,p.y,w,h,this.sw,this.ne) ;
    /*	proj = projto(p.x,p.y);
          proj.x = (proj.x-_sw.x)*w/(_ne.x-_sw.x);
          proj.y = (_ne.y-proj.y)*h/(_ne.y-_sw.y);*/
    if (proj.x < 0 || proj.y < 0 || proj.x > w || proj.y > h) {
      p.age = -2;

    }
    if (p.oldX != -1) {
      var wind = this.field.getValue(p.x, p.y, val);
      var s = wind.length()/ this.maxLength;
      var c = 150+Math.round(350 * s); // was 400
      if (c > 255) {
        c = 255;
      }
      //g.strokeStyle = 'rgba(255,255,255,1)';
      if(this.color) {
        g.strokeStyle = p.color
      }
      else {
        //g.strokeStyle = this.colors[c];

        g.strokeStyle = 'rgba(255,255,255,'+ this.opacity +')';
      }
      p.age --;
      g.beginPath();
      g.lineWidth = this.lineWidth + (this.age-p.age)*0.05;
      g.moveTo(p.oldX,  p.oldY);
      g.lineTo(proj.x,proj.y);
      g.stroke();
    }
    p.oldX = proj.x;
    p.oldY = proj.y;
  }
};
function addims(canvas,imagecanvas,globalAlpha) {
  var g = imagecanvas.getContext('2d');
  var w = imagecanvas.width;
  var h = imagecanvas.height;
  g.globalAlpha = globalAlpha;
  g.fillStyle = 'rgba(0, 0, 0, 0)';
  g.clearRect(0, 0, w, h);
  //g.fillRect(0, 0, w, h);
  //g.beginPath();
  g.drawImage(canvas,0,0);
  canvas.getContext('2d').clearRect(0, 0, w, h);
  //g.closePath();

}

function tuli(data) {
    var old = document.getElementById("tytuli");
    if (old) document.body.removeChild(old);
    var dom = document.createElement("div");
    dom.className = "tytuli";
    dom.id = "tytuli";
    document.body.appendChild(dom);
    var id = $('#tytuli');
    console.log(id);
    id.append('<div id=defaultTu ></div>');
    var obox = $('#defaultTu ')
    obox.append('<div class="tytuli_top">图例<hr/></div>');

    for (var i = 0; i < data.colors.length; i++) {

      obox.append('<div class="tytuli_left"><p class="tytuli_color" style="background:' + data.colors[i] +
        '"></p></div>');
      obox.append('<div class="tytuli_right"><p class="tytuli_text">' + (i* data.value)+ 'm/s'+'</p></div>');
    }

}
export {MotionDisplay}
