//自定义小图标图层
import mapboxgl from 'mapbox-gl'
class LabelLayer {
    constructor(map, layername) {
        this.els = [];
        this.map = map;
        this.layername = layername;
        this.initLayer();
        this.markerArr = []
    }
    //初始化图
    initLayer() {

    }
    //添加图层数据
    //.shewen,.shedu,.jShB,.zT,.shF,.qK,.shK
    addMapLayer(geoJsondata) {
        geoJsondata.forEach((iconInfo) => {
            var el = document.createElement('div');
                if(!iconInfo.properties.style){iconInfo.properties.style = {}}
                el.style.width = (iconInfo.properties.style.width || 100)+'px';
                el.style.color = iconInfo.properties.style.color || "#fff";
                let size = iconInfo.properties.style.fontSize;
                el.style['fontSize'] = (iconInfo.properties.style.fontSize || 12 )+'px';
                el.style['backgroundColor'] =  iconInfo.properties.style.bgColor || 'rgba(0,0,0,0)';
                el.style['lineHeight'] = 15+'px';
                // el.classList.add("label");
                el.style.position = 'absolute';
                el.style.top = (iconInfo.properties.style.top || -0)+'px';
                el.style.left =(iconInfo.properties.style.left || 0 )+'px';
                el.style['text-align']=iconInfo.properties.style.textAlign || 'center';
                el.style['padding'] = (iconInfo.properties.style.padding || 0 ) + "px";
                el.style['border'] = (iconInfo.properties.style.border || 'none' ) ;
                el.style['borderRadius'] = (iconInfo.properties.style.borderRadius || 0 )+"px" ;
                if(iconInfo.properties.style['text-shadow']){
                    el.style['text-shadow'] = iconInfo.properties.style['text-shadow'];
                }
            el.innerText = iconInfo.properties.textInfo;

            el.addEventListener('click', () => {
                // alert("我是label图层");
            });
            this.els.push(el);
            let icon = new mapboxgl.Marker(el)
                .setLngLat(iconInfo.geometry.coordinates)
                .addTo(this.map);
            this.markerArr.push(icon)
        });
    }
    //删除图层数据图层
    removeMapLayer() {
        for(let i in this.markerArr){
            this.markerArr[i].remove();
        }
        this.markerArr=[];
    }
    //控制图层显隐
    setLayerVisible(visibility) {
        if(this.els.length > 0 ){
            for(let i=0;i<this.els.length;i++){
                let el = this.els[i];
                if(visibility){
                    el.style.display = 'block';
                }else{
                    el.style.display = 'none';
                }
            }

        }

        // if (this.map.getLayer(this.layername + "_line")) {
        //   if (visibility) {
        //     this.map.setLayoutProperty(this.layername + "_line", 'visibility', 'visible');
        //   } else {
        //     this.map.setLayoutProperty(this.layername + "_line", 'visibility', 'none');
        //   }
        // }
    }
    //数据过滤显示
    filterBy(key, number) {
        let filters = ["all", ["==", key, number]]
        this.map.setFilter('heat', filters);
        this.map.setFilter(this.layername + "_point", filters);
    }
}
export {LabelLayer};
