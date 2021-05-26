function controller(options) {
    this.options = options;
    if (this.options.map) {

    } else {
        console.error("map为必传参数");
        return
    }
    this.map = options.map;
    this.container = options.container
    this.afterMap = null;
    this.oldZoom = this.map.getZoom();
    this.oldCenter = this.map.getCenter();
    this.compareType = false;
    this.controller_box = null;
    this.switcher_box = null;
    this.parentDOM = null;
    this.hawkEye_type = false;
    this.baseMaps = [{
        name: "行政地图",
        imgUrl: PIE.path.serverSystem.xingzheng,
        url: "http://mt2.google.cn/vt/lyrs=y&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&g={g}",
    }, {
        name: "谷歌影像",
        imgUrl: PIE.path.serverSystem.yingxiang,
        url: "http://mt3.google.cn/maps/vt?lyrs=s@800&x={x}&y={y}&z={z}",
    }, {
        name: "地形地图",
        imgUrl: PIE.path.serverSystem.dixing,
        url: "http://piecloud.piesat.cn/dataservices/service/v1/tile?map=GlobalHillShadingMap&access_token=gwKBF7o6gKhWv7zBzNmGebNWVAzqnrRS&x={x}&y={y}&z={z}",
    }];
    this.init();
}

controller.prototype = {
    init: function () {
        if (this.options.zoom || this.options.reset || this.options.change2D3D || this.options.compare || this.options.hawkEye || this.options.administration || this.options.compass) {
            this.controller_box = document.createElement("div");
            this.controller_box.id = "controller_box";
            document.body.appendChild(this.controller_box);
        }
        if (this.options.copyright) this.initCopyright(this.options.copyright);
        if (this.options.zoom) this.initZoom();
        if (this.options.reset) this.initReset();
        if (this.options.change2D3D) this.initChange_2Dor3D(this.options.change2D3D);
        if (this.options.compare) this.initCompare(this.options.compare);
        if (this.options.scale) this.initScale(this.options.scale);
        if (this.options.hawkEye) this.initHawkEye();
        if (this.options.administration) this.initAdministration();
        if (this.options.compass) this.initCompass();
        if (this.options.switcher) this.initSwitcher(this.options.switcher);
    },

    initZoom: function () { //层级
        var self = this;
        var plus_button = document.createElement("button");
        var reduce_button = document.createElement("button");
        plus_button.id = "zoom_plus";
        reduce_button.id = "zoom_reduce";
        plus_button.className = "zoomBtn";
        reduce_button.className = "zoomBtn";
        plus_button.innerHTML = "+";
        reduce_button.innerHTML = "-";
        plus_button.style.fontWeight = "bold";
        plus_button.style.fontSize = "20px";
        reduce_button.style.fontWeight = "bold";
        reduce_button.style.fontSize = "20px";
        plus_button.addEventListener("click", function () {
            self.plusZoom();
        }, false);
        reduce_button.addEventListener("click", function () {
            self.reduceZoom();
        }, false);
        this.controller_box.appendChild(plus_button);
        this.controller_box.appendChild(reduce_button);
    },

    plusZoom: function () {
        if (this.map.defaultSettings.type == 1 || this.map.defaultSettings.type == 2) {
            var newZoom = Number(this.map.getZoom()) + 1;
            this.map.setZoom(newZoom);
        } else if (this.map.defaultSettings.type == 3) {
            let scene = this.map.map._cesiumViewer.scene;
            let camera = scene.camera;
            // 获取当前镜头位置的笛卡尔坐标
            let cameraPos = camera.position;

            // 获取当前坐标系标准
            let ellipsoid = scene.globe.ellipsoid;

            // 根据坐标系标准，将笛卡尔坐标转换为地理坐标
            let cartographic = ellipsoid.cartesianToCartographic(cameraPos);

            // 获取镜头的高度

            let height = cartographic.height;

            let centerLon = parseFloat(Cesium.Math.toDegrees(cartographic.longitude).toFixed(8));
            let centerLat = parseFloat(Cesium.Math.toDegrees(cartographic.latitude).toFixed(8));

            // 镜头拉近
            camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(centerLon, centerLat, height / 1.8),
                duration: 1.0
            });
        }
    },

    reduceZoom: function () {
        if (this.map.defaultSettings.type == 1 || this.map.defaultSettings.type == 2) {
            var newZoom = Number(this.map.getZoom()) - 1;
            this.map.setZoom(newZoom);
        } else if (this.map.defaultSettings.type == 3) {
            let scene = this.map.map._cesiumViewer.scene;
            let camera = scene.camera;
            // 获取当前镜头位置的笛卡尔坐标
            let cameraPos = camera.position;

            // 获取当前坐标系标准
            let ellipsoid = scene.globe.ellipsoid;

            // 根据坐标系标准，将笛卡尔坐标转换为地理坐标
            let cartographic = ellipsoid.cartesianToCartographic(cameraPos);

            // 获取镜头的高度
            let height = cartographic.height;

            let centerLon = parseFloat(Cesium.Math.toDegrees(cartographic.longitude).toFixed(8));
            let centerLat = parseFloat(Cesium.Math.toDegrees(cartographic.latitude).toFixed(8));

            // 镜头拉近
            camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(centerLon, centerLat, height * 1.8),
                duration: 1.0
            });
        }

    },

    initCopyright: function (content) { // 版权
        var box = document.createElement("div");
        box.id = "copyright_box";
        var content_box = document.createElement("p");
        content_box.id = "copyright_content";
        content_box.innerHTML = content;
        box.appendChild(content_box);
        document.body.appendChild(box);
    },

    initChange_2Dor3D: function (option) { // 2D3D切换
        var self = this;
        var type;

        if (self.map.defaultSettings.type === 3) {
            type = "2D";
        } else {
            type = "3D";
        }

        if (option.type_2D.toLowerCase() === "mapbox") {
            this.defaultSettings = 1;
        } else if (option.type_2D.toLowerCase() === "openlayer") {
            this.defaultSettings = 2;
        }

        var changeType_button = document.createElement("button");
        changeType_button.id = "changeType_button";
        changeType_button.className = "zoomBtn";
        changeType_button.innerHTML = type;
        changeType_button.addEventListener("click", function () {
            if (type === "2D") {
                self.change2D(this.defaultSettings);
                type = "3D";
            } else {
                self.change3D();
                type = "2D";
            }
        }, false);
        this.controller_box.appendChild(changeType_button);
    },

    change3D: function () {
        var self = this;
        if (document.getElementById("changeType_button")) {
            document.getElementById("changeType_button").innerHTML = "2D";
        }
        this.map.changeMapType(3, this.container);
    },

    change2D: function (type) {
        if (!type) {
            type = this.defaultSettings
        }
        var self = this;
        if (document.getElementById("changeType_button")) {
            document.getElementById("changeType_button").innerHTML = "3D";
        }
        this.map.changeMapType(type, this.container);
    },

    initCompare: function (Compare) { // 卷帘 
        var _this = this;
        var compare_button = document.createElement("button");
        compare_button.id = "compare_button";
        compare_button.className = "zoomBtn";
        compare_button.innerHTML = "卷";
        compare_button.addEventListener("click", function (e) {
            _this.compare(Compare);
        });
        this.controller_box.appendChild(compare_button);
    },

    compare: function (Compare) {
        var self = this;
        if (self.map.defaultSettings.type === 1) { // 判断当前地图 1为mapbox，2为openlayer
            if (self.compareType) { // 判断是否已开启卷帘 true为已开启，false为未开启
                self.compare_obj.remove();
                self.parentDOM.appendChild(document.getElementById("map"));
                // document.getElementById("comparison-container").removeChild(document.getElementById("afterMap"))
                self.parentDOM.removeChild(document.getElementById("comparison-container"));
                self.compareType = false;
            } else {
                var map_box = document.getElementById(options.container);
                self.parentDOM = map_box.parentNode;
                var father_box = document.createElement("div");
                father_box.id = "comparison-container";
                var afterMap_box = document.createElement("div");
                afterMap_box.id = "afterMap";
                father_box.appendChild(map_box);
                father_box.appendChild(afterMap_box);
                self.parentDOM.appendChild(father_box);
                self.afterMap = new PIE.Map({
                    type: 1
                });
                var afterView = new PIE.MapView({
                    map: self.afterMap,
                    container: "afterMap",
                    zoom: self.map.getZoom(),
                    center: self.map.getCenter(),
                    projection: 'EPSG:4326'
                });
                var XYZLayer = new PIE.GridTileLayer({
                    // url: "https://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}",
                    url: Compare.afterBaseMap,
                    id: "XYZLayer"
                });
                self.afterMap.on("load", function () {
                    console.log(self.afterMap);
                    self.afterMap.add(XYZLayer);
                    var container = '#comparison-container';
                    self.compare_obj = new mapboxgl.Compare(self.map.map, self.afterMap.map, container, {
                        mousemove: Compare.mousemove, // Optional. Set to true to enable swiping during cursor movement.
                        orientation: Compare.orientation // Optional. Sets the orientation of swiper to horizontal or vertical, defaults to vertical
                    });
                    self.compareType = true;
                });
            }
        } else if (self.map.defaultSettings.type === 2) {
            if (self.compareType) {
                self.map.remove(self.map.getLayer("XYZLayer"));
                var swipe = document.getElementById('swipe')
                document.body.removeChild(swipe);
                self.compareType = false;
            } else {
                var input = document.createElement("div");
                input.id = "swipe";
                // input.type = "button";
                input.style.width = "50px";
                input.style.height = "50px";
                input.style.borderRadius = "1000px";
                input.style.position = "absolute";
                input.style.marginTop = "-25px";
                input.style.marginLeft = "-25px";
                input.style.top = "50%";
                input.style.left = "50%";
                input.style.background = "#3887be url(" + PIE.path.serverSystem.jl + ") center";
                input.style.zIndex = 999;
                document.body.appendChild(input);
                var XYZLayer = new PIE.GridTileLayer({
                    // url: "https://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}",
                    url: Compare.afterBaseMap,
                    id: "XYZLayer"
                });
                self.map.add(XYZLayer);
                var swipe = document.getElementById('swipe'); // 用于控制卷帘位置的DOM元素
                XYZLayer._openLayer.on('precompose', function (event) { // 在Bing地图渲染之前触发
                    var ctx = event.context; //获得canvas渲染上下文
                    var width = swipe.offsetLeft + 25; // 用于保存卷帘的位置
                    ctx.save(); // 保存canvas设置
                    ctx.beginPath(); // 开始绘制路径
                    ctx.rect(width, 0, ctx.canvas.width - width, ctx.canvas.height); // 绘制矩形
                    ctx.clip(); // 裁剪Bing地图，以形成卷帘效果
                })
                XYZLayer._openLayer.on('postcompose', function (event) { // 在Bing地图渲染之后触发
                    var ctx = event.context;
                    ctx.restore(); // 恢复canvas设置
                });
                var x = 0;
                var l = 0;
                var isDown = false;
                var mousemove = function (e) {
                    if (isDown == false) {
                        return;
                    }
                    var nx = e.clientX;
                    var nl = nx - (x - l);
                    swipe.style.left = nl + 'px';
                    self.map.map.render(); // 渲染地图
                }
                swipe.addEventListener('mousedown', function (e) { // 在每次用户改变swipe控件时触发
                    x = e.clientX;
                    l = swipe.offsetLeft + 25;
                    isDown = true;
                    swipe.style.cursor = 'ew-resize';
                    window.addEventListener("mousemove", mousemove);
                    window.addEventListener('mouseup', function () { // 在每次用户改变swipe控件时触发
                        isDown = false;
                        swipe.style.cursor = 'default';
                        window.removeEventListener("mousemove", mousemove);
                    }, false);
                }, false);
                self.compareType = true;
            }
        } else {
            if (self.compareType) {
                if (self.map.getLayer("CeiumCompossLayer")) {
                    self.map.remove(self.map.getLayer("CeiumCompossLayer"));
                }
                var swipe = document.getElementById('slider')
                document.body.removeChild(swipe);
                self.cesiumHandler.destroy();
                self.compareType = false;
            } else {
                var mPieSlider = document.createElement("div");
                mPieSlider.id = "slider";
                document.body.appendChild(mPieSlider);
                self.map.map._cesiumViewer.scene.imagerySplitPosition = (mPieSlider.offsetLeft) / mPieSlider.parentElement.offsetWidth;
                var pieHandler = new Cesium.ScreenSpaceEventHandler(mPieSlider);
                self.cesiumHandler = pieHandler;

                //灾后
                var CeiumCompossLayer = new PIE.GridTileLayer({
                    id: "CeiumCompossLayer",
                    url: Compare.afterBaseMap
                });
                self.map.add(CeiumCompossLayer);

                //增加卷帘效果
                let maplayers = self.map.map._cesiumViewer.imageryLayers._layers;
                let splitLayer = null;
                for (let i = 0; i < maplayers.length; i++) {
                    if (maplayers[i].id === "CeiumCompossLayer") {
                        splitLayer = maplayers[i];
                        break;
                    }
                }
                splitLayer.splitDirection = Cesium.ImagerySplitDirection.RIGHT; // Only show to the left of the mPieSlider.

                let moveActive = false;

                function move(movement) {
                    if (!moveActive) {
                        return;
                    }

                    let relativeOffset = movement.endPosition.x;
                    let splitPosition = (mPieSlider.offsetLeft + relativeOffset) / mPieSlider.parentElement.offsetWidth;
                    mPieSlider.style.left = 100.0 * splitPosition + '%';
                    self.map.map._cesiumViewer.scene.imagerySplitPosition = splitPosition;
                }

                pieHandler.setInputAction(function () {
                    moveActive = true;
                }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
                pieHandler.setInputAction(function () {
                    moveActive = true;
                }, Cesium.ScreenSpaceEventType.PINCH_START);

                pieHandler.setInputAction(move, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
                pieHandler.setInputAction(move, Cesium.ScreenSpaceEventType.PINCH_MOVE);

                pieHandler.setInputAction(function () {
                    moveActive = false;
                }, Cesium.ScreenSpaceEventType.LEFT_UP);
                pieHandler.setInputAction(function () {
                    moveActive = false;
                }, Cesium.ScreenSpaceEventType.PINCH_END);
                self.compareType = true;
            }

        }
    },

    initReset: function () { // 复位
        var self = this;
        var reset_button = document.createElement("button");
        reset_button.id = "reset_button";
        reset_button.className = "zoomBtn";
        reset_button.innerHTML = "复";
        reset_button.addEventListener("click", function (param) {
            self.reset();
        }, false);
        this.controller_box.appendChild(reset_button);
    },

    reset: function () {
        this.map.setZoom(this.oldZoom);
        this.map.setCenter(this.oldCenter);
    },

    initScale: function (configure) { // 比例尺
        this.map.scaleControl(configure);
    },

    initCompass: function () { //指北针
        var self = this;
        var compass_button = document.createElement("button");
        var img = document.createElement("img");
        compass_button.id = "compass_button";
        compass_button.className = "zoomBtn";
        img.src = PIE.path.serverSystem.compass;
        compass_button.appendChild(img);
        this.controller_box.appendChild(compass_button);
        compass_button.addEventListener("click", function (param) {
            self.compass();
        }, false);
    },

    compass: function () {
        this.map.setBearing(0);
    },

    initHawkEye: function () { // 鹰眼
        var self = this;
        var reset_button = document.createElement("button");
        reset_button.id = "reset_button";
        reset_button.className = "zoomBtn";
        reset_button.innerHTML = "鹰";
        reset_button.addEventListener("click", function (param) {
            self.hawkEye();
        }, false);
        this.controller_box.appendChild(reset_button);
    },

    hawkEye: function () {
        if (this.hawkEye_type) {
            document.body.removeChild(document.getElementById("hawkEye_box"));
            this.hawkEye_type = false;
        } else {
            this.createHawhEye();
            this.hawkEye_type = true;
        }
    },

    createHawhEye: function () {
        var self = this;
        var hawkEye_button = document.createElement("div");
        hawkEye_button.id = "hawkEye_box";
        hawkEye_button.style.width = "400px";
        hawkEye_button.style.height = "200px";
        hawkEye_button.style.border = "3px solid #ccc";
        hawkEye_button.style.backgroundColor = "#fff";
        hawkEye_button.style.position = "fixed";
        hawkEye_button.style.left = "5px";
        hawkEye_button.style.bottom = "35px";
        document.body.appendChild(hawkEye_button);
        var Viewport_box = document.createElement("div");
        Viewport_box.id = "Viewport_box";
        Viewport_box.style.width = "10px";
        var hawkEye_map = new PIE.Map({
            type: 1
        });
        var view = new PIE.MapView({
            map: hawkEye_map,
            container: "hawkEye_box",
            zoom: (self.map.getZoom() - 4) < 0 ? 0 : (self.map.getZoom() - 4),
            center: self.map.getCenter(),
            projection: 'EPSG:4326'
        });
        hawkEye_map.on("load", function () {
            var grid = new PIE.GridTileLayer({
                url: "http://mt2.google.cn/vt/lyrs=y&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&g={g}",
                id: "hawkEye_bg",
            });
            hawkEye_map.add(grid);
            hawkEye_map.mapScrollZoomDisable();
            hawkEye_map.doubleClickZoomDisable();
            hawkEye_map.on("drag", (e) => {
                self.map.setCenter(hawkEye_map.getCenter());
            })
        });
        if (this.map.defaultSettings.type == 3) {
            this.map.map._cesiumViewer.scene.preRender.addEventListener(function () {

                hawkEye_map.setZoom((self.map.getZoom() - 4) < 0 ? 0 : (self.map.getZoom() - 4));
                hawkEye_map.setCenter(self.map.getCenter());
            });
        } else if (this.map.defaultSettings.type == 1 || this.map.defaultSettings.type == 2) {
            this.map.on("drag", (e) => {
                hawkEye_map.setCenter(self.map.getCenter());
            })
            this.map.on("zoom", (e) => {
                hawkEye_map.setZoom((self.map.getZoom() - 4) < 0 ? 0 : (self.map.getZoom() - 4));
                hawkEye_map.setCenter(self.map.getCenter());
            })
        }

    },

    initSwitcher: function (options) {
        var self = this;
        this.switcher_box = document.createElement("div");
        this.switcher_box.id = "switcher_box";
        document.body.appendChild(this.switcher_box);
        var map_btn = document.createElement("button");
        map_btn.id = "map_btn";
        map_btn.innerHTML = "切换底图";
        map_btn.className = "zoomBtn";
        this.switcher_box.appendChild(map_btn);
        map_btn.addEventListener("click", function () {
            self.switcher(options);
        }, false)
        this.map.on("load", () => {
            var switcher_map = new PIE.GridTileLayer({
                url: "http://mt2.google.cn/vt/lyrs=y&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&g={g}",
                id: "switcher_map",
            });
            self.map.add(switcher_map);
        })
    },

    switcher: function (options) {
        var lu = document.getElementById("mapList_box");
        if (lu) {
            if (lu.style.display === "block") {
                lu.style.display = "none";
            } else {
                lu.style.display = "block";
            }
        } else {
            this.mapList(options);
        }
    },

    mapList: function (options) {
        var self = this;
        var mapList_box = document.createElement("ul");
        mapList_box.id = "mapList_box";
        mapList_box.style.display = "block";
        mapList_box.className = "mapList_box";
        if (typeof (options) === "Boolean") {

        } else {
            options.forEach(item => {
                this.baseMaps.push(item);
            })
        }
        this.baseMaps.forEach(function (item, index) {
            var mapList = document.createElement("li");
            if (index === 0) {
                mapList.className = "mapList select";
            } else {
                mapList.className = "mapList";
            }
            var img = document.createElement("img");
            img.src = item.imgUrl;
            var span = document.createElement("span");
            span.style.marginLeft = "5px";
            span.innerHTML = item.name;
            mapList.appendChild(img);
            mapList.appendChild(span);
            mapList_box.appendChild(mapList);
            mapList.addEventListener("click", function () {
                self.map.remove(self.map.getLayer("switcher_map"));
                var switcher_map = new PIE.GridTileLayer({
                    url: item.url,
                    id: "switcher_map",
                });
                self.map.add(switcher_map);
                var li = document.getElementsByClassName("mapList");
                for (let i = 0; i < li.length; i++) {
                    li[i].className = "mapList";
                }
                mapList.className = "mapList select";
            }, false)
        });
        this.switcher_box.appendChild(mapList_box);
    },

    initAdministration: function () {
        var self = this;
        var administration_box = document.createElement("div");
        administration_box.style.position = "relative";
        var administration_button = document.createElement("button");
        var administration_layerList = document.createElement("ul");
        administration_layerList.id = "administration_layerList";
        administration_layerList.style.display = "none";
        administration_button.id = "zoom_plus";
        administration_button.className = "zoomBtn";
        administration_button.innerHTML = "管";
        administration_button.addEventListener("click", function () {
            self.administration()
        });
        administration_box.appendChild(administration_button);
        administration_box.appendChild(administration_layerList);
        this.controller_box.appendChild(administration_box);
    },

    administration: function () {
        let self = this;
        if (administration_layerList.style.display === "block") {
            administration_layerList.style.display = "none";
        } else {
            administration_layerList.style.display = "block";
            administration_layerList.innerHTML = "";
            self.map.layers.forEach(item => {
                var administration_item = document.createElement("li");
                var div = document.createElement("div");
                var checkbox = document.createElement("input");
                var label = document.createElement("label");
                div.style.display = "inline-block";
                checkbox.type = "checkbox";
                checkbox.id = item.id;
                checkbox.checked = true;
                label.setAttribute("for", item.id);
                label.innerHTML = item.id;
                checkbox.addEventListener("click", function () {
                    if (this.checked == true) {
                        self.map.setVisibility(item, true);
                    } else {
                        self.map.setVisibility(item, false);
                    }
                })
                div.appendChild(checkbox);
                div.appendChild(label);
                administration_item.appendChild(div);
                administration_layerList.appendChild(administration_item);
            });
            self.myOrder("administration_layerList", 0, "上移", "下移");
        };
    },

    moveSonU: function (tag, pc) {
        var tagPre = this.get_previoussibling(tag);
        var t = document.getElementById(pc);
        if (tagPre != undefined) {
            t.insertBefore(tag, tagPre);
        }
    },

    moveSonD: function (tag) {
        var tagNext = this.get_nextsibling(tag);
        if (tagNext != undefined) {
            this.insertAfter(tag, tagNext);
        }
    },

    get_previoussibling: function (n) {
        if (n.previousSibling != null) {
            var x = n.previousSibling;
            while (x.nodeType != 1) {
                x = x.previousSibling;
            }
            return x;
        }
    },

    get_nextsibling: function (n) {
        if (n.nextSibling != null) {
            var x = n.nextSibling;
            while (x.nodeType != 1) {
                x = x.nextSibling;
            }
            return x;
        }
    },

    insertAfter: function (newElement, targetElement) {
        var parent = targetElement.parentNode;
        if (parent.lastChild == targetElement) {
            parent.appendChild(newElement);
        } else {
            parent.insertBefore(newElement, targetElement.nextSibling);
        }
    },

    myOrder: function (myList, m, mO, mT) {
        //myList为ul的id值，m为0显示文字，m为1显示图片，mO、mT为文字或图片内容
        var self = this;
        var pCon = document.getElementById(myList);
        var pSon = pCon.getElementsByTagName("li");
        for (var i = 0; i < pSon.length; i++) {
            var conTemp = document.createElement("div");
            conTemp.setAttribute("class", "control");
            conTemp.style.float = "right";
            conTemp.index = i;
            var clickUp = document.createElement("a");
            var clickDown = document.createElement("a");
            if (m == 0) {
                var upCon = document.createTextNode(mO);
                var downCon = document.createTextNode(mT);
            } else {
                var upCon = document.createElement("img");
                var downCon = document.createElement("img");
                upCon.setAttribute("src", mO);
                downCon.setAttribute("src", mT);
            }
            clickUp.appendChild(upCon);
            clickUp.setAttribute("href", "#");
            clickDown.appendChild(downCon);
            clickDown.setAttribute("href", "#");
            pSon[i].appendChild(conTemp);
            conTemp.appendChild(clickUp);
            conTemp.appendChild(clickDown);
            var ul = document.getElementById("administration_layerList");
            clickUp.onclick = function () {
                var lists = Array.from(ul.querySelectorAll('li'));
                var index = lists.indexOf(this.parentNode.parentNode);
                if (index === 0) {
                    alert("已经到低层了");
                    return
                } else {
                    self.moveSonU(this.parentNode.parentNode, myList);
                    self.map.moveLayer(self.map.layers[index], self.map.layers[index - 1]);
                }
            }
            clickDown.onclick = function () {
                var lists = Array.from(ul.querySelectorAll('li'));
                var index = lists.indexOf(this.parentNode.parentNode);
                if (index === lists.length - 1) {
                    alert("已经到顶层了");
                    return
                } else {
                    self.moveSonD(this.parentNode.parentNode);
                    self.map.moveLayer(self.map.layers[index + 1], self.map.layers[index]);
                }
            }
        }
    },

    swapItems: function (arr, index1, index2) {
        arr[index1] = arr.splice(index2, 1, arr[index1])[0];
        return arr;
    },
}

export {
    controller
};