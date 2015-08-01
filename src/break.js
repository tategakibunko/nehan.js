Nehan.Break = (function(){
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

  /**
   @memberof Nehan.Break
   @return {boolean}
   */
  Break.prototype.isAlways = function(){
    return this.value === "always";
  };
  /**
   @memberof Nehan.Break
   @return {boolean}
   */
  Break.prototype.isAvoid = function(){
    return this.value === "avoid";
  };
  /**
   true if breaking at first page of 2-page spread.
   @memberof Nehan.Break
   @return {boolean}
   */
  Break.prototype.isFirst = function(flow){
    return flow.isLeftToRight()? (this.value === "left") : (this.value === "right");
  };
  /**
   true if breaking at second page of 2-page spread.
   @memberof Nehan.Break
   @return {boolean}
   */
  Break.prototype.isSecond = function(flow){
    return flow.isLeftToRight()? (this.value === "right") : (this.value === "left");
  };
  /**
   (TODO)
   @memberof Nehan.Break
   @param order {int}
   @return {boolean}
   */
  Break.prototype.isNth = function(order){
  };

  return Break;
})();

