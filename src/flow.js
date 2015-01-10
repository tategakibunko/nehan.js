var Flow = (function(){
  /**
     @memberof Nehan
     @class Flow
     @classdesc abstraction of flow, left to right as "lr", right to left as "rl", top to bottom as "tb".
     @constructor
     @param dir {String}
     @example
     * new Flow("lr").isHorizontal(); // true
     * new Flow("rl").isHorizontal(); // true
     * new Flow("lr").isLeftToRight(); // true
     * new Flow("rl").isLeftToRight(); // false
     * new Flow("rl").isRightToLeft(); // true
     * new Flow("tb").isHorizontal(); // false
     * new Flow("tb").isVertical(); // true
  */
  function Flow(dir){
    this.dir = dir;
  }

  Flow.prototype = {
    /**
       @memberof Nehan.Flow
       @param dir {String}
    */
    init : function(dir){
      this.dir = dir;
    },
    /**
       @memberof Nehan.Flow
       @return {boolean}
    */
    isHorizontal : function(){
      return (this.dir === "lr" || this.dir === "rl");
    },
    /**
       @memberof Nehan.Flow
       @return {boolean}
    */
    isVertical : function(){
      return (this.dir === "tb");
    },
    /**
       @memberof Nehan.Flow
       @return {boolean}
    */
    isLeftToRight : function(){
      return this.dir === "lr";
    },
    /**
       @memberof Nehan.Flow
       @return {boolean}
    */
    isRightToLeft : function(){
      return this.dir === "rl";
    }
  };

  return Flow;
})();

