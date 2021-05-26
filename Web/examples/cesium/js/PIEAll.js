document.write('<script language=javascript src="../../build/PIE.js"></script>');
document.write('<script language=javascript src="js/lib/proj4.js"></script>');
window.onload = function(){
proj4.defs('EPSG:2700', '+title=Beijing1954 +proj=lcc +lat_1=21 +lat_2=24 +lat_0=18 +lon_0=114 +x_0=500000 +y_0=200000 +ellps=WGS84 +towgs84=0,0,1.9,0,-0000,-0,-0.39 +units=m +no_defs');

}