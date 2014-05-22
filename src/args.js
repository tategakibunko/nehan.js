var Args = {
  copy : function(dst, args){
    dst = dst || {};
    var keys = Object.keys(args);
    for(var i = 0, len = keys.length; i < len; i++){
      var prop = keys[i];
      dst[prop] = args[prop];
    }
    return dst;
  },
  copy2 : function(dst, args){
    var keys = Object.keys(args);
    for(var i = 0, len = keys.length; i < len; i++){
      var prop = keys[i];
      if(typeof dst[prop] === "object"){
	this.copy2(dst[prop], args[prop]);
      } else {
	dst[prop] = args[prop];
      }
    }
  },
  merge : function(dst, defaults, args){
    var keys = Object.keys(defaults);
    for(var i = 0, len = keys.length; i < len; i++){
      var prop = keys[i];
      dst[prop] = (typeof args[prop] === "undefined")? defaults[prop] : args[prop];
    }
    return dst;
  }
};
