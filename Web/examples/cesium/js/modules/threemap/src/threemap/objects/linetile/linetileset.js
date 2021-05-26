import {LineTile} from "./linetile.js";

function LineTileSet(map, threemap, material) {
    Three.Group.call(this);

	this.map = map;
    this.threemap = threemap;
    this.material = material;

    this.url = "";
    this.zoomLevel = 14;
    this.name = "beijing_linksAll";

	this.workers = [];
	this.maxActiveTask = 1;

	this.zoomLevel = 13;
    this.loadingTileKeys = {};
    this.renderTiles = {};

	var _this = this;
	function initialize() {
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

LineTileSet.prototype = Object.assign(Object.create(Three.Group.prototype),{
    constructor: "LineTileSet",

});

LineTileSet.prototype.setDatasource = function(url, token) {
    this.url = url;
};

LineTileSet.prototype.loadTile = function(message, buffers) {
    var renderTile = new LineTile(this, this.map, this.threemap, this.material);
    renderTile.create(message, buffers);

    this.renderTiles[message.key] = renderTile;
    delete this.loadingTileKeys[message.key];
};

LineTileSet.prototype.update = function() {
    for (var key in this.renderTiles){
        this.renderTiles[key].setVisible(false);
    }

    if (this.map.transform.zoom > this.zoomLevel) {
        var tileSize = 512;
        var epsg = this.map.getEPSG();
        var tileBox = this.map.getTileBounds();
        var lineType = 0;

        var idealTileIDs = this.map.transform.coveringTiles({
            tileSize: tileSize,
            minzoom: 0,
            maxzoom: 22,
            roundZoom: false,
            reparseOverscaled: false
        });
        if (idealTileIDs != null) {
            for (var i = 0; i < idealTileIDs.length; i++) {
                var tileID = idealTileIDs[i];

                var renderTile = this.renderTiles[tileID.key];
                if (renderTile != null) {
                    renderTile.setVisible(true);
                } else {
                    if (!(tileID.key in this.loadingTileKeys)) {
                        var message = {
                            name: this.name,
                            type: lineType,
                            fun: "processLineTile",
                            url: this.url,
                            key: tileID.key,
                            x: tileID.canonical.x,
                            y: tileID.canonical.y,
                            z: tileID.canonical.z,
                            w: tileSize,
                            epsg: epsg,
                            tileBounds: tileBox
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

export { LineTileSet };
