import resolve from 'rollup-plugin-node-resolve';// 帮助寻找node_modules里的包
import commonjs from 'rollup-plugin-commonjs'//将非ES6语法的包转为ES6可用 因为rollup只识别es6语法
import sourcemaps from 'rollup-plugin-sourcemaps';
import { terser } from 'rollup-plugin-terser';
//import { uglify } from 'rollup-plugin-uglify';//对代码进行压缩
export default {
    input: 'src/index.js',
    external:[
        'Cesium',
        'three-full',
        'jquery'
    ],
    output: [{
        name: 'ThreeGlobe',//框架的类名
        file: './dist/threeglobe.js',
        format: 'umd',
        sourcemap: true ? true : 'inline',
        globals: {
            "three-full": 'Three',
            "Cesium": 'Cesium',
            jquery: '$'
        },
        indent:'\t',
    },{
        name: 'ThreeGlobe',//框架的类名
        file: '../../examples/js/libs/threeglobe-1.0.0/threeglobe.js',
        format: 'umd',
        sourcemap: true ? true : 'inline',
        globals: {
            "three-full": 'Three',
            "Cesium": 'Cesium',
            jquery: '$'
        },
        indent:'\t',
    },
    {
    	format:'es',
    	file:"./dist/threeglobe.es6.js",
        sourcemap: true ? true : 'inline',
    	indent:'\t'
    },
    {
    	format:'es',
    	file:'../../examples/js/libs/threeglobe-1.0.0/threeglobe.es6.js',
        sourcemap: true ? true : 'inline',
    	indent:'\t'
    }
    ],
    plugins: [
        resolve() ,
        commonjs(),
        sourcemaps(),
        terser()
        //uglify(),
    ],
};
