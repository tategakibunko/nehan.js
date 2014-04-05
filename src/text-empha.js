var TextEmpha = (function(){
  function TextEmpha(opt){
    opt = opt || {};
    this.style = opt.style || new TextEmphaStyle();
    this.pos = opt.pos || new TextEmphaPos();
    this.color = opt.color || new Color(Layout.fontColor);
  }

  TextEmpha.prototype = {
    isEnable : function(){
      return this.style && this.style.isEnable();
    },
    isEmphaStart : function(){
      return this.pos? this.pos.isEmphaStart() : true;
    },
    getText : function(){
      return this.style? this.style.getText() : "";
    },
    getExtent : function(font_size){
      return font_size * 3;
    },
    getCssVertEmphaWrap : function(line, chr){
      var css = {}, font_size = line.style.getFontSize();
      css["text-align"] = "left";
      css.width = this.getExtent(font_size) + "px";
      css.height = chr.getAdvance(line.style.flow, line.style.letterSpacing || 0) + "px";
      return css;
    },
    getCssHoriEmphaWrap : function(line, chr){
      var css = {}, font_size = line.style.getFontSize();
      css.display = "inline-block";
      css.width = chr.getAdvance(line.style.flow, line.style.letterSpacing) + "px";
      css.height = this.getExtent(font_size) + "px";
      return css;
    }
  };

  return TextEmpha;
})();

