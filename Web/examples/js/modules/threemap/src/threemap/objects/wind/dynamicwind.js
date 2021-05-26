import {Vector2} from "../../core/vector2.js";
import {Size} from "../../core/size.js";
import {Bounds} from "../../core/bounds.js";
import {TileCoordSys} from "../../core/tilecoordsys.js";
import {windData} from "./winddata.js";

var Vector = function(x, y) {
    this.x = x;
    this.y = y;
}

Vector.polar = function(r, theta) {
    return new Vector(r * Math.cos(theta), r * Math.sin(theta));
};

Vector.prototype.length = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
};

Vector.prototype.copy = function() {
    return new Vector(this.x, this.y);
};

Vector.prototype.setLength = function(length) {
    var current = this.length();
    if (current) {
        var scale = length / current;
        this.x *= scale;
        this.y *= scale;
    }
    return this;
};

Vector.prototype.setAngle = function(theta) {
    var r = length();
    this.x = r * Math.cos(theta);
    this.y = r * Math.sin(theta);
    return this;
};

Vector.prototype.getAngle = function() {
    return Math.atan2(this.y, this.x);
};

Vector.prototype.d = function(v) {
    var dx = v.x - this.x;
    var dy = v.y - this.y;
    return Math.sqrt(dx * dx + dy * dy);
};


var VectorField = function(field, x0, y0, x1, y1) {
    this.x0 = x0;
    this.x1 = x1;
    this.y0 = y0;
    this.y1 = y1;
    this.field = field;
    this.w = field.length;
    this.h = field[0].length;
    this.maxLength = 0;
    var mx = 0;
    var my = 0;
    for (var i = 0; i < this.w; i++) {
        for (var j = 0; j < this.h; j++) {
            if (field[i][j].length() > this.maxLength) {
                mx = i;
                my = j;
            }
            this.maxLength = Math.max(this.maxLength, field[i][j].length());
        }
    }
    mx = (mx / this.w) * (x1 - x0) + x0;
    my = (my / this.h) * (y1 - y0) + y0;
};

VectorField.read = function(data, correctForSphere) {
    var field = [];
    var w = data.gridWidth;
    var h = data.gridHeight;
    var n = 2 * w * h;
    var i = 0;
    // OK, "total" and "weight"
    // are kludges that you should totally ignore,
    // unless you are interested in the average
    // vector length on vector field over lat/lon domain.
    var total = 0;
    var weight = 0;
    for (var x = 0; x < w; x++) {
        field[x] = [];
        for (var y = 0; y < h; y++) {
            var vx = data.field[i++];
            var vy = data.field[i++];
            var v = new Vector(vx, vy);
            // Uncomment to test a constant field:
            // v = new Vector(10, 0);
            if (correctForSphere) {
                var ux = x / (w - 1);
                var uy = y / (h - 1);
                var lon = data.x0 * (1 - ux) + data.x1 * ux;
                var lat = data.y0 * (1 - uy) + data.y1 * uy;
                var m = Math.PI * lat / 180;
                var length = v.length();
                if (length) {
                    total += length * m;
                    weight += m;
                }
                v.x /= Math.cos(m);
                v.setLength(length);
            }
            field[x][y] = v;
        }
    }
    var result = new VectorField(field, data.x0, data.y0, data.x1, data.y1);
    if (total && weight) {
        result.averageLength = total / weight;
    }
    return result;
};

VectorField.prototype.inBounds = function(x, y) {
    return x >= this.x0 && x < this.x1 && y >= this.y0 && y < this.y1;
};

VectorField.prototype.bilinear = function(coord, a, b) {
    var na = Math.floor(a);
    var nb = Math.floor(b);
    var ma = Math.ceil(a);
    var mb = Math.ceil(b);
    var fa = a - na;
    var fb = b - nb;

    return this.field[na][nb][coord] * (1 - fa) * (1 - fb) +
        this.field[ma][nb][coord] * fa * (1 - fb) +
        this.field[na][mb][coord] * (1 - fa) * fb +
        this.field[ma][mb][coord] * fa * fb;
};

VectorField.prototype.getValue = function(x, y, opt_result) {
    var a = (this.w - 1 - 1e-6) * (x - this.x0) / (this.x1 - this.x0);
    var b = (this.h - 1 - 1e-6) * (y - this.y0) / (this.y1 - this.y0);
    var vx = this.bilinear('x', a, b);
    var vy = this.bilinear('y', a, b);
    if (opt_result) {
        opt_result.x = vx;
        opt_result.y = vy;
        return opt_result;
    }
    return new Vector(vx, vy);
};

