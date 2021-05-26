import {Layer} from '../Layer/Layer';
/***
 *
 * @author yqq
 */
 /**
 * @module Layer
 */
/**
 * ModelLayer
 * 
 * @class ModelLayer
 * @extends Layer
 * @param {Object} options <br/>
 * [url] — 图层的URL，或者用于渲染图层的样式资源的URL。<br/>
 * [height] — 图层高度。 <br/>
 * [lat] — 图层经度。 <br/>
 * [lon] — 图层纬度。 <br/>
 * [color] — 图层颜色。 <br/>
 * [opacity] — 图层透明度。 <br/>
 * [colorBlendMode] — 图层彩色模式。 <br/>
 * [colorBlendAmount] — 图层混色量。 <br/>
 * [silhouetteColor] — 图层边框颜色。 <br/>
 * [silhouetteOpacity] — 图层边框透明度。 <br/>
 * [silhouetteSize] — 图层边框大小。 <br/>
 * 
 * @constructor
 */
var modelLayer = 0;
function ModelLayer (options) {
    Layer.call(this);
    this.interval = null;
    this.head = 0;
    this.type = "ModelLayer";
    this.url = options.url !== undefined ? options.url : "";
    this.id = options.id !== undefined ? options.id : "modelLayer"+ modelLayer++;
    this.height = options.height !== undefined ? options.height : 0;
    this.lat = options.lat !== undefined ? options.lat : 0;
    this.lon = options.lon !== undefined ? options.lon : 0;
    this.color = options.color !== undefined ? options.color : "White";
    this.opacity = options.opacity !== undefined ? options.opacity : 1.0;
    this.colorBlendMode = options.colorBlendMode !== undefined ? options.colorBlendMode : "Mix";
    this.colorBlendAmount = options.colorBlendAmount !== undefined ? options.colorBlendAmount : 0.5;
    this.silhouetteColor = options.silhouetteColor !== undefined ? options.silhouetteColor : "White";
    this.silhouetteOpacity = options.silhouetteOpacity !== undefined ? options.silhouetteOpacity : 1.0
    this.silhouetteSize = options.silhouetteSize !== undefined ? options.silhouetteSize : 0;
    this.minimumPixelSize = options.minimumPixelSize !== undefined ? options.minimumPixelSize : 128;
    this.maximumScale = options.maximumScale !== undefined ? options.maximumScale : 10000;
    this.allowPicking = options.allowPicking !== undefined ? options.allowPicking : false;
    this.debugWireframe = options.debugWireframe !== undefined ? options.debugWireframe : false;
    // this.initLayer();
};
ModelLayer.prototype = Object.assign( Object.create( Layer.prototype ), {

    innerSource:function(type){
        if(type == 1){

        }else if(type == 2){

        }else if(type == 3){

        }
    },
    innerLayer:function(type){
        if(type == 1){

        }else if(type == 2){

        }else if(type == 3){
            this.position = Cesium.Cartesian3.fromDegrees(120.59781455993652, 44.06388417471974, this.height);
            this.hpRange = new Cesium.HeadingPitchRange();
            this.hpRoll = new Cesium.HeadingPitchRoll.fromDegrees(-90,0,0);
            this.fixedFrameTransform = Cesium.Transforms.localFrameToFixedFrameGenerator('north', 'west');
            this.orientation = Cesium.Transforms.headingPitchRollQuaternion(this.position, this.hpRoll);
            this.entity = null;
            this.planePrimitive = null;
            this.speed = 10;
            this.speedVector = new Cesium.Cartesian3();
            this.pathPosition = new Cesium.SampledPositionProperty()
            this.center = new Cesium.Cartesian3();
            this.r = 0;
            this._cesiumlayer = {
                name : this.url,
                position : Cesium.Cartesian3.fromDegrees(this.lat, this.lon, this.height),
                orientation : this.orientation,
                model : {
                    uri : this.url,
                    minimumPixelSize : 128,
                    maximumScale : 20000,
                    color : this.getColor(this.color, this.opacity),
                    colorBlendMode : this.getColorBlendMode(this.colorBlendMode),
                    colorBlendAmount : parseFloat(this.colorBlendAmount),
                    silhouetteColor : this.getColor(this.silhouetteColor, this.silhouetteOpacity),
                    silhouetteSize : parseFloat(this.silhouetteSize),
                },
                path : {
                    show : true,
                    leadTime : 0,
                    trailTime : 60,
                    width : 10,
                    resolution : 1,
                    material : new Cesium.PolylineGlowMaterialProperty({
                        glowPower : 0.3,
                        color : Cesium.Color.PALEGOLDENROD
                    })
                },
            }
            return  this._cesiumlayer;
        }
    },
    onAdd:function(map,type){
        if(type == 1){

        }else if(type == 2){

        }else if(type == 3){
            // this.entity = map.scene.primitives.add( this._cesiumlayer)
            
            this.planePrimitive = map.scene.primitives.add(Cesium.Model.fromGltf({
				//这里需要把模型路径改下(如果你用的还是HelloWord.html的话就用这个,不是的话请自行修改)
				url : this.url,
				modelMatrix : Cesium.Transforms.headingPitchRollToFixedFrame(Cesium.Cartesian3.fromDegrees(this.lat, this.lon, this.height), this.hpRoll, Cesium.Ellipsoid.WGS84, this.fixedFrameTransform),
                minimumPixelSize : this.minimumPixelSize,
                maximumScale:this.maximumScale,
                allowPicking:this.allowPicking,
                debugWireframe:this.debugWireframe

            }));
            map.zoomTo( this.planePrimitive);
            // this.map._cesiumViewer.trackedEntity = layer.entity
        }
        
    },
    onRemove:function(map,type){
        if(type == 1){

        }else if(type == 2){

        }else if(type == 3){
           // map.entities.remove(this.entity)
            map.scene.primitives.remove(this.planePrimitive)
			this.planePrimitive = null;
        }
    },
    startMove:function (time) {
        var self = this
        clearInterval(this.interval)
        this.interval = setInterval(function(){
            self.move(self)
        },time)
    },
    endMove:function () {
        clearInterval(this.interval)
    },
    /**
     * move
     * <p>启动模型移动</p>
     * @method move
     * @param {Object} layer 图层对象
     */
    move:function (layer) {
        var self = this;
        console.log(map)
        layer.planePrimitive.readyPromise.then(function(model) {
            console.log(model)
		    // 以半速循环动画
		    layer.planePrimitive.activeAnimations.addAll({
		        speedup : 0.5,
		        loop : Cesium.ModelAnimationLoop.REPEAT
		    });
		    //r=2*max(模型的半径，相机的最近距离)
		    self.r = 2.0 * Math.max(layer.planePrimitive.boundingSphere.radius, map.map._cesiumViewer.camera.frustum.near);
		    //镜头最近距离
		    map.map._cesiumViewer.scene.screenSpaceCameraController.minimumZoomDistance = self.r * 0.5;
		    //计算center位置(也为下面的镜头跟随提供了center位置)
		    Cesium.Matrix4.multiplyByPoint(layer.planePrimitive.modelMatrix, layer.planePrimitive.boundingSphere.center, layer.center);
		    //相机偏移角度
		    var heading = Cesium.Math.toRadians(230.0);
		    var pitch = Cesium.Math.toRadians(-20.0);
		    layer.hpRange.heading = heading;
		    layer.hpRange.pitch = pitch;
		    layer.hpRange.range = self.r * 50.0;
		    //固定相机
		    map.map._cesiumViewer.camera.lookAt(layer.center, layer.hpRange);
		});

        var headingSpan = document.getElementById('heading');
		var pitchSpan = document.getElementById('pitch');
		var rollSpan = document.getElementById('roll');
		var speedSpan = document.getElementById('speed');
		var fromBehind = document.getElementById('fromBehind');

		//给左边的通知栏更新数据同时刷新飞机位置(这里也是个1ms一次的回调)
		map.map._cesiumViewer.scene.preRender.addEventListener( function(scene, time) {
		    headingSpan.innerHTML = Cesium.Math.toDegrees(layer.hpRoll.heading).toFixed(1);
		    pitchSpan.innerHTML = Cesium.Math.toDegrees(layer.hpRoll.pitch).toFixed(1);
		    rollSpan.innerHTML = Cesium.Math.toDegrees(layer.hpRoll.roll).toFixed(1);
		    speedSpan.innerHTML = layer.speed.toFixed(1);

		    //选择的笛卡尔分量Cartesian3.UNIT_X（x轴单位长度）乘以一个标量speed/10，得到速度向量speedVector
		    layer.speedVector = Cesium.Cartesian3.multiplyByScalar(Cesium.Cartesian3.UNIT_X, layer.speed / 10, layer.speedVector);
		    //飞机的模型矩阵与速度向量speedVector相乘，得到position
		    layer.position = Cesium.Matrix4.multiplyByPoint(layer.planePrimitive.modelMatrix, layer.speedVector, layer.position);
		    //添加一个路径模型(就是白色的尾气)
		    layer.pathPosition.addSample(Cesium.JulianDate.now(), layer.position);
		    //飞机位置+旋转角度+地球+坐标矩阵=飞机模型矩阵
		    Cesium.Transforms.headingPitchRollToFixedFrame(layer.position, layer.hpRoll, Cesium.Ellipsoid.WGS84, layer.fixedFrameTransform, layer.planePrimitive.modelMatrix);
		    if (fromBehind.checked) {
		        // 镜头跟随
		        Cesium.Matrix4.multiplyByPoint(layer.planePrimitive.modelMatrix, layer.planePrimitive.boundingSphere.center, layer.center);
		        layer.hpRange.heading = layer.hpRoll.heading;
		        layer.hpRange.pitch = -1;
		        map.map._cesiumViewer.camera.lookAt(layer.center, layer.hpRange);
		    }
		});
    },
    getColor:function (colorName, alpha) {
        var color = Cesium.Color[colorName.toUpperCase()];
        return Cesium.Color.fromAlpha(color, parseFloat(alpha));
    },
    getColorBlendMode:function (colorBlendMode) {
        return Cesium.ColorBlendMode[colorBlendMode.toUpperCase()];
    },
    /**
     * setColor
     * <p>设置图层颜色</p>
     * @method setColor
     * @param {String} colorName 颜色名称，例："Red"or"Blue"
     * @param {Number} alpha 透明度 0-1
     */
    setColor:function (colorName,alpha) {
        this.planePrimitive.color = this.getColor(colorName, alpha)
    },
    /**
     * setColorBlendMode
     * <p>设置图层颜色</p>
     * @method setColorBlendMode
     * @param {String} type 色彩模式类型，可选值："Mix","Replace","Highlight"
     */
    setColorBlendMode:function (type) {
        var colorBlendMode = this.getColorBlendMode(type);
        this.planePrimitivel.colorBlendMode = colorBlendMode;
        // viewModel.colorBlendAmountEnabled = (colorBlendMode === Cesium.ColorBlendMode.MIX);
    },
    /**
     * setColorBlendAmount
     * <p>设置图层颜色</p>
     * @method setColorBlendAmount
     * @param {Number} newValue 混色量，0-1(色彩模式为"Mix"时可用)
     */
    setColorBlendAmount:function (newValue) {
        this.planePrimitive.colorBlendAmount = parseFloat(newValue);
    },
    /**
     * setSilhouetteColor
     * <p>设置图层边框颜色</p>
     * @method setSilhouetteColor
     * @param {String} colorName 颜色名称，例："Red"or"Blue"
     * @param {Number} alpha 透明度 0-1
     */
    setSilhouetteColor:function (colorName,alph) {
        this.planePrimitive.silhouetteColor = this.getColor(colorName, alph);
    },
    /**
     * setSilhouetteSize
     * <p>设置图层边框大小</p>
     * @method setSilhouetteSize
     * @param {Number} newValue 要设置的边框值
     */
    setSilhouetteSize:function (newValue) {
        this.planePrimitive.silhouetteSize = parseFloat(newValue);
    },
});
export {ModelLayer}