// 高德
export function getArea(ring) {
    var sJ = 6378137;
    var Hq = 0.017453292519943295;

    var arr = [];
    for (var i = 0;i< ring.length; i++){
        var poi = {
            lng:ring[i][0],
            lat:ring[i][1]
        };
        arr[i] = poi;
    }

    ring = arr;

    var c = sJ *Hq , d = 0 , e = ring.length;

    if (3 > e) {
        return 0;
    }

    for (var g = 0; g < e - 1; g += 1){
        var h = ring[g], k = ring[g + 1];
        var u = h.lng * c * Math.cos(h.lat * Hq);
        var h = h.lat * c;
        var v = k.lng * c * Math.cos(k.lat *Hq);
        var d = d + (u * k.lat * c - v * h);
    }

    g = ring[g];
    ring = ring[0];
    e = g.lng * c * Math.cos(g.lat * Hq);
    g = g.lat * c;
    k = ring.lng * c * Math.cos(ring.lat * Hq);
    d += e * ring.lat * c - k * g;
    return 0.5*Math.abs(d)
}