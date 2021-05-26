let geoserver = "http://211.154.196.250:8083";          //geoserver   矢量
let piecloud = "http://piecloud.piesat.cn";          //dataservices  
let service = "http://piecloud.piesat.cn:10000";          //service  栅格

let IP1 = "http://211.154.196.253:5080";   //PIEWeb服务
let IP2 = "http://10.1.6.77:8060";          //PIEWeb服务
var IP3 = "http://1.119.5.10:18060";        //PIEWeb服务
let IP4 = "http://weixin.piesat.cn";        //PIEWeb服务
let IP5 = "http://10.1.6.88:8060";        //PIEWeb服务
let IP6 = "http://211.154.196.250:8082";        //PIEWeb服务
let IP7 = "http://10.1.6.84:8060";        //PIEWeb服务
let IP8 = "http://10.1.6.71:8060";          //PIEWeb服务

let swapQuery = "http://rsapp.nsmc.org.cn";    //swapQuery  栅格
let seis = "http://172.16.40.235:5091";   //seis
let JB = "http://172.16.10.220:8080";   //JB服务

let IP9 = "http://120.52.31.158:180";   //arcgis
let IP10 = "http://211.154.196.253:6080";  //arcgis   PIEWeb服务
let IP11 = "http://10.1.6.110:6080";       //arcgis
let IP12 = "http://10.1.100.97:6080";      //arcgis



