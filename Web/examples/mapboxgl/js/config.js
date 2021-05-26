/**
 * 配置文件,各种请求url,常用数据等.
 */
var configObj = {
	// 符号集url
	"spriteUrl" : "../jsp/map/necessary/Weather",
	// 底图字体样式等文件url
	"glyphsUrl" : "../jsp/map/necessary/font/pbf/{fontstack}/{range}.pbf",
	// 底图瓦片url
	"tileUrl" : "../jsp/map/necessary/proxy.jsp?http://168.192.100.68:8081/geoserver/lzk/wms?service=WMS&version=1.1.0&request=GetMap&&layers=lzk:alwaysPolygon&styles=&bbox={bbox-epsg-3857}&width=256&height=256&srs=EPSG:3857&format=image/png",
	// 瓦片底图图片裁切大小
	"tileSize" : 256,
	// 底图geojson数据url
	"topSourceGeojsonUrl" : "../html/prdShow/proxy.jsp?http://168.192.100.68:8081/geoserver/lzk/wms?service=WMS&version=1.1.0&request=GetMap&layers=lzk:province_line&styles=&bbox=73.44696044900006,6.318641186000056,135.08583068800007,53.557926178000095&width=768&height=588&srs=EPSG:4326&format=application%2Fjson%3Btype%3Dgeojson",
	// 最大层级
	"maxZoom" : 22,
	// 最小层级
	"minZoom" : 0,
	// 当前显示层级
	"zoom" : 3,
	// 地图中心点
	"center" : [ 115.3750026759328, 39.916660402236516 ],
	// 数据请求urls
	"getDataUrls" : {
		// 地面实况的数据请求url
		"groundLiveUrl" : "../groundLive/getGroundLiveData",
		// 高空实况的数据请求url
		"upperLiveUrl" : "../upperLive/getUpperLiveData",
		// 海况分析的数据请求url
		"seaAnaUrl" : "../seaAna/getSeaAnaData",
		"singleStationUrl": "../plotting/getSingleStationObsData"
	},

};
/**
 * 图例配置项
 */
var legendConfigObj = {
	// 雨量散点图
	"rainStationlegend" : {
		"title" : "雨量散点图(mm)",
		"data" : [ {
			"color" : "#884898",
			"caption" : ">250",
			"min" : 250,
			"max" : 999
		}, {
			"color" : "#B833A8",
			"caption" : "100~250",
			"min" : 100,
			"max" : 250
		}, {
			"color" : "#386CB0",
			"caption" : "50~100",
			"min" : 50,
			"max" : 100
		}, {
			"color" : "#68C4E8",
			"caption" : "25~50",
			"min" : 25,
			"max" : 50
		}, {
			"color" : "#309860",
			"caption" : "10~25",
			"min" : 10,
			"max" : 25
		}, {
			"color" : "#B0ECB0",
			"caption" : "0.1~10",
			"min" : 0.1,
			"max" : 10
		}, {
			"color" : "#B0B4B0",
			"caption" : "<=0",
			"min" : -999,
			"max" : 0
		} ]
	},
	"radarDooperlegend" : {
		"title" : "雷达图例(dbz)",
		"data" : [ {
			"color" : "rgb(0, 0, 246)",
			"caption" : "0-5",
			"min" : 15,
			"max" : 20
		}, {
			"color" : "rgb(1, 160, 246)",
			"caption" : "5-10",
			"min" : 100,
			"max" : 250
		}, {
			"color" : "rgb(0, 236, 236)",
			"caption" : "10-15",
			"min" : 50,
			"max" : 100
		}, {
			"color" : "rgb(1, 255, 0)",
			"caption" : "15-20",
			"min" : 25,
			"max" : 50
		}, {
			"color" : "rgb(0, 200, 0)",
			"caption" : "20-25",
			"min" : 10,
			"max" : 25
		}, {
			"color" : "rgb(1, 144, 0)",
			"caption" : "25-30",
			"min" : 0.1,
			"max" : 10
		}, {
			"color" : "rgb(255, 255, 0)",
			"caption" : "30-35",
			"min" : -999,
			"max" : 0
		},
		 {
			"color" : "rgb(231, 192, 0)",
			"caption" : "35-40",
			"min" : -999,
			"max" : 0
		},
		 {
			"color" : "rgb(255, 144, 0)",
			"caption" : "40-45",
			"min" : -999,
			"max" : 0
		},
		 {
			"color" : "rgb(255, 0, 0)",
			"caption" : "45-50",
			"min" : -999,
			"max" : 0
		},
		 {
			"color" : "rgb(214, 0, 0)",
			"caption" : "50-55",
			"min" : -999,
			"max" : 0
		},
		 {
			"color" : "rgb(192, 0, 0)",
			"caption" : "55-60",
			"min" : -999,
			"max" : 0
		},
		 {
			"color" : "rgb(255, 0, 240)",
			"caption" : "60-65",
			"min" : -999,
			"max" : 0
		},
		 {
			"color" : "rgb(120, 0, 132)",
			"caption" : "65-70",
			"min" : -999,
			"max" : 0
		},
		 {
			"color" : "rgb(173, 144, 240)",
			"caption" : ">70",
			"min" : -999,
			"max" : 0
		}
		]
	}
}
/**
 * 菜单配置项
 */
