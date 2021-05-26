/**
*
* @author mhw
* geojson属性字段配置
* @class GeoJsonFormatFeilds
* @constructor
* @param {Object} lineSFeilds              			线样式字段
* @param {Number} lineSFeilds.lineWidth  			线宽度字段
* @param {String} lineSFeilds.lineColor    			线颜色字段
* @param {Object} polygonSFeilds           			面样式字段
* @param {String} polygonSFeilds.fillColor  		面填充颜色字段
* @param {Number} polygonSFeilds.outlineWidth  		面外轮廓线宽度字段
* @param {String} polygonSFeilds.outlineColor  		面外轮廓线颜色字段
* @param {Number} polygonSFeilds.extrudedHeight 	面拉伸高度字段
* @param {Object} pointSFeilds           			点样式字段
* @param {String} pointSFeilds.pointColor  	 		点填充颜色字段
* @param {String} pointSFeilds.outlineColor  		点外轮廓线颜色字段
* @param {String} pointSFeilds.outlineWidth  		点外轮廓线宽度字段
* @param {Object} iconSFeilds           			图片样式字段
* @param {String} iconSFeilds.iconImage         	图片连接网络地址字段
* @param {Number} iconSFeilds.imageScale        	图片比例字段
* @param {Number} iconSFeilds.imageRotation     	图片旋转角度字段
* @param {Number} iconSFeilds.imageXOffset      	图片水平偏移字段，单位像素
* @param {Number} iconSFeilds.imageRotation     	图片竖直偏移字段，单位像素
* @param {Object} textSFeilds           			文本样式字段
* @param {String} textSFeilds.textColor        		文本字体颜色字段
* @param {String} textSFeilds.textName        		文本内容字段
* @param {String} textSFeilds.textFont        		文本字体大小和字体字段
* @param {Number} textSFeilds.textScale        		文本字体比例字段
* @param {Number} textSFeilds.textXOffset       	文本水平偏移字段，单位像素
* @param {Number} textSFeilds.textYOffset       	文本竖直偏移字段，单位像素
* @param {Number} textSFeilds.outlineWidth        	文本外轮廓线宽度字段
* @param {String} textSFeilds.outlineColor        	文本外轮廓线颜色字段
* @param {String} textSFeilds.backgroundColor     	文本背景颜色字段
* @param {Number} textSFeilds.backgroundXPadding  	文本背景颜色水平内置偏移字段，单位像素
* @param {Number} textSFeilds.backgroundYPadding  	文本背景颜色竖直内置偏移字段，单位像素
* @param {Object} groundStationFeilds           	站点实况样式 
* @param {Object} groundStationFeilds.XX        	站点实况XX图层 
* @param {String} groundStationFeilds.XX.type   	站点实况XX图层，图层类型（icon是图标，text是文字图层);
* @param {String} groundStationFeilds.XX.iconImage  站点实况样式XX图层，图标对应字段
* @param {String} groundStationFeilds.XX.iconName   站点实况样式XX图层，图标对应字段前缀 
* @param {String} groundStationFeilds.XX.rotate     站点实况样式XX图层，选择角度对应字段（false表示没有旋转）
* @param {Array}  groundStationFeilds.XX.offset     站点实况样式XX图层，图标/文字偏移量数组，单位像素
* @param {String} groundStationFeilds.XX.anchor     站点实况样式XX图层，图标锚点
* @param {String} groundStationFeilds.XX.size     	站点实况样式XX图层，图标/文字大小（图标是缩放比例，文字图层对应单位像素）
* @param {Boolean}groundStationFeilds.XX.overlap    站点实况样式XX图层，图标是否重叠隐藏
* @param {String} groundStationFeilds.XX.text       站点实况样式XX图层，文字对应字段
* @param {Boolean}groundStationFeilds.XX.color      站点实况样式XX图层，文字对应颜色
* @param {Object} upperStationFeilds           	    站点实况样式 
* @param {Object} upperStationFeilds.XX        	    站点实况XX图层 
* @param {String} upperStationFeilds.XX.type   	    站点实况XX图层，图层类型（icon是图标，text是文字图层);
* @param {String} upperStationFeilds.XX.iconImage   站点实况样式XX图层，图标对应字段
* @param {String} upperStationFeilds.XX.iconName    站点实况样式XX图层，图标对应字段前缀 
* @param {String} upperStationFeilds.XX.rotate      站点实况样式XX图层，选择角度对应字段（false表示没有旋转）
* @param {Array}  upperStationFeilds.XX.offset      站点实况样式XX图层，图标/文字偏移量数组，单位像素
* @param {String} upperStationFeilds.XX.anchor      站点实况样式XX图层，图标锚点
* @param {String} upperStationFeilds.XX.size     	站点实况样式XX图层，图标/文字大小（图标是缩放比例，文字图层对应单位像素）
* @param {Boolean}upperStationFeilds.XX.overlap     站点实况样式XX图层，图标是否重叠隐藏
* @param {String} upperStationFeilds.XX.text        站点实况样式XX图层，文字对应字段
* @param {Boolean}upperStationFeilds.XX.color       站点实况样式XX图层，文字对应颜色
*/
var GeoJsonFormatFeilds={
		lineSFeilds:{
			"lineWidth":"lineWidth",  
			"lineColor":"valueColor"
		},
		polygonSFeilds:{
			"fillColor":"valueColor",
			"outlineWidth":"lineWidth",
			"outlineColor":"lineColor",
			"extrudedHeight":"extrudedHeight"
		},
		pointSFeilds:{
			"pointColor":"pointColor",
			"outlineWidth":"lineWidth",
			"outlineColor":"lineColor",
			"pointSize":"pointSize"
		},
		iconSFeilds:{
			"iconImage":"iconUrl",
			"imageScale":"imageScale",
			"imageRotation":"imageRotation",
			"imageXOffset":"imageXOffset",
			"imageYOffset":"imageYOffset"
		},
		textSFeilds:{
			"textColor":"textColor",
			"textName":"textName",
			"textFont":"textFont",
			"textScale":"textScale",
			"textXOffset":"textXOffset",
			"textYOffset":"textYOffset",
			"outlineWidth":"lineWidth",
			"outlineColor":"lineColor",
			"backgroundColor":"backgroundColor",
			"backgroundXPadding":"backgroundXPadding",
			"backgroundYPadding":"backgroundYPadding"
		},
		groundStationFeilds:{
			"WS":{
				"type":"icon",
				"iconImage":"WS",
				"iconName":"WIND",
				"rotate":"WD",
				"offset":[4,-20],
				"anchor":"center",
				"size":0.8,
				"overlap":true
			},
			"WW":{
				"type":"icon",
				"iconImage":"WW",
				"iconName":"WW",
				"rotate":false,
				"offset":[-35, 10],
				"anchor":"center",
				"size":0.5,
				"overlap":true
			},
			"W1":{
				"type":"icon",
				"iconImage":"W1",
				"iconName":"OW",
				"rotate":false,
				"offset":[35, 28],
				"anchor":"center",
				"size":0.5,
				"overlap":true
			},
			"N":{
				"type":"icon",
				"iconImage":"N",
				"iconName":"N",
				"rotate":false,
				"offset":[0,0],
				"anchor":"center",
				"size":0.4,
				"overlap":true
			},
			"CH":{
				"type":"icon",
				"iconImage":"CH",
				"iconName":"CH",
				"rotate":false,
				"offset":[0, -60],
				"anchor":"center",
				"size":0.5,
				"overlap":true
			},
			"CM":{
				"type":"icon",
				"iconImage":"CM",
				"iconName":"CM",
				"rotate":false,
				"offset":[0, -35],
				"anchor":"center",
				"size":0.42,
				"overlap":true
			},
			"CL":{
				"type":"icon",
				"iconImage":"CL",
				"iconName":"CL",
				"rotate":false,
				"offset":[-8, 35],
				"anchor":"center",
				"size": 0.38,
				"overlap":true
			},
			"T":{
				"type":"text",
				"color" :"#000",
                "text":"T",
                "overlap":true,
                "offset":[-1.8,-1],
                "size":14
			},
			"VIS":{
				"type":"text",
				"color" :"#000",
                "text":"VIS",
                "overlap":true,
                "offset":[-1.8, 1],
                "size":14
			},
			"NH":{
				"type":"text",
				"color" :"#000",
                "text":"NH",
                "overlap":true,
                "offset":[0.5, 1],
                "size":14
			},
			"LH":{
				"type":"text",
				"color" :"#000",
                "text":"LH",
                "overlap":true,
                "offset":[0, 2],
                "size":14
			},
			"SLP":{
				"type":"text",
				"color" :"#000",
                "text":"SLP",
                "overlap":true,
                "offset":[1.4, -1],
                "size":14
			},
			"DP3":{
				"type":"text",
				"color" :"#000",
                "text":"DP3",
                "overlap":true,
                "offset":[1, 0.2],
                "size":14
			},
			"TD":{
				"type":"text",
				"color" :"#000",
                "text":"TD",
                "overlap":true,
                "offset":[-1.8, 2],
                "size":14
			},
			"RR":{
				"type":"text",
				"color" :"#000",
                "text":"RR",
                "overlap":true,
                "offset":[1.5, 2],
                "size":14
			},
		},
		upperStationFeilds:{
			"WS":{
				"type":"icon",
				"iconImage":"WS",
				"iconName":"WIND",
				"rotate":"WD",
				"offset":[4,-20],
				"anchor":"center",
				"size":0.8,
				"overlap":true
			},
			"TD":{
				"type":"text",
				"color" :"#000",
                "text":"TD",
                "overlap":true,
                "offset":[-1.8, 2],
                "size":14
			},
			"T":{
				"type":"text",
				"color" :"#000",
                "text":"T",
                "overlap":true,
                "offset":[-1.5, -1],
                "size":14
			},
			"H":{
				"type":"text",
				"color" :"#000",
                "text":"H",
                "overlap":true,
                "offset":[1.3, -1],
                "size":14
			}
			
		},
		isoLineFeilds:{
			"line":{
				"lineWidth":"lineWidth",  
				"lineColor":"valueColor"
			},
			"text":{
				"textColor":"valueColor",
				"textName":"value",
				"size":16
			}
		}

		
	}
export {GeoJsonFormatFeilds}