VectorField.prototype.vectValue = function(vector) {
    return this.getValue(vector.x, vector.y);
};

VectorField.constant = function(dx, dy, x0, y0, x1, y1) {
    var field = new VectorField([[]], x0, y0, x1, y1);
    field.maxLength = Math.sqrt(dx * dx + dy * dy);
    field.getValue = function() {
        return new Vector(dx, dy);
    }
    return field;
};


var Particle = function(x, y, age) {
    this.x = x;
    this.y = y;
    this.oldX = -1;
    this.oldY = -1;
    this.age = age;
    this.rnd = Math.random();
};


function DynamicWind(threemap) {
    Three.Group.call(this);

	this.map = threemap.map;
    this.threemap = threemap;
    this.source = null;

    this.coordSys = new TileCoordSys();

    this.screenMaterial = new Three.MeshBasicMaterial({color: 0xffffff, opacity: 1.0, transparent: true, side: Three.DoubleSide});

    this.cacheCanvas = document.createElement('canvas');
    this.cacheContext = this.cacheCanvas.getContext('2d', {alpha: true});
    this.cacheTexture = new Three.CanvasTexture(this.cacheCanvas);
    this.cacheTexture.magFilter = Three.NearestFilter;
    this.cacheTexture.minFilter = Three.NearestFilter;
    this.screenCanvas = document.createElement('canvas');
    this.screenContext = this.screenCanvas.getContext('2d', {alpha: true});
    this.screenTexture = new Three.CanvasTexture(this.screenCanvas);
    this.screenTexture.magFilter = Three.NearestFilter;
    this.screenTexture.minFilter = Three.NearestFilter;

    this.preZoom = -1;
    this.preBounds = null;
    this.preGroup = null;

    this.enable3D = false;
    this.speedScale = 1;
    this.numParticles = 3000;
    this.colorScale = 1000;
    this.field = VectorField.read(windData, true);
    this.x0 = this.field.x0;
    this.x1 = this.field.x1;
    this.y0 = this.field.y0;
    this.y1 = this.field.y1;

    this.colors = [];
    for (var i = 0; i < 256; i++) {
        this.colors[i] = 'rgb(' + i + ',' + (255 - i) + ',' + 0 + ')';
    }

    var _this = this;
    this.map.on('moveend', function() {
        _this.updateWind();
    });
    this.map.on('zoomend', function() {
        _this.updateWind();
    });
}

DynamicWind.prototype = Object.assign(Object.create(Three.Group.prototype),{
    constructor: "DynamicWind",

});

DynamicWind.prototype.setDatasource = function(url) {

};

DynamicWind.prototype.makeNewParticles = function() {
    this.particles = [];
    for (var i = 0; i < this.numParticles; i++) {
        this.particles.push(this.makeParticle());
    }
};

DynamicWind.prototype.makeParticle = function() {
    var safecount = 0;
    for ( ; ; ) {
        var a = Math.random();
        var b = Math.random();
        var x = a * this.x0 + (1 - a) * this.x1;
        var y = b * this.y0 + (1 - b) * this.y1;
        var v = this.field.getValue(x, y);
        if (this.field.maxLength == 0) {
            return new Particle(x, y, 1 + 40 * Math.random());
        }
        var m = v.length() / this.field.maxLength;
        if ((v.x || v.y) && (++safecount > 10 || Math.random() > m * .9)) {
            var p = new Vector(x, y);
            this.coordSys.geoToWorld(p);
            this.worldToScreen(p);
            if (++safecount > 10 || this.isPointInScreen(p)) {
                return new Particle(x, y, 1 + 40 * Math.random());
            }
        }
    }
};

DynamicWind.prototype.moveThings = function(scale) {
    var speed = 0.01 * this.speedScale / scale;
    for (var i = 0; i < this.particles.length; i++) {
        var p = this.particles[i];
        if (p.age > 0 && this.field.inBounds(p.x, p.y)) {
            var a = this.field.getValue(p.x, p.y);
            p.x += speed * a.x;
            p.y += speed * a.y;
            p.age--;
        } else {
            this.particles[i] = this.makeParticle();
        }
    }
};

