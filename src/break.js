var Break = (function(){
  /**
     @memberof Nehan
     @class Break
     @classdesc logical abstraction for css 'page-break-before' or 'page-break-after'
     @constructor
     @param value {string} - "always" or "avoid" or "left" or "right"
   */
  function Break(value){
    this.value = value;
  }

  Break.prototype = {
    /**
       @memberof Nehan.Break
       @return {boolean}
     */
    isAlways : function(){
      return this.value === "always";
    },
    /**
       @memberof Nehan.Break
       @return {boolean}
     */
    isAvoid : function(){
      return this.value === "avoid";
    },
    /**
       @memberof Nehan.Break
       @return {boolean}
     */
    isFirst : function(){
      return (Display.getPagingDirection() === "lr")? (this.value === "left") : (this.value === "right");
    },
    /**
       @memberof Nehan.Break
       @return {boolean}
     */
    isSecond : function(){
      return (Display.getPagingDirection() === "lr")? (this.value === "right") : (this.value === "left");
    },
    /**
       (TODO)
       @memberof Nehan.Break
       @param order {int}
       @return {boolean}
     */
    isNth : function(order){
    }
  };

  return Break;
})();

