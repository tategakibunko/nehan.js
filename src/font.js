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
   */
  Font.prototype.inherit = function(font){
    if(this.size === "inherit" && font.size){
      this.size = font.size;
    }
    if(this.family === "inherit" && font.family){
      this.family = font.family;
    }
    if(this.weight === "inherit" && font.weight){
      this.weight = font.weight;
    }
    if(this.style === "inherit" && font.style){
      this.style = font.style;
    }
    if(this.variant === "inherit" && font.variant){
      this.variant = font.variant;
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
	    this.style === font.style);
  };
  /**
   @memberof Nehan.Font
   @return {string}
   */
  Font.prototype.toString = function(){
    return [
      this.weight || "normal",
      this.style || "normal",
      this.size + "px",
      this.family || "monospace"
    ].join(" ");
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
    return css;
  };

  return Font;
})();

