var FloatDirection = (function(){
  function FloatDirection(value){
    this.value = value || "none";
  }

  FloatDirection.prototype = {
    getCss : function(flow){
      var css = {};
      if(flow.isTextHorizontal()){
	if(this.isStart()){
	  css["css-float"] = "left";
	} else if(this.isEnd()){
	  css["css-float"] = "right";
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

  return FloatDirection;
})();

