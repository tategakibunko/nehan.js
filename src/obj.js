var Obj = {
  isEmpty: function(obj){
    for(var name in obj){
      return false;
    }
    return true;
  },
  filter : function(obj, fn){
    var ret = [];
    for(var prop in obj){
      if(fn(obj)){
	ret.push(obj);
      }
    }
    return ret;
  },
  iter : function(obj, fn){
    for(var prop in obj){
      fn(obj, prop, obj[prop]);
    }
  }
};
