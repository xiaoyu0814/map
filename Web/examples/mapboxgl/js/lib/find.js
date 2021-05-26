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

export { getFind }