DynamicWind.prototype.drawParticles = function() {
    var g = this.screenContext;
    var w = this.screenCanvas.width;
    var h = this.screenCanvas.height;

    var prev = g.globalCompositeOperation;
    g.globalCompositeOperation = "destination-in";
    g.fillStyle = 'rgba(0, 0, 0, 0.95)';
    g.fillRect(0, 0, w, h);
    g.globalCompositeOperation = prev;

    var val = new Vector(0, 0);
    g.lineWidth = 1.0;
    for (var i = 0; i < this.particles.length; i++) {
        var p = this.particles[i];
        if (!this.field.inBounds(p.x, p.y)) {
            p.age = -2;
            continue;
        }
        var proj = new Vector(p.x, p.y);
        this.coordSys.geoToWorld(proj);
        this.worldToScreen(proj);
        if (!this.isPointInScreen(proj)) {
            p.age = -2;
        }
        if (p.oldX != -1) {
            var wind = this.field.getValue(p.x, p.y, val);
            var s = wind.length() / this.field.maxLength;
            var c = Math.round(this.colorScale * s);
            if (c > 255) {
                c = 255;
            }
            g.strokeStyle = this.colors[c];
            //g.strokeStyle = 'rgba(0, 255, 0, 1.0)';
            g.beginPath();
            g.moveTo(proj.x, proj.y);
            g.lineTo(p.oldX, p.oldY);
            g.stroke();
        }
        p.oldX = proj.x;
        p.oldY = proj.y;
    }
};

DynamicWind.prototype.worldToScreen = function(p) {
    var mapWidth = this.preBounds.getWidth();
    var mapHeight = this.preBounds.getHeight();
    var canvasWidth = this.screenCanvas.width;
    var canvasHeight = this.screenCanvas.height;
    p.x = (p.x - this.preBounds.left) * (canvasWidth / mapWidth);
    p.y = (this.preBounds.top - p.y) * (canvasHeight / mapHeight);
    return p;
};

DynamicWind.prototype.isPointInScreen = function(p) {
    return !(p.x < 0 || p.y < 0 || p.x > this.screenCanvas.width || p.y > this.screenCanvas.height);
};

DynamicWind.prototype.getRenderBounds = function(zoom, bounds) {

    var points = [];
    var array = bounds.toArray();
    for (var i = 0; i < array.length; i++) {
        var point = this.threemap.projectToWorld([array[i][0], array[i][1], 0]);
        points.push(point);
    }

    var renderBounds = new Bounds();
    for (var i = 0; i < points.length; i++) {
        var point = new Vector2(points[i].x, points[i].y);
        if (i == 0) {
            renderBounds.left = point.x;
            renderBounds.right = point.x;
            renderBounds.top = point.y;
            renderBounds.bottom = point.y;
        } else {
            renderBounds.unionPoint(point);
        }
    }

    return renderBounds;
};

DynamicWind.prototype.getCanvasBounds = function(zoom, bounds) {
    var canvasBounds = null;
    var tileArea = this.coordSys.computeTileRange(zoom, bounds);
    for (var row = tileArea.startRow; row <= tileArea.endRow; row++) {
        for (var col = tileArea.startCol; col <= tileArea.endCol; col++) {
            var tileBounds = this.coordSys.computeTileBounds(zoom, row, col);
            if (canvasBounds == null) {
                canvasBounds = tileBounds;
            } else {
                canvasBounds.unionBounds(tileBounds);
            }
        }
    }
    return canvasBounds;
};

DynamicWind.prototype.getCanvasSize = function(zoom, bounds, scale) {
    var tileArea = this.coordSys.computeTileRange(zoom, bounds);
    return new Size((tileArea.endCol - tileArea.startCol + 1) * 512 * scale, (tileArea.endRow - tileArea.startRow + 1) * 512 * scale);
};

