/**
   @namespace Nehan.Args
*/
var Args = {
  /**
     copy all value in [args] to [dst]
     @memberof Nehan.Args
     @param {Object} dst
     @param {Object} args
     @return {Object} - copied dst
  */
  copy : function(dst, args){
    dst = dst || {};
    for(var prop in args){
      dst[prop] = args[prop];
    }
    return dst;
  },
  /**
     copy all value in [args] to [dst] recursively
     @memberof Nehan.Args
     @param {Object} dst
     @param {Object} args
     @return {Object} - copied dst
  */
  copy2 : function(dst, args){
    dst = dst || {};
    for(var prop in args){
      if(typeof dst[prop] === "object"){
	this.copy2(dst[prop], args[prop]);
      } else {
	dst[prop] = args[prop];
      }
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
  }
};
