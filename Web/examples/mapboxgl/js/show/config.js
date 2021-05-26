/**
 * WebGL 示例配置文件：包含示例的分类、名称、缩略图、文件路径
 */
var identification = {
    name: "WebGL"
};
var exampleConfig = {
    "layer": {
        name: "地图",
        name_en: "map",
        content: {
            "Layer Raster": {
                name: "影像",
                name_en: "Layer Raster",
                content: [
                    {
                        name: "栅格图层",
                        name_en: "GridTileLayer",
                        thumbnail: "layer_GridTileLayer.jpg",
                        fileName: "Layer_GridTileLayer"
                    },
                    {
                        name: "影像XYZ服务",
                        name_en: "VectorTileLayer",
                        thumbnail: "layer_XYZLayer.jpg",
                        fileName: "Layer_XYZLayer"
                    },
                    {
                        name: "影像WMS服务",
                        name_en: "VectorTileLayer",
                        thumbnail: "layer_WMSLayer.jpg",
                        fileName: "Layer_WMSLayer"
                    },
                    {
                        name: "影像WMTS服务",
                        name_en: "VectorTileLayer",
                        thumbnail: "layer_WMTSLayer.jpg",
                        fileName: "Layer_WMTSLayer"
                    },
                ]
            },
            "Layer Vector": {
                name: "矢量",
                name_en: "Vector",
                content: [
                    {
                        name: "矢量图层",
                        name_en: "VectorTileLayer",
                        thumbnail: "layer_VectorTileLayer.jpg",
                        fileName: "Layer_VectorTileLayer"
                    },
                    {
                        name: "GeoJson数据",
                        name_en: "S3MTiles_suofeiya",
                        thumbnail: "layer_GeoJsonLayer.jpg",
                        fileName: "Layer_GeoJsonLayer"
                    },
                    {
                        name: "PBF数据",
                        name_en: "GeoJson download",
                        thumbnail: "Graphics_GeoJsondownload.jpg",
                        fileName: "Graphics_GeoJsondownload"
                    },
                ]
            },
            "Layer DEM": {
                name: "地形",
                name_en: "DEM",
                content: [
                    // {
                    //     name: "3DMax数据",
                    //     name_en: "max3d",
                    //     thumbnail: "thumb.jpg",
                    //     fileName: "Cesium_setDataScoure"
                    // }
                    // ,
                    {
                        name: "DEM数据",
                        name_en: "dem",
                        thumbnail: "thumb.jpg",
                        fileName: "Cesium_DEM"
                    }
                ]
            },
            "Layer Model": {
                name: "模型",
                name_en: "Model",
                content: [
                    {
                        name: "OSGB数据",
                        name_en: "osgb",
                        thumbnail: "osgb.jpg",
                        fileName: "Cesium_3Dtile"
                    },
                    {
                        name: "白膜数据",
                        name_en: "task",
                        thumbnail: "task.jpg",
                        fileName: "Cesium_modelLayer"
                    },
                ]
            },
            "Layer Online": {
                name: "在线地图",
                name_en: "Online",
                content: [
                    {
                        name: "百度地图",
                        name_en: "baidu",
                        thumbnail: "Layer_baiduLayer.png",
                        fileName: "Layer_BaiduLayer"
                    },
                ]
            },
        }
    },
    "display": {
        name: "显示",
        name_en: "display",
        content: {
            "Graphics draw": {
                name: "场景",
                name_en: "Graphics draw",
                content: [
                ]
            },
            "Coordinate": {
                name: "坐标转换",
                name_en: "Coordinate transform",
                content: [
                    {
                        name: "投影转换",
                        name_en: "ProjectionTransformation",
                        thumbnail: "Pro_Transformation.jpg",
                        fileName: "Pro_Transformation"
                    },
                ]
            },
            "Layer control": {
                name: "图层管理",
                name_en: "Control",
                content: [
                    {
                        name: "数据下载",
                        name_en: "GeoJson download",
                        thumbnail: "Graphics_GeoJsondownload.jpg",
                        fileName: "Graphics_GeoJsondownload"
                    },
                    {
                        name: "地图类型",
                        name_en: "Map type",
                        thumbnail: "Graphics_MapType.jpg",
                        fileName: "Graphics_MapType"
                    },
                ]
            },
            "Browse fly": {
                name: "浏览和飞行",
                name_en: "Browse fly",
                content: [
                    {
                        name: "缩放",
                        name_en: "VectorTileLayer",
                        thumbnail: "zoom.png",
                        fileName: "Cesium_zoomHandler"
                    },
                ]
            },
            "Dynamic extent": {
                name: "动态效果拓展",
                name_en: "Dynamic extent",
                content: [
                    {
                        name: "城市空气质量",
                        name_en: "Echart_EffectScattermap",
                        thumbnail: "Echart_EffectScattermap.jpg",
                        fileName: "Echart_EffectScattermap"
                    },
                    {
                        name: "热力图",
                        name_en: "heatmap",
                        thumbnail: "layer_HeatmapLayer.jpg",
                        fileName: "Thematic_HeatmapLayer"
                    },
                    {
                        name: "模拟迁移",
                        name_en: "Echart_Geoline",
                        thumbnail: "Echart_Geoline.jpg",
                        fileName: "Echart_Geoline"
                    },
                    {
                        name: "微博签到数据",
                        name_en: "Echart_Scatterweibo",
                        thumbnail: "Echart_Scatterweibo.jpg",
                        fileName: "Echart_Scatterweibo"
                    },
                    {
                        name: "城市空气质量",
                        name_en: "Echart_EffectScattermap",
                        thumbnail: "Echart_EffectScattermap.jpg",
                        fileName: "Echart_EffectScattermap"
                    },
                    {
                        name: "轨迹模拟",
                        name_en: "VectorTileLayer",
                        thumbnail: "roamHandler.png",
                        fileName: "Cesium_roamHandler"
                    },
                    {
                        name: "雷达卫星",
                        name_en: "ThreeJS_Radar",
                        thumbnail: "ThreeJS_Radar.jpg",
                        fileName: "ThreeJS_Radar"
                    },
                    {
                        name: "雨雪天气1",
                        name_en: "weather map",
                        thumbnail: "weatherHandler.png",
                        fileName: "Cesium_weatherHandler"
                    },
                    {
                        name: "雨雪天气2",
                        name_en: "weather map",
                        thumbnail: "weatherHandler2.png",
                        fileName: "Cesium_weatherHandler_Screen"
                    }
                ]
            },
        }
    },
    "query": {
        name: "查询",
        name_en: "query",
        content: {
            "query spatial": {
                name: "空间查询",
                name_en: "query spatial",
                content: [
                    {
                        name: "坐标查询",
                        name_en: "CoordinateLocation",
                        thumbnail: "layer_CoordinateLocation.jpg",
                        fileName: "Layer_CoordinateLocation"
                    },
                ]
            },
            "query attribute": {
                name: "属性查询",
                name_en: "query attribute",
                content: [

                ]
            }
        }
    },
    "edit": {
        name: "编辑",
        name_en: "edit",
        content: {
            "二维对象编辑": {
                name: "二维对象编辑",
                name_en: "edit 2D",
                content: [
                    {
                        name: "添加移动删除点",
                        name_en: "addRemoveMove points",
                        thumbnail: "Graphics_addRemoveMovePoints.jpg",
                        fileName: "Graphics_addRemoveMovePoints"
                    },
                    {
                        name: "图形选择",
                        name_en: "graphics select",
                        thumbnail: "Graphics_SelectGraphics.jpg",
                        fileName: "Graphics_SelectGraphics"
                    },
                    /* {
                         name: "图层设置",
                         name_en: "Layer settings",
                         thumbnail: "Graphics_LayerCountSettings.jpg",
                         fileName: "Graphics_LayerCountSettings"
                     }, */
                    {
                        name: "图形编辑",
                        name_en: "GraphicsEditor",
                        thumbnail: "Graphics_Editor.jpg",
                        fileName: "Graphics_Editor"
                    },
                    {

                        name: "几何图形添加",
                        name_en: "addGeometry",
                        thumbnail: "Graphics_addGeometry.jpg",
                        fileName: "Graphics_addGeometry"
                    }, {
                        name: "矩形框选",
                        name_en: "Rectangle select",
                        thumbnail: "Graphics_RectangleSelect.jpg",
                        fileName: "Graphics_RectangleSelect"
                    },
                    {
                        name: "绘制图形",
                        name_en: "DrawGraphics",
                        thumbnail: "Graphics_GraphicsLayer.jpg",
                        fileName: "Graphics_GraphicsLayer"
                    },
                    {
                        name: "范围选择",
                        name_en: "DrawGraphics",
                        thumbnail: "drawtool.png",
                        fileName: "Cesium_drawHelper"
                    },
                ]
            },
            "三维对象编辑": {
                name: "三维对象编辑",
                name_en: "edit 3D",
                content: [

                ]
            },
            "态势标绘": {
                name: "态势标绘",
                name_en: "Situation plot",
                content: [
                    {
                        name: "JB标绘",
                        name_en: "JB_plot",
                        thumbnail: "JB_plot.png",
                        fileName: "JB_plot"
                    },
                ]
            },
            "符号库": {
                name: "符号库",
                name_en: "symbol",
                content: [

                ]
            },
        }
    },
    "analyze": {
        name: "分析",
        name_en: "analyze",
        content: {
            "二维量算分析": {
                name: "二维量算分析",
                name_en: "analyze 2D",
                content: [
                    {
                        name: "距离量测",
                        name_en: "Distance Measure",
                        thumbnail: "measure_Distance.jpg",
                        fileName: "Measure_Distance"
                    },
                    {
                        name: "面积量测",
                        name_en: "Area Measure",
                        thumbnail: "measure_Area.jpg",
                        fileName: "Measure_Area"
                    }
                ]
            },
            "三维量算分析": {
                name: "三维量算分析",
                name_en: "analyze 3D",
                content: [
                    {
                        name: "距离量算",
                        name_en: "analyze3D_distanceMeasurement",
                        thumbnail: "analyze3D_distanceMeasurement.jpg",
                        fileName: "analyze3D_distanceMeasurement"
                    },
                    {
                        name: "面积量算",
                        name_en: "analyze3D_areaMeasurement",
                        thumbnail: "analyze3D_areaMeasurement.jpg",
                        fileName: "analyze3D_areaMeasurement"
                    },
                    {
                        name: "空间测量",
                        name_en: "SpaceMeasurement",
                        thumbnail: "measureHandler.png",
                        fileName: "Cesium_measureHandler"
                    },
                    {
                        name: "剖面分析",
                        name_en: "analyze3D_profileAnalysis",
                        thumbnail: "analyze3D_profileAnalysis.jpg",
                        fileName: "analyze3D_profileAnalysis"
                    },
                    {
                        name: "淹没分析",
                        name_en: "analyze3D_floodAnalysis",
                        thumbnail: "analyze3D_floodAnalysis.jpg",
                        fileName: "analyze3D_floodAnalysis"
                    },
                    {
                        name: "可视域分析",
                        name_en: "analyze3D_viewableAnalysis",
                        thumbnail: "analyze3D_viewableAnalysis.jpg",
                        fileName: "analyze3D_viewableAnalysis"
                    },
                    {
                        name: "模型通视分析",
                        name_en: "analyze3D_modelVisiableAnalysis",
                        thumbnail: "analyze3D_modelVisiableAnalysis.jpg",
                        fileName: "analyze3D_modelVisiableAnalysis"
                    },
                    {
                        name: "地形通视分析",
                        name_en: "analyze3D_terrainVisiableAnalysis",
                        thumbnail: "analyze3D_terrainVisiableAnalysis.jpg",
                        fileName: "analyze3D_terrainVisiableAnalysis"
                    },
                    {
                        name: "日照分析",
                        name_en: "analyze3D_sunAnalysis",
                        thumbnail: "analyze3D_sunAnalysis.jpg",
                        fileName: "analyze3D_sunAnalysis"
                    },
                    {
                        name: "动态可视域分析",
                        name_en: "analyze3D_dynamicViewableAnalysis",
                        thumbnail: "analyze3D_dynamicViewableAnalysis.jpg",
                        fileName: "analyze3D_dynamicViewableAnalysis"
                    }                    
                ]
            },
        }
    },
    "thematic": {
        name: "专题",
        name_en: "thematic",
        content: {
            "气象海洋": {
                name: "气象海洋",
                name_en: "Meteorological ocean",
                content: [
                    {
                        name: "站点数据",
                        name_en: "station",
                        thumbnail: "Observation_Station.jpg",
                        fileName: "Observation_Station"
                    },
                    {
                        name: "等值线分析图",
                        name_en: "IsoLineLayer",
                        thumbnail: "Observation_IsoLineLayer.jpg",
                        fileName: "Observation_IsoLineLayer"
                    },
                    {
                        name: "风力图",
                        name_en: "WindMapLayer",
                        thumbnail: "Pattern_WindMapLayer.jpg",
                        fileName: "Pattern_WindMapLayer"
                    },
                    {
                        name: "风羽图",
                        name_en: "WindIconLayer",
                        thumbnail: "Pattern_WindIconLayer.jpg",
                        fileName: "Pattern_WindIconLayer"
                    },
                    {
                        name: "格网值",
                        name_en: "WindTextLayer",
                        thumbnail: "Pattern_WindTextLayer.jpg",
                        fileName: "Pattern_WindTextLayer"
                    },
                    {
                        name: "色斑图",
                        name_en: "Pattern_SpotPattern",
                        thumbnail: "Pattern_SpotPattern.jpg",
                        fileName: "Pattern_SpotPattern"
                    },
                    {
                        name: "云图",
                        name_en: "cloud map",
                        thumbnail: "Cloud_mapLayer.jpg",
                        fileName: "Cloud_mapLayer"
                    }
                ]
            },
            "农业": {
                name: "农业",
                name_en: "Agriculture",
                content: [

                ]
            },
            "灾害": {
                name: "灾害",
                name_en: "Disaster",
                content: [
                    {
                        name: "洪水模拟",
                        name_en: "Typhoon map",
                        thumbnail: "floodInundation.png",
                        fileName: "Cesium_floodInundation"
                    },
                    {
                        name: "台风图",
                        name_en: "Typhoon map",
                        thumbnail: "Typhoon_mapLayer.jpg",
                        fileName: "Typhoon_mapLayer"
                    }
                ]
            },
            "水利": {
                name: "水利",
                name_en: "Water",
                content: [
                    {
                        name: "雷达卫星",
                        name_en: "ThreeJS_Radar",
                        thumbnail: "ThreeJS_Radar.jpg",
                        fileName: "ThreeJS_Radar"
                    },
                ]
            },
            "国土": {
                name: "国土",
                name_en: "land",
                content: [
                    {
                        name: "雷达卫星",
                        name_en: "ThreeJS_Radar",
                        thumbnail: "ThreeJS_Radar.jpg",
                        fileName: "ThreeJS_Radar"
                    },
                ]
            },
        }
    },
    "view": {
        name: "视图",
        name_en: "view",
        content: {
            "basic control": {
                name: "基础控件",
                name_en: "control",
                content: [
                    {
                        name: "缩放控件",
                        name_en: "controler_zoom",
                        thumbnail: "controler_zoom.png",
                        fileName: "controler_zoom"
                    },
                    {
                        name: "比例尺控件",
                        name_en: "controler_scaleline",
                        thumbnail: "controler_scaleline.png",
                        fileName: "controler_scaleline.png"
                    },
                    {
                        name: "版权控件",
                        name_en: "controler_attribution",
                        thumbnail: "controler_attribution.png",
                        fileName: "controler_attribution.png"
                    },
                    {
                        name: "图层控件",
                        name_en: "controler_layerswitcher",
                        thumbnail: "controler_layerswitcher.png",
                        fileName: "controler_layerswitcher"
                    },
                    {
                        name: "卷帘",
                        name_en: "controler_layerswitch",
                        thumbnail: "controler_layerswitch.png",
                        fileName: "controler_layerswitch"
                    },
                    {
                        name: "鹰眼",
                        name_en: "controler_overviewMap",
                        thumbnail: "controler_overviewMap.png",
                        fileName: "controler_overviewMap"
                    },
                    {
                        name: "复位",
                        name_en: "Echart_EffectScattermap",
                        thumbnail: "Echart_EffectScattermap.jpg",
                        fileName: "Echart_EffectScattermap"
                    },
                    {
                        name: "2D/3D",
                        name_en: "Echart_EffectScattermap",
                        thumbnail: "Echart_EffectScattermap.jpg",
                        fileName: "Echart_EffectScattermap"
                    },
                ]
            },
            "components": {
                name: "组件",
                name_en: "components_openFile",
                content: [
                    {
                        name: "打开文件",
                        name_en: "components_openFile",
                        thumbnail: "components_openFile.png",
                        fileName: "components_openFile"
                    }
                ]
            },
            "plugs": {
                name: "插件",
                name_en: "plugs",
                content: [
                    {
                        name: "气象海洋分析展示插件",
                        name_en: "components_openFile",
                        thumbnail: "components_openFile.png",
                        fileName: "components_openFile"
                    },
                    {
                        name: "灾害分析展示插件",
                        name_en: "components_openFile",
                        thumbnail: "components_openFile.png",
                        fileName: "components_openFile"
                    },
                    {
                        name: "AI分析展示插件",
                        name_en: "components_openFile",
                        thumbnail: "components_openFile.png",
                        fileName: "components_openFile"
                    },
                    {
                        name: "Echarts插件",
                        name_en: "components_openFile",
                        thumbnail: "components_openFile.png",
                        fileName: "components_openFile"
                    },
                ]
            },
        }
    },
    "help": {
        name: "帮助",
        name_en: "help",
        content: {
            "API": {
                name: "产品API文档",
                name_en: "API",
                content: [
                    {
                        name: "产品API文档",
                        name_en: "Echart_Geoline",
                        thumbnail: "Echart_Geoline.jpg",
                        fileName: "Echart_Geoline"
                    },
                ]
            },
            "SDK": {
                name: "产品开发包",
                name_en: "SDK",
                content: [
                    {
                        name: "产品开发包",
                        name_en: "Echart_Scatterweibo",
                        thumbnail: "Echart_Scatterweibo.jpg",
                        fileName: "Echart_Scatterweibo"
                    },
                ]
            },
            "About": {
                name: "关于我们",
                name_en: "About",
                content: [
                    {
                        name: "关于我们",
                        name_en: "Echart_EffectScattermap",
                        thumbnail: "Echart_EffectScattermap.jpg",
                        fileName: "Echart_EffectScattermap"
                    }
                ]
            },
        }
    },
  };

