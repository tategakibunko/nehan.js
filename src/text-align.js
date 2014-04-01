var TextAlign = (function(){
  function TextAlign(value){
    this.value = value || "start";
  }

  TextAlign.prototype = {
    isStart : function(){
      return this.value === "start";
    },
    isEnd : function(){
      return this.value === "end";
    },
    isCenter : function(){
      return this.value === "center";
    },
    getCss : function(line){
      var css = {};
      if(this.value === "center"){
      }
      return css;
    }
  };

  return TextAlign;
})();

