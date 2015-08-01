Nehan.TextAlign = (function(){
  /**
     @memberof Nehan
     @class TextAlign
     @classdesc abstraction of logical text align(start, end, center)
     @constructor
     @param value {String} - logical align direction, "start" or "end" or "center"
  */
  function TextAlign(value){
    this.value = value || "start";
  }

  /**
   @memberof Nehan.TextAlign
   @return {boolean}
   */
  TextAlign.prototype.isStart = function(){
    return this.value === "start";
  };
  /**
   @memberof Nehan.TextAlign
   @return {boolean}
   */
  TextAlign.prototype.isEnd = function(){
    return this.value === "end";
  };
  /**
   @memberof Nehan.TextAlign
   @return {boolean}
   */
  TextAlign.prototype.isCenter = function(){
    return this.value === "center";
  };
  /**
   @memberof Nehan.TextAlign
   @return {boolean}
   */
  TextAlign.prototype.isJustify = function(){
    return this.value === "justify";
  };

  return TextAlign;
})();

