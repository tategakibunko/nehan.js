var Obj = {
  isEmpty: function(obj){
    for(var name in obj){
      return false;
    }
    return true;
  },
  // fn : prop -> value -> obj
  map : function(obj, fn){
    var ret = {};
    this.iter(obj, function(prop, value){
      ret[prop] = fn(prop, value);
    });
    return ret;
  },
  // fn : prop -> value -> bool
  filter : function(obj, fn){
    var ret = {};
    this.iter(obj, function(prop, value){
      if(fn(prop, value)){
	ret[prop] = value;
      }
    });
    return ret;
  },
  // fn : prop -> value -> unit
  iter : function(obj, fn){
    for(var prop in obj){
      fn(prop, obj[prop]);
    }
  }
};
