var Exceptions = {
  PAGE_BREAK:1,
  LINE_BREAK:2,
  BUFFER_END:3,
  SINGLE_RETRY:4,
  IGNORE:5,
  FORCE_TERMINATE:6,
  toString : function(num){
    for(var prop in this){
      if(this[prop] === num){
	return prop;
      }
    }
    return "??";
  }
};


  