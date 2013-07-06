var FontWeight = (function(){
  function FontWeight(value){
    this.value = value;
  }

  FontWeight.prototype = {
    isBold : function(){
      return this.value !== "normal" && this.value !== "lighter";
    },
    getCss : function(){
      var css = {};
      css["font-weight"] = this.value;
      return css;
    }
  };

  return FontWeight;
})();

