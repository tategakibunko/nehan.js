/**
   pre defined logical float direction collection.
   @namespace Nehan.FloatDirections
 */
var FloatDirections = {
  /**
     @memberof Nehan.FloatDirections
     @type {Nehan.FloatDirection}
  */
  start:(new FloatDirection("start")),
  /**
     @memberof Nehan.FloatDirections
     @type {Nehan.FloatDirection}
  */
  end:(new FloatDirection("end")),
  /**
     @memberof Nehan.FloatDirections
     @type {Nehan.FloatDirection}
  */
  none:(new FloatDirection("none")),
  /**
     get {@link Nehan.FloatDirection} by float name.
     
     @memberof Nehan.FloatDirections
     @param name {String} - "start" or "end" or "none"
     @return {Nehan.FloatDirection}
  */
  get : function(name){
    return this[name] || null;
  }
};
