Nehan.TextEmpha = (function(){
  /**
     @memberof Nehan
     @class TextEmpha
     @classdesc abstraction of text emphasis.
     @constructor
     @param opt {Object}
     @param opt.style {Nehan.TextEmphaStyle}
     @param opt.position {Nehan.TextEmphaPos}
     @param opt.color {Nehan.Color}
  */
  function TextEmpha(opt){
    opt = opt || {};
    this.style = opt.style || new Nehan.TextEmphaStyle();
    this.position = opt.position || new Nehan.TextEmphaPos();
    this.color = opt.color || new Nehan.Color(Nehan.Config.defaultFontColor);
  }

  /**
   @memberof Nehan.TextEmpha
   @return {boolean}
   */
  TextEmpha.prototype.isEnable = function(){
    return this.style && this.style.isEnable();
  };
  /**
   get text of empha style, see {@link Nehan.TextEmphaStyle}.

   @memberof Nehan.TextEmpha
   @return {String}
   */
  TextEmpha.prototype.getText = function(){
    return this.style? this.style.getText() : "";
  };
  /**
   @memberof Nehan.TextEmpha
   @return {int}
   */
  TextEmpha.prototype.getExtent = function(font_size){
    return font_size * 3;
  };
  /**
   @memberof Nehan.TextEmpha
   @param line {Nehan.Box}
   @param chr {Nehan.Char}
   @return {Object}
   */
  TextEmpha.prototype.getCssVertEmphaWrap = function(line, chr){
    var css = {}, font_size = line.context.style.getFontSize();
    css["text-align"] = "left";
    css.width = this.getExtent(font_size) + "px";
    css.height = chr.getAdvance(line.context.style.flow, line.context.style.letterSpacing || 0) + "px";
    css.position = "relative";
    return css;
  };
  /**
   @memberof Nehan.TextEmpha
   @param line {Nehan.Box}
   @param chr {Nehan.Char}
   @return {Object}
   */
  TextEmpha.prototype.getCssHoriEmphaWrap = function(line, chr){
    var css = {}, font_size = line.context.style.getFontSize();
    css.display = "inline-block";
    css.width = chr.getAdvance(line.context.style.flow, line.context.style.letterSpacing) + "px";
    css.height = this.getExtent(font_size) + "px";
    return css;
  };

  return TextEmpha;
})();

