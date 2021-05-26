// /**
//  * Created by xuelili on 2020/5/29.
//  * save filter conditions
//  */


//获取IDS的统计信息
function GetFeaturesByIDsParameters(params) {
    var featureRequest = new PIE.ol.format.WFS().writeGetFeature({
        srsName: idsParam["srsName"], //坐标系
        featureTypes: idsParam["datasetNames"], //所要访问的图层
        maxFeatures: 5000,
        outputFormat: 'application/json',
        filter: PIE.ol.format.filter.like('ID', IDs) //前者是属性名，后者是对应值      
    });
    return featureRequest;
}


// 获取几何查询信息 
function GetFeaturesByGeometryParameters(params) {
    var featureRequest = new PIE.ol.format.WFS().writeGetFeature({
        srsName: idsParam["srsName"], //坐标系
        featureTypes: idsParam["datasetNames"], //所要访问的图层
        maxFeatures: 5000,
        outputFormat: 'application/json',
        filter: PIE.ol.format.filter.like('the_geom', IDs) //前者是属性名，后者是对应值      
    });
    return featureRequest;
}


//获取范围查询信息
function GetFeaturesByBoundsParameters(params) {
    var boundsParams=params;    
    var featureRequest = new PIE.ol.format.WFS().writeGetFeature({
        srsName: boundsParams["srsName"], //坐标系
        featureTypes: boundsParams["datasetNames"], //所要访问的图层
        maxFeatures: 5000,
        outputFormat: 'application/json',
        filter: PIE.ol.format.filter.intersects("the_geom", boundsParams["geometry"])//前者是属性名，后者是对应值   
    });
    return featureRequest;
}

// var geometryParam = new SuperMap.GetFeaturesByGeometryParameters({
//     datasetNames: ["World:Countries"],
//     geometry: polygon,
//     spatialQueryMode: "INTERSECT"
// });
// new ol.supermap.FeatureService(url).getFeaturesByGeometry(geometryParam, function (serviceResult) {
//     var vectorSource = new ol.source.Vector({
//         features: (new ol.format.GeoJSON()).readFeatures(serviceResult.result.features),
//         wrapX: false
//     });
//     resultLayer = new ol.layer.Vector({
//         source: vectorSource,
//     });
//     map.addLayer(resultLayer);
// });


//url:进行WFS查询数据的URL
//featureRequest：对传递的参数进行封装
function query(url, featureRequest) {  
    let _this = this;
    console.log(_this);
    // 发送请求
    try {
        fetch(url, {
            method: 'POST',
            body: new XMLSerializer().serializeToString(featureRequest)
        }).then(function (response) {
            return response.json();
        }).then(function (json) {
            var features = new PIE.ol.format.GeoJSON().readFeatures(json);
            _this.addFeatures(features);
        });
    } catch (error) {
        
    }  
}