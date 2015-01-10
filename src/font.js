var Font = (function(){
  /**
     @memberof Nehan
     @class Font
     @classdesc css 'font' abstraction
     @constructor
     @param size {int} - font size in px
  */
  function Font(size){
    this.size = size;
  }

  Font.prototype = {
    /**
       @memberof Nehan.Font
       @return {boolean}
    */
    isBold : function(){
      return this.weight && this.weight !== "normal" && this.weight !== "lighter";
    },
    /**
       @memberof Nehan.Font
       @return {string}
    */
    toString : function(){
      return [
	this.weight || "normal",
	this.style || "normal",
	this.size + "px",
	this.family || "monospace"
      ].join(" ");
    },
    /**
       @memberof Nehan.Font
       @return {Object}
    */
    getCss : function(){
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
    }
  };

  return Font;
})();

