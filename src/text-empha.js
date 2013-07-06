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
    getCssVertEmphaWrap : function(line, chr){
      var css = {};
      css["padding-left"] = "0.5em";
      css.width = (line.fontSize * 2) + "px";
      css.height = chr.getAdvance(line.fontSize, line.letterSpacing) + "px";
      return css;
    },
    getCssHoriEmphaWrap : function(line, chr){
      var css = {};
      css.display = "inline-block";
      css["margin-top"] = -line.fontSize + "px";
      css.width = line.fontSize + "px";
      css.height = chr.getAdvance(line.flow, line.letterSpacing) + line.fontSize;
      return css;
    },
    getCssVertEmphaText : function(line){
      var css = {};
      return css;
    },
    getCssHoriEmphaText : function(line){
      var css = {};
      css["margin-bottom"] = "-0.5em";
      return css;
    },
    getCss : function(flow){
      var css = {};
      Args.copy(css, this.pos.getCss(flow));
      Args.copy(css, this.style.getCss());
      Args.copy(css, this.color.getCss());
      return css;
    }
  };

  return TextEmpha;
})();

