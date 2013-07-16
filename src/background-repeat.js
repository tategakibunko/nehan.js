var BackgroundRepeat = (function(){
  function BackgroundRepeat(value){
    this.value = value;
  }

  BackgroundRepeat.prototype = {
    isSingleValue : function(){
      return (this.value === "repeat-x" ||
	      this.value === "repeat-y" ||
	      this.value === "repeat-inline" ||
	      this.value === "repeat-block");
    },
    getCssValue : function(flow){
      var is_vert = flow.isTextVertical();
      switch(this.value){
      case "repeat-inline": case "repeat-x":
	return is_vert? "repeat-y" : "repeat-x";
      case "repeat-block": case "repeat-y":
	return is_vert? "repeat-x" : "repeat-y";
      default:
	return this.value;
      }
    }
  };

  return BackgroundRepeat;
})();

