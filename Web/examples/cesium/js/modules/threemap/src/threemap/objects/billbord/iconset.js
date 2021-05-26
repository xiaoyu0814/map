
import { Group,Vector2,Vector3,Sprite } from 'three-full';
import { BillbordMaterial} from './billbordMaterial';

class IconSet extends  Group {
    constructor(threemap){
        super();
        this.threemap =  threemap;
        this.width = 8;
        this.length = 6;
        this.hasLight = true;
        this.uniMaterial = null;

        this.meshManager = [];
        this.ifUpdate = true;
    };
    updateWidthOrHeight(){

    }
    setIcon(url){
        delete this.uniMaterial;
        this.uniMaterial = new BillbordMaterial(url);
    };
    getSize(){
        return new Vector2(this.width,this.length);
    };
    setSize(width,length){
        this.width = width;
        this.length = length;
    };

    hasLight(){
        return this.hasLight;
    };

    setZoomScale(baseZoom,baseScale){
        this.baseZoom  = baseZoom;
        this.baseScale = baseScale;
    }

    setData(geoData,isJson){

        var threemap = this.threemap;
        var coordArray = [];
        var heights = [];
        if(isJson) {
            var features = geoData.features;
            for (var i = 0, len = features.length; i < len; i++) {
                var geometry = features[i].geometry;
                if (geometry.type === 'Point') {
                    var coords = geometry.coordinates;
                    let x = coords[0];
                    let y = coords[1];
                    //if the coordinates are string:
                    if ( (typeof x === "string") || (Object.prototype.toString.call(x) === '[object String]')){
                        coords[0] = parseFloat(x);
                        coords[1] = parseFloat(y);
                    }
                    coordArray.push(coords);
                }

            }
        }
        else { //是数组

            for (let i = 0; i < geoData.length; i++) {
                let coord = geoData[i];
                let lon = parseFloat(coord.lon);
                let lat = parseFloat(coord.lat);
                coordArray.push([lon, lat]);
            }
        }
        if(coordArray.length == 0){
            return;
        }

        let origin = coordArray[0];
        let center = threemap.projectToWorld([origin[0], origin[1], 0]);

        let material = this.uniMaterial;
        var zoomNow = this.threemap.map.transform.zoom;
        var scaleNow = this.baseScale * Math.pow(2,zoomNow - this.baseZoom);
        for(let i=0,len=coordArray.length;i<len;i++){
            let d = coordArray[i];
            let endP = threemap.projectToWorld([d[0], d[1], 0]);
            let coord = new Vector3(endP.x - center.x, endP.y - center.y,endP.z-center.z);

            let iconMesh = new Sprite(material);
            iconMesh.info = geoData[i];

            iconMesh.position.set(coord.x, coord.y,coord.z);
            // iconMesh.rotateX(90*(Math.PI/180));
            iconMesh.scale.set(scaleNow,scaleNow,1);
            iconMesh.center = new Vector2(0.5,0);
            this.meshManager.push(iconMesh);
            var preGroup = threemap.createGeoGroup(origin, {preScale: 1, scaleToLatitude: false});
            preGroup.add(iconMesh);
            this.add(preGroup);

        }

    };


    // unprojectFromWorld: function (pixel) {
    //
    //     var unprojected = [
    //         this.coordSys.lngFromMercatorX(pixel.x / WORLD_SIZE),
    //         this.coordSys.latFromMercatorY(pixel.y / WORLD_SIZE)
    //     ];
    //
    //     var pixelsPerMeter = this.coordSys.projectedUnitsPerMeter(unprojected[1]);
    //
    //     //z dimension
    //     var height = pixel.z || 0;
    //     unprojected.push( height / pixelsPerMeter );
    //
    //     return unprojected;
    // };
    getRealScale(w,h){
        var worldSize  = this.threemap.map.transform.worldSize;
        const circumference = 2 * Math.PI * 6378137;
        const meterPerWorldunit =  circumference / worldSize; //ÿ���������굥λ����ľ��루����Ϊ��λ��
        if( !this.uniMaterial.map.image){
            return null;
        }
        var width  = this.uniMaterial.map.image.width;
        var height = this.uniMaterial.map.image.height;
        var pixel =  circumference/512; //����5�����ش�С
        var widthscale   = w * pixel /worldSize /width;
        var heightscale   =  h * pixel /worldSize /height;
        return {
            ws:widthscale,
            hs:heightscale
        }
    }
    update(){

        if(!this.ifUpdate){
            return;
        }
        var worldSize  = this.threemap.map.transform.worldSize;
        // if(this.preWorldSize === worldSize){
        //     return;
        // }
        // else {
        //     this.preWorldSize = worldSize;
        // }

        const circumference = 2 * Math.PI * 6378137;
        const meterPerWorldunit =  circumference / worldSize; //ÿ���������굥λ����ľ��루����Ϊ��λ��
        var width  = this.uniMaterial.map.image.width;
        var height = this.uniMaterial.map.image.height;

        //�̶�����λΪ1�״�С��ͼ����ͼ����
        // var widthscale   =  1 /meterPerWorldunit /width;
        // var heightscale   =  1 /meterPerWorldunit /height;

        //�̶����ص�λ��ͼ�겻��ͼ����
        var pixel =  circumference/512; //����5�����ش�С
         var widthscale   = this.width * pixel /worldSize /width;
         var heightscale   =  this.length * pixel /worldSize /height;


        var zoomNow = this.threemap.map.transform.zoom;
        var scaleNow = this.baseScale * Math.pow(2, zoomNow  - this.baseZoom );
        var len = this.children.length;
        for(let i=0;i<len;i++) {
            var obj = this.children[i];
            if(obj.isGroup && obj.children.length>0) {
                var iconMesh = obj.children[0];
                // var position =  iconMesh.position.clone();
                // position.z = 1;
                //
                // var world  = this.threebox.unprojectFromWorld(position);
                //
                // var pixelsPerMeter = 1 / world[2];

                iconMesh.scale.set( widthscale,heightscale,1);
            }

        }


    };
    onBeforeRender ( renderer, scene, camera, geometry, material, group){
        console.info("befoure iconset is render");
    };

    detachLayer(){
        //do nothing
    };
}

export {IconSet};
