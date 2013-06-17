var Color = (function(){
  function Color(value){
    this.value = Colors.get(value);
  }

  Color.prototype = {
    getCss : function(){
      var css = {};
      css.color = this.getCssValue();
      return css;
    },
    getValue : function(){
      return this.value;
    },
    getPaletteValue : function(){
      return (new Rgb(this.value)).getPaletteValue();
    },
    getCssValue : function(){
      return (this.value === "transparent")? this.value : "#" + this.value;
    }
  };

  return Color;
})();
