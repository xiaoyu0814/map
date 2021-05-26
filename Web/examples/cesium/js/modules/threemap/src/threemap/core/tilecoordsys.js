import {TileArea} from "./tilearea";
import {Vector2} from "./vector2";
import {CoordSys} from "./coordsys";
import {Bounds} from "./bounds";
import {MathEngine} from "./mathengine";
import {Size} from "./size";

function TileCoordSys() {
    CoordSys.call(this);

    this.tileOrigin = new Vector2(0, 512);
    this.tileSize = 512;
}

TileCoordSys.prototype = Object.assign( Object.create(CoordSys.prototype), {

    setTileOrigin: function (pntOrigin) {
        this.tileOrigin = pntOrigin;
    },

    getTileOrigin: function () {
        return this.tileOrigin;
    },

    setTileSize: function (tileSize) {
        this.tileSize = tileSize;
    },

    getTileSize: function () {
        return this.tileSize;
    },

    computeTileRange: function (zoom, rcBounds) {
        var szTile = this.computeTileSize(zoom);

        var tolerance = szTile.cx / 512;
        var tileArea = new TileArea();

        var dRange = rcBounds.left - this.tileOrigin.x + tolerance;
        tileArea.startCol = (Math.floor(dRange / szTile.cx + MathEngine.EP));

        dRange = rcBounds.right - this.tileOrigin.x - tolerance;
        tileArea.endCol = (Math.floor(dRange / szTile.cx - MathEngine.EP));

        dRange = this.tileOrigin.y - rcBounds.top + tolerance;
        tileArea.startRow = (Math.floor(dRange / szTile.cy + MathEngine.EP));

        dRange = this.tileOrigin.y - rcBounds.bottom - tolerance;
        tileArea.endRow = (Math.floor(dRange / szTile.cy - MathEngine.EP));

        return tileArea;
    },

    computeTileBounds: function (zoom, row, col) {
        var rcBounds = new Bounds();

        var szTile = this.computeTileSize(zoom);

        rcBounds.left = this.tileOrigin.x + col * szTile.cx;
        rcBounds.right = rcBounds.left + szTile.cx;
        rcBounds.top = this.tileOrigin.y - row * szTile.cy;
        rcBounds.bottom = rcBounds.top - szTile.cy;

        return rcBounds;
    },

    computeTilePosition: function (zoom, center) {
        var pos = new Vector2();

        var szTile = this.computeTileSize(zoom);

        var rangeX = center.x - this.tileOrigin.x;
        pos.x = (Math.floor(rangeX / szTile.cx));

        var rangeY = this.tileOrigin.y - center.y;
        pos.y = (Math.floor(rangeY / szTile.cy));

        return pos;
    },

    computeTileCount: function (zoom) {
        var zoomLevel = Math.floor(zoom);
        var tileCount = Math.pow(2, zoomLevel);
        return new Size(tileCount, tileCount);
    },

    computeTileSize: function (zoom) {
        var zoomLevel = Math.floor(zoom);
        var tileSize = 512.0 / (Math.pow(2, zoomLevel));
        return new Size(tileSize, tileSize);
    },

    tileToWorld: function (zoom, row, col, p) {
        p.x = (p.x + 4096 * col) / (4096.0 * Math.pow(2.0, zoom)) * 512;
        p.y = (1.0 - (p.y + 4096 * row) / (4096.0 * Math.pow(2.0, zoom))) * 512;
    },

} );


export { TileCoordSys }
