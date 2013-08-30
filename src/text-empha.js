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
      var css = {}, font_size = line.getFontSize();
      css["font-family"] = Layout.emphaFontFamily;
      css["padding-left"] = "0.5em";
      css.width = this.getExtent(font_size) + "px";
      css.height = chr.getAdvance(line.flow, line.letterSpacing) + "px";
      return css;
    },
    getCssHoriEmphaWrap : function(line, chr){
      var css = {}, font_size = line.getFontSize();
      css.display = "inline-block";
      css["font-family"] = Layout.emphaFontFamily;
      css["padding-top"] = -font_size + "px";
      css.width = chr.getAdvance(line.flow, line.letterSpacing) + "px";
      css.height = this.getExtent(font_size) + "px";
      return css;
    }
  };

  return TextEmpha;
})();

