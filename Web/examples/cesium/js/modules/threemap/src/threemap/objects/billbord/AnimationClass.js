class AnimationClass {
    constructor(Object,Object1){
        this.animationObject = Object;
        this.animationObject1 = Object1;
        this.start = true;
        // this.stop = false;
        this.loop = false;//是否循环
        this.maxWidth = this.maxHeight = 100;
        this.minWidth = this.minHeight = 0;
        this.speed = 0.005;//速率  0-1之间
        this.ifAnimation = true;
        this.intervalTime = 10; //以秒为单位  默认动画间隔时间为10秒
        this.changeRange = [0.5, 1.5];//变换范围
        if(this.ifAnimation){
            this.referenceWidth = this.animationObject.width;//参考宽度
            this.referenceHeight = this.animationObject.length;//参考高度
            // this.animationObject.width = 0;
            // this.animationObject.length = 0;
        }
    }
    //同时做动画
    updateAnimation(){
        let instance = this;
        let width = 0;
        let height = 0;
        let addOrSubstract = 'add';
        update();
        function update(){
            requestAnimationFrame(update);
            if(instance.start){
                // if(!instance.stop){
                    if(addOrSubstract === 'add'){
                        width+=instance.speed;
                        height+=instance.speed;
                    }else{
                        width-=instance.speed;
                        height-=instance.speed;
                    }

                    if(width >= 1.0 || height > 1.0){
                        addOrSubstract = 'substract'
                        // if(instance.loop){
                        //     width = 0;
                        //     height = 0;
                        //     // update();
                        // }else{
                        //     width = 0;
                        //     height = 0;
                        //     instance.stop = true;
                        //     return;
                        // }
                    }else if(width <=0 || height <= 0){
                        addOrSubstract = 'add';
                    }
                    instance.animationObject.width = width*instance.referenceWidth;
                    instance.animationObject.length = height * instance.referenceHeight;
                }
            }
        // }
    }
    setIconScaleOfInit(arr,wAndHScale,bool,obj){
        for(let i=0;i<arr.length;i++){
            let Obj = arr[i].children[0];
            if(bool && Obj === obj){

                continue;
            }
            Obj.scale.set( wAndHScale.ws,wAndHScale.hs,1);
        }
    }
    //按照顺序  依次做动画
    updateAnimation1(){
        let instance = this;
        this.animationObject.ifUpdate = false;
        let children = this.animationObject.children;
        let len = children.length;
        let eq = 0;
        let currentAnimationObj = children[eq].children[0];
        let width = instance.changeRange[0];
        let height = instance.changeRange[0];
        let addOrSubstract = 'add';
        let timeOfanimationProcessing = 0;//动画执行时间  默认是0
        let timeOfSomeJieD = 0;
        let canNext = true;
        let sTime = Date.now();
        let changeSpeed = 0;
        changeSpeed = Math.min(instance.speed, 0.015);
        changeSpeed= Math.max(instance.speed, 0.001);
        let speed = changeSpeed;
        let isInAnimation = true;//正在进行动画中
        let hasInit = false;
        let canCallBack = true;//可以执行回调函数
        let canCancleCallBack = true;//取消回调函数
        let range = (instance.changeRange[0]+instance.changeRange[1])/2;
        update();
        function update(){
            if(!hasInit){
                let w = instance.changeRange[0] * instance.referenceWidth;
                let h =  instance.changeRange[0] * instance.referenceHeight;
                let wAndHScale = instance.animationObject.getRealScale(w,h);
                if(wAndHScale){
                    //设置所有图标得初始大小
                    instance.setIconScaleOfInit(children,wAndHScale,false);
                    hasInit = true;
                }
            }
            requestAnimationFrame(update);
            if(instance.start && hasInit){
                range = instance.changeRange[1];
                let t =  (Date.now() - sTime)/1000;
                timeOfanimationProcessing = t+timeOfSomeJieD;
                isInAnimation = true;
                changeSpeed = Math.min(instance.speed, 0.015);
                changeSpeed = Math.max(changeSpeed, 0.001);
                if(addOrSubstract === 'add'){
                    width+=changeSpeed;
                    height+=changeSpeed;
                }else{
                    width-=changeSpeed;
                    height-=changeSpeed;

                }
                if(timeOfanimationProcessing >= instance.intervalTime){//当一个图标的动画时间达到后
                    //我们需要查看上一个 图标的动画是否结束  如果没有结束  我们应该先让他用一个比较快的速度结束动画  然后让另一个开始动画

                    //取消回调
                    if(canCancleCallBack){
                        instance.cancleCallBack(currentAnimationObj);
                        canCancleCallBack = false;
                    }
                    //首先让上一个动画彻底结束
                    if(width > instance.changeRange[0]){
                        changeSpeed = speed*5;//速率  0-1之间
                        if((width-changeSpeed) < instance.changeRange[0]){
                            width = instance.changeRange[0]
                        }
                        canNext = false;
                        addOrSubstract = 'substract';
                        let w = width*instance.referenceWidth;
                        let h =  height * instance.referenceHeight;
                        let wAndHScale = instance.animationObject.getRealScale(w,h);
                        currentAnimationObj.scale.set( wAndHScale.ws,wAndHScale.hs,1);
                    }else{
                        canNext = true;
                    }
                    //再让下一个动画开始
                    if(canNext){
                        canCancleCallBack = true;
                        // instance.speed = speed;
                        canCallBack = true;
                        changeSpeed = 0;
                        width = instance.changeRange[0];
                        height = instance.changeRange[0];
                        addOrSubstract = 'add';
                        sTime = Date.now();
                        timeOfanimationProcessing = 0;
                        timeOfSomeJieD = 0;
                        eq+=1;
                        if(eq >= len){//判断是否要循环  如果要循环 否则
                            if(instance.loop){
                                eq = 0;
                            }else {
                                instance.animationObject.ifUpdate = true;
                                eq = 0;
                                instance.start = false;//停止动画
                                return;
                            }
                        }
                        currentAnimationObj = children[eq].children[0];
                    }
                }else{//让当前图标进行动画
                    if(width >= instance.changeRange[1] || height >= instance.changeRange[1]){
                        // addOrSubstract = 'substract'
                    }else if(width <= instance.changeRange[0] || height <= instance.changeRange[0]){
                        addOrSubstract = 'add';
                    }
                    if(width >= range){
                        if(canCallBack){
                            instance.callBack(currentAnimationObj);
                            canCallBack = false;

                        }
                        width = range;
                        height = range;
                        // return;
                    }
                    let w = width*instance.referenceWidth;
                    let h =  height * instance.referenceHeight;
                    let wAndHScale = instance.animationObject.getRealScale(w,h);
                    let w1 = instance.changeRange[0] * instance.referenceWidth;
                    let h1 =  instance.changeRange[0] * instance.referenceHeight;
                    let wAndHScale1 = instance.animationObject.getRealScale(w1,h1);
                    //设置所有图标得初始大小
                    instance.setIconScaleOfInit(children,wAndHScale1,true,currentAnimationObj);
                    currentAnimationObj.scale.set( wAndHScale.ws,wAndHScale.hs,1);
                }
            }else{
                if(isInAnimation){
                    timeOfSomeJieD += (Date.now() - sTime)/1000;
                }
                sTime = Date.now();
                isInAnimation = false;
            }
        }
    }
    updateAnimation2(str){
        let instance = this;
        let currentAnimationObj = [];
        this.animationObject.ifUpdate = false;
        this.animationObject1.ifUpdate = false;
        let arr = [];
        let children = this.animationObject.children;
        for(let i=0;i<children.length;i++){
            arr.push(children[i]);
        }
        let len = children.length;
        let eq = 0;
        if(str === 'all'){
            for(let i=0;i<this.animationObject.children.length;i++){
                currentAnimationObj.push( this.animationObject.children[i].children[0]);
            }
        }else{
            let currentAObj = arr[eq];
            instance.animationObject.children = [];
            instance.animationObject1.children = [];
            for(let i=0;i<arr.length;i++){
                if(eq == i){
                    instance.animationObject.add(arr[i]);
                }else{
                    instance.animationObject1.add(arr[i]);
                }
            }
            currentAnimationObj =[ this.animationObject.children[0].children[0]];
        }

        let width = instance.changeRange[0];
        let height = instance.changeRange[0];
        let addOrSubstract = null;
        let timeOfanimationProcessing = 0;//动画执行时间  默认是0
        let timeOfSomeJieD = 0;
        let canNext = true;
        let sTime = Date.now();
        let changeSpeed = 0;
        let strength = 0.3;
        let minS = 0.3;
        let maxS = 2.5;
        let canNext1 = true;
        let strengthChangerange = 0.1;
        let addOrSubstractOfStrength = 'add';
        let canChange = false;
        changeSpeed = Math.min(instance.speed, 0.015);
        changeSpeed= Math.max(changeSpeed, 0.001);
        let speed = changeSpeed;
        let isInAnimation = true;//正在进行动画中
        let hasInit = false;
        let canCallBack = true;//可以执行回调函数
        let canCancleCallBack = true;//取消回调函数
        let range = (instance.changeRange[0]+instance.changeRange[1])/2;
        update();
        function update(){
            if(!hasInit){
                let w = instance.changeRange[0] * instance.referenceWidth;
                let h =  instance.changeRange[0] * instance.referenceHeight;
                let wAndHScale = instance.animationObject.getRealScale(w,h);
                if(wAndHScale){
                    //设置所有图标得初始大小
                    instance.setIconScaleOfInit(arr,wAndHScale,false);
                    hasInit = true;
                }
            }
            requestAnimationFrame(update);
            if(instance.start && hasInit && instance.animationObject && instance.animationObject1 && instance.animationObject.visible && instance.animationObject1.visible){
                range = instance.changeRange[1];
                let t =  (Date.now() - sTime)/1000;
                timeOfanimationProcessing = t+timeOfSomeJieD;
                isInAnimation = true;
                changeSpeed = Math.min(instance.speed, 0.015);
                changeSpeed = Math.max(changeSpeed, 0.001);
                if(addOrSubstract === 'add'){
                    width+=changeSpeed;
                    height+=changeSpeed;
                }else if(addOrSubstract === 'substract'){
                    width-=changeSpeed;
                    height-=changeSpeed;

                }
                if(canChange){
                    if(addOrSubstractOfStrength == 'add'){
                        strength+=strengthChangerange;
                    }else{
                        strength-=strengthChangerange;
                    }
                }

                if(timeOfanimationProcessing >= instance.intervalTime){//当一个图标的动画时间达到后
                    //我们需要查看上一个 图标的动画是否结束  如果没有结束  我们应该先让他用一个比较快的速度结束动画  然后让另一个开始动画
                    //取消回调
                    if(canCancleCallBack){
                        if(str === 'all'){
                            instance.cancleCallBack(currentAnimationObj);
                        }else{
                            instance.cancleCallBack(currentAnimationObj[0]);
                        }
                        canCancleCallBack = false;
                    }
                    //首先让上一个动画彻底结束
                        //1:让光圈消失
                        //2:缩放回去
                    if(strength > minS){
                        // strengthChangerange = 0.3;
                        if((strength - strengthChangerange )<minS){
                            strength = minS;
                        }
                        addOrSubstractOfStrength = 'substract';
                        instance.animationObject.layer.composer.bloomPass.strength = strength;
                        canNext1 = false;
                    }else{
                        canNext1 = true;
                    }
                    if(width > instance.changeRange[0]){
                        changeSpeed = speed*5;//速率  0-1之间
                        if((width-changeSpeed) < instance.changeRange[0]){
                            width = instance.changeRange[0]
                        }
                        canNext = false;
                        addOrSubstract = 'substract';
                        let w = width*instance.referenceWidth;
                        let h =  height * instance.referenceHeight;
                        let wAndHScale = instance.animationObject.getRealScale(w,h);
                        for(let i=0;i<currentAnimationObj.length;i++){
                            currentAnimationObj[i].scale.set( wAndHScale.ws,wAndHScale.hs,1);
                        }
                    }else{
                        canNext = true;
                    }
                    //再让下一个动画开始
                    if(canNext && canNext1){
                        canCancleCallBack = true;
                        // instance.speed = speed;
                        canCallBack = true;
                        changeSpeed = 0;
                        width = instance.changeRange[0];
                        height = instance.changeRange[0];
                        strength = minS;
                        canChange = false;
                        addOrSubstract = null;
                        sTime = Date.now();
                        timeOfanimationProcessing = 0;
                        timeOfSomeJieD = 0;
                        currentAnimationObj = [];
                        eq+=1;
                        if(eq >= len || str === 'all'){//判断是否要循环  如果要循环 否则
                            if(instance.loop){
                                eq = 0;
                            }else {
                                instance.animationObject.ifUpdate = true;
                                instance.animationObject1.ifUpdate = true;
                                eq = 0;
                                instance.start = false;//停止动画
                                return;
                            }
                        }
                        if(str === 'all'){
                            for(let i=0;i<instance.animationObject.children.length;i++){
                                currentAnimationObj.push( instance.animationObject.children[i].children[0]);
                            }
                        }else{
                            let currentAObj = arr[eq];
                            instance.animationObject.children = [];
                            instance.animationObject1.children = [];
                            for(let i=0;i<arr.length;i++){
                                if(eq == i){
                                    instance.animationObject.add(arr[i]);
                                }else{
                                    instance.animationObject1.add(arr[i]);
                                }
                            }
                            currentAnimationObj =[ instance.animationObject.children[0].children[0]];
                        }
                    }
                }else{//让当前图标进行动画
                    addOrSubstract = 'add';
                    if(width >= instance.changeRange[1] || height >= instance.changeRange[1]){
                        // addOrSubstract = 'substract'
                    }else if(width <= instance.changeRange[0] || height <= instance.changeRange[0]){
                        addOrSubstract = 'add';
                    }
                    if(width >= range){
                        canChange = true;
                        if(canCallBack){
                            if(str === 'all'){
                                instance.callBack(currentAnimationObj);

                            }else{
                                instance.callBack(currentAnimationObj[0]);
                            }
                            canCallBack = false;
                        }
                        width = range;
                        height = range;
                    }
                    if(canChange){
                        if(strength>=maxS){
                            addOrSubstractOfStrength = 'substract';
                        }
                        if(strength <= minS){
                            addOrSubstractOfStrength = 'add';
                        }
                        instance.animationObject.layer.composer.bloomPass.strength = strength;
                    }
                    let w = width*instance.referenceWidth;
                    let h =  height * instance.referenceHeight;
                    let wAndHScale = instance.animationObject.getRealScale(w,h);
                    let w1 = instance.changeRange[0] * instance.referenceWidth;
                    let h1 =  instance.changeRange[0] * instance.referenceHeight;
                    let wAndHScale1 = instance.animationObject1.getRealScale(w1,h1);
                    //设置所有图标得初始大小
                    if(str === 'all'){
                        for(let i=0;i<currentAnimationObj.length;i++){
                            currentAnimationObj[i].scale.set( wAndHScale.ws,wAndHScale.hs,1);
                        }
                    }else{
                        instance.setIconScaleOfInit(instance.animationObject1.children,wAndHScale1,true,currentAnimationObj[0]);
                        currentAnimationObj[0].scale.set( wAndHScale.ws,wAndHScale.hs,1);
                    }

                }
            }else{
                if(isInAnimation){
                    timeOfSomeJieD += (Date.now() - sTime)/1000;
                }
                sTime = Date.now();
                isInAnimation = false;
            }
        }
    }
    callBack(){
    }
    cancleCallBack(){

    }
}
export  {AnimationClass};
