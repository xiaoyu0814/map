/*
 * @Author: hecheng 
 * @Date: 2019-07-12 16:25:44 
 * @Last Modified by: hecheng
 * @Last Modified time: 2019-09-03 16:33:26
 */

import proj4 from "./proj4"; // proj4
var tileBounds
const  initTileBounds = (endEPSG)=>{
    let tileBoundsOption={
        3857:[-20037508.3427892, -20037508.3427892, 20037508.3427892, 20037508.3427892],
        4326:[-180, -270, 180, 90],
        4490: [-180, -270, 180, 90]
    }
    tileBounds = tileBoundsOption[endEPSG]
}
const  sameEPSG=(data)=>{
    let x = data[0];
    let y = data[1];
    return {
        x: (x - tileBounds[0]) / (tileBounds[2] - tileBounds[0]),
        y: (tileBounds[3] - y) / (tileBounds[3] - tileBounds[1])
    };
}
const  convert4326=(data)=>{
    let x = data[0];
    let y = data[1];
    var sin = Math.sin(y * Math.PI / 180);
    var y2 = 0.5 - 0.25 * Math.log((1 + sin) / (1 - sin)) / Math.PI;
    return {
        x: x / 360 + 0.5,
        y: y2 < 0 ? 0 : y2 > 1 ? 1 : y2
    };
}
export default class CoordinateTransformation {
    constructor(startEPSG , endEPSG ){
        this.startEPSG = startEPSG
        this.endEPSG = endEPSG
        this.startProj = null
        this.endProj  = null
        this.convertFn = ()=>{ console.log('转换失败') }
        initTileBounds(endEPSG)
        if(this.startEPSG == this.endEPSG)this.convertFn = sameEPSG
        if(this.startEPSG == 4326 && this.endEPSG == 3857){this.convertFn = convert4326; return}
        if (this.startEPSG == 4490|| this.endEPSG  == 4490)this.defineProj(4490, '+proj=longlat +ellps=GRS80 +no_defs');
        this.startProj=this.getProj(this.startEPSG)
        this.endProj=this.getProj(this.endEPSG)
        this.convertFn = this.convertProj
    }
    defineProj(epsg, optionString){
        proj4.defs(`EPSG:${epsg}`, optionString);
    }
    getProj(epsg){
        return proj4(`EPSG:${epsg}`);
    }
    convert(piont){
        return this.convertFn(piont)
    }
    convertProj(piont){
        let piont = proj4(this.startProj, this.endProj, piont);
        return sameEPSG(piont);
    }
 }