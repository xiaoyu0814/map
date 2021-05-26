//定义定位信息图层方法
var Status = function (map) {
    this.dom = document.createElement("div");
    this.dom.style.left = "10px";
    this.dom.style.bottom = "10px";
    this.dom.style.position = "absolute";
    this.dom.style.width = "600px";
    this.dom.style.zIndex = 99999;

    var status3 = document.createElement("div");
    status3.id = "status3";
    status3.style.height = "20px";
    this.dom.appendChild(status3);

    var status1 = document.createElement("div");
    status1.id = "status1";
    status1.style.height = "20px";
    this.dom.appendChild(status1);

    var status = document.createElement("div");
    status.id = "status";
    status.style.height = "20px";
    this.dom.appendChild(status);

    var status2 = document.createElement("div");
    status2.id = "status2";
    status2.style.height = "20px";
    this.dom.appendChild(status2);

    map.on("move", function (e) {
        // console.log(map.getBounds());
        status3.innerHTML = ( "层级：" + parseInt(map.getZoom()))
        status.innerHTML = ("   当前中心点经纬度：" + "("+map.getCenter()[0].toFixed(2)+"," + " "+ map.getCenter()[1].toFixed(2)+")"+"");
        status2.innerHTML = ( " 视角范围:" + "("+map.getBounds()[0].toFixed(2)+","+ " " +map.getBounds()[1].toFixed(2) +")" + " "
            +"("+map.getBounds()[2].toFixed(2)+"," + " "+map.getBounds()[3].toFixed(2) +")");
    });
    map.on("mousemove", function (e) {
        //console.log(e);
        status1.innerHTML = ("   定位经纬度：" +"(" + e.coordinate[0].toFixed(2) +","+ " "+ e.coordinate[1].toFixed(2)+")");
    });
    map.on("click", function (e) {
        // console.log(e);
        status1.innerHTML = ("   定位经纬度：" +"(" + e.coordinate[0].toFixed(2) +","+ " "+ e.coordinate[1].toFixed(2)+")");
    })
};
