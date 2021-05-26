/*
 * @Author: hecheng
 * @Date: 2019-08-27 09:41:23
 * @Last Modified by: hecheng
 * @Last Modified time: 2019-09-02 17:44:31
 */




/**
 *
 *
 * @class LayerAnimation
 */
class LayerAnimation {
    /**
     *Creates an instance of LayerAnimation.
     * @param {*} {map,loop}
     * @memberof LayerAnimation
     */
    constructor ({map,loop = true,timeLineDelay = 500}){
        this.map = map
        this.currentTime = 0
        this.queue = {}
        this.timeLine = null
        this.timeLineDelay =timeLineDelay
        this.loop = loop
        this.timeQueue = {}
        this.maxTime = 0
    }
    init(){
        console.log(123)
    }
    /**
     *
     *
     * @param {*} {id,time}
     * @memberof LayerAnimation
     */
    add({id,time}){
        this.queue[ id ]={ delay:time }
        this.timeQueue[ time ] = { id }
        this.maxTime = Math.max.apply(null,Object.keys(this.timeQueue))
    }
    /**
     *
     *
     * @param {*} id
     * @memberof LayerAnimation
     */
    remove(id){
        let time = this.queue[ id ].delay
        delete this.queue[ id ]
        delete this.timeQueue[ time ]
    }
    /**
     *
     *
     * @param {*} id
     * @memberof LayerAnimation
     */
    showLayer(id){
        this.hiddenAll()
        if(!map.isSourceLoaded(id)){
            this.reset()
            this.play()
        }
        this.changeRender(id, true);
    }
    /**
     *
     *
     * @param {*} id
     * @memberof LayerAnimation
     */
    hiddenLayer(id){
        this.changeRender(id, false);
    }
    /**
     *
     *
     * @memberof LayerAnimation
     */
    showAll(){
        let _this=this
        Object.keys(this.queue).map((v)=>{
            _this.hiddenLayer(v)
        })
    }
    /**
     *
     *
     * @memberof LayerAnimation
     */
    hiddenAll(){
        let _this=this
        Object.keys(this.queue).map((v)=>{
            _this.hiddenLayer(v)
        })
    }
    /**
     *
     *
     * @memberof LayerAnimation
     */
    async play(){
        let timeQueue = this.timeQueue
        let timeLineDelay = this.timeLineDelay
        let currentTime = this.currentTime
        let maxTime = this.maxTime
        let loop = this.loop
        let _this = this
        let map = this.map
        await this.loadsCache()
        this.timeLine&&clearInterval(this.timeLine)
        this.timeLine = setInterval(()=>{
            if(maxTime + timeLineDelay < currentTime ){
                if(loop)currentTime = 0
                !loop&&_this.stop()
            }
            currentTime+=timeLineDelay
            let layer = timeQueue[currentTime]
            if(layer&&map.isSourceLoaded(layer.id))_this.showLayer(layer.id)
            _this.currentTime = currentTime
        },timeLineDelay)
    }
    /**
     *
     *
     * @param {*} id
     * @memberof LayerAnimation
     */
    jumpTo(id){
        let layer = this.queue[ id ]
        this.currentTime = layer.delay
        this.showLayer(id)
    }
    /**
     *
     *
     * @memberof LayerAnimation
     */
    reset(){
        this.currentTime = 0
        this.hiddenAll()
    }
    /**
     *
     *
     * @memberof LayerAnimation
     */
    stop(){
        clearInterval(this.timeLine)
    }

    /**
     *
     *
     * @param {*} id
     * @param {*} show
     * @memberof LayerAnimation
     */
    changeRender(id,show){
        map.getLayer(id).render = show
        map.triggerRepaint()
    }

    /**
     *
     *
     * @returns
     * @memberof LayerAnimation
     */
    loadsCache(){
        let loop = this.loop
        let loadLength = loop ? 3 : 1
        let timeQueue = this.timeQueue
        let _this = this
        let map = this.map
        let queueKeys = Object.keys(timeQueue)
        let loadFlags = []
        return new Promise(function(resolve, reject){
            setTimeout(() => {
                for (let index = 0; index < loadLength; index++) {
                    const layer = timeQueue[queueKeys[index]]
                    loadFlags.push(map.isSourceLoaded(layer.id))
                }
                if(loadFlags.every(v=>v)) {
                    resolve(true)
                    return
                }
                _this.loadsCache()
            }, 10);
        })
    }
}
