class SunlightTool {

    constructor(viewer) {
        this.viewer = viewer;
        this.handler = null;
        this.entityArray = [];
        this.enable = false;

    }
    setEnable(enable) {
        this.enable = enable;

        if (enable) {
            if (this.handler == null) {
                this.sunAnlysis()
            }
        } else {

            for (let i = 0; i < this.entityArray.length; i++) {
                this.viewer.entities.remove(this.entityArray[i]);
            }
            this.handler.destroy();
            this.handler = null;

        }
    }

    sunAnlysis() {
        var cartesian;
        var points;
        //加入了太阳光
        this.viewer.scene.globe.enableLighting = true;
        this.viewer.scene.sun.show = true;
        this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
        var that = this;
        this.handler.setInputAction(function (event) {
            cartesian = that.viewer.scene.pickPosition(event.position);

            points = []
            cartesian = that.viewer.scene.pickPosition(event.position);
            var point1 = that.viewer.entities.add({
                position: cartesian,
                point: {
                    pixelSize: 5,
                    color: Cesium.Color.RED,
                    outlineColor: Cesium.Color.WHITE,
                    outlineWidth: 2,
                    // heightReference:Cesium.HeightReference.CLAMP_TO_GROUND 
                }
            });
            that.entityArray.push(point1);
            var e = "2019-06-18";
            var stopTime = null;
            // var endDate = "2019-06-18 24:00:00";
            // var end = Cesium.JulianDate.fromDate(new Date(endDate))
            if (that.viewer.clock.shouldAnimate = true, stopTime) { that.viewer.clock.currentTime = stopTime; }

            else {

                var t = new Date(e),
                    i = "6",
                    a = "21",
                    r = new Date(new Date(t).setHours(Number(i))),
                    o = new Date(new Date(t).setHours(Number(a)));
                that.viewer.scene.globe.enableLighting = true;
                that.viewer.shadows = true;
                that.viewer.clock.startTime = Cesium.JulianDate.fromDate(r);
                that.viewer.clock.currentTime = Cesium.JulianDate.fromDate(r);
                that.viewer.clock.stopTime = Cesium.JulianDate.fromDate(o);
                that.viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
                that.viewer.clock.clockStep = Cesium.ClockStep.TICK_DEPENDENT
                that.viewer.clock.multiplier = 200;


            }
            /**
             *对Date的扩展，将 Date 转化为指定格式的String
             *月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
             *年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
             *例子：
             *(new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
             *(new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
             */
            Date.prototype.format = function (fmt) {
                var o = {
                    "M+": this.getMonth() + 1, //月份
                    "d+": this.getDate(), //日
                    "h+": this.getHours(), //小时
                    "m+": this.getMinutes(), //分
                    "s+": this.getSeconds(), //秒
                    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                    "S": this.getMilliseconds() //毫秒
                };
                if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
                for (var k in o)
                    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                return fmt;
            }
            // var a = { watchValue: 0 };
            // var time1 = a.watchValue;

            // var a = { time1: 0 };
            var a = 0;
            var obj = {

            }
            var sunline = setInterval(function () {
                var sunPostion = that.viewer.scene.context.uniformState.sunPositionWC;

                var bolean = PointSunshineAnalysis(cartesian, sunPostion);
                if (bolean) {
                    points.push(1)
                } else {
                    points.push(0)
                }
                console.log(points);
               console.log(Cesium.JulianDate.toDate(that.viewer.clock.currentTime)) 
                obj.a = Cesium.JulianDate.toDate(that.viewer.clock.currentTime);
                // console.log(time1.format("yyyy-MM-dd hh:mm:ss"))

            }, 800)
            var times = 0;


            Object.defineProperty(obj, 'a', {
                get: function () {
                    return a
                },
                set: function (value) {
                    a = value;
                  
                    var hours = a.getHours();
                     
                    console.log(hours)
                    if (hours  == 20) {
                        window.clearInterval(sunline);
                        for (let i = 0; i < points.length; i++) {
                            console.log(points[i]);
                            that.viewer.shadows = false;
                            that.viewer.clock.shouldAnimate = false;
                            if (points[i] == 0) {
                                times++
                            }
                        }
                        var point2 = that.viewer.entities.add({
                            position: cartesian,
                            point: {
                                color: Cesium.Color.RED,    //点位颜色
                                pixelSize: 10                //像素点大小
                            },
                            label: {
                                text: (times / ((points.length)+1)).toFixed(3) + "日照率",
                                font: '14pt Source Han Sans CN',    //字体样式
                                fillColor: Cesium.Color.BLACK,        //字体颜色
                                backgroundColor: Cesium.Color.AQUA,    //背景颜色
                                showBackground: true,                //是否显示背景颜色
                                style: Cesium.LabelStyle.FILL,        //label样式
                                outlineWidth: 2,
                                verticalOrigin: Cesium.VerticalOrigin.CENTER,//垂直位置
                                horizontalOrigin: Cesium.HorizontalOrigin.LEFT,//水平位置
                                pixelOffset: new Cesium.Cartesian3(20, -30, 10),         //偏移
                            }

                        });
                        that.entityArray.push(point2);

                    }
                }
            })

            // Object.defineProperty(a, 'time1', {
            //     get: function () {
            //         console.log('get：' + time1);
            //         return time1;
            //     },
            //     set: function (value) {

            //         time1 = value;
            //         var hours = time1.getHours()
            //         if (hours == 23) {
            //             window.clearInterval(sunline);
            //             for (let i = 0; i < points.length; i++) {
            //                 console.log(points[i]);
            //                 that.viewer.shadows = false;
            //                 that.viewer.clock.shouldAnimate = false;
            //                 if (points[i] == 0) {
            //                     times++
            //                 }
            //             }
            //             var point2 = that.viewer.entities.add({
            //                 position: cartesian,
            //                 point: {
            //                     color: Cesium.Color.RED,    //点位颜色
            //                     pixelSize: 10                //像素点大小
            //                 },
            //                 label: {
            //                     text: (times / (points.length)).toFixed(3) + "%日照率",
            //                     font: '14pt Source Han Sans CN',    //字体样式
            //                     fillColor: Cesium.Color.BLACK,        //字体颜色
            //                     backgroundColor: Cesium.Color.AQUA,    //背景颜色
            //                     showBackground: true,                //是否显示背景颜色
            //                     style: Cesium.LabelStyle.FILL,        //label样式
            //                     outlineWidth: 2,
            //                     verticalOrigin: Cesium.VerticalOrigin.CENTER,//垂直位置
            //                     horizontalOrigin: Cesium.HorizontalOrigin.LEFT,//水平位置
            //                     pixelOffset: new Cesium.Cartesian3(20, -30, 10),         //偏移
            //                 }

            //             });
            //             that.entityArray.push(point2);

            //         }
            //     }
            // })



        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        //date（日期），经纬度，startTime是开始时间，endTime是结束时间，这里经纬度不传值的话默认是前面的要日照分析的点。,date,startTime,endTime
        function PointSunshineAnalysis(postion, sunposition2)//可以是二维的鼠标点，也可以是三维的直接坐标
        {

            //第一步，获取要分析的点位置
            if (postion != null) {
                if (postion.constructor.name != "Cartesian3") {
                    throw "传入参数必须是三维坐标";
                }
            }
            else {
                throw "无效参数";
            }
            //第二步，获取太阳的世界坐标,这里获取太阳的坐标的做法是很傻的，现在做一个函数，根据日期，时间，来推算出太阳高度角和太阳俯视角

            if (!that.viewer.scene.sun.show) {
                that.viewer.scene.sun.show = true;
            }


            // var sunposition2 = this.viewer.scene.context.uniformState.sunPositionWC;//这个应该是贴图的位置，

            var fx = new Cesium.Cartesian3(sunposition2.x - postion.x, sunposition2.y - postion.y, sunposition2.z - postion.z);
            var dec = Math.sqrt(fx.x * fx.x + fx.y * fx.y + fx.z * fx.z);
            var fxxl = new Cesium.Cartesian3(fx.x / dec, fx.y / dec, fx.z / dec);//方向向量
            var changdu = 500;
            var zd = new Cesium.Cartesian3(postion.x + changdu * fxxl.x, postion.y + changdu * fxxl.y, postion.z + changdu * fxxl.z);
            // //第三步，做射线，
            // var arrowPositions = [
            //     postion,
            //     zd
            // ];


            var bloean = jiance(postion, zd);
            return bloean;

        }
        function jiance(start, end) {
            var num = 100;
            var isshowders = false;
            var rad1 = Cesium.Cartographic.fromCartesian(start);
            var rad2 = Cesium.Cartographic.fromCartesian(end);//开始节点和结束节点转换为以弧度计算的经纬度

            //这里表示插值函数，start和end是起始点，然后进行插值，检测高程，如果获取的地面点比差值点的高程高的话就代表有焦点
            //坐标转经纬度
            let startpoint = {};
            startpoint.longitude = rad1.longitude / Math.PI * 180;
            startpoint.latitude = rad1.latitude / Math.PI * 180;
            startpoint.czheight = rad1.height;//将开始节点转换为角度的点
            let endpoint = {};
            endpoint.longitude = rad2.longitude / Math.PI * 180;
            endpoint.latitude = rad2.latitude / Math.PI * 180;
            endpoint.czheight = rad2.height;//将结束节点节点转换为角度的点
            for (var i = 0; i < num; i++) {
                let point = {};
                point.longitude = Cesium.Math.lerp(startpoint.longitude, endpoint.longitude, 0.01 * (i + 1));
                point.latitude = Cesium.Math.lerp(startpoint.latitude, endpoint.latitude, 0.01 * (i + 1));
                point.czheight = startpoint.czheight - (startpoint.czheight - endpoint.czheight) * 0.01 * (i + 1);
                var terCartographic = new Cesium.Cartographic(Cesium.Math.toRadians(point.longitude), Cesium.Math.toRadians(point.latitude), 0);//转经纬度对像
                var cartographichight = that.viewer.scene.sampleHeight(terCartographic);//坐标点获取建筑物高程
                var cartographic = Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude, cartographichight);//经纬度转世界坐标

                point.zsheight = cartographichight;//真实点的高程
                if (point.zsheight > point.czheight) {
                    isshowders = true;
                    break
                }

            }
            return isshowders;

        }

    }

}