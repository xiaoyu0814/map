/**
 * WebGL 示例配置文件：包含示例的分类、名称、缩略图、文件路径
 */
var identification = {
    name: "WebGL"
};
var exampleConfig = {
    "display": {
        name: "显示",
        name_en: "display",
        content: {
            "Dynamic extent": {
                name: "动态效果拓展",
                name_en: "Dynamic extent",
                content: [
                    {
                        name: "轨迹模拟",
                        name_en: "VectorTileLayer",
                        thumbnail: "roamHandler.png",
                        fileName: "Cesium_roamHandler"
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
            }
        }
    },
    "analyze": {
        name: "分析",
        name_en: "analyze",
        content: {
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
                    },
                    {
                        name: "三维分析",
                        name_en: "3DAnalysis",
                        thumbnail: "analyze3D_dynamicViewableAnalysis.jpg",
                        fileName: "3DAnalysis"
                    }                   
                ]
            },
        }
    },
    // "thematic": {
    //     name: "专题",
    //     name_en: "thematic",
    //     content: {
    //         "气象海洋": {
    //             name: "气象海洋",
    //             name_en: "Meteorological ocean",
    //             content: [
    //                 {
    //                     name: "站点数据",
    //                     name_en: "station",
    //                     thumbnail: "Observation_Station.jpg",
    //                     fileName: "Observation_Station"
    //                 },
    //                 {
    //                     name: "等值线分析图",
    //                     name_en: "IsoLineLayer",
    //                     thumbnail: "Observation_IsoLineLayer.jpg",
    //                     fileName: "Observation_IsoLineLayer"
    //                 },
    //                 {
    //                     name: "风力图",
    //                     name_en: "WindMapLayer",
    //                     thumbnail: "Pattern_WindMapLayer.jpg",
    //                     fileName: "Pattern_WindMapLayer"
    //                 },
    //                 {
    //                     name: "风羽图",
    //                     name_en: "WindIconLayer",
    //                     thumbnail: "Pattern_WindIconLayer.jpg",
    //                     fileName: "Pattern_WindIconLayer"
    //                 },
    //                 {
    //                     name: "格网值",
    //                     name_en: "WindTextLayer",
    //                     thumbnail: "Pattern_WindTextLayer.jpg",
    //                     fileName: "Pattern_WindTextLayer"
    //                 },
    //                 {
    //                     name: "色斑图",
    //                     name_en: "Pattern_SpotPattern",
    //                     thumbnail: "Pattern_SpotPattern.jpg",
    //                     fileName: "Pattern_SpotPattern"
    //                 },
    //                 {
    //                     name: "云图",
    //                     name_en: "cloud map",
    //                     thumbnail: "Cloud_mapLayer.jpg",
    //                     fileName: "Cloud_mapLayer"
    //                 }
    //             ]
    //         },
    //         "灾害": {
    //             name: "灾害",
    //             name_en: "Disaster",
    //             content: [
    //                 {
    //                     name: "洪水模拟",
    //                     name_en: "Typhoon map",
    //                     thumbnail: "floodInundation.png",
    //                     fileName: "Cesium_floodInundation"
    //                 },
    //                 {
    //                     name: "台风图",
    //                     name_en: "Typhoon map",
    //                     thumbnail: "Typhoon_mapLayer.jpg",
    //                     fileName: "Typhoon_mapLayer"
    //                 }
    //             ]
    //         }
    //     }
    // },
    // "view": {
    //     name: "视图",
    //     name_en: "view",
    //     content: {
    //         "basic control": {
    //             name: "基础控件",
    //             name_en: "control",
    //             content: [
    //                 {
    //                     name: "缩放控件",
    //                     name_en: "controler_zoom",
    //                     thumbnail: "controler_zoom.png",
    //                     fileName: "controler_zoom"
    //                 },
    //                 {
    //                     name: "比例尺控件",
    //                     name_en: "controler_scaleline",
    //                     thumbnail: "controler_scaleline.png",
    //                     fileName: "controler_scaleline.png"
    //                 },
    //                 {
    //                     name: "版权控件",
    //                     name_en: "controler_attribution",
    //                     thumbnail: "controler_attribution.png",
    //                     fileName: "controler_attribution.png"
    //                 },
    //                 {
    //                     name: "图层控件",
    //                     name_en: "controler_layerswitcher",
    //                     thumbnail: "controler_layerswitcher.png",
    //                     fileName: "controler_layerswitcher"
    //                 },
    //                 {
    //                     name: "卷帘",
    //                     name_en: "controler_layerswitch",
    //                     thumbnail: "controler_layerswitch.png",
    //                     fileName: "controler_layerswitch"
    //                 },
    //                 {
    //                     name: "鹰眼",
    //                     name_en: "controler_overviewMap",
    //                     thumbnail: "controler_overviewMap.png",
    //                     fileName: "controler_overviewMap"
    //                 },
    //                 {
    //                     name: "复位",
    //                     name_en: "Echart_EffectScattermap",
    //                     thumbnail: "Echart_EffectScattermap.jpg",
    //                     fileName: "Echart_EffectScattermap"
    //                 },
    //                 {
    //                     name: "2D/3D",
    //                     name_en: "Echart_EffectScattermap",
    //                     thumbnail: "Echart_EffectScattermap.jpg",
    //                     fileName: "Echart_EffectScattermap"
    //                 },
    //             ]
    //         }
    //     }
    // }
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