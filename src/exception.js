var Exceptions = {
  PAGE_BREAK:2,
  LINE_BREAK:3,
  BUFFER_END:4,
  OVER_FLOW:5,
  RETRY:6,
  SKIP:7,
  BREAK:8,
  IGNORE:9,
  FORCE_TERMINATE:10,
  toString : function(num){
    for(var prop in this){
      if(this[prop] === num){
	return prop;
      }
    }
    return "??";
  }
};


  