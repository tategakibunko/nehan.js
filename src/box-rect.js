/**
   utility module for abstract box model.

   @namespace Nehan.BoxRect
*/
Nehan.BoxRect = {
  /**
   @memberof Nehan.BoxRect
   @param dst {Object}
   @param flow {Nehan.BoxFlow}
   @param values {Object}
   @param values.before - before value
   @param values.end - end value
   @param values.after - after value
   @param values.start - start value
   */
  setLogicalValues : function(dst, flow, values){
    // set before, end, after, start value
    for(var prop in values){
      dst[flow.getProp(prop)] = values[prop];
    }
    return dst;
  },
  /**
   @memberof Nehan.BoxRect
   @param dst {Object}
   @param flow {Nehan.BoxFlow}
   @param value
   */
  setBefore : function(dst, flow, value){
    dst[flow.getPropBefore()] = value;
  },
  /**
   @memberof Nehan.BoxRect
   @param dst {Object}
   @param flow {Nehan.BoxFlow}
   @param value
   */
  setAfter : function(dst, flow, value){
    dst[flow.getPropAfter()] = value;
  },
  /**
   @memberof Nehan.BoxRect
   @param dst {Object}
   @param flow {Nehan.BoxFlow}
   @param value
   */
  setStart : function(dst, flow, value){
    dst[flow.getPropStart()] = value;
  },
  /**
   @memberof Nehan.BoxRect
   @param dst {Object}
   @param flow {Nehan.BoxFlow}
   @param value
   */
  setEnd : function(dst, flow, value){
    dst[flow.getPropEnd()] = value;
  }
};

