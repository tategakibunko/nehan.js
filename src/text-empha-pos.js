var TextEmphaPos = (function(){
  function TextEmphaPos(value){
    Args.merge(this, {
      hori:"over",
      vert:"right"
    }, value || {});
  }

  TextEmphaPos.prototype = {
    isEmphaFirst : function(){
      return this.hori === "over" || this.vert === "left";
    },
    getCss : function(line){
      var css = {};
      return css;
    }
  };

  return TextEmphaPos;
})();

