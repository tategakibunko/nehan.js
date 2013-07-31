var Exceptions = {
  PAGE_BREAK:2,
  LINE_BREAK:3,
  BUFFER_END:4,
  SINGLE_RETRY:5,
  BREAK:6,
  IGNORE:7,
  FORCE_TERMINATE:8,
  toString : function(num){
    for(var prop in this){
      if(this[prop] === num){
	return prop;
      }
    }
    return "??";
  }
};


  