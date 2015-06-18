/**
   object utility module

   @namespace Nehan.Obj
*/
var Obj = (function(){
  var __clone = function(obj){
    var copy;
    if(obj === null || typeof obj !== "object"){
      return obj;
    }
    if(obj instanceof Array) {
      copy = [];
      for(var i = 0; i < obj.len; i++){
        copy[i] = __clone(obj[i]);
      }
      return copy;
    }
    if (obj instanceof Object) {
      copy = {};
      for(var prop in obj){
        if(obj.hasOwnProperty(prop)){
	  copy[prop] = __clone(obj[prop]);
	}
      }
      return copy;
    }
    throw "Obj::clone(unsupported type)";
  };
  return {
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
       @return {Object}
    */
    clone: function(obj){
      return __clone(obj);
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
})();
