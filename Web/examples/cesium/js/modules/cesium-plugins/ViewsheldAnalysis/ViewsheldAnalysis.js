function ViewsheldTool(option) {
    this.viewer = option.viewer;
    this.enable = false;
    this.baseHeight = 50;
    this.maxmimumDistance = 1000000;
    this.camera = null;

    this.handler = null;
    this.positions = [];
    this.floatingPointS = [];
    this.outline = null;
    this.span = null;

}
ViewsheldTool.prototype.isEnable = function () {
    return this.enable;
}
ViewsheldTool.prototype.setEnable = function (enable) {
    this.enable = enable;

    if (enable) {
        if (this.handler == null) {
            this.addShadowMap();
        }
    } else {
        this.clean();
    }
}

ViewsheldTool.prototype.makeShadowMap = function (position, heading, pitch, distance) {
    var that = this;

    that.viewer.scene.debugShowFramesPerSecond = true;
    that.viewer.shadows = true;
    that.viewer.terrainShadows = true ? Cesium.ShadowMode.ENABLED : Cesium.ShadowMode.DISABLED;
    //that.viewer.scene.globe.enableLighting = true;

    that.camera = new Cesium.Camera(that.viewer.scene);
    that.camera.frustum.near = 10.0;
    that.camera.frustum.far = distance;
    that.camera.frustum.fov = Cesium.Math.toRadians(89);
    that.camera.position = position;
    that.camera.setView({
        destination: position,
        orientation: {
            heading: Cesium.Math.toRadians(heading),
            pitch: Cesium.Math.toRadians(pitch)
        }
    });

    var shadowMap = new Cesium.ShadowMap({
        context: that.viewer.scene.context,
        lightCamera: that.camera,
        maxmimumDistance: that.maxmimumDistance,
        pointLightRadius: distance,
        darkness: 0.1,
        cascadesEnabled: false,
        isPointLight: false,
        isViewshed3D: true,
        softShadows: false,
        normalOffset: true
    });
    shadowMap.enabled = true;
    that.viewer.scene.shadowMap = shadowMap;
}

