import {Layer} from '../Layer/Layer';

/***
 *
 * @param options
 * @author wy
 */
/**
 * @module Layer
 */
/**
 * ThemeGraphLayer是charts图层。
 * 
 * @class ThemeGraphLayer
 * @extends Layer
 * @param {Object} options </br>
 * [url] — 图层数据的来源地址url。</br>
 * [id] — 图层的唯一id。</br>
 * [chartType] — 图表类型，1:饼图,2:柱状图  如果没有设置，默认为1。</br>
 * @constructor
 */

var themeGraphLayer =1;
function ThemeGraphLayer(options) {
    Layer.call(this);
    options = options || {};
    this.type = "ThemeGraphLayer";
    this.url = options.url !== undefined ? options.url : "";
    this.data = options.data !== undefined ? options.data : "";
    this.id = options.id !== undefined ?options.id : "ThemeGraphLayer"+themeGraphLayer++;
    this.projection  = options.projection !== undefined ? options.projection : "EPSG:4326";
    //1.饼图   
    this.chartType = options.chartType !== undefined ? options.chartType : 1;
    this.height = options.height !== undefined ? options.height : 40*this.chartType;
    this.width = options.width !== undefined ? options.width : 40*this.chartType;

    this.initData(options);
}
ThemeGraphLayer.prototype =Object.assign(Object.create(Layer.prototype),{
    /**
     * initLayer
     * <p>初始化图层，根据传参option对数据进行重新赋值。</p>
     */
    initLayer:function () {

    },
    handleData:function (self) {

    },
    innerSource:function(type){
        return;
    },
    innerLayer:function(type){
        return;
    },
    onAdd:function(map,type){
        this._map = map;
        var overlayId = [];
        this.olCharts = [];
        this.mapCharts = [];
        for (var i = 0; i < this.data.piedatas.length; i++) {
            var data = this.data.piedatas[i];
            var pointCoordinates = PIE.ol.proj.transform([data.x, data.y], 'EPSG:4326', 'EPSG:3857');
            let domid = "chart" + this.guid();
            var dom = document.createElement('div');
            dom.id = domid;
            dom.style.width = this.width + "px";
            dom.style.height = this.height + "px";
           // $("#chart").append("<div id='" + domid + "'></div>");
            var name=data.name;
        
            if(type == 1){  
                console.log(data.x,data.y);
                this.mapCharts.push( new mapboxgl.Marker(dom)
                .setLngLat([
                    data.x,
                    data.y
                ])
                .addTo(map));
                if(this.chartType==1){
                    this.addPieChartNew(name,domid, data.data);
                }else if(this.chartType==2){
                    this.addChart(name,domid,data.data);
                }
                if(i==this.data.piedatas.length-1){
                    return  {value:overlayId};
                }
            }else if(type==2){
                document.getElementById('chart').append(dom);
                var chart = new PIE.ol.Overlay({
                    id: domid,
                    element: document.getElementById(domid),
                    positioning: "bottom-center", 
                    offset: [0, 18],
                    stopEvent: false  
                });
                map.addOverlay(chart);
                this.olCharts.push(chart)
                var element = chart.getElement();
                chart.setPosition(pointCoordinates);
                $(element).popover({
                    placement: 'top',
                    animation: false
                });
                $(element).popover('show');
                overlayId.push(domid);
                if(this.chartType==1){
                    this.addPieChartNew(name,domid, data.data);
                }else if(this.chartType==2){
                    this.addChart(name,domid,data.data);
                }
                if(i==this.data.piedatas.length-1){
                    return  {value:overlayId};
                }
               
            }else if(type ==3){
                let canvasDom = document.createElement('canvas');
                canvasDom.id = domid;
                canvasDom.width =  this.width*10;
                canvasDom.height =  this.height*10;
                let lon = data.x;
                let lat = data.y;
                let _this = this;
                let option = this.getPieOption(name,data.data);
                let myChart = echarts.init(canvasDom);
                myChart.setOption(option);
                myChart.on('finished', () => {
                    let tempoption = {
                        radius:10000, 
                        lon:lon, 
                        lat:lat
                    }
                    let criclePrimitive = _this.getCriclePrimitive(myChart,tempoption )
                    map.scene.primitives.add(criclePrimitive)
                    myChart.dispose();
                    myChart = null;
                    canvasDom = null;
                })
                
            }
            
                
        }
    },
    onRemove:function(map,type){
        if(type ==1){

        }else if(type ==2){
            for(var i=0;i<this.olCharts.length;i++){
                let chart = this.olCharts[i];
                map.removeOverlay(chart);
            }
            
        }else if(type == 3){

        }
    },
    guid:function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    },
    getPieOption:function(name,data){
        var option = {
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            series: [
               {
                    name: name,
                    type: 'pie',
                    radius: '50%',
                    center: ['50%', '50%'],
                    label: {
                        show: false,
                        position: 'center'
                    },
                    labelLine: {
                        show: false
                    },
                    data: data,
                }
            ]
        };
        return option;
    },
    addPieChartNew:function(name,domid, data){
        var myChart = echarts.init(document.getElementById(domid));
        var option = this.getPieOption(name,data);
        myChart.setOption(option);
    },
    addChart:function(name,domid,data){
	    var myChart = echarts.init(document.getElementById(domid));
		
        var option = {
            animation:false,
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                top: '0%',
                left: '8%',
                right: '0%',
                bottom: '5%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: [name],
                axisLabel :{
                    fontSize:10,
                    margin :0
                },
                axisTick: {
                    show: false
                } 
            },
            yAxis: {
                type: 'value',
                axisLabel :{
                    fontSize:10,
                    margin :0
                },
                offset:-10,
                axisTick: {
                    show: false
                }
                // show:false,   
            },
            series: []
        };
        for(var i=0;i<data.length;i++){
            let temp_series = {
                name: data[i].name,
                type: 'bar',
                data: [data[i].value]
            };
            option.series.push(temp_series)

        }
        myChart.setOption(option);
    },
    getCriclePrimitive:function (chart, { radius = 100000.0, lon, lat } = {}) {
        let circle = new Cesium.CircleGeometry({
            center: Cesium.Cartesian3.fromDegrees(lon, lat),
            radius: radius
        });
        let circleGeometry = Cesium.CircleGeometry.createGeometry(circle);
        let circleGeometryInstance = new Cesium.GeometryInstance({
            geometry: circleGeometry,
            attributes: {
                color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.ORANGE)
            }
        });
        let criclePrimitive = new Cesium.Primitive({
            geometryInstances: [
                circleGeometryInstance
            ],
            appearance: new Cesium.MaterialAppearance({
                material:
                    new Cesium.Material({
                        fabric: {
                            type: 'Image',
                            uniforms: {
                                image: chart.getDataURL()
                            }
                        }
                    })
            })
        })
        return criclePrimitive;
    }
});

export {ThemeGraphLayer}