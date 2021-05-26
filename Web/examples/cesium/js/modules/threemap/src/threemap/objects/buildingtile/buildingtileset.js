import {BuildingTile} from "./buildingtile.js";

function BuildingTileSet(map, threemap, material) {
    Three.Group.call(this);

	this.map = map;
    this.threemap = threemap;

    if(( material instanceof String)
        || ((typeof material) == "string")){
        this.material = this.setMaterialTexture(material);
    }
    else {
        this.material = material;
    }

    this.source = null;
    this.name = "bj_building_2dgeojson";

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

BuildingTileSet.prototype = Object.assign(Object.create(Three.Group.prototype),{
    constructor: "BuildingTileSet",

});

BuildingTileSet.prototype.setDatasource = function(url, token) {
    var _this = this;

    var jsonUrl = url;
    if (token != null && token != "") {
        jsonUrl += "?" + token;
    }
    var xhr = new XMLHttpRequest();
    xhr.timeout = 0;
    xhr.withCredentials = false;
    xhr.responseType = "";
    xhr.onload = function() {
        var content = JSON.parse(this.response);
        if (content != null) {
            _this.source = content;
        }
    }
    xhr.open("GET", jsonUrl, true);
    xhr.send(null);
};

BuildingTileSet.prototype.setMaterialTexture = function(url) {
    var loader = new Three.TextureLoader();
    var texture = loader.load(url);
    texture.mapping = Three.UVMapping;
    texture.anisotropy = 16;
    texture.repeat.set(4, 2);
    texture.wrapS = texture.wrapT = Three.RepeatWrapping;
    var specularTex = loader.load(material);
    specularTex.mapping = Three.UVMapping;
    specularTex.anisotropy = 16;
    specularTex.repeat.set(4, 2);
    specularTex.wrapS = specularTex.wrapT = Three.RepeatWrapping;
    var material = new Three.MeshLambertMaterial({
        color: 0xffffff,
        specular:0xffffff,
        map: texture,
        specularMap: specularTex,
        combine: Three.MixOperation,
        reflectivity: 0.8
    });

    return material;
};

BuildingTileSet.prototype.loadTile = function(message, buffers) {
    var renderTile = new BuildingTile(this, this.map, this.threemap, this.material);
    renderTile.create(message, buffers);

    this.renderTiles[message.key] = renderTile;
    delete this.loadingTileKeys[message.key];
};

BuildingTileSet.prototype.update = function() {
    for (var key in this.renderTiles){
        this.renderTiles[key].setVisible(false);
    }

    if (this.source != null && this.map.transform.zoom > this.zoomLevel) {
        var tileSize = 512;
        var tileUrl = this.source.tiles[0];
        var epsg = this.map.getEPSG();
        var tileBox = this.map.getTileBounds();
        var buildingType = this.material.buildingType;

        var idealTileIDs = this.map.transform.coveringTiles({
            tileSize: tileSize,
            minzoom: this.source.minzoom,
            maxzoom: this.source.maxzoom,
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
                            type: buildingType,
                            fun: "processBuildingTile",
                            url: tileUrl,
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

export { BuildingTileSet };
