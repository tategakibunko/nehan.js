/**
 object utility module

 @namespace Nehan.Obj
 */
Nehan.Obj = (function(){
  var __clone = function(obj){
    var copy;
    if(obj === null || typeof obj !== "object"){
      return obj;
    }
    if(obj instanceof Array) {
      copy = [];
      for(var i = 0; i < obj.length; i++){
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
     copy all value in [args] to [dst]
     @memberof Nehan.Args
     @param {Object} dst
     @param {Object} args
     @return {Object} copied dst
     */
    copy : function(dst, args){
      dst = dst || {};
      for(var prop in args){
	dst[prop] = args[prop];
      }
      return dst;
    },
    /**
     merge all value in [args] to [dst] with default value by [defaults]
     @memberof Nehan.Args
     @param {Object} dst
     @param {Object} defaults
     @param {Object} args
     @return {Object} merged dst
     */
    merge : function(dst, defaults, args){
      dst = dst || {};
      for(var prop in defaults){
	dst[prop] = (typeof args[prop] === "undefined")? defaults[prop] : args[prop];
      }
      return dst;
    },
    /**
     @memberof Nehan.Obj
     @param obj {Object}
     @return {bool}
     */
    isEmpty: function(obj){
      for(var name in obj){
	return false;
      }
      return true;
    },
    createOne : function(prop, value){
      var obj = {};
      obj[prop] = value;
      return obj;
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
     @param fn {Function} - fun prop -> value -> {bool}
     @return {bool}
     */
    exists : function(obj, fn){
      for(var prop in obj){
	if(fn(prop, obj[prop])){
	  return true;
	}
      }
      return false;
    },
    /**
     @memberof Nehan.Obj
     @param obj {Object}
     @param fn {Function} - fun prop -> value -> {bool}
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
    },
    /**
     @memberof Nehan.Obj
     @param obj {Object}
     @param fn {Function} - fun prop -> value -> {bool}
     */
    forall : function(obj, fn){
      for(var prop in obj){
	if(!fn(prop, obj[prop])){
	  return false;
	}
      }
      return true;
    }
  };
})();
