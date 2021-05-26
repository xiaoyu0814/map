var rainSnowFall = function (options) {
    let _self=this;
    this._viewer = options.viewer;
    this._options = options;
    this._snowSystem=null;
    this._rainSystem=null;
    this._viewer.scene.globe.depthTestAgainstTerrain = true;
}
rainSnowFall.prototype.getSnow = function () {
    let _self = this;
    //粒子发射器的模型矩阵
    let emitterModelMatrix = new Cesium.Matrix4.fromTranslation(this._viewer.scene.camera.position);
    let _particleRadius=this._viewer.scene.camera.positionCartographic.height;
    let minVelocity=-5;
    let maxVelocity=-1;

    if(_self._snowSystem!=null){
        this._viewer.scene.primitives.remove(_self._snowSystem);
    }
    //设置雪天效果
    this._viewer.scene.skyAtmosphere.hueShift = -0.8;
    this._viewer.scene.skyAtmosphere.saturationShift = -0.7;
    this._viewer.scene.skyAtmosphere.brightnessShift = -0.33;

    this._viewer.scene.fog.density = 0.001;
    this._viewer.scene.fog.minimumBrightness = 0.8;

    // snow
    let snowParticleSize = 12.0;
    let minimumSnowImageSize = 0;//雪花大小
    let maximumSnowImageSize = 0;//雪花大小
    let emissionRate = 0;//下雪速率
    if (this._options.snowSize == "0")//小雪
    {
        emissionRate = 1000;
        minimumSnowImageSize = new Cesium.Cartesian2(snowParticleSize * 1.0, snowParticleSize * 1.0);
        maximumSnowImageSize = new Cesium.Cartesian2(snowParticleSize * 1.0, snowParticleSize * 1.0);

    } else if (this._options.snowSize == "1")//中雪
    {
        emissionRate = 1500;
        minimumSnowImageSize = new Cesium.Cartesian2(snowParticleSize*1, snowParticleSize*1);
        maximumSnowImageSize = new Cesium.Cartesian2(snowParticleSize *1.5, snowParticleSize * 1.5);
    } else if (this._options.snowSize == "2")//大雪
    {
        emissionRate = 2000;
        minimumSnowImageSize = new Cesium.Cartesian2(snowParticleSize * 1.5, snowParticleSize * 1.5);
        maximumSnowImageSize = new Cesium.Cartesian2(snowParticleSize * 2, snowParticleSize * 2);
    }
    else if (this._options.snowSize == "3")//暴雪
    {
        emissionRate = 2500;
        minimumSnowImageSize = new Cesium.Cartesian2(snowParticleSize * 2.5, snowParticleSize * 2.5);
        maximumSnowImageSize = new Cesium.Cartesian2(snowParticleSize * 3.0, snowParticleSize * 3.0);
    }else if (this._options.snowSize == "4")//大暴雪
    {
        emissionRate = 3000;
        minimumSnowImageSize = new Cesium.Cartesian2(snowParticleSize * 3.0, snowParticleSize * 3.0);
        maximumSnowImageSize = new Cesium.Cartesian2(snowParticleSize * 3.5, snowParticleSize * 3.5);
    }else //特大暴雪
    {
        emissionRate =3500;
        minimumSnowImageSize = new Cesium.Cartesian2(snowParticleSize * 3.5, snowParticleSize * 3.5);
        maximumSnowImageSize = new Cesium.Cartesian2(snowParticleSize * 4, snowParticleSize * 4);
    }

    //以下根据相机与粒子的距离求粒子的显隐
    let snowGravityScratch = new Cesium.Cartesian3();
    let snowUpdate = function (particle, dt) {
        // console.log(_self._viewer.scene.camera.position);
        snowGravityScratch = Cesium.Cartesian3.normalize(particle.position, snowGravityScratch);
        Cesium.Cartesian3.multiplyByScalar(snowGravityScratch, Cesium.Math.randomBetween(maxVelocity,minVelocity), snowGravityScratch);
        particle.velocity = Cesium.Cartesian3.add(particle.velocity, snowGravityScratch, particle.velocity);


        let distance = Cesium.Cartesian3.distance(_self._viewer.scene.camera.position, particle.position);
        if (distance > _particleRadius) {
            particle.endColor.alpha = 0.0;
        } else {
            particle.endColor.alpha = _self._snowSystem.endColor.alpha / (distance /_particleRadius + 0.1);
        }

    };

    _self._snowSystem= new Cesium.ParticleSystem({
        modelMatrix: emitterModelMatrix,
        //emitterModelMatrix:emitterModelMatrix,
        minimumSpeed: -1,
        maximumSpeed: 0.0,
        lifetime: 15.0,
        emitter: new Cesium.SphereEmitter(_particleRadius),
        startScale: 0.5,
        endScale: 1.0,
        image:_self._options.snowImg,
        startColor: Cesium.Color.WHITE.withAlpha(0.0),
        endColor: Cesium.Color.WHITE.withAlpha(1.0),
        emissionRate: emissionRate,
        minimumImageSize: minimumSnowImageSize,
        maximumImageSize: maximumSnowImageSize,
        updateCallback: snowUpdate
    });

    this._viewer.scene.primitives.add(_self._snowSystem);
};

