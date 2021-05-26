import {Vector} from "./Vector";

var Test = {
  project: function(x, y,w,h,_sw,_ne, opt_v) {

    var mercator = new Vector(0, 0);
    var _x = x * 20037508.34 / 180;
    var _y = Math.log(Math.tan((90 + y) * Math.PI / 360)) / (Math.PI / 180);
    _y = _y * 20037508.34 / 180;
    // mercator.x = _x;
    // mercator.y = _y;
    mercator.x = (_x-_sw.x)*w/(_ne.x-_sw.x);
    mercator.y = (_ne.y-_y)*h/(_ne.y-_sw.y);

    return mercator;
  },
  invert: function(x, y, opt_v) {
    var v = opt_v || new Vector();
    v.x = x;
    v.y = y;
    return v;
  }
}
export default Test;
