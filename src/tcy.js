Nehan.Tcy = (function(){
  /**
     @memberof Nehan
     @class Tcy
     @classdesc abstraction of tcy(tate-chu-yoko) character.
     @constructor
     @param tcy {String}
  */
  function Tcy(tcy){
    this.data = tcy;
    this._type = "tcy";
  }

  Tcy.prototype = {
    /**
       @memberof Nehan.Tcy
       @return {bool}
    */
    isHeadNg: function(){
      return false; // TODO
    },
    /**
       @memberof Nehan.Tcy
       @return {bool}
    */
    isTailNg: function(){
      return false; // TODO
    },
    /**
       @memberof Nehan.Tcy
       @return {string}
     */
    getData : function(){
      return this.data;
    },
    /**
       @memberof Nehan.Tcy
       @return {int}
    */
    getCharCount : function(){
      return 1;
    },
    /**
       @memberof Nehan.Tcy
       @return {int}
    */
    getAdvance : function(flow, letter_spacing){
      return this.bodySize + letter_spacing;
    },
    /**
       @memberof Nehan.Char
       @return {Object}
    */
    getCssVert : function(line){
      var css = {};
      css["text-align"] = "center";
      css["font-family"] = "monospace";
      css["font-weight"] = "normal";
      return css;
    },
    /**
       @memberof Nehan.Char
       @return {Object}
    */
    getCssHori : function(line){
      var css = {};
      if(this.data.length === 1){
	css.display = "inline-block";
	css.width = "1em";
	css["text-align"] = "center";
      }
      return css;
    },
    /**
       @memberof Nehan.Tcy
       @return {boolean}
    */
    hasMetrics : function(){
      return (typeof this.bodySize != "undefined");
    },
    /**
       @memberof Nehan.Tcy
       @param flow {Nehan.BoxFlow}
       @param font {Nehan.Font}
    */
    setMetrics : function(flow, font){
      if(flow.isTextVertical()){
	this.bodySize = font.size;
      } else {
	this.bodySize = (this.data.length <= 1)? font.size : Math.floor(1.2 * font.size);
      }
    }
  };

  return Tcy;
})();

