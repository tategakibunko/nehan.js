var TextEmphaPos = (function(){
  function TextEmphaPos(value){
    this.value = value || "over";
  }

  TextEmphaPos.prototype = {
    isEmphaFirst : function(){
      return this.value === "over" || this.value === "left" || this.value === "before";
    },
    setValue : function(value){
      this.value = value;
    },
    getCss : function(line){
      var css = {};
      return css;
    }
  };

  return TextEmphaPos;
})();

