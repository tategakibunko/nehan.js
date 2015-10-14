// http://www.w3.org/TR/css3-text/#word-break-property
Nehan.WordBreak = (function(){
  /**
     @memberof Nehan
     @class WordBreak
     @classdesc abstract for css word-break property.
     @constructor
     @param value {String} - keep-all/normal/break-all
  */
  function WordBreak(value){
    this.value = value;
  }

  /**
   @memberof Nehan.WordBreak
   @return {boolean}
   */
  WordBreak.prototype.isWordBreakAll = function(){
    return this.value === "break-all";
  };

  /**
   @memberof Nehan.WordBreak
   @return {boolean}
   */
  WordBreak.prototype.isHyphenationEnable = function(){
    return this.value === "normal" || this.value === "break-all";
  };

  return WordBreak;
})();

