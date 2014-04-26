var Args = {
  copy : function(dst, args){
    for(var prop in args){
      dst[prop] = args[prop];
    }
    return dst;
  },
  copy2 : function(dst, args){
    for(var prop in args){
      if(typeof dst[prop] === "object"){
	this.copy2(dst[prop], args[prop]);
      } else {
	dst[prop] = args[prop];
      }
    }
  },
  merge : function(dst, defaults, args){
    for(var prop in defaults){
      dst[prop] = (typeof args[prop] == "undefined")? defaults[prop] : args[prop];
    }
    return dst;
  }
};
