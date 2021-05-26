define(function (require) {

    return require('echarts').extendComponentModel({
        type: 'GLMap',

        getBMap: function () {
            return this.__GLMap;
        },

        defaultOption: {
            roam: false
        }
    });
});
