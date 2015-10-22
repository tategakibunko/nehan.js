/**
   utility module for box physical direction(top, right, bottom, left).

   @namespace Nehan.BoxRect
*/
Nehan.BoxRect = {
  /**
     iterate all direction of [obj] by [fn]
     @memberof Nehan.BoxRect
     @param obj {Object}
     @param fn {Function}
   */
  iter : function(obj, fn){
    Nehan.Const.cssBoxDirs.forEach(function(dir){
      if(obj[dir]){
	fn(dir, obj[dir]);
      }
    });
  },
  /**
     @memberof Nehan.BoxRect
     @param dst {Object}
     @param flow {Nehan.BoxFlow}
     @param value {Object}
   */
  setValue : function(dst, flow, value){
    if(typeof value.start != "undefined"){
      this.setStart(dst, flow, value.start);
    }
    if(typeof value.end != "undefined"){
      this.setEnd(dst, flow, value.end);
    }
    if(typeof value.before != "undefined"){
      this.setBefore(dst, flow, value.before);
    }
    if(typeof value.after != "undefined"){
      this.setAfter(dst, flow, value.after);
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

