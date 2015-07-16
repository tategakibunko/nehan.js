Nehan.Clear = (function(){
  /**
   @memberof Nehan
   @class Clear
   @classdesc abstraction of logical float clearance.
   @constructor
   @param direction {String} - "start" or "end" or "both"
   */
  function Clear(direction){
    this.status = this._createStatus(direction || "both");
  }

  Clear.prototype = {
    _createStatus : function(direction){
      var status = {};
      switch(direction){
      case "start": case "end":
	status[direction] = false;
	break;
      case "both":
	status.start = status.end = false;
	break;
      }
      return status;
    },
    /**
     @memberof Nehan.Clear
     @param direction {String}
     @return {bool}
     */
    hasDirection : function(direction){
      return (typeof this.status[direction]) !== "undefined";
    },
    /**
     @memberof Nehan.Clear
     @param direction {String}
     */
    setDone : function(direction){
      this.status[direction] = true;
    },
    /**
     @memberof Nehan.Clear
     @param direction {String}
     @return {bool}
     */
    isDone : function(direction){
      return this.status[direction];
    }
  };

  return Clear;
})();
