var TextEmpha = (function(){
  function TextEmpha(){
    this.pos = new TextEmphaPos();
    this.style = new TextEmphaStyle();
    this.color = new Color(Layout.fontColor);
  }

  TextEmpha.prototype = {
    setPos : function(value){
      this.pos.setValue(value);
    },
    setStyle : function(value){
      this.style.setValue(value);
    },
    setColor : function(value){
      this.color.setValue(value);
    },
    getText : function(){
      return this.style.getText();
    },
    getExtent : function(font_size){
      return font_size * 3;
    },
    getCssVertEmphaWrap : function(line, chr){
      var css = {};
      css["padding-left"] = "0.5em";
      css.width = this.getExtent(line.fontSize) + "px";
      css.height = chr.getAdvance(line.fontSize, line.letterSpacing) + "px";
      return css;
    },
    getCssHoriEmphaWrap : function(line, chr){
      var css = {};
      css.display = "inline-block";
      css["padding-top"] = -line.fontSize + "px";
      css.width = chr.getAdvance(line.fontSize, line.letterSpacing) + "px";
      css.height = this.getExtent(line.fontSize) + "px";
      return css;
    }/*,
    getCss : function(flow){
      var css = {};
      Args.copy(css, this.pos.getCss(flow));
      Args.copy(css, this.style.getCss());
      Args.copy(css, this.color.getCss());
      return css;
    }*/
  };

  return TextEmpha;
})();

