function LayerGroup(threemap) {
    this.threemap = threemap;

    this.layers = [];
}

Object.assign(LayerGroup.prototype, {
    constructor: "LayerGroup",

    addLayer: function(layer) {
        // layer.initialize(this.threebox);
        this.layers.push(layer);
    },

    removeLayer: function(layer) {
        console.log("删除图层");
        for (var i = 0; i < this.layers.length; i++) {
            if (this.layers[i] == layer) {
                // layer.unInitialize(this.threebox);
                this.layers.splice(i,1);
                break;
            }
        }
    },

    notify: function () {
        for (var i = 0; i < this.layers.length; i++) {
            this.layers[i].notify();
        }
    },

    update: function () {
        for (var i = 0; i < this.layers.length; i++) {
            this.layers[i].update();
        }
    },

} );

export { LayerGroup };

