//自定义计算距离算法
var EARTH_RADIUS = 6378137;//赤道半径(单位m)

//转化为弧度（rad）
function rad(d) {
    return d * Math.PI / 180.0;
}

//遍历数组，进行数组的叠加计算
export function getLength(pointArr) {
    var dis = 0.0;
    if (pointArr.length <= 1) {
        return dis;
    }
    for (var i = 0; i < pointArr.length - 1; i++) {
        var point1 = pointArr[i];
        var point2 = pointArr[i + 1];
        dis += getDistance(point1[0], point1[1], point2[0], point2[1]);
    }
    return dis;
}

//获取距离算法
export function getDistance(lng1, lat1, lng2, lat2) {
    var radLat1 = rad(lat1);
    var radLat2 = rad(lat2);
    var a = radLat1 - radLat2;
    var b = rad(lng1) - rad(lng2);
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2)
        + Math.cos(radLat1) * Math.cos(radLat2)
        * Math.pow(Math.sin(b / 2), 2)));
    s = s * EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000;
    s = s / 1000;
    return s;
}