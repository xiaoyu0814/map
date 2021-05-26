var PROD = process.argv.indexOf('-p') >= 0;

module.exports = {
    //mode: "development",
    //devtool: "source-map",
    entry: {
        'EchartsGlobeLayer': __dirname + '/index.js',
    },
    output: {
        libraryTarget: 'umd',
        library: ['[name]'],
        path: __dirname + '/../../examples/js/libs/echarts-globelayer-1.0.0/',
        filename: PROD ? '[name].min.js' : '[name].js'
    },
    externals: {
        'echarts': 'echarts'
    }
};
