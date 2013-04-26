var Obj = {
  isEmpty: function(obj){
    for(var name in obj){
      return false;
    }
    return true;
  },
  iter : function(obj, fn){
    for(var prop in obj){
      fn(obj, prop, obj[prop]);
    }
  }
};
