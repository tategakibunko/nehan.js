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

  TextAlign.prototype = {
    /**
       @memberof Nehan.TextAlign
       @return {boolean}
    */
    isStart : function(){
      return this.value === "start";
    },
    /**
       @memberof Nehan.TextAlign
       @return {boolean}
    */
    isEnd : function(){
      return this.value === "end";
    },
    /**
       @memberof Nehan.TextAlign
       @return {boolean}
    */
    isCenter : function(){
      return this.value === "center";
    }
  };

  return TextAlign;
})();

