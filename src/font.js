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

  var __cascading_props = ["size", "family", "weight", "style", "variant"];

  /**
   @memberof Nehan.Font
   @return {boolean}
   */
  Font.prototype.isBold = function(){
    return this.weight && this.weight !== "normal" && this.weight !== "lighter";
  };
  /**
   @memberof Nehan.Font
   @return {boolean}
   */
  Font.prototype.isItalic = function(){
    return this.style === "italic";
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
      this.style || "normal",
      variant,
      this.weight || "normal",
      size,
      this.family || Nehan.Config.defaultFontFamily
    ].filter(Nehan.Closure.neq("")).join(" ");
  };
  /**
   @memberof Nehan.Font
   @param {Nehan.Font} - parent font
   @return {Object}
   */
  Font.prototype.getCss = function(parent_font){
    var css = {};
    __cascading_props.forEach(function(prop){
      var css_prop = "font-" + prop;
      var value = this[prop] || null;
      if(!value){
	return;
      }
      switch(prop){
      case "size":
	css[css_prop] = value + "px"; break;
      default:
	css[css_prop] = value; break;
      }
      var parent_value = parent_font? (parent_font[prop] || null) : null;
      if(value === parent_value){
	delete css[css_prop]; // use parent value
      }
    }.bind(this));
    //console.log("Font::getCss(parent:%o) = %o", parent_font, css);
    return css;
  };

  return Font;
})();

