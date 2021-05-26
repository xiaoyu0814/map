
function Collection() {
    this.length =0;
    this.array = [];
}
Collection.prototype = {
    add:function (Layer) {
        this.array.push(Layer);
    },
    clone:function(){

    },
    remove:function () {

    }
};
export {Collection}