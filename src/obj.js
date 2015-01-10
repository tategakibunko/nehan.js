/**
   object utility module

   @namespace Nehan.Obj
*/
var Obj = {
  /**
     @memberof Nehan.Obj
     @param obj {Object}
     @return {boolean}
  */
  isEmpty: function(obj){
    for(var name in obj){
      return false;
    }
    return true;
  },
  /**
     @memberof Nehan.Obj
     @param obj {Object}
     @param fn {Function} - fun prop -> value -> obj
  */
  map : function(obj, fn){
    var ret = {};
    this.iter(obj, function(prop, value){
      ret[prop] = fn(prop, value);
    });
    return ret;
  },
  /**
     @memberof Nehan.Obj
     @param obj {Object}
     @param fn {Function} - fun prop -> value -> {boolean}
  */
  filter : function(obj, fn){
    var ret = {};
    this.iter(obj, function(prop, value){
      if(fn(prop, value)){
	ret[prop] = value;
      }
    });
    return ret;
  },
  /**
     @memberof Nehan.Obj
     @param obj {Object}
     @param fn {Function} - fun prop -> value -> ()
  */
  iter : function(obj, fn){
    for(var prop in obj){
      fn(prop, obj[prop]);
    }
  }
};
