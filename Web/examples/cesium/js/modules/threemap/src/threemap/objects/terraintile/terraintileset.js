import {TerrainTile} from "./terraintile.js";

function TerrainTileSet(map, threemap, material) {
    Three.Group.call(this);

	this.map = map;
    this.threemap = threemap;
    this.material = material;
    this.source = null;
    this.name = "";

	this.workers = [];
	this.maxActiveTask = 1;

	this.flat = true;
    this.loadingTileKeys = {};
    this.renderTiles = {};

	var _this = this;
	function initialize() {
	    if (_this.material != null && _this.flat) {
            _this.material.depthTest = false;
            _this.material.depthWrite = false;
        }

		for (var i = 0; i < 1; i++) {
			var worker = new Worker('../src/threemap/worker/vectortileworker.js');
			worker.owner = _this;
			worker.index = i;
			worker.activeTask = 0;
			worker.onmessage = function (event) {
                handleBuildingTileMessage(this, event);
			}
			_this.workers.push(worker);
		}
	}
	initialize();
}

function handleBuildingTileMessage(worker, event) {
	worker.activeTask--;
	var message = event.data.result;
    var owner = worker.owner;
    owner.loadTile(message, event.data.buffer);
}

TerrainTileSet.prototype = Object.assign(Object.create(Three.Group.prototype),{
    constructor: "TerrainTileSet",

});

TerrainTileSet.prototype.setDatasource = function(url, token) {

    this.source = {};
    this.source.tiles = [];
    this.source.tiles.push(url);
    this.source.minzoom = 5;
    this.source.maxzoom = 12;

};

TerrainTileSet.prototype.loadTile = function(message, buffers) {
    var renderTile = new TerrainTile(this, this.map, this.threemap, this.material);
    renderTile.create(message, buffers);

    this.renderTiles[message.key] = renderTile;
    delete this.loadingTileKeys[message.key];
};

TerrainTileSet.prototype.update = function() {
    for (var key in this.renderTiles){
        this.renderTiles[key].setVisible(false);
    }

    if (this.source != null && this.map.transform.zoom > this.source.minzoom) {
        var tileSize = 512;
        var tileUrl = this.source.tiles[0];
        var epsg = this.map.getEPSG();
        var tileBox = this.map.getTileBounds();
        var terrainType = this.material.terrainType;

        var idealTileIDs = this.map.transform.coveringTiles({
            tileSize: tileSize,
            minzoom: this.source.minzoom,
            maxzoom: this.source.maxzoom,
            roundZoom: false,
            reparseOverscaled: false
        });
        if (idealTileIDs != null) {
            var halflen = idealTileIDs.length/2;
            for (var i = 0; i < idealTileIDs.length; i++) {
                var n = i;
                // var n = i + halflen;
                // if ( n > idealTileIDs.length-1 )
                //     n = n - idealTileIDs.length;
                var tileID = idealTileIDs[n];

                var renderTile = this.renderTiles[tileID.key];
                if (renderTile != null) {
                    renderTile.setVisible(true);
                } else {
                    if (!(tileID.key in this.loadingTileKeys)) {
                        var message = {
                            name: this.name,
                            type: terrainType,
                            fun: "processTerrainTile",
                            url: tileUrl,
                            key: tileID.key,
                            x: tileID.canonical.x,
                            y: tileID.canonical.y,
                            z: tileID.canonical.z,
                            w: tileSize,
                            epsg: epsg,
                            tileBounds: tileBox,
                            flat: this.flat
                        };
                        var index = (message.x + message.y) % this.workers.length;
                        this.workers[index].postMessage(message);
                        this.workers[index].activeTask++;

                        this.loadingTileKeys[tileID.key] = message;
                    }
                }
            }
        }
    }
};


export { TerrainTileSet };