var path = {
    PIEVector: {
        geoserver: geoserver + "/geoserver/wms",
        web: geoserver + "/geoserver/web/",
        wfs: geoserver + "/geoserver/wfs",
        map_blue: piecloud + "/map/styles/map_blue.json",
        WGS84Geoserver: "http://1.119.5.10:18060/geoserver/wms?service=WMS&version=1.1.0&request=GetMap&format=image/png",

        //ows 备用 /geoserver/zhaojiawei/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=zhaojiawei:GlobalIslandRegion-WGS1984&maxFeatures=50&outputFormat=application%2Fjson 
        //ows 备用 /geoserver/zhaojiawei/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=zhaojiawei:CityPoint-Lambert&maxFeatures=50&outputFormat=application%2Fjson
        //ChinaProvince 线
        ChinaProvince: geoserver + "/geoserver/zhaojiawei/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=zhaojiawei:ChinaProvince-WGS1984&maxFeatures=1000&outputFormat=application%2Fjson&id=ChinaProvince-WGS1984.1",
        //城市点数据
        CityPoint: geoserver + "/geoserver/zhaojiawei/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=zhaojiawei:CityPoint-WGS84&maxFeatures=50&outputFormat=application%2Fjson",
        //显示格网值
        AlwaysPolyline: geoserver + "/geoserver/zhaojiawei/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=zhaojiawei:AlwaysPolyline&maxFeatures=50&outputFormat=application%2Fjson",
        //基础底图
        BaseMap: geoserver + "/geoserver/zhaojiawei/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=zhaojiawei:BaseMap-WGS1984&maxFeatures=50&outputFormat=application%2Fjson",
       //线图层
        GlobalRiversLine: geoserver + "/geoserver/zhaojiawei/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=zhaojiawei:GlobalRiversLine-Lambert&maxFeatures=50&outputFormat=application%2Fjson",
        //省份点数据
        ProvincePoint: geoserver + "/geoserver/zhaojiawei/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=zhaojiawei:ProvincePoint-Lambert&maxFeatures=50&outputFormat=application%2Fjson",
        
        GlobalIslandRegion: geoserver + "/geoserver/zhaojiawei/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=zhaojiawei:GlobalIslandRegion-Lambert&maxFeatures=50&outputFormat=application%2Fjson",

        ChinaProvince_Lambert: geoserver + "/geoserver/zhaojiawei/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=zhaojiawei:ChinaProvince-Lambert&maxFeatures=50&outputFormat=application%2Fjson",
        //城市名称
        CityPoint_Lambert: geoserver + "/geoserver/zhaojiawei/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=zhaojiawei:CityPoint-Lambert&maxFeatures=50&outputFormat=application%2Fjson",
    
    },
    //栅格
    PIEGrid: {
        GFTile: piecloud + "/dataservices/service/v1/tile?map=GFImage&x={x}&y={y}&z={z}",
        GFTile1: service + "/service/v1/tile?map=GFImage&x={x}&y={y}&z={z}",
        GoogleTile: piecloud + "/dataservices/service/v1/tile?map=GoogleImage&x={x}&y={y}&z={z}",
        GoogleTile1: piecloud + "/dataservices/google/service/v1/tile?map=GoogleImage&x={x}&y={y}&z={z}",
        GlobalDarkMap: piecloud + "/dataservices/service/v1/tile?map=GlobalDarkMap&x={x}&y={y}&z={z}",
        GlobalHillShadingMap: piecloud + "/dataservices/service/v1/tile?map=GlobalHillShadingMap&access_token=8VGmDyaJj7OtfxBNAGqDII5urW7y0VeQ&x={x}&y={y}&z={z}",
        GlobalGrayLandMap: piecloud + "/dataservices/service/v1/tile?map=GlobalGrayLandMap&x={x}&y={y}&z={z}",
        //swapQuery  备用：/swapQuery/public/tileServer/getTile/fy-4a/prj_gll/NOMChannel01/20191021000000/jpg/{z}/{y}/{x}.png
        //swapQuery  备用：/swapQuery/public/tileServer/getTile/fy-4a/prj_gll/NatureColor_NoLit/20191107031500/jpg/0/0/0.png
        swapQuery: swapQuery + "/swapQuery/public/tileServer/getTile/fy-4a/prj_gll/NatureColor_NoLit/20190813030000/jpg/{z}/{y}/{x}.png",
        swapQuery1: swapQuery + "/swapQuery/public/tileServer/getTile/fy-4a/prj_gll/NOMChannel12/20190813030000/jpg/{z}/{y}/{x}.png",
        swapQuery2: swapQuery + "/swapQuery/public/tileServer/getTile/fy-4a/prj_gll/NatureColor_NoLit/20191107031500/jpg/",
        swapQuery3: swapQuery + "/swapQuery/public/tileServer/getTile/fy-4a/prj_gll/NatureColor_NoLit/20191107031500/jpg/{z}/{y}/{x}.png",
        swapQuery4: swapQuery + "/swapQuery/public/tileServer/getTile/fy-4a/prj_gll/NatureColor_NoLit/20191108043000/jpg/{z}/{y}/{x}.png", 
        Guizhou_Density_bt: "http://125.69.82.40:15440/Tiles/Guizhou/Guizhou_Density_bt/{zz}/{yy}/{xx}.png",
        tile: "/2016liangqingyingxiang/MapServer/tile/{z}/{y}/{x}",   
    },
    //地形
    PIEterrain: {
        //全国地形
        test: piecloud + "/tilesets/test/",
        //北京地形
        Tiles: piecloud + "/tilesets/tiles/",
    },
    PIEservice: {
        GFImage: "http://service.piesat.cn:10000/service/v1/tile?map=GFImage&x={x}&y={y}&z={z}",
        basic: "http://service.piesat.cn:10002/styles/basic.json",
        ChinaVector: "http://service.piesat.cn:10000/service/v1/tile?map=ChinaVector&x={x}&y={y}&z={z}",
    },
    windy: {
        ecmwfHres: "https://ims.windy.com/ecmwf-hres/2019/05/10/06/257w{z}/{y}/{x}/temp-surface.jpg?reftime=2019050912",
        darkmap: "https://tiles.windy.com/tiles/v9.0/darkmap/{z}/{x}/{y}.png",
    },
    seis: {
        wmts: seis + "/seis/v3/wmts/service/1145/2?service=WMTS&request=GetTile&version=1.0.0&layer=&style=&tilematrixSet=GoogleMapsCompatible&format=image/png&transparent=1&width=256&height=256&opacity=1&mgt_token=7be49279ea411a18dd6aface64ede5a2&srs=EPSG:3857&tilematrix={z}&tilerow={y}&tilecol={x}",
        wmts1: seis + "/seis/v3/wmts/service/1143/8?service=WMTS&request=GetTile&version=1.0.0&layer=&style=&tilematrixSet=GoogleCRS84Quad&format=image/png&transparent=1&width=256&height=256&opacity=1&mgt_token=7be49279ea411a18dd6aface64ede5a2&srs=EPSG:4326",
        wmts2: piecloud + "/seis/v3/wmts/service/1144/3?service=WMTS&request=GetTile&version=1.0.0&layer=&style=&tilematrixSet=GoogleCRS84Quad&format=image%2Fpng&transparent=1&width=256&height=256&opacity=1&mgt_token=7be49279ea411a18dd6aface64ede5a2&srs=EPSG%3A4326",
    },
    //PIEWeb服务
    PIEWeb: {
        surf: IP1 + "/PIE-Web/showPrd/surf/{x}/{x}/{y}.png?params=data:2019-05-13,hour:12,fcstHour:24,modelType:ECMWF_HR_C1D,feature:thag,level:0",
        surf2: IP3 + "/PIE-Web/showPrd/surf/{z}/{x}/{y}.png?params=data:2018-12-04,hour:12,fcstHour:24,modelType:JAPAN,feature:ps,level:0",
        surf3: IP8 + "/PIE-Web/showPrd/surf/{z}/{x}/{y}.png",
        surf4: IP5 + "/PIE-Web/showPrd/surf/{z}/{x}/{y}.png?params=data:2018-12-04,hour:12,fcstHour:24,modelType:ECMWF_HR_C1D,feature:temp,level:500",
        showStationColorTilePng: IP2 + "/PIE-Web/groundLive/showStationColorTilePng/{z}/{x}/{y}.png?params=date:20181204,type:liveInfo_Gts,span:0800,level:999,element:T24",
        disasterHotMap: IP4 + "/VIS-Web/envirAndSimu/disasterHotMap?type=1&startTime=1970-01-01%2000:00:00&endTime=1970-02-01%2000:00:00",
        //备用  http://10.1.6.106:8060/PIE-Web/showPrd/getDigitalWindVectorData?params=data:2018-12-04,hour:12,fcstHour:24,modelType:ECMWF_HR_C1D,feature:uw;vw,level:500&bounds=LngLatBounds(LngLat(33.62499999998607,%20-0.1675101714707381),%20LngLat(202.37500000004002,%2064.43846097971775))&zoom=3
        getDigitalWindVectorData: IP8 + "/PIE-Web/showPrd/getDigitalWindVectorData",
        //请求参数：params
        getDigitalData: IP10 + "/PIE-Web/showPrd/getDigitalData",
        getPubsurf: IP6 + "/VIS-Web/getNumerical/getPubsurf/{z}/{x}/{y}.png",
       // IP3 + "/VIS-Web/groundLive/getGroundLiveDataCoutour?params=date:20181203,type:liveInfo_Gts,span:0800,level:0,element:SLP",
        getGroundLiveDataCoutour: IP7 + "/PIE-Web/groundLive/getGroundLiveDataCoutour?params=date:2018-01-02,type:liveInfo_ground,span:5.0,level:500,element:pressure", 
        getGroundLiveData: IP3 + "/VIS-Web/groundLive/getGroundLiveData?date=20181203&span=0800&type=liveInfo_Gts&level=0&zoom=3&proType=mercator&bound=44.62,-0.56,213.37,64.61&w=1920&h=978",
        getGroundLiveData24hP: IP3 + "/VIS-Web/groundLive/getGroundLiveData24hP?params=date:20181203,type:liveInfo_Gts,span:1700,level:0,element:P24&zoom=1",
        showStationColorTilePng: IP3 + "/VIS-Web/groundLive/showStationColorTilePng/{z}/{x}/{y}.png?params=date:20181203,type:liveInfo_Gts,span:0800,level:0,element:T24",
        getWindDataContour: IP3 + "/VIS-Web/groundLive/getWindDataContour?params=date:20181203,type:liveInfo_Gts,span:0800,level:0,element:WS,WI:11",
    },
    //JB服务
    PathNative: {
        //get请求  参数:  code  points   unitlength
        url: JB + "/PathNative/service/analysis.do",
    },
    //CesiumToken
    CesiumURL: {
        //token  备用 "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5ZjkxMTcwNi05ZjI4LTQ0MDAtYTA2OS05NWY1ZTlhYzg5YmIiLCJpZCI6MjM2NjcsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1ODM4MTM4NTR9.F0WbCArpRjS5hUYped0Eutfn3hKPdC7-YGlCBOW7lvY"
        //token  备用 "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwMDVjODczYy1kMzkxLTQ1OGUtYjAwOS01MDRlN2QzOTExYTgiLCJpZCI6NTM3Mywic2NvcGVzIjpbImFzciIsImdjIl0sImlhdCI6MTU0MzE5NzM1NH0.RqX0BJWiIngpnINQpX5S7-4Gb16v85X2PPl6DfnGvCw"
        //token  备用  pk.eyJ1IjoicWlhbmt1bjIwMDgiLCJhIjoiY2pxZDdvbGdrNDJvOTQycHBrajF5NmVubiJ9.alWm23QayDt98SsRbRjGEw
        Token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5N2YwN2Q4ZS1iODA0LTRkZDQtYmMxNC0yNDBkNWNkMDc4MDAiLCJpZCI6NjI2NCwic2NvcGVzIjpbImFzciIsImdjIl0sImlhdCI6MTU0NTc5MTY5Nn0.ki6CLrIJtYbR2RpOoV9PDhxHcHXsQhoU69mFi8bY9Mg",  
    },
    //Mapbox地图
    MapboxURL: {
        //mapbox在线瓦片url
        satellite: "https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic2V2ZW55dTEiLCJhIjoiY2phOTBveW1oMDJ4ZDMybmM1azU1ZGtsbiJ9.G5ppV9GwVCs4M9ZVOzbhQA",
    },
    //百度地图
    BaiduURL: {
        //百度在线瓦片url(后面需要拼接参数)
        tile: "http://online6.map.bdimg.com/onlinelabel/?qt=tile",
        //百度在线瓦片url(有参数)
        // 备用  http://online6.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles=pl&udt=20150815&scaler=1&p=1
        tile1: "http://online1.map.bdimg.com/onlinelabel/?qt=tile&{x}&y={y}&z={z}&styles=pl&udt=20170408&scaler=1&p=1",
    },
    //高德地图
    GaodeURL: {
        //矢量图（含路网、含注记）
        VectorRoadNote: "http://webst0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}",
        //矢量图（含路网，不含注记）
        VectorRoad: "http://wprd0{1-4}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=2&style=7",
        //影像底图（不含路网，不含注记）
        Image: "http://wprd0{1-4}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=6",
        //影像路图（含路网，含注记）
        ImageRoadNote: "http://wprd0{1-4}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=8",
        //影像路网（含路网，不含注记）
        ImageRoad: "http://wprd0{1-4}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=2&style=8",
    },
    //BingMap
    BingMap: {
        //Bing在线瓦片地图(后拼接参数)
        tiles: "http://dynamic.t0.tiles.ditu.live.com/comp/ch/",
    },
    //天地图
    TiandituURL: {
        //影像底图——球面墨卡托投影
        img_w: "http://t0.tianditu.gov.cn/img_w/wmts?tk=7b435c61bff7f77eb49206e10d6397bd",
        //影像底图——经纬度投影
        img_c: "http://t0.tianditu.gov.cn/img_c/wmts?tk=7b435c61bff7f77eb49206e10d6397bd",
        //矢量底图——球面墨卡托投影
        vec_w: "http://t0.tianditu.gov.cn/vec_w/wmts?tk=c1d6b49adb2ba817109873dbc13becb4&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=tiles",
        vec_w1: "https://t5.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=1072d95046f18e67463ce40d645a9b8d",
        //矢量底图——经纬度投影
        vec_c: "http://t0.tianditu.gov.cn/vec_c/wmts?tk=c1d6b49adb2ba817109873dbc13becb4&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=c&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=tiles",
        //矢量注记——球面墨卡托投影
        cva_w: "https://t3.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=fb1bfb9e06cd7681813a42f4c934e1ea",
        //矢量注记——经纬度投影
        cva_c: "http://t0.tianditu.gov.cn/cva_c/wmts?tk=c1d6b49adb2ba817109873dbc13becb4&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=c&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=tiles",
    },
    //arcgis地图
    ArcgisURL: {
        Sink: IP10 + "/arcgis/rest/services/EDATA/Sink/MapServer/2/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryPoint&inSR=&spatialRel=esriSpatialRelOverlaps&relationParam=&outFields=RES,AZIMUTH,RANGE,H_STDEV,V_STDEV,VEL%2CHEIGHT+&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&f=json",
        ImageServer: IP10 + "/arcgis/rest/services/EDATA/lspop2013/ImageServer/exportImage/export?bbox=98.701171875%2C31.102294921874996%2C98.71215820312499%2C31.113281250000004&size=256%2C256&format=png&transparent=true&f=image&bboxSR=4326&imageSR=4326",
        Life_lost_years: IP9 + "/arcgis/rest/services/WorldDB/Life_lost_years/MapServer",
        Seismic_hazard_PGA_RT475years: IP9 + "/arcgis/rest/services/WorldDB/Seismic_hazard_PGA_RT475years/ImageServer",
        chinanew: IP11 + "/arcgis/rest/services/chinanew/MapServer/tile/{z}/{y}/{x}",
        GX: IP12 + "/arcgis/rest/services/GX/%E6%B0%B4%E4%BD%932016/MapServer/0/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&f=pjson",   
    },
    //谷歌地图
    GoogleURL: {
        //卫星图
        satellite: "https://mt1.google.cn/vt/lyrs=s&x={x}&y={y}&z={z}",
        // 备用 "http://www.google.cn/maps/vt?lyrs=s@716&x={x}&y={y}&z={z}"
        // 备用  "https://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}"
        s: "http://mt1.google.cn/maps/vt?lyrs=y&gl=cn&x={x}&y={y}&z={z}",
        //带标签的卫星图
        satelliteTag: "http://mt2.google.cn/vt/lyrs=y&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s=G",
        //变体XZY
        xyz: "http://mt2.google.cn/vt/lyrs=y&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&g={g}",
    }
}

