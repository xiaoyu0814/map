define(function (require) {

    return require('echarts').extendComponentModel({
        type: 'GLGlobe',

        getBMap: function () {
            return this.__GLGlobe;
        },

        defaultOption: {
            roam: false
        }
    });
});
