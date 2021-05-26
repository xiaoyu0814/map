/**
 * WebGL 示例配置文件：包含示例的分类、名称、缩略图、文件路径
 */
var identification = {
    name: "WebGL"
};
var exampleConfig = {
    "layer": {
        name: "地图",
        name_en: "Map",
        content: {
            "Layer Raster": {
                name: "影像",
                name_en: "Raster",
                content: [
                    {
                        name: "栅格图层",
                        name_en: "GridTileLayer",
                        thumbnail: "layer_GridTileLayer.jpg",
                        fileName: "Layer_GridTileLayer"
                    },
                    {
                        name: "影像XYZ服务",
                        name_en: "XYZLayer",
                        thumbnail: "layer_XYZLayer.jpg",
                        fileName: "Layer_XYZLayer"
                    },
                    {
                        name: "影像WMS服务",
                        name_en: "WMSLayer",
                        thumbnail: "layer_WMSLayer.jpg",
                        fileName: "Layer_WMSLayer"
                    },
                    {
                        name: "影像WMTS服务",
                        name_en: "WMTSLayer",
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
                        name: "矢量WFS服务",
                        name_en: "VectorWFSLayer",
                        thumbnail: "layer_WFSLayer.png",
                        fileName: "Layer_WFSLayer"
                    },
                    {
                        name: "矢量图层",
                        name_en: "VectorTileLayer",
                        thumbnail: "layer_VectorTileLayer.jpg",
                        fileName: "Layer_VectorTileLayer"
                    },
                    {
                        name: "GeoJson数据",
                        //name_en: "S3MTiles_suofeiya",
                        name_en: "GeoJson Data",
                        thumbnail: "layer_GeoJsonLayer.jpg",
                        fileName: "Layer_GeoJsonLayer"
                    },
                    {
                        name: "矢量掩膜数据",
                        name_en: "VectorMaskLayer",
                        thumbnail: "Layer_VectorMaskLayer.png",
                        fileName: "Layer_VectorMaskLayer"
                    },
                    {
                        name: "PBF数据",
                        //name_en: "GeoJson download",
                        name_en: "PBF Data",
                        thumbnail: "Graphics_GeoJsondownload.jpg",
                        fileName: "Graphics_GeoJsondownload"
                    }
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
                        name_en: "DEM Data",
                        thumbnail: "Cesium_DEM.png",
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
                        name_en: "OSGB Data",
                        thumbnail: "osgb.jpg",
                        fileName: "Cesium_3Dtile"
                    },
                    {
                        name: "白膜数据",
                        name_en: "WhiteModel Data",
                        thumbnail: "task.jpg",
                        fileName: "Cesium_modelLayer"
                    },
                    {
                        name: "fbx",
                        name_en: "FBX",
                        thumbnail: "cesium_fbx.png",
                        fileName: "Cesium_loadFBX"
                    },
                    {
                        name: "obj",

                        name_en: "task",
                        thumbnail: "cesium_obj.png",
                        fileName: "Cesium_loadObj"
                    },
                    {
                        name: "3ds",
                        name_en: "3DS",
                        thumbnail: "cesium_3ds.png",
                        fileName: "Cesium_load3dsHandler"
                    },
                    {
                        name: "点云数据",
                        name_en: "task",
                        thumbnail: "cesium_pointCloud.png",
                        fileName: "Cesium_loadPointCloudHandler"
                    },
                    {
                        name: "BIM数据",
                        name_en: "task",
                        thumbnail: "cesium_bim.png",
                        fileName: "Cesium_loadBIMHandler"
                    },
                    {
                        name: "三维管线",
                        name_en: "3D Pipeline",
                        thumbnail: "cesium_pipleline.png",
                        fileName: "Cesium_loadPipelineHandler"
                    },
                ]
            },
            "Layer Online": {
                name: "在线地图",
                name_en: "Online",
                content: [
                    {
                        name: "百度地图",
                        name_en: "Baidu Map",
                        thumbnail: "Layer_baiduLayer.png",
                        fileName: "Layer_BaiduLayer"
                    },
                    {
                        name: "Google地图",
                        name_en: "Google Map",
                        thumbnail: "Layer_googleLayer.png",
                        fileName: "Layer_GoogleLayer"
                    },
                    {
                        name: "BingMap",
                        name_en: "Bing Map",
                        thumbnail: "Layer_BingLayer.png",
                        fileName: "Layer_BingLayer"
                    },
                    {
                        name: "高德地图",
                        name_en: "Gaode Map",
                        thumbnail: "Layer_gaodeLayer.png",
                        fileName: "Layer_GaodeLayer"
                    },
                    {
                        name: "Arcgis地图",
                        name_en: "Arcgis Map",
                        thumbnail: "Layer_arcgisLayer.png",
                        fileName: "Layer_ArcgisMapLayer"
                    },
                    {
                        name: "Mapbox地图",
                        name_en: "Mapbox Map",
                        thumbnail: "Layer_mapboxLayer.png",
                        fileName: "Layer_MapboxLayer"
                    }
                ]
            },
        }
    },
    "display": {
        name: "显示",
        name_en: "Display",
        content: {
            "Graphics draw": {
                name: "场景",
                name_en: "Sence",
                content: [{
                    name:"场景转换",
                    name_en:"SenceTransform",
                    thumbnail: "cameraController.png",
                    fileName: "Layer_SenceTransform"
                }
                ]
            },
            "Coordinate": {
                name: "坐标转换",
                name_en: "Coordinate Transform",
                content: [
                    {
                        name: "投影转换",
                        name_en: "ProjectionTransformation",
                        thumbnail: "Pro_Transformation.jpg",
                        fileName: "Pro_Transformation"
                    },
                    {
                        name: "二三维联动",
                        name_en: "Interactive 2D&3D",
                        thumbnail: "Map_Linkage.png",
                        fileName: "Map_Linkage"
                    },
                    {
                        name: "wgs84",
                        name_en: "WGS84",
                        thumbnail: "cesium_wgs84.png",
                        fileName: "Cesium_wgs84"
                    },
                    {
                        name: "webmercator",
                        name_en: "WebMercator",
                        thumbnail: "webmercator.png",
                        fileName: "Cesium_webmercator"
                    },
                ]
            },
            "Layer control": {
                name: "图层管理",
                name_en: "Layer Control",
                content: [
                    {
                        name: "数据下载",
                        name_en: "GeoJson Download",
                        thumbnail: "Graphics_GeoJsondownload.jpg",
                        fileName: "Graphics_GeoJsondownload"
                    },
                    {
                        name: "地图类型",
                        name_en: "Map Type",
                        thumbnail: "Graphics_MapType.jpg",
                        fileName: "Graphics_MapType"
                    },
                ]
            },
            "Browse fly": {
                name: "浏览和飞行",
                name_en: "Browse and Fly",
                content: [
                    {
                        name: "缩放",
                        name_en: "Zoom",
                        thumbnail: "Cesium_drawHandler.png",
                        fileName: "Cesium_zoomHandler"
                    },
                ]
            },
            "Dynamic extent": {
                name: "动态效果拓展",
                name_en: "Dynamic Extent",
                content: [
                    {
                        name: "城市空气质量",
                        name_en: "Urban Air Quality",
                        thumbnail: "Echart_EffectScattermap.jpg",
                        fileName: "Echart_EffectScattermap"
                    },
                    {
                        name: "热力图",
                        name_en: "Heat Map",
                        thumbnail: "layer_HeatmapLayer.jpg",
                        fileName: "Thematic_HeatmapLayer"
                    },
                    {
                        name: "模拟迁移",
                        name_en: "Migration Simulation",
                        thumbnail: "Echart_Geoline.jpg",
                        fileName: "Echart_Geoline"
                    },
                    {
                        name: "微博签到数据",
                        name_en: "Scatter Weibo",
                        thumbnail: "Echart_Scatterweibo.jpg",
                        fileName: "Echart_Scatterweibo"
                    },
                    // {
                    //     name: "城市空气质量",
                    //     name_en: "Echart_EffectScattermap",
                    //     thumbnail: "Echart_EffectScattermap.jpg",
                    //     fileName: "Echart_EffectScattermap"
                    // },
                    {
                        name: "轨迹模拟",
                        name_en: "Trajectory Simulation",
                        thumbnail: "roamHandler.png",
                        fileName: "Cesium_roamHandler"
                    },
                    {
                        name: "雷达卫星",
                        name_en: "Radar Satellite",
                        thumbnail: "ThreeJS_Radar.jpg",
                        fileName: "ThreeJS_Radar"
                    },
                    {
                        name: "雨雪天气1",
                        name_en: "Weather Map1",
                        thumbnail: "weatherHandler.png",
                        fileName: "Cesium_weatherHandler"
                    },
                    {
                        name: "雨雪天气2",
                        name_en: "Weather Map2",
                        thumbnail: "weatherHandler2.png",
                        fileName: "Cesium_weatherHandler_Screen"
                    },
					{
                        name: "烟花效果",
                        name_en: "fireworks",
                        thumbnail: "Cesium_Fireworks.png",
                        fileName: "Cesium_Fireworks"
                    },
                    {
                        name: "经纬网",
                        name_en: "Graticules",
                        thumbnail: "graticules.png",
                        fileName: "Cesium_graticules"
                    },
                ]
            },
        }
    },
    "query": {
        name: "查询",
        name_en: "Query",
        content: {
            "query spatial": {
                name: "空间查询",
                name_en: "Spatial Query",
                content: [
                    {
                        name: "坐标查询",
                        name_en: "Coordinate Query",
                        thumbnail: "layer_CoordinateLocation.jpg",
                        fileName: "Layer_CoordinateLocation"
                    },
                    {
                        name: "绘制查询",
                        name_en: "Draw Query",
                        thumbnail: "Query_Draw.png",
                        fileName: "Query_Draw"
                    },
                    {
                        name: "范围查询",
                        name_en: "Bounds Query",
                        thumbnail: "Query_Bounds.png",
                        fileName: "Query_Bounds"
                    },
                ]
            },
            "query attribute": {
                name: "属性查询",
                name_en: "Attribute Query",
                content: [
                    {
                        name: "ID查询",
                        name_en: "ID Query",
                        thumbnail: "Query_ID.png",
                        fileName: "Query_ID"
                        // fileName:"testwfs"
                    },
                    {
                        name: "字段查询",
                        name_en: "Field Query",
                        thumbnail: "Query_Field.png",
                        fileName: "Query_Field"
                    },
                    {
                        name: "地物查询",
                        name_en: "PlaceName Query",
                        thumbnail: "Query_PlaceName.png",
                        fileName: "Query_PlaceName"
                    },
                ]
            }
        }
    },
    "edit": {
        name: "编辑",
        name_en: "Edit",
        content: {
            "二维对象编辑": {
                name: "二维对象编辑",
                name_en: "Edit 2D",
                content: [
                    {
                        name: "节点编辑",
                        name_en: "AddRemoveMove Points",
                        thumbnail: "Graphics_addRemoveMovePoints.jpg",
                        fileName: "Graphics_addRemoveMovePoints"
                    },
                    // {
                    //     name: "图形选择",
                    //     name_en: "Graphics Select",
                    //     thumbnail: "Graphics_SelectGraphics.jpg",
                    //     fileName: "Graphics_SelectGraphics"
                    // },
                    /* {
                         name: "图层设置",
                         name_en: "Layer settings",
                         thumbnail: "Graphics_LayerCountSettings.jpg",
                         fileName: "Graphics_LayerCountSettings"
                     }, */
                    {
                        name: "样式编辑",
                        name_en: "Graphics Edit",
                        thumbnail: "Graphics_Editor.jpg",
                        fileName: "Graphics_Editor"
                    },
                    // {

                    //     name: "几何图形添加",
                    //     name_en: "Add Geometry",
                    //     thumbnail: "Graphics_addGeometry.jpg",
                    //     fileName: "Graphics_addGeometry"
                    // }, 
                    {
                        name: "矩形框选",
                        name_en: "Rectangle Select",
                        thumbnail: "Graphics_RectangleSelect.jpg",
                        fileName: "Graphics_RectangleSelect"
                    },
                    {
                        name: "绘制图形",
                        name_en: "Draw Graphics",
                        thumbnail: "Graphics_GraphicsLayer.jpg",
                        fileName: "Graphics_GraphicsLayer"
                    },
                    {
                        name: "二维标绘",
                        name_en: "Range Select",
                        thumbnail: "openlayer_drawtool.png",
                        fileName: "Openlayer_drawHelper"
                    },
                    {
                        name: "对象合并",
                        name_en: "Editor_UnionObject",
                        thumbnail: "Editor_UnionObject.png",
                        fileName: "Editor_UnionObject"
                    },
                    {
                        name: "对象求交",
                        name_en: "Editor_IntersectObject",
                        thumbnail: "Editor_IntersectObject.png",
                        fileName: "Editor_IntersectObject"
                    },
                    {
                        name: "对象拆分",
                        name_en: "Editor_SplitObject",
                        thumbnail: "Editor_SplitObject.png",
                        fileName: "Editor_SplitObject"
                    },
                    {
                        name: "对象裁切",
                        name_en: "Editor_SplitsObject",
                        thumbnail: "Editor_SplitsObject.png",
                        fileName: "Editor_SplitsObject"
                    },
                    // {
                    //     name: "对象编辑",
                    //     name_en: "Editor_Object",
                    //     thumbnail: "Editor_Object.jpg",
                    //     fileName: "Editor_Object"
                    // },
                ]
            },
            "三维对象编辑": {
                name: "三维对象编辑",
                name_en: "Edit 3D",
                content: [
                    {
                        name: "平移旋转缩放",
                        name_en: "Translation Rotation Scaling",
                        thumbnail: "Cesium_drawHandler.png",
                        fileName: "Cesium_drawHandler"
                    },
                    {
                        name: "范围选择",
                        name_en: "Range Select",
                        thumbnail: "drawtool.png",
                        fileName: "Cesium_drawHelper"
                    },
                ]
            },
            "态势标绘": {
                name: "态势标绘",
                name_en: "Situation Plot",
                content: [
                    {
                        name: "JB标绘",
                        name_en: "JB Plot",
                        thumbnail: "JB_plot.png",
                        fileName: "JB_plot"
                    },
                ]
            },
            // "符号库": {
            //     name: "符号库",
            //     name_en: "Symbol",
            //     content: [
            //         {
            //             name: "符号库",
            //             name_en: "layer_plotting",
            //             thumbnail: "measure_Distance.jpg",
            //             fileName: "layer_plotting"
            //         },
            //     ]
            // },
        }
    },
    "analyze": {
        name: "分析",
        name_en: "Analyze",
        content: {
            "二维量算分析": {
                name: "二维量算分析",
                name_en: "Analyze 2D",
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
            "三维空间量算分析": {
                name: "三维空间量算分析",
                name_en: "Analyze 3D",
                content: [
                    {
                        name: "距离量算",
                        name_en: "Distance Measurement",
                        thumbnail: "analyze3D_distanceMeasurement.jpg",
                        fileName: "analyze3D_distanceMeasurement"
                    },
                    {
                        name: "面积量算",
                        name_en: "Area Measurement",
                        thumbnail: "analyze3D_areaMeasurement.jpg",
                        fileName: "analyze3D_areaMeasurement"
                    },
                    {
                        name: "体积测量",
                        name_en: "Volume Measurement",
                        thumbnail: "VolumeMeasurement.png",
                        fileName: "Cesium_VolumeMeasurement"
                    },
                    {
                        name: "空间测量",
                        name_en: "Space Measurement",
                        thumbnail: "measureHandler.png",
                        fileName: "Cesium_measureHandler"
                    },  
                    // {
                    //     name: "经纬网",
                    //     name_en: "Graticules",
                    //     thumbnail: "graticules.png",
                    //     fileName: "Cesium_graticules"
                    // },
                    // {
                    //     name: "三维分析",
                    //     name_en: "3DAnalysis",
                    //     thumbnail: "analyze3D_dynamicViewableAnalysis.jpg",
                    //     fileName: "3DAnalysis"
                    // }   ,
                    // {
                    //     name: "填挖方分析",
                    //     name_en: "cesium_terrainClippingHelper",
                    //     thumbnail: "cesium_terrainClipping.png",
                    //     fileName: "cesium_terrainClippingHelper"
                    // }
                ]
            },
            "三维地表面分析": {
                name: "三维地表面分析",
                name_en: "Analyze 3D",
                content: [
                    {
                        name: "剖面分析",
                        name_en: "Profile Analysis",
                        thumbnail: "analyze3D_profileAnalysis.jpg",
                        fileName: "analyze3D_profileAnalysis"
                    },
                    {
                        name: "填挖方分析",
                        name_en: "cesium_terrainClippingHelper",
                        thumbnail: "cesium_terrainClipping.png",
                        fileName: "cesium_terrainClippingHelper"
                    },
                    {
                        name: "淹没分析",
                        name_en: "Flood Analysis",
                        thumbnail: "analyze3D_floodAnalysis.jpg",
                        fileName: "analyze3D_floodAnalysis"
                    },        
                    {
                        name: "缓冲区分析",
                        name_en: "Buffer Analysis",
                        thumbnail: "drawHelperFor.png",
                        fileName: "Cesium_drawHelperFor"
                    },
                    {
                        name: "坡度坡向分析",
                        name_en: "analyze3D_SlopeAspect",
                        thumbnail: "analyze3D_SlopeAspect.png",
                        fileName: "analyze3D_SlopeAspect"
                    }
                ]
            },
            "三维可见性分析": {
                name: "三维可见性分析",
                name_en: "Analyze 3D",
                content: [
                    {
                        name: "可视域分析",
                        name_en: "Viewable Analysis",
                        thumbnail: "analyze3D_viewableAnalysis.jpg",
                        fileName: "analyze3D_viewableAnalysis"
                    },
                    {
                        name: "模型通视分析",
                        name_en: "Model Visiable Analysis",
                        thumbnail: "analyze3D_modelVisiableAnalysis.jpg",
                        fileName: "analyze3D_modelVisiableAnalysis"
                    },
                    {
                        name: "地形通视分析",
                        name_en: "Terrain Visiable Analysis",
                        thumbnail: "analyze3D_terrainVisiableAnalysis.jpg",
                        fileName: "analyze3D_terrainVisiableAnalysis"
                    },
                    {
                        name: "建筑日照分析",
                        name_en: "Build Sun Analysis",
                        thumbnail: "analyze3D_sunAnalysis.jpg",
                        fileName: "analyze3D_sunAnalysis"
                    },
                    {
                        name: "日照分析",
                        name_en: "Sun Analysis",
                        thumbnail: "Cesium_sunAnalysis.png",
                        fileName: "Cesium_sunAnalysis"
                    },
                    {
                        name: "动态可视域分析",
                        name_en: "Dynamic Viewable Analysis",
                        thumbnail: "analyze3D_dynamicViewableAnalysis.jpg",
                        fileName: "analyze3D_dynamicViewableAnalysis"
                    },
                ]
            },
        }
    },
    "thematic": {
        name: "专题",
        name_en: "Thematic",
        content: {
            "二维专题图": {
                name: "二维专题图",
                name_en: "Thematic 2D",
                content: [
                    {
                        name: "人口密度图",
                        name_en: "Population Density",
                        thumbnail: "populationDensity.png",
                        fileName: "openlayer_populationDensity"
                    },
                    {
                        name: "统计专题图",
                        name_en: "ThemeGraph",
                        thumbnail: "ThemeGraph.png",
                        fileName: "openlayer_ThemeGraph"
                    },
                    {
                        name: "标签专题图",
                        name_en: "ThemeLabel",
                        thumbnail: "ThemeLabel.png",
                        fileName: "openlayer_ThemeLabel"
                    }
                ]
            },
            "三维专题图": {
                name: "三维专题图",
                name_en: "Thematic 3D",
                content: [
                    {
                        name: "沉降点",
                        name_en: "Settlemente Points",
                        thumbnail: "settlementePoints.png",
                        fileName: "Cesium_settlementePoints"
                    },
                    {
                        name: "人口数量分布",
                        name_en: "Population Distribution",
                        thumbnail: "populationDistribution.png",
                        fileName: "Cesium_populationDistribution"
                    },
                ]
            },
            "气象海洋": {
                name: "气象海洋",
                name_en: "Meteorological Ocean",
                content: [
                    {
                        name: "站点数据",
                        name_en: "Station",
                        thumbnail: "Observation_Station.jpg",
                        fileName: "Observation_Station"
                    },
                    {
                        name: "等值线分析图",
                        name_en: "IsoLineLayer",
                        thumbnail: "Observation_IsoLineLayer.jpg",
                        fileName: "Observation_IsoLineLayer"
                    },
                    // {
                    //     name: "风力图",
                    //     name_en: "WindMapLayer",
                    //     thumbnail: "Pattern_WindMapLayer.jpg",
                    //     fileName: "Pattern_WindMapLayer"
                    // },
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
                        name_en: "SpotPattern Map",
                        thumbnail: "Pattern_SpotPattern.jpg",
                        fileName: "Pattern_SpotPattern"
                    },
                    {
                        name: "云图",
                        name_en: "Cloud Map",
                        thumbnail: "Cloud_mapLayer.jpg",
                        fileName: "Cloud_mapLayer"
                    }
                ]
            },
            // "农业": {
            //     name: "农业",
            //     name_en: "Agriculture",
            //     content: [
            //
            //     ]
            // },
            "灾害": {
                name: "灾害",
                name_en: "Disaster",
                content: [
                    {
                        name: "洪水模拟",
                        name_en: "Flood Map",
                        thumbnail: "floodInundation.png",
                        fileName: "Cesium_floodInundation"
                    },
                    {
                        name: "台风图",
                        name_en: "Typhoon Map",
                        thumbnail: "Typhoon_mapLayer.jpg",
                        fileName: "Typhoon_mapLayer"
                    },
                    {
                        name: "地震灾害图",
                        name_en: "Earthquake Map",
                        thumbnail: "Disaster_EarthquakeLayer.png",
                        fileName: "Disaster_EarthquakeLayer"
                    }
                ]
            },
        }
    },
    "view": {
        name: "视图",
        name_en: "View",
        content: {
            "basic control": {
                name: "基础控件",
                name_en: "Control",
                content: [
                    {
                        name: "缩放控件",
                        name_en: "Zoom",
                        thumbnail: "controler_zoom.png",
                        fileName: "controler_zoom"
                    },
                    {
                        name: "比例尺控件",
                        name_en: "Scaleline",
                        thumbnail: "controler_scaleline.png",
                        fileName: "controler_scaleline"
                    },
                    {
                        name: "版权控件",
                        name_en: "Attribution",
                        thumbnail: "controler_attribution.png",
                        fileName: "controler_attribution"
                    },
                    {
                        name: "图层控件",
                        name_en: "Layer",
                        thumbnail: "controler_layerswitcher.png",
                        fileName: "controler_layerswitcher"
                    },
                    {
                        name: "卷帘",
                        name_en: "Swipe",
                        thumbnail: "controler_layerswitch.png",
                        fileName: "controler_layerswitch"
                    },
                    {
                        name: "鹰眼",
                        name_en: "Hawk Eye",
                        thumbnail: "controler_overviewMap.png",
                        fileName: "controler_hawkEye"
                    },
                    {
                        name: "复位",
                        name_en: "Reset",
                        thumbnail: "controler_reset.png",
                        fileName: "controler_reset"
                    },
                    {
                        name: "2D/3D",
                        name_en: "2Dor3D",
                        thumbnail: "controler_2Dor3D.png",
                        fileName: "controler_2Dor3D"
                    },
                    {
                        name: "相机控件",
                        name_en: "Camera",
                        thumbnail: "cameraController.png",
                        fileName: "controler_overviewMap"
                    },

                ]
            },
            // "components": {
            //     name: "组件",
            //     name_en: "components_openFile",
            //     content: [
            //         {
            //             name: "打开文件",
            //             name_en: "components_openFile",
            //             thumbnail: "components_openFile.png",
            //             fileName: "components_openFile"
            //         }
            //     ]
            // },
            // "plugs": {
            //     name: "插件",
            //     name_en: "Plugs",
            //     content: [
            //         {
            //             name: "气象海洋分析展示插件",
            //             name_en: "Meteorological Ocean Analysis Plug-in",
            //             thumbnail: "develop.jpg",
            //             fileName: "components_openFile"
            //         },
            //         {
            //             name: "灾害分析展示插件",
            //             name_en: "Disaster Analysis Plug-in",
            //             thumbnail: "develop.jpg",
            //             fileName: "components_openFile"
            //         },
            //         {
            //             name: "AI分析展示插件",
            //             name_en: "AI Analysis Plug-in",
            //             thumbnail: "develop.jpg",
            //             fileName: "components_openFile"
            //         },
            //         {
            //             name: "Echarts插件",
            //             name_en: "Echarts Plug-in",
            //             thumbnail: "develop.jpg",
            //             fileName: "components_openFile"
            //         },
            //     ]
            // },
        }
    },
    "help": {
        name: "帮助",
        name_en: "Help",
        content: {
            // "API": {
            //     name: "产品API文档",
            //     name_en: "API",
            //     content: [
            //         // {
            //         //     name: "产品API文档",
            //         //     name_en: "Echart_Geoline",
            //         //     thumbnail: "Echart_Geoline.jpg",
            //         //     fileName: "Echart_Geoline"
            //         // },
            //     ]
            // },
            // "SDK": {
            //     name: "产品开发包",
            //     name_en: "SDK",
            //     content: [
            //         // {
            //         //     name: "产品开发包",
            //         //     name_en: "Echart_Scatterweibo",
            //         //     thumbnail: "Echart_Scatterweibo.jpg",
            //         //     fileName: "Echart_Scatterweibo"
            //         // },
            //     ]
            // },
            "About": {
                name: "关于我们",
                name_en: "About",
                content: [
                    // {
                    //     name: "关于我们",
                    //     name_en: "Echart_EffectScattermap",
                    //     thumbnail: "Echart_EffectScattermap.jpg",
                    //     fileName: "Echart_EffectScattermap"
                    // }
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