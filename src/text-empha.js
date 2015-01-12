var TextEmpha = (function(){
  /**
     @memberof Nehan
     @class TextEmpha
     @classdesc abstraction of text emphasis.
     @constructor
     @param opt {Object}
     @param opt.style {Nehan.TextEmphaStyle}
     @param opt.pos {Nehan.TextEmphaPos}
     @param opt.color {Nehan.Color}
  */
  function TextEmpha(opt){
    opt = opt || {};
    this.style = opt.style || new TextEmphaStyle();
    this.pos = opt.pos || new TextEmphaPos();
    this.color = opt.color || new Color(Display.fontColor);
  }

  TextEmpha.prototype = {
    /**
       @memberof Nehan.TextEmpha
       @return {boolean}
    */
    isEnable : function(){
      return this.style && this.style.isEnable();
    },
    /**
       get text of empha style, see {@link Nehan.TextEmphaStyle}.

       @memberof Nehan.TextEmpha
       @return {String}
    */
    getText : function(){
      return this.style? this.style.getText() : "";
    },
    /**
       @memberof Nehan.TextEmpha
       @return {int}
    */
    getExtent : function(font_size){
      return font_size * 3;
    },
    /**
       @memberof Nehan.TextEmpha
       @param line {Nehan.Box}
       @param chr {Nehan.Char}
       @return {Object}
    */
    getCssVertEmphaWrap : function(line, chr){
      var css = {}, font_size = line.style.getFontSize();
      css["text-align"] = "left";
      css.width = this.getExtent(font_size) + "px";
      css.height = chr.getAdvance(line.style.flow, line.style.letterSpacing || 0) + "px";
      return css;
    },
    /**
       @memberof Nehan.TextEmpha
       @param line {Nehan.Box}
       @param chr {Nehan.Char}
       @return {Object}
    */
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