ViewsheldTool.prototype.addShadowMap = function () {
    var that = this;

    this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene._imageryLayerCollection);
    this.handler.setInputAction(function (movement) {
        if (that.positions.length == 0) {
            if (movement.endPosition.x == 0 && movement.endPosition.y == 0) //跳出地球时异常
            { return; }
            var box2 = document.getElementById('cesiumContainer');
            if (Cesium.defined(that.span)) {
                that.span.remove();
            }
            that.span = document.createElement('span');
            that.span.innerText = '点击拾取视角';
            that.span.style.display = "block";
            that.span.style.position = "absolute";

            that.span.style.left = movement.endPosition.x + 3 + "px";
            that.span.style.top = movement.endPosition.y - 25 + "px";
            that.span.style.zIndex = '99999999';

            box2.appendChild(that.span);

        } else if (that.positions.length == 1) {
            if (Cesium.defined(that.span)) {
                that.span.remove();
            }
            var box1 = document.getElementById('cesiumContainer');
            that.span = document.createElement('span');
            that.span.innerText = '点击拾取方位';
            that.span.style.display = "block";
            that.span.style.position = "absolute";
            that.span.style.left = movement.endPosition.x + 3 + "px";
            that.span.style.top = movement.endPosition.y - 25 + "px";
            that.span.style.zIndex = '99999999';
            box1.appendChild(that.span);
        }

    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    this.handler.setInputAction(function (movement) {
        if (Cesium.defined(that.span)) {
            that.span.remove();
        }
        var scene = that.viewer.scene;
        var camera = scene.camera;
        // 取消双击事件-追踪该位置
        that.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

        var cartesian = that.viewer.scene.pickPosition(movement.position);
        cartesian.z += that.baseHeight;

        if (!Cesium.defined(cartesian)) //跳出地球时异常
            return;
        that.positions.push(cartesian);
        var floatingPoint = that.viewer.entities.add({
            position: cartesian,
            point: {
                pixelSize: 5,
                color: Cesium.Color.CYAN,
                outlineWidth: 2,
            }
        });
        that.floatingPointS.push(floatingPoint);
        if (that.positions.length >= 2) {
            var dist = distance(that.positions[0], that.positions[1]);

            that.viewer.scene.debugShowFramesPerSecond = true;
            that.viewer.shadows = true;
            that.viewer.terrainShadows = true ? Cesium.ShadowMode.ENABLED : Cesium.ShadowMode.DISABLED;
            //that.viewer.scene.globe.enableLighting = true;

            that.camera = new Cesium.Camera(that.viewer.scene);
            that.camera.frustum.near = 10.0;
            that.camera.frustum.far = dist;
            that.camera.frustum.fov = Cesium.Math.toRadians(89);

            var firstPos = that.positions[0];
            var secondPos = that.positions[1];
            let direction = Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(secondPos, firstPos, new Cesium.Cartesian3()), new Cesium.Cartesian3());
            that.camera.position = firstPos;//firstPos是相机起点
            //that.camera.direction = direction;//direction是相机面向的方向
            that.camera.setView({
                destination: firstPos,
                orientation: {
                    heading: Cesium.Math.toRadians(0),
                    pitch: Cesium.Math.toRadians(-25)
                }
            });

            var shadowMap = new Cesium.ShadowMap({
                context: scene.context,
                lightCamera: that.camera,
                maxmimumDistance: that.maxmimumDistance,
                pointLightRadius: dist,
                darkness: 0.1,
                cascadesEnabled: false,
                isPointLight: false,
                isViewshed3D: true,
                softShadows: false,
                normalOffset: false
            });
            shadowMap.enabled = true;
            //shadowMap.debugShow = true;
            scene.shadowMap = shadowMap;

            let scratchRight = new Cesium.Cartesian3();
            let scratchRotation = new Cesium.Matrix3();
            var scratchOrientation = new Cesium.Quaternion();
            let position = that.camera.positionWC;
            let direction2 = that.camera.directionWC;
            let up = that.camera.upWC;
            let right = that.camera.rightWC;
            right = Cesium.Cartesian3.negate(right, scratchRight);

            let rotation = scratchRotation;
            Cesium.Matrix3.setColumn(rotation, 0, right, rotation);
            Cesium.Matrix3.setColumn(rotation, 1, up, rotation);
            Cesium.Matrix3.setColumn(rotation, 2, direction2, rotation);

            //计算视锥姿态
            let orientation = Cesium.Quaternion.fromRotationMatrix(rotation, scratchOrientation);
            //视锥轮廓线图形
            let instanceOutline = new Cesium.GeometryInstance({
                geometry: new Cesium.FrustumOutlineGeometry({
                    frustum: that.camera.frustum,
                    origin: firstPos,
                    orientation: orientation,
                }),
                attributes: {
                    color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.CHARTREUSE),
                    show: new Cesium.ShowGeometryInstanceAttribute(true)
                }
            });
            //添加图元
            that.outline = new Cesium.Primitive({
                geometryInstances: instanceOutline,
                appearance: new Cesium.PerInstanceColorAppearance()
            })
            that.viewer.scene.primitives.add(that.outline);

            if (that.handler != null) {
                that.handler.destroy();
                that.handler = null;
            }

            var viewsheldHeading = 0;
            window.setInterval(function () {
                if (that.positions.length > 0) {
                    if (viewsheld.camera != null) {
                        that.camera.setView({
                            destination: firstPos,
                            orientation: {
                                heading: Cesium.Math.toRadians(viewsheldHeading),
                                pitch: Cesium.Math.toRadians(-25)
                            }
                        });
                    }
                    viewsheldHeading += 0.5;
                }
            }, 30);
        }

    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

}

ViewsheldTool.prototype.clean = function () {
    this.camera = null;
    this.viewer.scene.shadowMap.enabled = false;
    this.positions = [];
    for (let i = 0; i < this.floatingPointS.length; i++) {
        this.viewer.entities.remove(this.floatingPointS[i])
    }
    this.floatingPointS.length = 0;
    this.viewer.scene.primitives.remove(this.outline);
    this.outline = null;

    if (this.handler != null) {
        this.handler.destroy();
        this.handler = null;
    }
}

function angleOflocation(option) {
    let { x: x1, y: y1, z: z1 } = option[1];
    let { x: x2, y: y2, z: z2 } = option[0];
    let { x: x3, y: y3, z: z3 } = option[2];

    // 计算向量 P2P1 和 P2P3 的夹角 https://www.zybang.com/question/3379a30c0dd3041b3ef966803f0bf758.html
    let _P1P2 = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2);
    let _P2P3 = Math.sqrt((x3 - x2) ** 2 + (y3 - y2) ** 2 + (z3 - z2) ** 2);

    let P = (x1 - x2) * (x3 - x2) + (y1 - y2) * (y3 - y2) + (z1 - z2) * (z3 - z2); //P2P1*P2P3

    return (Math.acos(P / (_P1P2 * _P2P3)) / Math.PI) * 180;
}
//计算两点间的距离
function distance(point1, point2) {
    var s = (point1.x - point2.x) * (point1.x - point2.x) + (point1.y - point2.y) * (point1.y - point2.y) + (point1.z - point2.z) * (point1.z - point2.z);
    s = Math.sqrt(s);
    return s;

}
function requestCenter(point2, point3) {
    var x = (point2.x + point3.x) / 2;
    var y = (point2.y + point3.y) / 2;
    var z = (point2.z + point3.z) / 2;
    var center = new Cesium.Cartesian3(x, y, z);
    return center;
}
