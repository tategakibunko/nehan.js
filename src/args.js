var Args = {
  copy : function(dst, args){
    for(var prop in args){
      dst[prop] = args[prop];
    }
    return dst;
  },
  merge : function(dst, defaults, args){
    for(var prop in defaults){
      dst[prop] = (typeof args[prop] == "undefined")? defaults[prop] : args[prop];
    }
    return dst;
  },
  activate : function(dst, src, props){
    List.iter(props, function(prop){
      if(src[prop]){
	dst[prop] = src[prop];
      }
    });
    return dst;
  }
};
