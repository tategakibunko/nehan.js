Nehan.Font = (function(){
  /**
   @memberof Nehan
   @class Font
   @classdesc css 'font' abstraction
   @constructor
   @param opt {Object}
  */
  function Font(opt){
    opt = opt || {};
    this.size = opt.size || "inherit";
    this.family = opt.family || "inherit";
    this.weight = opt.weight || "inherit";
    this.style = opt.style || "inherit";
    this.variant = opt.variant || "inherit";
    this.lineHeight = opt.lineHeight || "inherit";
  }

  /**
   @memberof Nehan.Font
   @return {boolean}
   */
  Font.prototype.isBold = function(){
    return this.weight && this.weight !== "normal" && this.weight !== "lighter";
  };
  /**
   @memberof Nehan.Font
   @param parent {Nehan.Font} - parent font
   */
  Font.prototype.inherit = function(parent){
    if(this.size === "inherit" && parent.size){
      this.size = parent.size;
    }
    if(this.family === "inherit" && parent.family){
      this.family = parent.family;
    }
    if(this.weight === "inherit" && parent.weight){
      this.weight = parent.weight;
    }
    if(this.style === "inherit" && parent.style){
      this.style = parent.style;
    }
    if(this.variant === "inherit" && parent.variant){
      this.variant = parent.variant;
    }
    if(this.lineHeight === "inherit" && parent.lineHeight){
      this.lineHeight = parent.lineHeight;
    }
  };
  /**
   @memberof Nehan.Font
   @param {Nehan.Font}
   @return {boolean}
   */
  Font.prototype.isEqual = function(font){
    return (this.size === font.size &&
	    this.family === font.family &&
	    this.weight === font.weight &&
	    this.variant === font.variant &&
	    this.lineHeight === font.lineHeight &&
	    this.style === font.style);
  };
  /**
   @memberof Nehan.Font
   @return {string}
   */
  Font.prototype.getCssShorthand = function(){
    var size = this.size + "px";
    var variant = (this.variant === "inherit")? "" : this.variant;
    if(this.lineHeight !== "inherit"){
      size = [size, this.lineHeight].join("/");
    }
    return [
      this.weight || "normal",
      this.style || "normal",
      variant,
      size,
      this.family || Nehan.Config.defaultFontFamily
    ].filter(Nehan.Closure.neq("")).join(" ");
  };
  /**
   @memberof Nehan.Font
   @return {Object}
   */
  Font.prototype.getCss = function(){
    var css = {};
    if(this.size){
      css["font-size"] = this.size + "px";
    }
    if(this.weight){
      css["font-weight"] = this.weight;
    }
    if(this.style){
      css["font-style"] = this.style;
    }
    if(this.family){
      css["font-family"] = this.family;
    }
    if(this.variant){
      css["font-variant"] = this.variant;
    }
    return css;
  };

  return Font;
})();