var menuConfigObj = {
	// 地面实况
	"groundLive" : {
		// 标题
		"title" : "地面实况",
		// 唯一标识
		"mark" : "groundLive",
		// jquery激活样式名
		"acClassName" : "viewMenu1Clss",
		// 图片路径
		"imgurl" : "../images/map/icon/shikuang_1.png",
		// 菜单层级
		"level" : 1,
		// 是否可见，加载，生成菜单
		"visible" : true,
		// 是否多选，基本是三级菜单，针对四级菜单，地图显示用。
		"isCheck" : false,
		// 是否选中
		"checked" : false,
		// 子菜单
		"childNodes" : {
			// 实况信息
			"groundLive_liveInfo" : {
				"title" : "实况信息",
				"mark" : "groundLive_liveInfo",
				"acClassName" : "viewMenu2Clss",
				"imgurl" : "",
				"level" : 2,
				"visible" : true,
				"isCheck" : false,
				"checked" : false,
				"childNodes" : {
					// 地面实况
					"groundLive_liveInfo_ground" : {
						"title" : "地面实况",
						"mark" : "groundLive_liveInfo_ground",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/groundLive/u31627.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : true,
						"checked" : false,
						"childNodes" : {
							// 风速
							"groundLive_liveInfo_ground_WS" : {
								"title" : "风速",
								"mark" : "groundLive_liveInfo_ground_WS",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "groundLive_liveInfo_ground_WS",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							// 现在天气
							"groundLive_liveInfo_ground_WW" : {
								"title" : "现在天气",
								"mark" : "groundLive_liveInfo_ground_WW",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "groundLive_liveInfo_ground_WW",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							// 过去天气
							"groundLive_liveInfo_ground_W1" : {
								"title" : "过去天气",
								"mark" : "groundLive_liveInfo_ground_W1",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "groundLive_liveInfo_ground_W1",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							// 总云量
							"groundLive_liveInfo_ground_N" : {
								"title" : "总云量",
								"mark" : "groundLive_liveInfo_ground_N",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "groundLive_liveInfo_ground_N",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							// 低云态
							"groundLive_liveInfo_ground_CL" : {
								"title" : "低云态",
								"mark" : "groundLive_liveInfo_ground_CL",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "groundLive_liveInfo_ground_CL",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							// 中云态
							"groundLive_liveInfo_ground_CM" : {
								"title" : "中云态",
								"mark" : "groundLive_liveInfo_ground_CM",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "groundLive_liveInfo_ground_CM",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							// 高云态
							"groundLive_liveInfo_ground_CH" : {
								"title" : "高云态",
								"mark" : "groundLive_liveInfo_ground_CH",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "groundLive_liveInfo_ground_CH",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							// 温度
							"groundLive_liveInfo_ground_T" : {
								"title" : "温度",
								"mark" : "groundLive_liveInfo_ground_T",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "groundLive_liveInfo_ground_T",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							//温度露点差
							"groundLive_liveInfo_ground_TD" : {
								"title" : "温度露点差",
								"mark" : "groundLive_liveInfo_ground_TD",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "groundLive_liveInfo_ground_TD",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							// 能见度
							"groundLive_liveInfo_ground_VIS" : {
								"title" : "能见度",
								"mark" : "groundLive_liveInfo_ground_VIS",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "groundLive_liveInfo_ground_VIS",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							// 低云量
							"groundLive_liveInfo_ground_NH" : {
								"title" : "低云量",
								"mark" : "groundLive_liveInfo_ground_NH",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "groundLive_liveInfo_ground_NH",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							// 低云高
							"groundLive_liveInfo_ground_LH" : {
								"title" : "低云高",
								"mark" : "groundLive_liveInfo_ground_LH",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "groundLive_liveInfo_ground_LH",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							// 海平面气压
							"groundLive_liveInfo_ground_SLP" : {
								"title" : "海平面气压",
								"mark" : "groundLive_liveInfo_ground_SLP",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "groundLive_liveInfo_ground_SLP",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							// 3h气压变量
							"groundLive_liveInfo_ground_DP3" : {
								"title" : "3h气压变量",
								"mark" : "groundLive_liveInfo_ground_DP3",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "groundLive_liveInfo_ground_DP3",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : false,
							},
							// 6小时降水
							"groundLive_liveInfo_ground_RR" : {
								"title" : "6小时降水",
								"mark" : "groundLive_liveInfo_ground_RR",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "groundLive_liveInfo_ground_RR",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : false,
							}

						}
					},
					// 机场实况
					"groundLive_liveInfo_area" : {
						"title" : "机场实况",
						"mark" : "groundLive_liveInfo_area",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/groundLive/jcsk.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {
							// 风速
							"groundLive_liveInfo_area_WS" : {
								"title" : "风速",
								"mark" : "groundLive_liveInfo_area_WS",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "groundLive_liveInfo_area_WS",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							// 天气现象
							"groundLive_liveInfo_area_WW" : {
								"title" : "天气现象",
								"mark" : "groundLive_liveInfo_area_WW",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "groundLive_liveInfo_area_WW",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							
							// 总云量
							"groundLive_liveInfo_area_N" : {
								"title" : "总云量",
								"mark" : "groundLive_liveInfo_area_N",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "groundLive_liveInfo_area_N",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							
							// 温度
							"groundLive_liveInfo_area_T" : {
								"title" : "气温",
								"mark" : "groundLive_liveInfo_area_T",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "groundLive_liveInfo_area_T",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							
							// 垂直能见度
							"groundLive_liveInfo_area_VVIS" : {
								"title" : "垂直能见度",
								"mark" : "groundLive_liveInfo_area_VVIS",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "groundLive_liveInfo_area_VVIS",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							// 水平能见度
							"groundLive_liveInfo_area_HVIS" : {
								"title" : "水平能见度",
								"mark" : "groundLive_liveInfo_area_HVIS",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "groundLive_liveInfo_area_HVIS",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},				
							// 低云高
							"groundLive_liveInfo_area_LH" : {
								"title" : "低云高",
								"mark" : "groundLive_liveInfo_area_LH",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "groundLive_liveInfo_area_LH",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							// 海平面气压
							"groundLive_liveInfo_area_SLP" : {
								"title" : "海平面气压",
								"mark" : "groundLive_liveInfo_area_SLP",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "groundLive_liveInfo_area_SLP",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							// 道路视程
							"groundLive_liveInfo_area_VD" : {
								"title" : "道路视程",
								"mark" : "groundLive_liveInfo_area_VD",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "groundLive_liveInfo_area_VD",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							// 风切变
							"groundLive_liveInfo_area_WQ" : {
								"title" : "风切变",
								"mark" : "groundLive_liveInfo_area_WQ",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "groundLive_liveInfo_area_WQ",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							}
						}
					},
					// 军队实况
					"groundLive_liveInfo_army" : {
						"title" : "军队实况",
						"mark" : "groundLive_liveInfo_army",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/groundLive/jdsk.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {
							// 风速
							"groundLive_liveInfo_army_WS" : {
								"title" : "风速",
								"mark" : "groundLive_liveInfo_army_WS",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "groundLive_liveInfo_army_WS",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							// 现在天气
							"groundLive_liveInfo_army_WW" : {
								"title" : "现在天气",
								"mark" : "groundLive_liveInfo_army_WW",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "groundLive_liveInfo_army_WW",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							// 过去天气
							"groundLive_liveInfo_army_W1" : {
								"title" : "过去天气",
								"mark" : "groundLive_liveInfo_army_W1",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "groundLive_liveInfo_army_W1",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							// 总云量
							"groundLive_liveInfo_army_N" : {
								"title" : "总云量",
								"mark" : "groundLive_liveInfo_army_N",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "groundLive_liveInfo_army_N",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							// 低云态
							"groundLive_liveInfo_army_CL" : {
								"title" : "低云态",
								"mark" : "groundLive_liveInfo_army_CL",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "groundLive_liveInfo_army_CL",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							// 中云态
							"groundLive_liveInfo_army_CM" : {
								"title" : "中云态",
								"mark" : "groundLive_liveInfo_army_CM",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "groundLive_liveInfo_army_CM",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							// 高云态
							"groundLive_liveInfo_army_CH" : {
								"title" : "高云态",
								"mark" : "groundLive_liveInfo_army_CH",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "groundLive_liveInfo_army_CH",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							// 温度
							"groundLive_liveInfo_army_T" : {
								"title" : "温度",
								"mark" : "groundLive_liveInfo_army_T",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "groundLive_liveInfo_army_T",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							//温度露点差
							"groundLive_liveInfo_army_TD" : {
								"title" : "温度露点差",
								"mark" : "groundLive_liveInfo_army_TD",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "groundLive_liveInfo_army_TD",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							// 能见度
							"groundLive_liveInfo_army_VIS" : {
								"title" : "能见度",
								"mark" : "groundLive_liveInfo_army_VIS",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "groundLive_liveInfo_army_VIS",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							// 低云量
							"groundLive_liveInfo_army_NH" : {
								"title" : "低云量",
								"mark" : "groundLive_liveInfo_army_NH",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "groundLive_liveInfo_army_NH",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							// 低云高
							"groundLive_liveInfo_army_LH" : {
								"title" : "低云高",
								"mark" : "groundLive_liveInfo_army_LH",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "groundLive_liveInfo_army_LH",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							// 海平面气压
							"groundLive_liveInfo_army_SLP" : {
								"title" : "海平面气压",
								"mark" : "groundLive_liveInfo_army_SLP",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "groundLive_liveInfo_army_SLP",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							// 3h气压变量
							"groundLive_liveInfo_army_DP3" : {
								"title" : "3h气压变量",
								"mark" : "groundLive_liveInfo_army_DP3",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "groundLive_liveInfo_army_DP3",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : false,
							},
							// 6小时降水
							"groundLive_liveInfo_army_RR" : {
								"title" : "6小时降水",
								"mark" : "groundLive_liveInfo_army_RR",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "groundLive_liveInfo_army_RR",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : false,
							}
						}
					},
					// 海洋实况
					"groundLive_liveInfo_sea" : {
						"title" : "海洋实况",
						"mark" : "groundLive_liveInfo_sea",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/groundLive/u31633.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : true,
						"checked" : false,
						"childNodes" : {
							// 风速
							"groundLive_liveInfo_sea_WS" : {
								"title" : "风速风向",
								"mark" : "groundLive_liveInfo_sea_WS",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "groundLive_liveInfo_sea_WS",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							// 海平面气压
							"groundLive_liveInfo_sea_SLP" : {
								"title" : "气压",
								"mark" : "groundLive_liveInfo_sea_SLP",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "groundLive_liveInfo_sea_SLP",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							  //气温
							"groundLive_liveInfo_sea_T" : {
								"title" : "气温",
								"mark" : "groundLive_liveInfo_sea_T",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "groundLive_liveInfo_sea_T",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
					           //水温
							"groundLive_liveInfo_sea_TW" : {
								"title" : "水温",
								"mark" : "groundLive_liveInfo_sea_TW",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "groundLive_liveInfo_seaTW",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							//浪高
							"groundLive_liveInfo_sea_HW" : {
								"title" : "浪高",
								"mark" : "groundLive_liveInfo_sea_HW",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "groundLive_liveInfo_sea_HW",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							//浪周期
							"groundLive_liveInfo_sea_PW" : {
								"title" : "浪周期",
								"mark" : "groundLive_liveInfo_sea_PW",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "groundLive_liveInfo_sea_PW",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							//涌向
							"groundLive_liveInfo_sea_DW1" : {
								"title" : "涌向",
								"mark" : "groundLive_liveInfo_sea_DW1",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "groundLive_liveInfo_sea_DW1",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							//涌高
							"groundLive_liveInfo_sea_HW1" : {
								"title" : "涌高",
								"mark" : "groundLive_liveInfo_sea_HW1",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "groundLive_liveInfo_sea_HW1",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							//涌周期
							"groundLive_liveInfo_sea_PW1" : {
								"title" : "涌周期",
								"mark" : "groundLive_liveInfo_sea_PW1",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "groundLive_liveInfo_sea_PW1",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							}
						}
					},
					// 海洋浮标
					"groundLive_liveInfo_seaBuoy" : {
						"title" : "海洋浮标",
						"mark" : "groundLive_liveInfo_seaBuoy",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/groundLive/u32601.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : true,
						"childNodes" : {
							// 风速
							"groundLive_liveInfo_seaBuoy_WS" : {
								"title" : "风速风向",
								"mark" : "groundLive_liveInfo_seaBuoy_WS",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "groundLive_liveInfo_seaBuoy_WS",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							// 海平面气压
							"groundLive_liveInfo_seaBuoy_SLP" : {
								"title" : "气压",
								"mark" : "groundLive_liveInfo_seaBuoy_SLP",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "groundLive_liveInfo_seaBuoy_SLP",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							  //气温
							"groundLive_liveInfo_seaBuoy_T" : {
								"title" : "气温",
								"mark" : "groundLive_liveInfo_seaBuoy_T",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "groundLive_liveInfo_seaBuoy_T",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
					           //水温
							"groundLive_liveInfo_seaBuoy_TW" : {
								"title" : "水温",
								"mark" : "groundLive_liveInfo_seaBuoy_TW",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "groundLive_liveInfo_seaBuoyTW",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							//浪高
							"groundLive_liveInfo_seaBuoy_HW" : {
								"title" : "浪高",
								"mark" : "groundLive_liveInfo_seaBuoy_HW",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "groundLive_liveInfo_seaBuoy_HW",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							//浪周期
							"groundLive_liveInfo_seaBuoy_PW" : {
								"title" : "浪周期",
								"mark" : "groundLive_liveInfo_seaBuoy_PW",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "groundLive_liveInfo_seaBuoy_PW",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							//涌向
							"groundLive_liveInfo_seaBuoy_DW1" : {
								"title" : "涌向",
								"mark" : "groundLive_liveInfo_seaBuoy_DW1",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "groundLive_liveInfo_seaBuoy_DW1",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							//涌高
							"groundLive_liveInfo_seaBuoy_HW1" : {
								"title" : "涌高",
								"mark" : "groundLive_liveInfo_seaBuoy_HW1",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "groundLive_liveInfo_seaBuoy_HW1",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							//涌周期
							"groundLive_liveInfo_seaBuoy_PW1" : {
								"title" : "涌周期",
								"mark" : "groundLive_liveInfo_seaBuoy_PW1",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "groundLive_liveInfo_seaBuoy_PW1",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							}
						}
					},
					// 降水实况
					"groundLive_liveInfo_rain" : {
						"title" : "降水实况",
						"mark" : "groundLive_liveInfo_rain",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/groundLive/u31603.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 温度实况
					"groundLive_liveInfo_temp" : {
						"title" : "温度实况",
						"mark" : "groundLive_liveInfo_temp",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/groundLive/u31561.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					}
				}
			},
			// 数值分析
			"groundLive_numAna" : {
				"title" : "数值分析",
				"mark" : "groundLive_numAna",
				"acClassName" : "viewMenu2Clss",
				"imgurl" : "",
				"level" : 2,
				"visible" : true,
				"isCheck" : false,
				"checked" : false,
				"childNodes" : {
					// 温度
					"groundLive_numAna_temp" : {
						"title" : "温度",
						"mark" : "groundLive_numAna_temp",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/groundLive/szfx_wd.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 24h降水量
					"groundLive_numAna_24h" : {
						"title" : "24h降水量",
						"mark" : "groundLive_numAna_24h",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/groundLive/szfx_24h.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 12h降水量
					"groundLive_numAna_12h" : {
						"title" : "12h降水量",
						"mark" : "groundLive_numAna_12h",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/groundLive/szfx_12h.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 6h降水量
					"groundLive_numAna_6h" : {
						"title" : "6h降水量",
						"mark" : "groundLive_numAna_6h",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/groundLive/szfx_6h.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 3h降水量
					"groundLive_numAna_3h" : {
						"title" : "3h降水量",
						"mark" : "groundLive_numAna_3h",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/groundLive/szfx_3h.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 总云量
					"groundLive_numAna_totalCloud" : {
						"title" : "总云量",
						"mark" : "groundLive_numAna_totalCloud",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/groundLive/szfx_zyl.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 海平面气压
					"groundLive_numAna_seaPa" : {
						"title" : "海平面气压",
						"mark" : "groundLive_numAna_seaPa",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/groundLive/u31743.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 风场
					"groundLive_numAna_wind" : {
						"title" : "风场",
						"mark" : "groundLive_numAna_wind",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/groundLive/szfx_fx.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					}
				}
			},
			// 辅助信息
			"groundLive_auxInfo" : {
				"title" : "辅助信息",
				"mark" : "groundLive_auxInfo",
				"acClassName" : "viewMenu2Clss",
				"imgurl" : "",
				"level" : 2,
				"visible" : true,
				"isCheck" : false,
				"checked" : false,
				"childNodes" : {
					// 卫星云图
					"groundLive_auxInfo_satCloud" : {
						"title" : "卫星云图",
						"mark" : "groundLive_auxInfo_satCloud",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/auxInfoAll/u31519.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 雷达图
					"groundLive_auxInfo_radar" : {
						"title" : "雷达图",
						"mark" : "groundLive_auxInfo_radar",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/auxInfoAll/u32241.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 台风图
					"groundLive_auxInfo_typh" : {
						"title" : "台风图",
						"mark" : "groundLive_auxInfo_typh",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/auxInfoAll/u29817.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 学校
					"groundLive_auxInfo_school" : {
						"title" : "学校",
						"mark" : "groundLive_auxInfo_school",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/auxInfoAll/u29989.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 医院
					"groundLive_auxInfo_hosp" : {
						"title" : "医院",
						"mark" : "groundLive_auxInfo_hosp",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/auxInfoAll/u29955.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 加油站
					"groundLive_auxInfo_gasStation" : {
						"title" : "加油站",
						"mark" : "groundLive_auxInfo_gasStation",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/auxInfoAll/u29918.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 火警
					"groundLive_auxInfo_fire" : {
						"title" : "火警",
						"mark" : "groundLive_auxInfo_fire",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/auxInfoAll/u29951.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 交通
					"groundLive_auxInfo_traffic" : {
						"title" : "交通",
						"mark" : "groundLive_auxInfo_traffic",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/auxInfoAll/u29949.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 环保
					"groundLive_auxInfo_envPro" : {
						"title" : "环保",
						"mark" : "groundLive_auxInfo_envPro",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/auxInfoAll/u29926.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					}
				}
			}
		}
	},
	// 高空实况
	"upperLive" : {
		"title" : "高空实况",
		"mark" : "upperLive",
		"acClassName" : "viewMenu1Clss",
		"imgurl" : "../images/map/icon/shikuang_3.png",
		"level" : 1,
		"visible" : true,
		"isCheck" : false,
		"checked" : false,
		"childNodes" : {
			// 高空实况
			"upperLive_upperInfo" : {
				"title" : "实况信息",
				"mark" : "upperLive_upperInfo",
				"acClassName" : "viewMenu2Clss",
				"imgurl" : "",
				"level" : 2,
				"visible" : true,
				"isCheck" : false,
				"checked" : false,
				"childNodes" : {
					// 高空实况
					"upperLive_upperInfo_upper" : {
						"title" : "高空填图",
						"mark" : "upperLive_upperInfo_upper",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/upperLive/gk.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {
							//风速 风向
							"upperLive_upperInfo_upper_WS" : {
								"title" : "风速风向",
								"mark" : "upperLive_upperInfo_upper_WS",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "upperLive_upperInfo_upper_WS",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							// 温度
							"upperLive_upperInfo_upper_T" : {
								"title" : "温度",
								"mark" : "upperLive_upperInfo_upper_T",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "upperLive_upperInfo_upper_T",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							// 温度露点差
							"upperLive_upperInfo_upper_TD" : {
								"title" : "温度露点差",
								"mark" : "upperLive_upperInfo_upper_TD",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "upperLive_upperInfo_upper_TD",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							// 位势高度
							"upperLive_upperInfo_upper_H" : {
								"title" : "位势高度",
								"mark" : "upperLive_upperInfo_upper_H",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "upperLive_upperInfo_upper_H",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							}
							
						}
					},
					// 飞行探测
					"upperLive_upperInfo_watch" : {
						"title" : "飞行探测",
						"mark" : "upperLive_upperInfo_watch",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/upperLive/gk_fx.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {
							//风速 风向
							"upperLive_upperInfo_watch_WS" : {
								"title" : "风速风向",
								"mark" : "upperLive_upperInfo_watch_WS",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "upperLive_upperInfo_watch_WS",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							// 温度
							"upperLive_upperInfo_watch_T" : {
								"title" : "温度",
								"mark" : "upperLive_upperInfo_watch_T",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "upperLive_upperInfo_watch_T",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
						
							// 位势高度
							"upperLive_upperInfo_watch_H" : {
								"title" : "位势高度",
								"mark" : "upperLive_upperInfo_watch_H",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "upperLive_upperInfo_watch_H",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							}
						}
					},
					// 军队实况
					"upperLive_upperInfo_army" : {
						"title" : "军队实况",
						"mark" : "upperLive_upperInfo_army",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/upperLive/gk_jd.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {
							//风速 风向
							"upperLive_upperInfo_army_WS" : {
								"title" : "风速风向",
								"mark" : "upperLive_upperInfo_army_WS",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "upperLive_upperInfo_army_WS",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							// 温度
							"upperLive_upperInfo_army_T" : {
								"title" : "温度",
								"mark" : "upperLive_upperInfo_army_T",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "upperLive_upperInfo_army_T",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							// 温度露点差
							"upperLive_upperInfo_army_TD" : {
								"title" : "温度露点差",
								"mark" : "upperLive_upperInfo_army_TD",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "upperLive_upperInfo_army_TD",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							// 位势高度
							"upperLive_upperInfo_army_H" : {
								"title" : "位势高度",
								"mark" : "upperLive_upperInfo_army_H",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "upperLive_upperInfo_army_H",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							}
						}
					},
					// 雷达实况
					"upperLive_upperInfo_radar" : {
						"title" : "雷达实况",
						"mark" : "upperLive_upperInfo_radar",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/upperLive/gk_ld.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					}
				}
			},
			// 数值分析
			"upperLive_numAna" : {
				"title" : "数值分析",
				"mark" : "upperLive_numAna",
				"acClassName" : "viewMenu2Clss",
				"imgurl" : "",
				"level" : 2,
				"visible" : true,
				"isCheck" : false,
				"checked" : false,
				"childNodes" : {
					// 散度
					"upperLive_numAna_disps" : {
						"title" : "散度",
						"mark" : "upperLive_numAna_disps",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/upperLive/wlc_sqtlsd.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// K指数
					"upperLive_numAna_kIndex" : {
						"title" : "K指数",
						"mark" : "upperLive_numAna_kIndex",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/upperLive/wlc_zhishu.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 沙氏指数
					"upperLive_numAna_shasIndex" : {
						"title" : "沙氏指数",
						"mark" : "upperLive_numAna_shasIndex",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/upperLive/szfx_shashizs.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 相对湿度
					"upperLive_numAna_relaHum" : {
						"title" : "相对湿度",
						"mark" : "upperLive_numAna_relaHum",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/upperLive/wlc_xiangduishidu.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 温度
					"upperLive_numAna_temp" : {
						"title" : "温度",
						"mark" : "upperLive_numAna_temp",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/upperLive/wlc_zongwendu.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 位势高度
					"upperLive_numAna_pHeight" : {
						"title" : "位势高度",
						"mark" : "upperLive_numAna_pHeight",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/upperLive/szfx_weishigd.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 涡度
					"upperLive_numAna_vort" : {
						"title" : "涡度",
						"mark" : "upperLive_numAna_vort",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/upperLive/szfx_wd.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 风场
					"upperLive_numAna_wind" : {
						"title" : "风场",
						"mark" : "upperLive_numAna_wind",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/upperLive/szfx_fc.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 垂直速度
					"upperLive_numAna_vSpeed" : {
						"title" : "垂直速度",
						"mark" : "upperLive_numAna_vSpeed",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/upperLive/wlc_czsd.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					}
				}
			},
			// 物理量场分析
			"upperLive_physicalAna" : {
				"title" : "物理量场分析",
				"mark" : "upperLive_physicalAna",
				"acClassName" : "viewMenu2Clss",
				"imgurl" : "",
				"level" : 2,
				"visible" : true,
				"isCheck" : false,
				"checked" : false,
				"childNodes" : {
					// 散度
					"upperLive_physicalAna_disps" : {
						"title" : "散度",
						"mark" : "upperLive_physicalAna_disps",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/upperLive/wlc_sqtlsd.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 相对湿度
					"upperLive_physicalAna_relaHum" : {
						"title" : "相对湿度",
						"mark" : "upperLive_physicalAna_relaHum",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/upperLive/wlc_xiangduishidu.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// K指数
					"upperLive_physicalAna_kIndex" : {
						"title" : "K指数",
						"mark" : "upperLive_physicalAna_kIndex",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/upperLive/wlc_zhishu.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// si指数
					"upperLive_physicalAna_siIndex" : {
						"title" : "si指数",
						"mark" : "upperLive_physicalAna_siIndex",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/upperLive/wlc_si.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 垂直速度
					"upperLive_physicalAna_vSpeed" : {
						"title" : "垂直速度",
						"mark" : "upperLive_physicalAna_vSpeed",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/upperLive/wlc_czsd.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 比湿
					"upperLive_physicalAna_speHum" : {
						"title" : "比湿",
						"mark" : "upperLive_physicalAna_speHum",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/upperLive/wlc_bishi.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 平流场
					"upperLive_physicalAna_fFlowField" : {
						"title" : "平流场",
						"mark" : "upperLive_physicalAna_fFlowField",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/upperLive/wlc_plc.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// KY指数
					"upperLive_physicalAna_kyIndex" : {
						"title" : "KY指数",
						"mark" : "upperLive_physicalAna_kyIndex",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/upperLive/szfx_weishigd.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 总温度
					"upperLive_physicalAna_tTemp" : {
						"title" : "总温度",
						"mark" : "upperLive_physicalAna_tTemp",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/upperLive/wlc_zongwendu.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 总温度平流
					"upperLive_physicalAna_tTempFlowField" : {
						"title" : "总温平流",
						"mark" : "upperLive_physicalAna_tTempFlowField",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/upperLive/wlc_wodupl.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 涡度平流
					"upperLive_physicalAna_vortFlow" : {
						"title" : "涡度平流",
						"mark" : "upperLive_physicalAna_vortFlow",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/upperLive/wlc_wdpl.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 水汽平流场
					"upperLive_physicalAna_vaporFlowField" : {
						"title" : "水汽流场",
						"mark" : "upperLive_physicalAna_vaporFlowField",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/upperLive/wlc_shiqipl.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 水汽通量散度
					"upperLive_physicalAna_vaporDisps" : {
						"title" : "水汽通量散度",
						"mark" : "upperLive_physicalAna_vaporDisps",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/upperLive/wlc_sqtlsd.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 假相当位温
					"upperLive_physicalAna_pETemp" : {
						"title" : "假相当位温",
						"mark" : "upperLive_physicalAna_pETemp",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/upperLive/wlc_jxdww.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 水汽通量
					"upperLive_physicalAna_vaporFlux" : {
						"title" : "水汽通量",
						"mark" : "upperLive_physicalAna_vaporFlux",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/upperLive/wlc_sqtl.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					}
				}
			},
			// 辅助信息
			"upperLive_auxInfo" : {
				"title" : "辅助信息",
				"mark" : "upperLive_auxInfo",
				"acClassName" : "viewMenu2Clss",
				"imgurl" : "",
				"level" : 2,
				"visible" : true,
				"isCheck" : false,
				"checked" : false,
				"childNodes" : {
					// 卫星云图
					"upperLive_auxInfo_satCloud" : {
						"title" : "卫星云图",
						"mark" : "upperLive_auxInfo_satCloud",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/auxInfoAll/u31519.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 雷达图
					"upperLive_auxInfo_radar" : {
						"title" : "雷达图",
						"mark" : "upperLive_auxInfo_radar",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/auxInfoAll/u32241.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					}

				}
			}
		}
	},
	// 雷达图
	"radar" : {
		"title" : "雷达图",
		"mark" : "radar",
		"acClassName" : "viewMenu1Clss",
		"imgurl" : "../images/map/icon/shuju_2.png",
		"level" : 1,
		"visible" : true,
		"isCheck" : false,
		"checked" : false,
		"childNodes" : {
			// 雷达图
			"radar_info" : {
				"title" : "雷达图",
				"mark" : "radar_info",
				"acClassName" : "viewMenu2Clss",
				"imgurl" : "",
				"level" : 2,
				"visible" : true,
				"isCheck" : false,
				"checked" : false,
				"childNodes" : {
					// 多普勒
					"radar_info_doppler" : {
						"title" : "多普勒",
						"mark" : "radar_info_doppler",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/radar/dooper.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 地波
					"radar_info_groundWave" : {
						"title" : "地波",
						"mark" : "radar_info_groundWave",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/radar/db.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					}
				}
			},
			// 辅助信息
			"radar_auxInfo" : {
				"title" : "辅助信息",
				"mark" : "radar_auxInfo",
				"acClassName" : "viewMenu2Clss",
				"imgurl" : "",
				"level" : 2,
				"visible" : true,
				"isCheck" : false,
				"checked" : false,
				"childNodes" : {
					// 卫星云图
					"radar_auxInfo_satCloud" : {
						"title" : "卫星云图",
						"mark" : "radar_auxInfo_satCloud",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/auxInfoAll/u31519.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 台风图
					"radar_auxInfo_typh" : {
						"title" : "台风图",
						"mark" : "radar_auxInfo_typh",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/auxInfoAll/u29817.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 学校
					"radar_auxInfo_school" : {
						"title" : "学校",
						"mark" : "radar_auxInfo_school",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/auxInfoAll/u29989.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 医院
					"radar_auxInfo_hosp" : {
						"title" : "医院",
						"mark" : "radar_auxInfo_hosp",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/auxInfoAll/u29955.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 加油站
					"radar_auxInfo_gasStation" : {
						"title" : "加油站",
						"mark" : "radar_auxInfo_gasStation",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/auxInfoAll/u29918.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 火警
					"radar_auxInfo_fire" : {
						"title" : "火警",
						"mark" : "radar_auxInfo_fire",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/auxInfoAll/u29951.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 交通
					"radar_auxInfo_traffic" : {
						"title" : "交通",
						"mark" : "radar_auxInfo_traffic",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/auxInfoAll/u29949.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 环保
					"radar_auxInfo_envPro" : {
						"title" : "环保",
						"mark" : "radar_auxInfo_envPro",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/auxInfoAll/u29926.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					}
				}
			}
		}
	},
	// 卫星云图
	"satCloud" : {
		"title" : "卫星云图",
		"mark" : "satCloud",
		"acClassName" : "viewMenu1Clss",
		"imgurl" : "../images/map/icon/T639.png",
		"level" : 1,
		"visible" : true,
		"isCheck" : false,
		"checked" : false,
		"childNodes" : {
			// 卫星云图
			"satCloud_info" : {
				"title" : "卫星云图",
				"mark" : "satCloud_info",
				"acClassName" : "viewMenu2Clss",
				"imgurl" : "",
				"level" : 2,
				"visible" : true,
				"isCheck" : false,
				"checked" : false,
				"childNodes" : {

					// FY2-D/D/F
					"satCloud_info_fy2df" : {
						"title" : "FY2-D/D/F",
						"mark" : "satCloud_info_fy2df",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/satCloud/fy2d.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// FY3-A/BC
					"satCloud_info_fy3bc" : {
						"title" : "FY3-A/BC",
						"mark" : "satCloud_info_fy3bc",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/satCloud/fy3a.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// NOAA
					"satCloud_info_noaa" : {
						"title" : "NOAA",
						"mark" : "satCloud_info_noaa",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/satCloud/noaa.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// MTSAT
					"satCloud_info_mtsat" : {
						"title" : "MTSAT",
						"mark" : "satCloud_info_mtsat",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/satCloud/mtsa.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					}
					
				}
			},
			// 卫星反演产品
			"satCloud_inverProduct" : {
				"title" : "卫星反演",
				"mark" : "satCloud_inverProduct",
				"acClassName" : "viewMenu2Clss",
				"imgurl" : "../images/map/satCloud/wxfy.png",
				"level" : 2,
				"visible" : true,
				"isCheck" : false,
				"checked" : false,
				"childNodes" : {
					// 风强
					"satCloud_inverProduct_wind" : {
						"title" : "风强",
						"mark" : "satCloud_inverProduct_wind",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/satCloud/wxfy.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 气压
					"satCloud_inverProduct_press" : {
						"title" : "气压",
						"mark" : "satCloud_inverProduct_press",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/satCloud/wxfy.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
				}
			},
			// 辅助信息
			"satCloud_auxInfo" : {
				"title" : "辅助信息",
				"mark" : "satCloud_auxInfo",
				"acClassName" : "viewMenu2Clss",
				"imgurl" : "",
				"level" : 2,
				"visible" : true,
				"isCheck" : false,
				"checked" : false,
				"childNodes" : {
					// 雷达图
					"satCloud_auxInfo_radar" : {
						"title" : "雷达图",
						"mark" : "satCloud_auxInfo_radar",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/auxInfoAll/u32241.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 台风图
					"satCloud_auxInfo_typh" : {
						"title" : "台风图",
						"mark" : "satCloud_auxInfo_typh",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/auxInfoAll/u29817.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 学校
					"satCloud_auxInfo_school" : {
						"title" : "学校",
						"mark" : "satCloud_auxInfo_school",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/auxInfoAll/u29989.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 医院
					"satCloud_auxInfo_hosp" : {
						"title" : "医院",
						"mark" : "satCloud_auxInfo_hosp",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/auxInfoAll/u29955.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 加油站
					"satCloud_auxInfo_gasStation" : {
						"title" : "加油站",
						"mark" : "satCloud_auxInfo_gasStation",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/auxInfoAll/u29918.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 火警
					"satCloud_auxInfo_fire" : {
						"title" : "火警",
						"mark" : "satCloud_auxInfo_fire",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/auxInfoAll/u29951.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 交通
					"satCloud_auxInfo_traffic" : {
						"title" : "交通",
						"mark" : "satCloud_auxInfo_traffic",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/auxInfoAll/u29949.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 环保
					"satCloud_auxInfo_envPro" : {
						"title" : "环保",
						"mark" : "satCloud_auxInfo_envPro",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/auxInfoAll/u29926.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					}
				}
			}
		}
	},
	// 传真图
	"faxChart" : {
		"title" : "传真图",
		"mark" : "faxChart",
		"acClassName" : "viewMenu1Clss",
		"imgurl" : "../images/map/icon/menu_3.png",
		"level" : 1,
		"visible" : true,
		"isCheck" : false,
		"checked" : false,
		"childNodes" : {}
	},
	// 数值分析
	"numAna" : {
		"title" : "数值分析",
		"mark" : "numAna",
		"acClassName" : "viewMenu1Clss",
		"imgurl" : "../images/map/icon/ic_3.png",
		"level" : 1,
		"visible" : true,
		"isCheck" : false,
		"checked" : false,
		"childNodes" : {
			// 等值面
			"numAna_contourPolygon" : {
				"title" : "等值面",
				"mark" : "numAna_contourPolygon",
				"acClassName" : "viewMenu2Clss",
				"imgurl" : "",
				"level" : 2,
				"visible" : true,
				"isCheck" : false,
				"checked" : false,
				"childNodes" : {
					// 位势温度
					"numAna_contourPolygon_pTemp" : {
						"title" : "位势温度",
						"mark" : "numAna_contourPolygon_pTemp",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/numAna/dzm_wswd.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 温度
					"numAna_contourPolygon_Temp" : {
						"title" : "温度",
						"mark" : "numAna_contourPolygon_Temp",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/numAna/dzm_wd.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 降水
					"numAna_contourPolygon_rain" : {
						"title" : "降水",
						"mark" : "numAna_contourPolygon_rain",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/numAna/dzm_js.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 相对湿度
					"numAna_contourPolygon_realHum" : {
						"title" : "相对湿度",
						"mark" : "numAna_contourPolygon_realHum",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/numAna/dzm_xdsd.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 垂直速度
					"numAna_contourPolygon_vSpeed" : {
						"title" : "垂直速度",
						"mark" : "numAna_contourPolygon_vSpeed",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/numAna/dzm_czsd.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					}
				}
			},
			// 等值线
			"numAna_contourLine" : {
				"title" : "等值线",
				"mark" : "numAna_contourLine",
				"acClassName" : "viewMenu2Clss",
				"imgurl" : "",
				"level" : 2,
				"visible" : true,
				"isCheck" : false,
				"checked" : false,
				"childNodes" : {
					// 温度
					"numAna_contourLine_temp" : {
						"title" : "温度",
						"mark" : "numAna_contourLine_temp",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/numAna/dzx_wd.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 压强
					"numAna_contourLine_pressure" : {
						"title" : "压强",
						"mark" : "numAna_contourLine_pressure",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/numAna/dzx_qy.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 位势高度
					"numAna_contourLine_pHeight" : {
						"title" : "位势高度",
						"mark" : "numAna_contourLine_pHeight",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/numAna/dzx_wsg.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					}
				}
			},
			// 风
			"numAna_windInfo" : {
				"title" : "风",
				"mark" : "numAna_windInfo",
				"acClassName" : "viewMenu2Clss",
				"imgurl" : "",
				"level" : 2,
				"visible" : true,
				"isCheck" : false,
				"checked" : false,
				"childNodes" : {
					// 风速
					"numAna_windInfo_windSpeed" : {
						"title" : "风速",
						"mark" : "numAna_windInfo_windSpeed",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/numAna/f_fs.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 风向杆
					"numAna_windInfo_windDirecRod" : {
						"title" : "风向杆",
						"mark" : "numAna_windInfo_windDirecRod",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/numAna/f_fxg.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					}
				}
			}

		}
	},
	// 海况分析
	"seaAna" : {
		"title" : "海况分析",
		"mark" : "seaAna",
		"acClassName" : "viewMenu1Clss",
		"imgurl" : "../images/map/icon/shikuang_2.png",
		"level" : 1,
		"visible" : true,
		"isCheck" : false,
		"checked" : false,
		"childNodes" : {
			// 实况信息
			"seaAna_liveInfo" : {
				"title" : "实况信息",
				"mark" : "seaAna_liveInfo",
				"acClassName" : "viewMenu2Clss",
				"imgurl" : "",
				"level" : 2,
				"visible" : true,
				"isCheck" : false,
				"checked" : false,
				"childNodes" : {
					// 海洋站
					"seaAna_liveInfo_marineStation" : {
						"title" : "海洋站",
						"mark" : "seaAna_liveInfo_marineStation",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/seaAna/hyz.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {
							// 风速
							"seaAna_liveInfo_marineStation_WS" : {
								"title" : "风速风向",
								"mark" : "seaAna_liveInfo_marineStation_WS",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "seaAna_liveInfo_marineStation_WS",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							// 海平面气压
							"seaAna_liveInfo_marineStation_SLP" : {
								"title" : "气压",
								"mark" : "seaAna_liveInfo_marineStation_SLP",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "seaAna_liveInfo_marineStation_SLP",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							  //气温
							"seaAna_liveInfo_marineStation_T" : {
								"title" : "气温",
								"mark" : "seaAna_liveInfo_marineStation_T",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "seaAna_liveInfo_marineStation_T",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
					           //水温
							"seaAna_liveInfo_marineStation_TW" : {
								"title" : "水温",
								"mark" : "seaAna_liveInfo_marineStation_TW",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "seaAna_liveInfo_marineStationTW",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							//浪高
							"seaAna_liveInfo_marineStation_HW" : {
								"title" : "浪高",
								"mark" : "seaAna_liveInfo_marineStation_HW",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "seaAna_liveInfo_marineStation_HW",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							//浪周期
							"seaAna_liveInfo_marineStation_PW" : {
								"title" : "浪周期",
								"mark" : "seaAna_liveInfo_marineStation_PW",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "seaAna_liveInfo_marineStation_PW",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							//涌向
							"seaAna_liveInfo_marineStation_DW1" : {
								"title" : "涌向",
								"mark" : "seaAna_liveInfo_marineStation_DW1",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "seaAna_liveInfo_marineStation_DW1",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							//涌高
							"seaAna_liveInfo_marineStation_HW1" : {
								"title" : "涌高",
								"mark" : "seaAna_liveInfo_marineStation_HW1",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "seaAna_liveInfo_marineStation_HW1",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							//涌周期
							"seaAna_liveInfo_marineStation_PW1" : {
								"title" : "涌周期",
								"mark" : "seaAna_liveInfo_marineStation_PW1",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "seaAna_liveInfo_marineStation_PW1",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							}
						}
					},
					// 海洋船舶
					"seaAna_liveInfo_marineShips" : {
						"title" : "海洋船舶",
						"mark" : "seaAna_liveInfo_marineShips",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/seaAna/hycp.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {
							// 风速
							"seaAna_liveInfo_marineShips_WS" : {
								"title" : "风速风向",
								"mark" : "seaAna_liveInfo_marineShips_WS",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "seaAna_liveInfo_marineShips_WS",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							// 海平面气压
							"seaAna_liveInfo_marineShips_SLP" : {
								"title" : "气压",
								"mark" : "seaAna_liveInfo_marineShips_SLP",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "seaAna_liveInfo_marineShips_SLP",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							  //气温
							"seaAna_liveInfo_marineShips_T" : {
								"title" : "气温",
								"mark" : "seaAna_liveInfo_marineShips_T",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "seaAna_liveInfo_marineShips_T",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
					           //水温
							"seaAna_liveInfo_marineShips_TW" : {
								"title" : "水温",
								"mark" : "seaAna_liveInfo_marineShips_TW",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "seaAna_liveInfo_marineShipsTW",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							//浪高
							"seaAna_liveInfo_marineShips_HW" : {
								"title" : "浪高",
								"mark" : "seaAna_liveInfo_marineShips_HW",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "seaAna_liveInfo_marineShips_HW",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							//浪周期
							"seaAna_liveInfo_marineShips_PW" : {
								"title" : "浪周期",
								"mark" : "seaAna_liveInfo_marineShips_PW",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "seaAna_liveInfo_marineShips_PW",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							//涌向
							"seaAna_liveInfo_marineShips_DW1" : {
								"title" : "涌向",
								"mark" : "seaAna_liveInfo_marineShips_DW1",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "seaAna_liveInfo_marineShips_DW1",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							//涌高
							"seaAna_liveInfo_marineShips_HW1" : {
								"title" : "涌高",
								"mark" : "seaAna_liveInfo_marineShips_HW1",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "seaAna_liveInfo_marineShips_HW1",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							//涌周期
							"seaAna_liveInfo_marineShips_PW1" : {
								"title" : "涌周期",
								"mark" : "seaAna_liveInfo_marineShips_PW1",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "seaAna_liveInfo_marineShips_PW1",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							}
						}
					},
					// 海洋浮标
					"seaAna_liveInfo_marineBuoy" : {
						"title" : "海洋浮标",
						"mark" : "seaAna_liveInfo_marineBuoy",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/seaAna/hyfb.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {
							// 风速
							"seaAna_liveInfo_marineBuoy_WS" : {
								"title" : "风速风向",
								"mark" : "seaAna_liveInfo_marineBuoy_WS",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "seaAna_liveInfo_marineBuoy_WS",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							// 海平面气压
							"seaAna_liveInfo_marineBuoy_SLP" : {
								"title" : "气压",
								"mark" : "seaAna_liveInfo_marineBuoy_SLP",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "seaAna_liveInfo_marineBuoy_SLP",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							  //气温
							"seaAna_liveInfo_marineBuoy_T" : {
								"title" : "气温",
								"mark" : "seaAna_liveInfo_marineBuoy_T",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "seaAna_liveInfo_marineBuoy_T",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
					           //水温
							"seaAna_liveInfo_marineBuoy_TW" : {
								"title" : "水温",
								"mark" : "seaAna_liveInfo_marineBuoy_TW",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "seaAna_liveInfo_marineBuoyTW",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							//浪高
							"seaAna_liveInfo_marineBuoy_HW" : {
								"title" : "浪高",
								"mark" : "seaAna_liveInfo_marineBuoy_HW",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "seaAna_liveInfo_marineBuoy_HW",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							//浪周期
							"seaAna_liveInfo_marineBuoy_PW" : {
								"title" : "浪周期",
								"mark" : "seaAna_liveInfo_marineBuoy_PW",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "seaAna_liveInfo_marineBuoy_PW",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							//涌向
							"seaAna_liveInfo_marineBuoy_DW1" : {
								"title" : "涌向",
								"mark" : "seaAna_liveInfo_marineBuoy_DW1",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "seaAna_liveInfo_marineBuoy_DW1",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							//涌高
							"seaAna_liveInfo_marineBuoy_HW1" : {
								"title" : "涌高",
								"mark" : "seaAna_liveInfo_marineBuoy_HW1",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "seaAna_liveInfo_marineBuoy_HW1",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							},
							//涌周期
							"seaAna_liveInfo_marineBuoy_PW1" : {
								"title" : "涌周期",
								"mark" : "seaAna_liveInfo_marineBuoy_PW1",
								"acClassName" : "viewMenu4Clss",
								"imgurl" : "",
								"value" : "seaAna_liveInfo_marineBuoy_PW1",
								"level" : 4,
								"visible" : true,
								"isCheck" : false,
								"checked" : true,
							}
						}
					}
				}
			},
			// 辅助信息
			"seaAna_auxInfo" : {
				"title" : "辅助信息",
				"mark" : "seaAna_auxInfo",
				"acClassName" : "viewMenu2Clss",
				"imgurl" : "",
				"level" : 2,
				"visible" : true,
				"isCheck" : false,
				"checked" : false,
				"childNodes" : {
					// 台风
					"seaAna_auxInfo_typhoon" : {
						"title" : "台风",
						"mark" : "seaAna_auxInfo_typhoon",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/auxInfoAll/u29817.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 卫星云图
					"seaAna_auxInfo_sateliteCloudChart" : {
						"title" : "卫星云图",
						"mark" : "seaAna_auxInfo_sateliteCloudChart",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/auxInfoAll/u31519.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					}
				}
			}
		}
	},
	// 热带气旋
	"tropicalCyc" : {
		"title" : "热带气旋",
		"mark" : "tropicalCyc",
		"acClassName" : "viewMenu1Clss",
		"imgurl" : "../images/map/icon/ic_5.png",
		"level" : 1,
		"visible" : true,
		"isCheck" : false,
		"checked" : false,
		"childNodes" : {
			// 台风预报
			"tropicalCyc_typhoonFocat" : {
				"title" : "台风预报",
				"mark" : "tropicalCyc_typhoonFocat",
				"acClassName" : "viewMenu2Clss",
				"imgurl" : "",
				"level" : 2,
				"visible" : true,
				"isCheck" : false,
				"checked" : false,
				"childNodes" : {
					// 中国
					"tropicalCyc_typhoonFocat_China" : {
						"title" : "中国",
						"mark" : "tropicalCyc_typhoonFocat_China",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/tropicalCyc/zg.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 美国
					"tropicalCyc_typhoonFocat_America" : {
						"title" : "美国",
						"mark" : "tropicalCyc_typhoonFocat_America",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/tropicalCyc/mg.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 日本
					"tropicalCyc_typhoonFocat_Japan" : {
						"title" : "日本",
						"mark" : "tropicalCyc_typhoonFocat_Japan",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/tropicalCyc/rb.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 中国台湾
					"tropicalCyc_typhoonFocat_taiWa" : {
						"title" : "中国台湾",
						"mark" : "tropicalCyc_typhoonFocat_taiWa",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/tropicalCyc/tw.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 中国香港
					"tropicalCyc_typhoonFocat_hongKong" : {
						"title" : "中国香港",
						"mark" : "tropicalCyc_typhoonFocat_hongKong",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/tropicalCyc/xg.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					}
				}
			},
			// 灾害预警
			"tropicalCyc_disWarning" : {
				"title" : "灾害预警",
				"mark" : "tropicalCyc_disWarning",
				"acClassName" : "viewMenu2Clss",
				"imgurl" : "",
				"level" : 2,
				"visible" : true,
				"isCheck" : false,
				"checked" : false,
				"childNodes" : {
					// 暴雨预警
					"tropicalCyc_disWarning_rainstormEarlyWarn" : {
						"title" : "暴雨预警",
						"mark" : "tropicalCyc_disWarning_rainstormEarlyWarn",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/tropicalCyc/zh_baoyu.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 海啸预警
					"tropicalCyc_disWarning_TsunamiEarlyWarn" : {
						"title" : "海啸预警",
						"mark" : "tropicalCyc_disWarning_TsunamiEarlyWarn",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/tropicalCyc/zh_haixiao.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					}
				}
			},
			// 辅助信息
			"tropicalCyc_auxInfo" : {
				"title" : "辅助信息",
				"mark" : "tropicalCyc_auxInfo",
				"acClassName" : "viewMenu2Clss",
				"imgurl" : "",
				"level" : 2,
				"visible" : true,
				"isCheck" : false,
				"checked" : false,
				"childNodes" : {
					// 卫星云图
					"tropicalCyc_auxInfo_satCloud" : {
						"title" : "卫星云图",
						"mark" : "tropicalCyc_auxInfo_satCloud",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/auxInfoAll/u31519.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 雷达图
					"tropicalCyc_auxInfo_radar" : {
						"title" : "雷达图",
						"mark" : "tropicalCyc_auxInfo_radar",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/auxInfoAll/u32241.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 台风公报
					"tropicalCyc_auxInfo_typhoonBulletin" : {
						"title" : "台风公报",
						"mark" : "tropicalCyc_auxInfo_typhoonBulletin",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/auxInfoAll/u32298.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 台风报文
					"tropicalCyc_auxInfo_typhoonMessage" : {
						"title" : "台风报文",
						"mark" : "tropicalCyc_auxInfo_typhoonMessage",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/auxInfoAll/u31571.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					}
				}
			}
		}
	},
	// 灾害预警
	"disWarning" : {
		"title" : "灾害预警",
		"mark" : "disWarning",
		"acClassName" : "viewMenu1Clss",
		"imgurl" : "../images/map/icon/ic_8.png",
		"level" : 1,
		"visible" : true,
		"isCheck" : false,
		"checked" : false,
		"childNodes" : {
			// 预警信息
			"disWarning_warningInfo" : {
				"title" : "预警信息",
				"mark" : "disWarning_warningInfo",
				"acClassName" : "viewMenu2Clss",
				"imgurl" : "",
				"level" : 2,
				"visible" : true,
				"isCheck" : false,
				"checked" : false,
				"childNodes" : {
					// 沙尘暴
					"disWarning_warningInfo_sandStorm" : {
						"title" : "沙尘暴",
						"mark" : "disWarning_warningInfo_sandStorm",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/disWarning/yj_csb.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 海啸
					"disWarning_warningInfo_tsunami" : {
						"title" : "海啸",
						"mark" : "disWarning_warningInfo_tsunami",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/disWarning/yj_haixiao.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 低温
					"disWarning_warningInfo_lowTemperature" : {
						"title" : "低温",
						"mark" : "disWarning_warningInfo_lowTemperature",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/disWarning/yj_diwen.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 高温
					"disWarning_warningInfo_hTemperature" : {
						"title" : "高温",
						"mark" : "disWarning_warningInfo_hTemperature",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/disWarning/yj_gaowen.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 暴雨
					"disWarning_warningInfo_rainstorm" : {
						"title" : "暴雨",
						"mark" : "disWarning_warningInfo_rainstorm",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/disWarning/yj_baoyu.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 暴雪
					"disWarning_warningInfo_blizzard" : {
						"title" : "暴雪",
						"mark" : "disWarning_warningInfo_blizzard",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/disWarning/yj_bx.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 强对流
					"disWarning_warningInfo_strongConvection" : {
						"title" : "强对流",
						"mark" : "disWarning_warningInfo_strongConvection",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/disWarning/yj_qdl.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 寒潮
					"disWarning_warningInfo_coldWave" : {
						"title" : "寒潮",
						"mark" : "disWarning_warningInfo_coldWave",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/disWarning/yj_hancao.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 霾
					"disWarning_warningInfo_haze" : {
						"title" : "霾",
						"mark" : "disWarning_warningInfo_haze",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/disWarning/yj_mai.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 雾
					"disWarning_warningInfo_dFog" : {
						"title" : "大雾",
						"mark" : "disWarning_warningInfo_dFog",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/disWarning/yj_dawu.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 全国预警
					"disWarning_warningInfo_allArea" : {
						"title" : "全国预警",
						"mark" : "disWarning_warningInfo_allArea",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/disWarning/yj_qg.png",
						"level" : 3,
						"visible" : false,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					}
				}
			},
			// 观测信息
			"disWarning_watchInfo" : {
				"title" : "观测信息",
				"mark" : "disWarning_watchInfo",
				"acClassName" : "viewMenu2Clss",
				"imgurl" : "",
				"level" : 2,
				"visible" : true,
				"isCheck" : false,
				"checked" : false,
				"childNodes" : {
					// 降水
					"disWarning_watchInfo_precipitation" : {
						"title" : "降水",
						"mark" : "disWarning_watchInfo_precipitation",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/disWarning/gc_js.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 温度
					"disWarning_watchInfo_temperature" : {
						"title" : "温度",
						"mark" : "disWarning_watchInfo_temperature",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/disWarning/gc_wd.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 强对流
					"disWarning_watchInfo_strongConvection" : {
						"title" : "强对流",
						"mark" : "disWarning_watchInfo_strongConvection",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/disWarning/gc_qdl.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 气压
					"disWarning_watchInfo_pressure" : {
						"title" : "气压",
						"mark" : "disWarning_watchInfo_pressure",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/disWarning/gc_qy.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					}
				}
			},
			// 辅助信息
			"disWarning_auxInfo" : {
				"title" : "辅助信息",
				"mark" : "disWarning_auxInfo",
				"acClassName" : "viewMenu2Clss",
				"imgurl" : "",
				"level" : 2,
				"visible" : true,
				"isCheck" : false,
				"checked" : false,
				"childNodes" : {
					// 卫星云图
					"disWarning_auxInfo_satCloud" : {
						"title" : "卫星云图",
						"mark" : "disWarning_auxInfo_satCloud",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/auxInfoAll/u31519.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 雷达图
					"disWarning_auxInfo_radar" : {
						"title" : "雷达图",
						"mark" : "disWarning_auxInfo_radar",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/auxInfoAll/u32241.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 台风图
					"disWarning_auxInfo_typh" : {
						"title" : "台风图",
						"mark" : "disWarning_auxInfo_typh",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/auxInfoAll/u29817.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 学校
					"disWarning_auxInfo_school" : {
						"title" : "学校",
						"mark" : "disWarning_auxInfo_school",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/auxInfoAll/u29989.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 医院
					"disWarning_auxInfo_hosp" : {
						"title" : "医院",
						"mark" : "disWarning_auxInfo_hosp",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/auxInfoAll/u29955.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 加油站
					"disWarning_auxInfo_gasStation" : {
						"title" : "加油站",
						"mark" : "disWarning_auxInfo_gasStation",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/auxInfoAll/u29918.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 火警
					"disWarning_auxInfo_fire" : {
						"title" : "火警",
						"mark" : "disWarning_auxInfo_fire",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/auxInfoAll/u29951.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 交通
					"disWarning_auxInfo_traffic" : {
						"title" : "交通",
						"mark" : "disWarning_auxInfo_traffic",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/auxInfoAll/u29949.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 环保
					"disWarning_auxInfo_envPro" : {
						"title" : "环保",
						"mark" : "disWarning_auxInfo_envPro",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/auxInfoAll/u29926.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					}
				}
			}
		}
	},
	// 海气预报  改为天气预报
	"seaForecast" : {
		"title" : "天气预报",
		"mark" : "seaForecast",
		"acClassName" : "viewMenu1Clss",
		"imgurl" : "../images/map/icon/weather.png",
		"level" : 1,
		"visible" : true,
		"isCheck" : false,
		"checked" : false,
		"childNodes" : {
			// 天气预报
			"seaForecast_waetherFocat" : {
				"title" : "天气预报",
				"mark" : "seaForecast_waetherFocat",
				"acClassName" : "viewMenu2Clss",
				"imgurl" : "",
				"level" : 2,
				"visible" : true,
				"isCheck" : false,
				"checked" : false,
				"childNodes" : {
					// 城市预报
					"seaForecast_waetherFocat_cityFocat" : {
						"title" : "城市预报",
						"mark" : "seaForecast_waetherFocat_cityFocat",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/seaForecast/tq_cs.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 强对流
					"seaForecast_waetherFocat_strongConvection" : {
						"title" : "强对流",
						"mark" : "seaForecast_waetherFocat_strongConvection",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/seaForecast/tq_qdl.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 降水量
					"seaForecast_waetherFocat_precipitation" : {
						"title" : "降水强度",
						"mark" : "seaForecast_waetherFocat_precipitation",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/seaForecast/tq_js.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 雷电概率
					"seaForecast_waetherFocat_thunderProbability" : {
						"title" : "雷电概率",
						"mark" : "seaForecast_waetherFocat_thunderProbability",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/seaForecast/tq_ld.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 国外天气
					"seaForecast_waetherFocat_foreignWeather" : {
						"title" : "国外天气",
						"mark" : "seaForecast_waetherFocat_foreignWeather",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/seaForecast/tq_gw.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 短时临近
					"seaForecast_waetherFocat_shortTime" : {
						"title" : "短时临近",
						"mark" : "seaForecast_waetherFocat_shortTime",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/seaForecast/tq_dl.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					}
				}
			},
			// 海洋预报
			"seaForecast_seaForecast" : {
				"title" : "海洋预报",
				"mark" : "seaForecast_seaForecast",
				"acClassName" : "viewMenu2Clss",
				"imgurl" : "",
				"level" : 2,
				"visible" : true,
				"isCheck" : false,
				"checked" : false,
				"childNodes" : {
					// 风场
					"seaForecast_seaForecast_windField" : {
						"title" : "风场",
						"mark" : "seaForecast_seaForecast_windField",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/seaForecast/hy_fc.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 浪场
					"seaForecast_seaForecast_waveField" : {
						"title" : "浪场",
						"mark" : "seaForecast_seaForecast_waveField",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/seaForecast/hy_langc.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 流场
					"seaForecast_seaForecast_flowField" : {
						"title" : "流场",
						"mark" : "seaForecast_seaForecast_flowField",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/seaForecast/hy_lc.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 温度
					"seaForecast_seaForecast_temperature" : {
						"title" : "温度",
						"mark" : "seaForecast_seaForecast_temperature",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/seaForecast/hy_wd.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 盐度
					"seaForecast_seaForecast_salinity" : {
						"title" : "盐度",
						"mark" : "seaForecast_seaForecast_salinity",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/seaForecast/hy_yd.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 有效波高
					"seaForecast_seaForecast_effectWaveHeight" : {
						"title" : "有效波高",
						"mark" : "seaForecast_seaForecast_effectWaveHeight",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/seaForecast/hy_yxbg.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 平均波向
					"seaForecast_seaForecast_meanWaveDirection" : {
						"title" : "平均波向",
						"mark" : "seaForecast_seaForecast_meanWaveDirection",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/seaForecast/hy_pjxb.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					}
				}
			},
			// 辅助信息
			"seaForecast_auxInfo" : {
				"title" : "辅助信息",
				"mark" : "seaForecast_auxInfo",
				"acClassName" : "viewMenu2Clss",
				"imgurl" : "",
				"level" : 2,
				"visible" : true,
				"isCheck" : false,
				"checked" : false,
				"childNodes" : {
					// 卫星云图
					"seaForecast_auxInfo_satCloud" : {
						"title" : "卫星云图",
						"mark" : "seaForecast_auxInfo_satCloud",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/auxInfoAll/u31519.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 雷达图
					"seaForecast_auxInfo_radar" : {
						"title" : "雷达图",
						"mark" : "seaForecast_auxInfo_radar",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/auxInfoAll/u32241.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					}
				}
			}
		}
	},
	// 空间天气
	"spaceWeather" : {
		"title" : "空间天气",
		"mark" : "spaceWeather",
		"acClassName" : "viewMenu1Clss",
		"imgurl" : "../images/map/icon/ic_18.png",
		"level" : 1,
		"visible" : true,
		"isCheck" : false,
		"checked" : false,
		"childNodes" : {
			"spaceWeather_Sunα" : {
				"title" : "太阳α图像",
				"mark" : "spaceWeather_Sunα",
				"acClassName" : "viewMenu3Clss",
				"imgurl" : "../images/map/rainInfo/u31603.png",
				"level" : 2,
				"visible" : true,
				"isCheck" : false,
				"checked" : false,
				"childNodes" : {}
			},
			"spaceWeather_Ionosphere" : {
				"title" : "电离层背景",
				"mark" : "spaceWeather_Ionosphere",
				"acClassName" : "viewMenu3Clss",
				"imgurl" : "../images/map/rainInfo/u31603.png",
				"level" : 2,
				"visible" : true,
				"isCheck" : false,
				"checked" : false,
				"childNodes" : {}
			},
			"spaceWeather_Satellite" : {
				"title" : "同步轨道卫星",
				"mark" : "spaceWeather_Satellite",
				"acClassName" : "viewMenu3Clss",
				"imgurl" : "../images/map/rainInfo/u31603.png",
				"level" : 2,
				"visible" : true,
				"isCheck" : false,
				"checked" : false,
				"childNodes" : {}
			},
			"spaceWeather_Proton" : {
				"title" : "高能质子",
				"mark" : "spaceWeather_Proton",
				"acClassName" : "viewMenu3Clss",
				"imgurl" : "../images/map/rainInfo/u31603.png",
				"level" : 2,
				"visible" : true,
				"isCheck" : false,
				"checked" : false,
				"childNodes" : {}
			},
			"spaceWeather_Electron" : {
				"title" : "高能电子",
				"mark" : "spaceWeather_Electron",
				"acClassName" : "viewMenu3Clss",
				"imgurl" : "../images/map/rainInfo/u31603.png",
				"level" : 2,
				"visible" : true,
				"isCheck" : false,
				"checked" : false,
				"childNodes" : {}
			},
			"spaceWeather_TEC" : {
				"title" : "TEC分布图",
				"mark" : "spaceWeather_TEC",
				"acClassName" : "viewMenu3Clss",
				"imgurl" : "../images/map/rainInfo/u31603.png",
				"level" : 2,
				"visible" : true,
				"isCheck" : false,
				"checked" : false,
				"childNodes" : {}
			},
			"spaceWeather_SunSpot" : {
				"title" : "太阳黑子数",
				"mark" : "spaceWeather_SunSpot",
				"acClassName" : "viewMenu3Clss",
				"imgurl" : "../images/map/rainInfo/u31603.png",
				"level" : 2,
				"visible" : true,
				"isCheck" : false,
				"checked" : false,
				"childNodes" : {}
			},
			"spaceWeather_F107" : {
				"title" : "F107指数",
				"mark" : "spaceWeather_F107",
				"acClassName" : "viewMenu3Clss",
				"imgurl" : "../images/map/rainInfo/u31603.png",
				"level" : 2,
				"visible" : true,
				"isCheck" : false,
				"checked" : false,
				"childNodes" : {}
			}
		}
	},
	// 雨情信息
	"rainInfo" : {
		"title" : "雨情信息",
		"mark" : "rainInfo",
		"acClassName" : "viewMenu1Clss",
		"imgurl" : "../images/map/icon/ic_10.png",
		"level" : 1,
		"visible" : true,
		"isCheck" : false,
		"checked" : false,
		"childNodes" : {
			// 雨情信息
			"rainInfo_rain" : {
				"title" : "降雨信息",
				"mark" : "rainInfo_rain",
				"acClassName" : "viewMenu2Clss",
				"imgurl" : "",
				"level" : 2,
				"visible" : true,
				"isCheck" : false,
				"checked" : false,
				"childNodes" : {
					// 1h
					"rainInfo_rain_1h" : {
						"title" : "1小时降水",
						"mark" : "rainInfo_rain_1h",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/rainInfo/h1.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 3h
					"rainInfo_rain_3h" : {
						"title" : "3小时降水",
						"mark" : "rainInfo_rain_3h",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/rainInfo/h3.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 6h
					"rainInfo_rain_6h" : {
						"title" : "6小时降水",
						"mark" : "rainInfo_rain_6h",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/rainInfo/h6.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 24h
					"rainInfo_rain_24h" : {
						"title" : "24小时降水",
						"mark" : "rainInfo_rain_24h",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/rainInfo/h24.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					}
				}
			},
			// 辅助信息
			"rainInfo_auxInfo" : {
				"title" : "辅助信息",
				"mark" : "rainInfo_auxInfo",
				"acClassName" : "viewMenu2Clss",
				"imgurl" : "",
				"level" : 2,
				"visible" : true,
				"isCheck" : false,
				"checked" : false,
				"childNodes" : {
					// 卫星云图
					"rainInfo_auxInfo_satCloud" : {
						"title" : "卫星云图",
						"mark" : "rainInfo_auxInfo_satCloud",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/auxInfoAll/u31519.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 雷达图
					"rainInfo_auxInfo_radar" : {
						"title" : "雷达图",
						"mark" : "rainInfo_auxInfo_radar",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/auxInfoAll/u32241.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					}
				}
			}

		}
	},
	// 水情信息
	"waterInfo" : {
		"title" : "水情信息",
		"mark" : "waterInfo",
		"acClassName" : "viewMenu1Clss",
		"imgurl" : "../images/map/icon/shikuang_2.png",
		"level" : 1,
		"visible" : true,
		"isCheck" : false,
		"checked" : false,
		"childNodes" : {
			// 水情信息
			"waterInfo_water" : {
				"title" : "水情信息",
				"mark" : "waterInfo_water",
				"acClassName" : "viewMenu2Clss",
				"imgurl" : "",
				"level" : 2,
				"visible" : true,
				"isCheck" : false,
				"checked" : false,
				"childNodes" : {
					// 堰闸
					"waterInfo_water_weirSlu" : {
						"title" : "堰闸水情",
						"mark" : "waterInfo_water_weirSlu",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/waterInfo/yz.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 水库
					"waterInfo_water_reservoir" : {
						"title" : "水库水情",
						"mark" : "waterInfo_water_reservoir",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/waterInfo/sk.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 河道
					"waterInfo_water_riverWay" : {
						"title" : "河道水情",
						"mark" : "waterInfo_water_riverWay",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/waterInfo/hd.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 潮汐
					"waterInfo_water_tide" : {
						"title" : "潮汐水情",
						"mark" : "waterInfo_water_tide",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/waterInfo/cx.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					}
				}
			},
			// 辅助信息
			"waterInfo_auxInfo" : {
				"title" : "辅助信息",
				"mark" : "waterInfo_auxInfo",
				"acClassName" : "viewMenu2Clss",
				"imgurl" : "",
				"level" : 2,
				"visible" : true,
				"isCheck" : false,
				"checked" : false,
				"childNodes" : {
					// 卫星云图
					"waterInfo_auxInfo_satCloud" : {
						"title" : "卫星云图",
						"mark" : "waterInfo_auxInfo_satCloud",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/auxInfoAll/u31519.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 雷达图
					"waterInfo_auxInfo_radar" : {
						"title" : "雷达图",
						"mark" : "waterInfo_auxInfo_radar",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/auxInfoAll/u32241.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					}
				}
			}

		}
	},
	"leidapintu" : {
		"title" : "雷达拼图",
		"mark" : "leidapintu",
		"acClassName" : "viewMenu1Clss",
		"imgurl" : "../images/map/icon/shuju_2.png",
		"level" : 1,
		"visible" : true,
		"isCheck" : false,
		"checked" : false,
		"childNodes" : {
			"leidapintu_AllCountry" : {
				"title" : "全国雷达",
				"mark" : "leidapintu_AllCountry",
				"acClassName" : "viewMenu3Clss",
				"imgurl" : "",
				"level" : 2,
				"visible" : true,
				"isCheck" : false,
				"checked" : false,
				"childNodes" : {}
			},
			"leidapintu_regionalRadar" : {
				"title" : "区域雷达",
				"mark" : "leidapintu_regionalRadar",
				"acClassName" : "viewMenu3Clss",
				"imgurl" : "",
				"level" : 2,
				"visible" : true,
				"isCheck" : false,
				"checked" : false,
				"childNodes" : {}
			},
			"leidapintu_SingleRadar" : {
				"title" : "单站雷达",
				"mark" : "leidapintu_SingleRadar",
				"acClassName" : "viewMenu3Clss",
				"imgurl" : "",
				"level" : 2,
				"visible" : true,
				"isCheck" : false,
				"checked" : false,
				"childNodes" : {}
			}
		}
	},
	"tianqitu" : {
		"title" : "天气图",
		"mark" : "tianqitu",
		"acClassName" : "viewMenu1Clss",
		"imgurl" : "../images/map/icon/ic_18.png",
		"level" : 1,
		"visible" : true,
		"isCheck" : false,
		"checked" : false,
		"childNodes" : {}
	},
	//实况产品图
	"liveProduct" : {
		"title" : "实况产品图",
		"mark" : "liveProduct",
		"acClassName" : "viewMenu1Clss",
		"imgurl" : "../images/map/icon/ic_18.png",
		"level" : 1,
		"visible" : true,
		"isCheck" : false,
		"checked" : false,
		"childNodes" : {
			//逐小时实况
			"liveProduct_hourByhour" : {
				"title" : "逐小时实况",
				"mark" : "liveProduct_hourByhour",
				"acClassName" : "viewMenu3Clss",
				"imgurl" : "",
				"level" : 2,
				"visible" : true,
				"isCheck" : false,
				"checked" : false,
				"childNodes" : {
					// 全国降水图
					"liveProduct_hourByhour_rain" : {
						"title" : "全国降水图",
						"mark" : "liveProduct_hourByhour_rain",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/groundLive/u31603.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					},
					// 全国气温图
					"liveProduct_hourByhour_temp" : {
						"title" : "全国气温图",
						"mark" : "liveProduct_hourByhour_temp",
						"acClassName" : "viewMenu3Clss",
						"imgurl" : "../images/map/groundLive/szfx_wd.png",
						"level" : 3,
						"visible" : true,
						"isCheck" : false,
						"checked" : false,
						"childNodes" : {}
					}
				}
			},
			//逐小时实况
			"liveProduct_other" : {
				"title" : "其他",
				"mark" : "liveProduct_other",
				"acClassName" : "viewMenu3Clss",
				"imgurl" : "",
				"level" : 2,
				"visible" : true,
				"isCheck" : false,
				"checked" : false,
				"childNodes" : {}
			}
		}
	}
	
	}