/**
 *key值：为exampleConfig配置的key值或者fileName值
 *      （为中间节点时是key值，叶结点是fileName值）
 *value值：fontawesome字体icon名
 *不分层
 */
var sideBarIconConfig = {
    "layer": "fa-map",
    "display": "fa-pencil-square",
    "query": "fa-globe",
	"edit":"fa-edit",
    "analyze":"fa-map",
    "thematic":"fa-cube",
    "view":"fa-eye",
    "help":"fa-pencil",
  /* "KMLAndModel": "fa-cubes",
    "online-draw": "fa-edit",
    "search": "fa-search",
    "measurement": "fa-arrows-v",
    "analysis": "fa-map",
    "visualization": "fa-eye",
    "stereoscopic-show": "fa-cube",
    "plot": "fa-pencil"*/
};

/**
 *key值：为exampleConfig配置的key值
 *value值：fontawesome字体icon名
 *与sideBarIconConfig的区别：sideBarIconConfig包括侧边栏所有层级目录的图标，exampleIconConfig仅包括一级标题的图标
 */
var exampleIconConfig = {
    "layer": "fa-map",
    "display": "fa-pencil-square",
    "query": "fa-globe",
    "edit":"fa-edit",
    "analyze":"fa-map",
    "thematic":"fa-cube",
    "view":"fa-eye",
    "help":"fa-pencil",

    // "display": "fa-pencil-square",
    // "Visualization": "fa-globe",
    // "layer": "fa-map",
	// "Plugins":"fa-edit",

  /*  "KMLAndModel": "fa-cubes",
    "online-draw": "fa-edit",
    "search": "fa-search",
    "measurement": "fa-arrows-v",
    "analysis": "fa-map",
    "visualization": "fa-eye",
    "stereoscopic-show": "fa-cube",
    "plot": "fa-pencil"*/

   /*
   地图、
   显示、
   查询、
   编辑、
   分析、
   专题、
   视图、
   帮助
   * */
};