rainSnowFall.prototype.getRain = function () {
    let _self = this;
    //粒子发射器的模型矩阵
    let emitterModelMatrix = new Cesium.Matrix4.fromTranslation(this._viewer.scene.camera.position);
    let _particleRadius=this._viewer.scene.camera.positionCartographic.height;
    let _rainGravity=-(this._viewer.scene.camera.positionCartographic.height / 15);

    if(_self._rainSystem!=null){
        this._viewer.scene.primitives.remove(_self._rainSystem);
    }
    //设置雨天效果
    this._viewer.scene.skyAtmosphere.hueShift = -0.97;
    this._viewer.scene.skyAtmosphere.saturationShift = 0.25;
    this._viewer.scene.skyAtmosphere.brightnessShift = -0.4;

    this._viewer.scene.fog.density = 0.00025;
    this._viewer.scene.fog.minimumBrightness = 0.01;

    // rain
    let rainParticleSize = 15.0;
    let rainImageSize = 15;
    let emissionRate = 0;//下雨速率
    if (this._options.snowSize == "0")//小雨
    {
        emissionRate = 3500;
        rainImageSize = new Cesium.Cartesian2(rainParticleSize, rainParticleSize*1.5);

    } else if (this._options.snowSize == "1")//中雨
    {
        emissionRate =4000;
        rainImageSize = new Cesium.Cartesian2(rainParticleSize*1.5, rainParticleSize *2.0);
} else if (this._options.snowSize == "2")//大
    {
        emissionRate =5000;
        rainImageSize = new Cesium.Cartesian2(rainParticleSize*1.8, rainParticleSize * 3);
    }else if (this._options.snowSize == "3")//暴雨
    {
        emissionRate =6000;
        rainImageSize = new Cesium.Cartesian2(rainParticleSize*2, rainParticleSize * 3.5);
    }else if (this._options.snowSize == "4")//大暴雨
    {
        emissionRate =7000;
        rainImageSize = new Cesium.Cartesian2(rainParticleSize*2.5, rainParticleSize * 4.5);
    }else {//特大暴雨
        emissionRate =8000;
        rainImageSize = new Cesium.Cartesian2(rainParticleSize*3, rainParticleSize *5);
    }

    //以下根据相机与粒子的距离求粒子的显隐
    let rainGravityScratch = new Cesium.Cartesian3();
    let rainUpdate = function (particle, dt) {
        // console.log(_self._viewer.scene.camera.position);
        rainGravityScratch = Cesium.Cartesian3.normalize(particle.position, rainGravityScratch);
        rainGravityScratch = Cesium.Cartesian3.multiplyByScalar(rainGravityScratch,_rainGravity, rainGravityScratch);
        particle.position = Cesium.Cartesian3.add(particle.position, rainGravityScratch, particle.position);

        let distance = Cesium.Cartesian3.distance(_self._viewer.scene.camera.position, particle.position);
        if (distance >_particleRadius) {
            particle.endColor.alpha = 0.0;
        } else {
            // console.log("粒子高度："+Cesium.Cartographic.fromCartesian(particle.position));
            particle.endColor.alpha = _self._rainSystem.endColor.alpha / (distance /_particleRadius + 0.1);
        }
    };

    _self._rainSystem= new Cesium.ParticleSystem({
        modelMatrix: emitterModelMatrix,
        speed : -1.0,
        lifetime : 15.0,
        emitter: new Cesium.SphereEmitter(_particleRadius),
        startScale : 1.0,
        endScale : 0.0,
        image:_self._options.rainImg,
        startColor :new Cesium.Color(1.0, 1.0, 1.0,0.0),
        endColor : new Cesium.Color(1.0, 1.0, 1.0, 1.0),
        emissionRate: emissionRate,
        imageSize : rainImageSize,
        updateCallback : rainUpdate
    });

    this._viewer.scene.primitives.add(_self._rainSystem);
};

rainSnowFall.prototype.convertDegreeArrayToCartographicArray = function (degreeArray) {
        //把经纬度坐标的数组转制图坐标的数�?
        let cartographics = [];
        for (let i = 0; i < degreeArray.length; i++) {
            let cartographic = Cesium.Cartographic.fromDegrees(degreeArray[i][0], degreeArray[i][1]);
            cartographics.push(cartographic);
        }
        return cartographics;

}

 //定位
rainSnowFall.prototype.flyTo = function (destination, head, pitch, roll, duration, call) {
    let _self = this;
    _self._viewer.camera.flyTo({
            destination: destination,    //Cartesian3 | Rectangle
            orientation: {
                heading: head,
                pitch: pitch,
                roll: roll,
            },
            duration: duration,
            complete: function ()//飞行完毕后执行的动作
            {
                if (call)//如果有回调函�?
                {
                    call();
                }
            }

        });
    }