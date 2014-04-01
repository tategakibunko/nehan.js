var LogicalFloat = (function(){
  function LogicalFloat(value){
    this.value = value || "none";
  }

  LogicalFloat.prototype = {
    getCss : function(flow){
      var css = {};
      if(flow.isTextHorizontal()){
	if(this.isStart()){
	  css["float"] = "left";
	} else if(this.isEnd()){
	  css["float"] = "right";
	}
      }
      return css;
    },
    isStart : function(){
      return this.value === "start";
    },
    isEnd : function(){
      return this.value === "end";
    },
    isNone : function(){
      return this.value === "none";
    }
  };

  return LogicalFloat;
})();

