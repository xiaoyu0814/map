import resolve from 'rollup-plugin-node-resolve';// 帮助寻找node_modules里的包
import commonjs from 'rollup-plugin-commonjs'//将非ES6语法的包转为ES6可用 因为rollup只识别es6语法
import sourcemaps from 'rollup-plugin-sourcemaps';
import { terser } from 'rollup-plugin-terser';
export default {
    input: 'src/index.js',
    external:[
        'mapbox-gl',
        'Cesium'
    ],
    output: [{
        name: 'GlobeMap',//框架的类名
        file: './dist/globemap.js',
        format: 'umd',
        sourcemap: true ? true : 'inline',
        globals: {
            "three-full": 'Three',
            "Cesium": 'Cesium'
        },
        indent:'\t',
    },
    {
    	format:'es',
    	file:"./dist/globemap.es6.js",
        sourcemap: true ? true : 'inline',
    	indent:'\t'
    }
    ],
    plugins: [
        resolve() ,
        commonjs(),
        sourcemaps(),
        terser()
    ],
};
