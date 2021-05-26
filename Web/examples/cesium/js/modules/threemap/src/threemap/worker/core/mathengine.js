function MathEngine() {

}

MathEngine.EP = 1e-13;
MathEngine.RTOD = 57.295779513082320876798154814;
MathEngine.DTOR = 0.0174532925199432957692369077;
MathEngine.EARTH_RADIUS = 6378137;
MathEngine.EARTH_CIRCUM = 2 * Math.PI * MathEngine.EARTH_RADIUS;
MathEngine.EARTH_LTOWRATIO = 0.762; // (423.0 / 555.0)

MathEngine.DBLMAX = 1.7976931348623158e+308;
MathEngine.DBLMIN = 2.2250738585072014e-308;
MathEngine.FLTMAX = 3.402823466e+38;
MathEngine.FLTMIN = 1.175494351e-38;

MathEngine.round = function (value) {
    return (value > 0) ? (value + 0.5) : (value - 0.5);
};

MathEngine.rotateRadian = function (pntAnchor, dRadian, pntSource) {
    var dCos = Math.cos(dRadian);
    var dSin = Math.sin(dRadian);

    var xx = pntSource.x - pntAnchor.x;
    var yy = pntSource.y - pntAnchor.y;

    pntSource.x = xx * dCos - yy * dSin + pntAnchor.x;
    pntSource.y = xx * dSin + yy * dCos + pntAnchor.y;

    return pntSource;
};

MathEngine.isZero = function (value) {
    return ((value<1e-13) && (value>-1e-13));
};

MathEngine.isEqual = function (dValue1, dValue2)
{
    if (dValue1 == 0) {
        return MathEngine.isZero(dValue2);
    }
    else if (dValue2 == 0) {
        return MathEngine.isZero(dValue1);
    }
    var dMaxValue = Math.max(Math.abs(dValue1), Math.abs(dValue2));
    var dAbsolute = dValue1 - dValue2;

    return ((dAbsolute>=(-1e-13*dMaxValue)) && (dAbsolute<=(1e-13*dMaxValue)));
};

MathEngine.isEq = function (dValue1, dValue2, dTolerance)
{
    if (dTolerance > 0)
    {
        var dTemp = dValue1 - dValue2;
        return ((dTemp > -dTolerance) && (dTemp < dTolerance));
    }
    return false;
};

MathEngine.compute2DAngleFromY = function (x, y)
{
    if (MathEngine.isZero(x))
    {
        return 0;
    }
    var dAngle = 0.0;

    if (x < 0 && y > 0)
    {
        dAngle = Math.PI/2 - Math.atan(Math.abs(y/x));
    }
    else if (x < 0 && y < 0)
    {
        dAngle = Math.atan(Math.abs(y/x)) + Math.PI/2;
    }
    else if (x > 0 && y < 0)
    {
        dAngle = 3*Math.PI/2 - Math.atan(Math.abs(y/x));
    }
    else if (x > 0 && y > 0)
    {
        dAngle = 3*Math.PI/2 + Math.atan(Math.abs(y/x));
    }
    else if (MathEngine.isZero(y) && x < 0)
    {
        dAngle = Math.PI/2;
    }
    else if (MathEngine.isZero(x) && y < 0)
    {
        dAngle = Math.PI;
    }
    else if (MathEngine.isZero(y) && x >0)
    {
        dAngle = 3*Math.PI/2;
    }
    else if (MathEngine.isZero(x) && y > 0)
    {
        dAngle = 0;
    }

    return dAngle;
};

MathEngine.sphericalToCartesian = function(dLongitude, dLatitude, dRadius) {
    var dRadCosLat = dRadius * Math.cos(dLatitude);
    return new Vector3(dRadCosLat*Math.sin(dLongitude), dRadius*Math.sin(dLatitude), dRadCosLat*Math.cos(dLongitude));
};

MathEngine.cartesianToSpherical = function(x, y, z) {
    var rho = Math.sqrt(x * x + y * y + z * z);
    if (MathEngine.isZero(rho))
    {
        return new Vector3(0, 0, 0);
    }
    var longitude = Math.atan2(x, z);
    var latitude = Math.asin(y / rho);

    return new Vector3(longitude, latitude, rho);
};

MathEngine.rayIntersectionWithPlane = function (vecStart, vecEnd) {
    var vecLineVector = new Vector3();
    vecLineVector.x = vecEnd.x - vecStart.x;
    vecLineVector.y = vecEnd.y - vecStart.y;
    vecLineVector.z = vecEnd.z - vecStart.z;
    vecLineVector.normalize();

    var vecPlaneNormal = new Vector3();
    vecPlaneNormal.x = 0;
    vecPlaneNormal.y = 0;
    vecPlaneNormal.z = 1;
    var vecPlanePoint = new Vector3();
    vecPlanePoint.x = 0;
    vecPlanePoint.y = 0;
    vecPlanePoint.z = 0;
    var vecPoint = new Vector3();

    var vp1, vp2, vp3, n1, n2, n3, v1, v2, v3, m1, m2, m3, t, vpt;
    vp1 = vecPlaneNormal.x;
    vp2 = vecPlaneNormal.y;
    vp3 = vecPlaneNormal.z;
    n1 = vecPlanePoint.x;
    n2 = vecPlanePoint.y;
    n3 = vecPlanePoint.z;
    v1 = vecLineVector.x;
    v2 = vecLineVector.y;
    v3 = vecLineVector.z;
    m1 = vecStart.x;
    m2 = vecStart.y;
    m3 = vecStart.z;
    vpt = v1 * vp1 + v2 * vp2 + v3 * vp3;
    if (vpt == 0) {
        return null;
    }
    else {
        t = ((n1 - m1) * vp1 + (n2 - m2) * vp2 + (n3 - m3) * vp3) / vpt;

        var vecIntersect = new Vector3();
        vecIntersect.x = m1 + v1 * t;
        vecIntersect.y = m2 + v2 * t;
        vecIntersect.z = m3 + v3 * t;

        return vecIntersect;
    }

    return null;
};

MathEngine.rayIntersectionWithSphere = function (vecStart, vecEnd, dRadius) {
    var p1 = vecStart;
    var p2 = vecEnd;

    var dDist = p2.x*p2.x + p2.y*p2.y + p2.z*p2.z;
    var dRealRadious = Math.sqrt(dDist);

    var a = (p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y) + (p2.z - p1.z) * (p2.z - p1.z);
    var b = 2.0*((p2.x - p1.x)*(p1.x) + (p2.y - p1.y)*(p1.y) + (p2.z - p1.z)*(p1.z));
    var c = p1.x*p1.x + p1.y*p1.y + p1.z*p1.z - dRadius*dRadius;

    var discriminant = b*b - 4 * a * c;
    if(discriminant <= 0)
    {
        return null;
    }
    var t1 = ((-1.0) * b - Math.sqrt(b*b - 4 * a * c)) / (2*a);
    var vecIntersect = new Vector3(p1.x + t1*(p2.x - p1.x), p1.y + t1*(p2.y - p1.y), p1.z + t1 *(p2.z - p1.z));
    return vecIntersect;
};
