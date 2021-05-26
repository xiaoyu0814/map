function Projection() {

}

Projection.forward = function (point) {
	point.x *= 0.017453292519943295;
	point.y *= 0.017453292519943295;
	point.x = Projection.adjLongitude(point.x);

	point.y = Math.max(-1.5358897417550099, Math.min(point.y, 1.5358897417550099));
	point.x = 6378137.0000000000 * Projection.adjLongitude(point.x);
	point.y = 6378137.0000000000 * Math.log(Math.tan(0.78539816339744828 + 0.5 * point.y));
	return point;
};

Projection.inverse = function (point) {
	point.y = 2.0 * Math.atan(Math.exp(point.y / 6378137.0000000000)) - 1.5707963267948966;
	point.x = point.x / 6378137.0000000000;

	if(Projection.isEqual(Math.abs(point.x), 3.1415926535897931))
	{
		point.x = point.x < 0.0 ? -3.1415926535897931 : 3.1415926535897931;
	}

	point.x = Projection.adjLongitude(point.x);
	point.y = Math.min(Math.max(-1.5707963267948966, point.y), 1.5707963267948966);

	point.x /= 0.017453292519943295;
	point.y /= 0.017453292519943295;
	return point;
};

Projection.adjLongitude = function (lon)
{
	if (Projection.isEq(lon, 3.1415926535897931, 0.00000000001))
	{
		return 3.1415926535897931;
	}
	if (Projection.isEq(lon, -3.1415926535897931, 0.00000000001))
	{
		return -3.1415926535897931;
	}
	if (Math.abs(lon) / 3.1415926535897931 > 10)
	{
		return 0;
	}
	while (Math.abs(lon) > 3.1415926535897931)
	{
		lon += lon < 0.0 ? 6.2831853071795862 : -6.2831853071795862;
	}
	return lon;
};

Projection.isZero = function (value) {
    return ((value<1e-13) && (value>-1e-13));
};

Projection.isEqual = function (dValue1, dValue2)
{
    if (dValue1 == 0) {
        return Projection.isZero(dValue2);
    }
    else if (dValue2 == 0) {
        return Projection.isZero(dValue1);
    }
    var dMaxValue = Math.max(Math.abs(dValue1), Math.abs(dValue2));
    var dAbsolute = dValue1 - dValue2;

    return ((dAbsolute>=(-1e-13*dMaxValue)) && (dAbsolute<=(1e-13*dMaxValue)));
};

Projection.isEq = function (dValue1, dValue2, dTolerance)
{
    if (dTolerance > 0)
    {
        var dTemp = dValue1 - dValue2;
        return ((dTemp > -dTolerance) && (dTemp < dTolerance));
    }
    return false;
};
