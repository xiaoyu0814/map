importScripts("./vectortileprocessor.js");

var TileProcessor = new VectorTileProcessor();

self.onmessage = function(event) {
	var message = event.data;
	TileProcessor.process(message);
}

