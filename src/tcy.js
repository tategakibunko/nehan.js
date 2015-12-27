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
  }

  /**
   @memberof Nehan.Tcy
   @return {bool}
   */
  Tcy.prototype.isHeadNg = function(){
    return false; // TODO
  };
  /**
   @memberof Nehan.Tcy
   @return {bool}
   */
  Tcy.prototype.isTailNg = function(){
    return false; // TODO
  };
  /**
   @memberof Nehan.Tcy
   @return {string}
   */
  Tcy.prototype.getData = function(){
    return this.data;
  };
  /**
   @memberof Nehan.Tcy
   @return {int}
   */
  Tcy.prototype.getCharCount = function(){
    return 1;
  };
  /**
   @memberof Nehan.Tcy
   @return {int}
   */
  Tcy.prototype.getAdvance = function(flow, letter_spacing){
    return this.bodySize + letter_spacing;
  };
  /**
   @memberof Nehan.Char
   @return {Object}
   */
  Tcy.prototype.getCssVert = function(line){
    var css = {};
    css["text-align"] = "center";
    // if native text-combine-upright is not supported,
    // use normal font-weight.
    if(!Nehan.Env.isTextCombineEnable){
      css["font-weight"] = "normal";
    }
    css["word-break"] = "normal";
    css["height"] = "1em"; // for IE
    return css;
  };
  /**
   @memberof Nehan.Char
   @return {Object}
   */
  Tcy.prototype.getCssHori = function(line){
    var css = {};
    if(this.data.length === 1){
      css.display = "inline-block";
      //css.width = "1em";
      css.width = this.bodySize + "px";
      css["text-align"] = "center";
    }
    return css;
  };
  /**
   @memberof Nehan.Tcy
   @return {boolean}
   */
  Tcy.prototype.hasMetrics = function(){
    return (typeof this.bodySize != "undefined");
  };
  /**
   @memberof Nehan.Tcy
   @param flow {Nehan.BoxFlow}
   @param font {Nehan.Font}
   */
  Tcy.prototype.setMetrics = function(flow, font){
    if(flow.isTextVertical()){
      this.bodySize = font.size;
    } else {
      this.bodySize = (this.data.length <= 1)? font.size : Math.floor(1.2 * font.size);
    }
  };

  return Tcy;
})();