DynamicWind.prototype.createScreenGeometry = function(bounds) {
    var indices = new Uint16Array(6);
    var vertices = new Float32Array(4 * 3);
    var normals = new Float32Array(4 * 3);
    var uvs = new Float32Array(4 * 2);

    vertices[0 * 3 + 0] = bounds.left;
    vertices[0 * 3 + 1] = bounds.top;
    vertices[0 * 3 + 2] = 0;
    normals[0 * 3 + 0] = 0;
    normals[0 * 3 + 1] = 0;
    normals[0 * 3 + 2] = 1;
    uvs[0 * 2 + 0] = 0;
    uvs[0 * 2 + 1] = 1;

    vertices[1 * 3 + 0] = bounds.right;
    vertices[1 * 3 + 1] = bounds.top;
    vertices[1 * 3 + 2] = 0;
    normals[1 * 3 + 0] = 0;
    normals[1 * 3 + 1] = 0;
    normals[1 * 3 + 2] = 1;
    uvs[1 * 2 + 0] = 1;
    uvs[1 * 2 + 1] = 1;

    vertices[2 * 3 + 0] = bounds.right;
    vertices[2 * 3 + 1] = bounds.bottom;
    vertices[2 * 3 + 2] = 0;
    normals[2 * 3 + 0] = 0;
    normals[2 * 3 + 1] = 0;
    normals[2 * 3 + 2] = 1;
    uvs[2 * 2 + 0] = 1;
    uvs[2 * 2 + 1] = 0;

    vertices[3 * 3 + 0] = bounds.left;
    vertices[3 * 3 + 1] = bounds.bottom;
    vertices[3 * 3 + 2] = 0;
    normals[3 * 3 + 0] = 0;
    normals[3 * 3 + 1] = 0;
    normals[3 * 3 + 2] = 1;
    uvs[3 * 2 + 0] = 0;
    uvs[3 * 2 + 1] = 0;

    indices[0] = 0;
    indices[1] = 1;
    indices[2] = 2;
    indices[3] = 0;
    indices[4] = 2;
    indices[5] = 3;

    var geometry = new Three.BufferGeometry();
    geometry.addAttribute('position', new Three.Float32BufferAttribute(vertices, 3));
    geometry.addAttribute('normal', new Three.Float32BufferAttribute(normals, 3));
    geometry.addAttribute('uv', new Three.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(new Three.Uint16BufferAttribute(indices, 1));
    geometry.boundingSphere = new Three.Sphere(new Three.Vector3(0, 0, 0), 512);

    return geometry;
};

DynamicWind.prototype.updateWind = function() {
    var zoom = this.map.transform.zoom;
    var bounds = this.map.getBounds();
    var renderBounds = this.getRenderBounds(zoom, bounds);
    var canvasBounds = renderBounds;
    var canvasSize = new Size(this.map.transform.width, this.map.transform.height);
    if (this.enable3D) {
        canvasBounds = this.getCanvasBounds(zoom, renderBounds);
        canvasSize = this.getCanvasSize(zoom, renderBounds, 1.5);
    }
    if (zoom != this.preZoom || !canvasBounds.isEqual(this.preBounds)) {

        if (this.preZoom == -1) {
            this.screenCanvas.width = canvasSize.cx;
            this.screenCanvas.height = canvasSize.cy;
            this.screenContext.fillStyle = 'rgba(0, 0, 0, 0)';
            this.screenContext.fillRect(0, 0, this.screenCanvas.width, this.screenCanvas.height);
        } else {
            this.cacheCanvas.width = canvasSize.cx;
            this.cacheCanvas.height = canvasSize.cy;
            this.cacheContext.fillStyle = 'rgba(0, 0, 0, 0)';
            this.cacheContext.fillRect(0, 0, this.cacheCanvas.width, this.cacheCanvas.height);

            var intersectBounds = new Bounds(canvasBounds.left, canvasBounds.top, canvasBounds.right, canvasBounds.bottom);
            var result = intersectBounds.intersectRect(this.preBounds);
            if (result) {
                var sScale = this.screenCanvas.width / this.preBounds.getWidth();
                var dScale = this.cacheCanvas.width / canvasBounds.getWidth();

                var sx = (intersectBounds.left - this.preBounds.left) * sScale;
                var sy = (this.preBounds.top - intersectBounds.top) * sScale;
                var sw = intersectBounds.getWidth() * sScale;
                var sh = intersectBounds.getHeight() * sScale;
                var dx = (intersectBounds.left - canvasBounds.left) * dScale;
                var dy = (canvasBounds.top - intersectBounds.top) * dScale;
                var dw = intersectBounds.getWidth() * dScale;
                var dh = intersectBounds.getHeight() * dScale;

                this.cacheContext.drawImage(this.screenCanvas, sx, sy, sw, sh, dx, dy, dw, dh);
            }

            var preCanvas = this.screenCanvas;
            this.screenCanvas = this.cacheCanvas;
            this.cacheCanvas = preCanvas;

            var preContext = this.screenContext;
            this.screenContext = this.cacheContext;
            this.cacheContext = preContext;

            var preTexture = this.screenTexture;
            this.screenTexture = this.cacheTexture;
            this.cacheTexture = preTexture;
        }

        this.screenMaterial.map = this.screenTexture;
        var geometry = this.createScreenGeometry(canvasBounds);
        var mesh = new Three.Mesh(geometry, this.screenMaterial);
        this.remove(this.preGroup);
        this.preGroup = this.threemap.createGeoGroup([-180, -90], {preScale: 1, scaleToLatitude: false});
        this.preGroup.add(mesh);
        this.add(this.preGroup);

        this.preZoom = zoom;
        this.preBounds = canvasBounds;

        this.makeNewParticles(null, true);
    }
};

DynamicWind.prototype.update = function() {
    if (this.preZoom == -1) {
        this.updateWind();
    }

    this.moveThings(1.0);
    this.drawParticles();

    this.screenMaterial.map.needsUpdate = true;
};

export { DynamicWind };
