var Obj = {
  isEmpty: function(obj){
    for(var name in obj){
      return false;
    }
    return true;
  },
  // fn : obj -> ?
  map : function(obj, fn){
    var ret = {};
    for(var prop in obj){
      ret[prop] = fn(obj[prop]);
    }
    return ret;
  },
  // fn : prop -> value -> ?
  each : function(obj, fn){
    for(var prop in obj){
      fn(prop, obj[prop]);
    }
  },
  // fn : obj -> prop -> value -> ?
  iter : function(obj, fn){
    for(var prop in obj){
      fn(prop, obj[prop]);
    }
  }
};
