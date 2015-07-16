Nehan.Clear = (function(){
  /**
   @memberof Nehan
   @class Clear
   @classdesc abstraction of logical float clearance.
   @constructor
   @param direction {String} - "start" or "end" or "both"
   */
  function Clear(direction){
    this.direction = direction || "both";
    this.done = false;
  }

  Clear.prototype = {
    /**
     @memberof Nehan.Clear
     @param status {bool}
     */
    setDone : function(status){
      this.done = status;
    },
    /**
     @memberof Nehan.Clear
     @return {bool}
     */
    isDone : function(){
      return this.done;
    },
    /**
     @memberof Nehan.Clear
     @return {bool}
     */
    isStart : function(){
      return this.direction === "start";
    },
    /**
     @memberof Nehan.Clear
     @return {bool}
     */
    isEnd : function(){
      return this.direction === "end";
    },
    /**
     @memberof Nehan.Clear
     @return {bool}
     */
    isBoth : function(){
      return this.direction === "both";
    }
  };

  return Clear;
})();
