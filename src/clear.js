Nehan.Clear = (function(){
  /**
   @memberof Nehan
   @class Clear
   @classdesc abstraction of logical float clearance.
   @constructor
   @param direction {String} - "start" or "end" or "both"
   */
  function Clear(direction){
    this.value = direction;
    this.status = this._createStatus(direction || "both");
  }

  /**
   @memberof Nehan.Clear
   @param direction {String}
   @return {bool}
   */
  Clear.prototype.hasDirection = function(direction){
    return (typeof this.status[direction]) !== "undefined";
  };
  /**
   @memberof Nehan.Clear
   @param direction {String}
   */
  Clear.prototype.setDone = function(direction){
    this.status[direction] = true;
  };
  /**
   @memberof Nehan.Clear
   @param direction {String}
   @return {bool}
   */
  Clear.prototype.isDone = function(direction){
    return this.status[direction];
  };
  /**
   @memberof Nehan.Clear
   @param direction {String}
   @return {bool}
   */
  Clear.prototype.isDoneAll = function(){
    return Nehan.Obj.forall(this.status, function(prop, state){
      return state === true;
    });
  };

  Clear.prototype._createStatus = function(direction){
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
  };

  return Clear;
})();
