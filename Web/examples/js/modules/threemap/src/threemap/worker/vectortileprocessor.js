importScripts("./libshared/earcut.js");
importScripts("./libshared/Point.js");
importScripts("./libshared/Pbf.js");
importScripts("./libshared/MVTData.js");
importScripts("./libshared/MVTFeature.js");
importScripts("./libshared/MVTLayer.js");

importScripts("./core/mathengine.js");
importScripts("./core/vector2.js");
importScripts("./core/vector3.js");
importScripts("./core/vector4.js");
importScripts("./core/matrix3f.js");
importScripts("./core/matrix4f.js");
importScripts("./core/matrix4d.js");
importScripts("./core/size.js");
importScripts("./core/bounds.js");
importScripts("./core/projection.js");
importScripts("./core/triangulator.js");
importScripts("./core/coordsys.js");
importScripts("./core/tilecoordsys.js");

importScripts("./buildingstessellator.js");
importScripts("./buildingtessellator.js");
importScripts("./colorbuildingtessellator.js");
importScripts("./terraintessellator.js");
importScripts("./linestessellator.js");
importScripts("./linetessellator.js");

function VectorTileProcessor() {
    this.coordSys = new TileCoordSys();
}

Object.assign(VectorTileProcessor.prototype, {

	process: function (message) {
        this.coordSys.setEPSG(message.epsg);
        this.coordSys.setTileBounds(message.tileBounds);

        if (message.fun == "processBuildingTile") {
            this.loadBuildingTile(message, this.response);
        } else if (message.fun == "processTerrainTile") {
            this.loadTerrainTile(message, this.response);
        } else if (message.fun == "processLineTile") {
            this.loadLineTile(message, this.response);
        }
	},


    loadTerrainTile: function (message) {
        var _this = this;

        var url = this.getRequestURL(message.url, message.z, message.y, message.x);
        var xhr = new XMLHttpRequest();
        xhr.timeout = 0;
        xhr.withCredentials = false;
        xhr.responseType = "arraybuffer";
        xhr.onload = function() {

            if (this.status===200 && this.response.byteLength > 256  ) {
                _this.processTerrainTile(message, this.response);
            }
        }
        xhr.open("GET", url, false);
        xhr.send(null);
	},

    createTerrainTessellator: function (terrainType) {
        return new TerrainTessellator();
    },

    processTerrainTile: function (message, response) {

	    var tessellator = this.createTerrainTessellator(message.type);
        var tilelayer = this.parserTerrainLayer(message, response, tessellator);

        var transferableObjects = [];
        if (tilelayer != null) {
            message.name = tilelayer.name;
            message.layouts = tessellator.toTransferableObjects(tilelayer.vertexBuffer, tilelayer.indexBuffer, transferableObjects, message.flat);
        }

        postMessage({result:message, buffer:transferableObjects}, transferableObjects);
    },

    parserTerrainLayer: function (message, response, tessellator) {

        var rcBounds = this.coordSys.computeTileBounds(message.z, message.y, message.x);
        var center = rcBounds.getCenter();
        var local = new Vector2(center.x, center.y);
        this.coordSys.worldToGeo(center);

        var leftTop = new Vector2(rcBounds.left, rcBounds.top);
        message.radius = leftTop.sub(local).length();
        message.center = center;

        var tilelayer = {};
        tilelayer.name = message.name;
        tilelayer.vertexBuffer = [];
        tilelayer.indexBuffer = [];

        var length = response.byteLength;
        var tileSize = 64*64; //切片大小是67X67；
        var terrains = null;
        if(Math.floor(length/tileSize) === 2) {//16位数据格式
            terrains = new Int16Array(response);
        }
        else if(Math.floor(length / tileSize) === 4){ //32位数据格式
            terrains = new Float32Array(response);
        }

        tessellator.process(this.coordSys, tilelayer.vertexBuffer, tilelayer.indexBuffer, message, terrains, local);

        return tilelayer;
    },


    loadBuildingTile: function (message) {
        var _this = this;

        var url = this.getRequestURL(message.url, message.z, message.y, message.x);
        var xhr = new XMLHttpRequest();
        xhr.timeout = 0;
        xhr.withCredentials = false;
        xhr.responseType = "arraybuffer";
        xhr.onload = function() {
            if (this.status===200 && this.response.byteLength > 256 ) {
                _this.processBuildingTile(message, this.response);
            }
        }
        xhr.open("GET", url, true);
        xhr.send(null);
    },

    createBuildingTessellator: function (buildingType) {
        if (buildingType == "ColorBuilding") {
            return new ColorBuildingTessellator();
        }
        return new BuildingTessellator();
    },

    processBuildingTile: function (message, response) {
        var tile = new MVTData(new Pbf(response));

        var rcBounds = this.coordSys.computeTileBounds(message.z, message.y, message.x);
        var center = rcBounds.getCenter();
        var local = new Vector2(center.x, center.y);
        this.coordSys.worldToGeo(center);

        var leftTop = new Vector2(rcBounds.left, rcBounds.top);
        message.radius = leftTop.sub(local).length();
        message.center = center;

        var tessellator = this.createBuildingTessellator(message.type);

        var tilelayer = null;
        var layer = tile.layers[message.name];
        if (layer != null) {
            tilelayer = this.parserBuildingLayer(message, center, local, layer, tessellator);
        }

        var transferableObjects = [];
        if (tilelayer != null) {
            message.name = tilelayer.name;
            message.layouts = tessellator.toTransferableObjects(tilelayer.vertexBuffers, tilelayer.indexBuffers, transferableObjects);
        }

        postMessage({result:message, buffer:transferableObjects}, transferableObjects);
    },

    parserBuildingLayer: function (message, center, local, layer, tessellator) {
        var tilelayer = {};
        tilelayer.name = layer.name;
        tilelayer.vertexBuffers = [];
        tilelayer.indexBuffers = [];

        for (var i = 0; i < layer.length; i++) {
            var feature = layer.feature(i);
            if (feature != null) {
                var height = feature.properties.MEAN_FIELD / 5000.0;
                var rings = classifyRings(feature.loadGeometry());
                for (var j = 0; j < rings.length; j++) {
                    var ring = rings[j];
                    for (var k = 0; k < ring.length; k++) {
                        this.tessBuilding(message, local, ring[k], height, tessellator, tilelayer.vertexBuffers, tilelayer.indexBuffers);
                    }
                }
            }
        }

        return tilelayer;
    },

    tessBuilding: function (message, local, coords, height, tessellator, vertexBuffers, indexBuffers) {

        for (var i = 0; i < coords.length; i++) {
            this.coordSys.tileToWorld(message.z, message.y, message.x, coords[i]);
        }

        var tessellators = new BuildingsTessellator();
        tessellators.process(tessellator, vertexBuffers, indexBuffers, coords, height, local, 1.0);
    },


    loadLineTile: function (message) {
        var _this = this;

        var url = this.getRequestURL(message.url, message.z, message.y, message.x);
        var xhr = new XMLHttpRequest();
        xhr.timeout = 0;
        xhr.withCredentials = false;
        xhr.responseType = "arraybuffer";
        xhr.onload = function() {
            if (this.status == 200 && this.response.byteLength > 30) {
                _this.processLineTile(message, this.response);
            }
        }
        xhr.open("GET", url, false);
        xhr.send(null);
    },

    createLineTessellator: function (LineType) {
        return new LineTessellator();
    },

    processLineTile: function (message, response) {
        var tile = new MVTData(new Pbf(response));

        var rcBounds = this.coordSys.computeTileBounds(message.z, message.y, message.x);
        var center = rcBounds.getCenter();
        var local = new Vector2(center.x, center.y);
        this.coordSys.worldToGeo(center);

        var leftTop = new Vector2(rcBounds.left, rcBounds.top);
        message.radius = leftTop.sub(local).length();
        message.center = center;

        var tessellator = this.createLineTessellator(message.type);

        var tilelayer = null;
        var layer = tile.layers[message.name];
        if (layer != null) {
            tilelayer = this.parserLineLayer(message, center, local, layer, tessellator);
        }

        var transferableObjects = [];
        if (tilelayer != null) {
            message.name = tilelayer.name;
            message.layouts = tessellator.toTransferableObjects(tilelayer.vertexBuffers, tilelayer.indexBuffers, transferableObjects);
        }

        postMessage({result:message, buffer:transferableObjects}, transferableObjects);
    },

    parserLineLayer: function (message, center, local, layer, tessellator) {
        var tilelayer = {};
        tilelayer.name = layer.name;
        tilelayer.vertexBuffers = [];
        tilelayer.indexBuffers = [];

        for (var i = 0; i < layer.length; i++) {
            var feature = layer.feature(i);
            if (feature != null) {
                var rings = classifyRings(feature.loadGeometry());
                for (var j = 0; j < rings.length; j++) {
                    var ring = rings[j];
                    for (var k = 0; k < ring.length; k++) {
                        this.tessLine(message, local, ring[k], tessellator, tilelayer.vertexBuffers, tilelayer.indexBuffers);
                    }
                }
            }
        }

        return tilelayer;
    },

    tessLine: function (message, local, coords, tessellator, vertexBuffers, indexBuffers) {

        var times = [];
        for (var i = 0; i < coords.length; i++) {
            times.push(0);
            this.coordSys.tileToWorld(message.z, message.y, message.x, coords[i]);
        }

        var tessellators = new LinesTessellator();
        tessellators.process(tessellator, vertexBuffers, indexBuffers, coords, times, local, 1.0);
    },


    getRequestURL: function (url, z, y, x) {
        url = url.replace(/{z}/, z);
        url = url.replace(/{y}/, y);
        url = url.replace(/{x}/, x);
        return url;
    },

} );

