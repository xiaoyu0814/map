function  getFind(array,id) {
    var temp = false;
    for(var i=0;i<array.length;i++){
      if(array[i].id == id){
        temp = array[i];
        break;
      }
    }
    return temp
  }

  function getIndex(array,id){
  	 var temp = -1;
	    for(var i=0;i<array.length;i++){
	      if(array[i].id == id){
	        temp = i;
	        break;
	      }
	    }
	    return temp
  }

  function getEvent(array,item){
    var temp = false;
    for(var i=0;i<array.length;i++){
      if(array[i].type == item.type && array[i].layer == item.layer){
        temp = array[i];
        break;
      }
    }
    return temp;
  }
  function  getFindCesiumLayer(_map,layer) {
    let _entities = _map.entities.values;
    let _imageryLayers = _map.imageryLayers._layers;
    let _primitives = _map.scene.primitives._primitives;
    let _dataSources = _map.dataSources._dataSources
    let temp = getFind(_entities,layer.id)||getFind(_imageryLayers,layer.id)||getFind(_primitives,layer.id)||getFind(_dataSources,layer.id);
    return temp
  }

export { getFind,getIndex,getEvent,getFindCesiumLayer}