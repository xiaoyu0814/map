function MapMouseEvent(maptype,map) {
	this.type=maptype;
	this.map=map;
	this.init();
};
MapMouseEvent.prototype = {
	init:function(){
		if(this.type ==3) {
			this.map.pieCesium.mouseEvent('init');			
		}
	},
	/**
     * 添加监听鼠标事件类
     * 
     * @param {String} type           鼠标事件类型:'pick'拾取对象,'moveover'鼠标悬停进对象，'roam'鼠标漫游
     * @param {Function}callbackfun   返回事件
	 * @example
		//获取拾取对象的position位置,properties属性,object对象
		view.listentoMouseEvent.on('pick',function(position,properties,object){
			console.log(position);
			console.log(properties);
			console.log(object);
		});
     */
	on:function(type,callbackfun){
		switch (type){
			case 'pick':
				if(this.type ==3) {
					this.map.pieCesium.mouseEvent(type,callbackfun);	
				}
				break;
			case 'moveover':
				if(this.type ==3) {
					this.map.pieCesium.mouseEvent(type,callbackfun);
				}
				break;
			case 'roam':
				if(this.type ==3) {
					this.map.pieCesium.mouseEvent(type);
				}
				break;
			default:
				
				break;
		}
	},
	/**
     * 移除监听鼠标事件类
     * 
     * @param {String} type           鼠标事件类型:'pick'拾取事件,'moveover'鼠标悬停事件
	 * @example
		//移除鼠标拾取事件
		view.listentoMouseEvent.off('pick');
     */
	off:function(type){
		switch (type){
			case 'pick':
				if(this.type ==3) {
					this.map.pieCesium.mouseEvent('pickoff');
				}
				break;
			case 'moveover':
				if(this.type ==3) {
					this.map.pieCesium.mouseEvent('moveoveroff');
				}
				break;
			default:
				
				break;
		}
	}
};
export {MapMouseEvent}