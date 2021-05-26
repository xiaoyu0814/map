var flyRouter = function(viewer){

    this._viewer = viewer;

};

flyRouter.prototype = {

    get flyManager(){

        return this._flyManager;

    },

    set flyManager(value){

        this._flyManager = value;

    },

    get flyEntity(){

        return this._flyEntity;

    },

    set flyEntity(value){

        this._flyEntity = value;

    },

    get viewer(){

        return this._viewer;

    }

};

/** 通过传入坐标点数组方式飞行

 * 参数 Array positions点数组，Object Model 模型对象,Number time飞行时间 以秒为单位

 * 执行飞行函数

 **/

flyRouter.prototype.flyRouterByPositions = function(positions=[], model,cartesian, time){

    if(positions.length == 0){

        return;

    }

    /*var positionA = az.geometry.coordinates;

        for (i = 0; i < positionA.length; i++) {

            var x = positionA[i][0];

            var y = positionA[i][1];

            positions.push({ x: x, y: y });

        }*/

    //positions = [{ x: 113.106100, y: 33.498900 }, { x: 111.100000, y: 34.320000 }, { x: 109.050000, y: 35.150000 }, { x: 107.010000, y: 35.9140000 }, { x: 104.900000, y: 36.7140000 }, { x: 102.800000, y: 37.600000 }, { x: 100.690800, y: 38.422000 }, { x: 98.570700, y: 39.241700 }, { x: 96.396500, y: 40.066100 }];

    var start = Cesium.JulianDate.fromDate(new Date());

    var stop = Cesium.JulianDate.addSeconds(start, time, new Cesium.JulianDate());

    //Make sure viewer is at the desired time.

    this.viewer.clock.startTime = start.clone();

    this.viewer.clock.stopTime = stop.clone();

    this.viewer.clock.currentTime = start.clone();

    this.viewer.clock.clockRange = Cesium.ClockRange.CLAMPED; //Loop at the end

    this.viewer.clock.multiplier = 1;

    this.viewer.clock.canAnimate = false;

    var _position = this.computeCirclularFlight(positions,start,stop);

    this.flyEntity = this.viewer.entities.add({

        //Set the entity availability to the same interval as the simulation time.

        availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({

            start: start,

            stop: stop

        })]),

        position: _position,
        viewFrom:cartesian,

        orientation: new Cesium.VelocityOrientationProperty(_position),

        model: model,

//Show the path as a pink line sampled in 1 second increments.

        path: {

            resolution: 1,

            material: new Cesium.PolylineGlowMaterialProperty({

                glowPower: 0.1,

                color: Cesium.Color.YELLOW

            }),

            width: 30

        }

    });

    this.viewer.trackedEntity = this.flyEntity;

};

/**

 *计算运动轨迹函数

 *position 点数组[{x:"",y:"",z:""}]

 *

 **/

flyRouter.prototype.computeCirclularFlight = function(position=[], start, stop) {

    var property = new Cesium.SampledPositionProperty();

    for (var i = 0; i < position.length; i++) {

        if (i == 0) {

            var time = Cesium.JulianDate.addSeconds(start, i, new Cesium.JulianDate());

            var _position = Cesium.Cartesian3.fromDegrees(position[i].x, position[i].y, position[i].z);

            property.addSample(time, _position);

        }

        if (i > 0) {

            var position_a = new Cesium.Cartesian3(property._property._values[i * 3 - 3], property._property._values[i * 3 - 2], property._property._values[i * 3 - 1]);

            var _position = Cesium.Cartesian3.fromDegrees(position[i].x, position[i].y, position[i].z);

            var positions = [Cesium.Ellipsoid.WGS84.cartesianToCartographic(position_a), Cesium.Ellipsoid.WGS84.cartesianToCartographic(_position)];

            var a = new Cesium.EllipsoidGeodesic(positions[0], positions[1]);

            var long = a.surfaceDistance;

            var _time = long/50;

            var time = Cesium.JulianDate.addSeconds(property._property._times[i - 1], _time, new Cesium.JulianDate());

            property.addSample(time, _position);

        }

    }

    return property;

};

//暂停飞行

flyRouter.prototype.pause = function(){

    this.viewer.clock.multiplier = 0;

};

//向前飞行

flyRouter.prototype.forward = function(){

    this.viewer.clock.multiplier = 1;

};

//向后飞行

flyRouter.prototype.backward = function(){

    this.viewer.clock.multiplier = -1;

};

//退出飞行

flyRouter.prototype.stopFly = function(){

    /* var start = Cesium.JulianDate.fromDate(new Date());

      viewer.clock.startTime = start.clone();

      var stop = Cesium.JulianDate.addSeconds(start, 300000000, new Cesium.JulianDate());

      viewer.clock.stopTime = stop.clone();*/

    this.viewer.clock.multiplier = 0;

    if(this.flyEntity){

        this.viewer.entities.remove(this.flyEntity);

    }

};