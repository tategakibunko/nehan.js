Nehan.Edge = (function(){
  /**
   @memberof Nehan
   @class Edge
   @classdesc abstraction of physical edge size for each css directions(top, right, bottom, left).
   @constructor
   */
  function Edge(){
    this.top = 0;
    this.right = 0;
    this.bottom = 0;
    this.left = 0;
  }

  /**
   @memberof Nehan.Edge
   @return {String}
   */
  Edge.prototype.getType = function(){
    throw "Edge::getType must be implemented in subclass";
  };

  /**
   @memberof Nehan.Edge
   */
  Edge.prototype.clear = function(){
    this.top = 0;
    this.right = 0;
    this.bottom = 0;
    this.left = 0;
  };
  /**
   @memberof Nehan.Edge
   */
  Edge.prototype.clearBefore = function(flow){
    this[flow.getPropBefore()] = 0;
  };
  /**
   @memberof Nehan.Edge
   */
  Edge.prototype.clearAfter = function(flow){
    this[flow.getPropAfter()] = 0;
  };
  /**
   @memberof Nehan.Edge
   @param size {int}
   */
  Edge.prototype.subtractAfter = function(flow, size){
    var prop = flow.getPropAfter();
    this[prop] = Math.max(0, this[prop] - size);
  };
  /**
   @memberof Nehan.Edge
   @param flow {Nehan.BoxFlow}
   @param required_size {int}
   @return {int} - canceled size
   */
  Edge.prototype.cancelAfter = function(flow, required_size){
    var after_size = this.getAfter(flow);
    if(after_size <= 0){
      return 0;
    }
    var cancel_size = (after_size >= required_size)? required_size : after_size;
    this.subtractAfter(flow, cancel_size);
    //console.warn("cancel after(%s):(after size = %d, required = %d, cancel = %d)", this.getType(), after_size, required_size, cancel_size);
    return cancel_size;
  };
  /**
   @memberof Nehan.Edge
   @param dst {Nehan.Edge}
   @return {Nehan.Edge}
   */
  Edge.prototype.copyTo = function(dst){
    Nehan.List.iter(Nehan.Const.cssPhysicalBoxDirs, function(dir){
      dst[dir] = this[dir];
    }.bind(this));
    return dst;
  };
  /**
   @memberof Nehan.Edge
   @param dir {String} - "top", "right", "bottom", "left"
   @return {String}
   */
  Edge.prototype.getDirProp = function(dir){
    return [this.getType(), dir].join("-");
  };
  /**
   @memberof Nehan.Edge
   @return {Object}
   */
  Edge.prototype.getCss = function(){
    return Nehan.Const.cssPhysicalBoxDirs.reduce(function(css, dir){
      var value = this[dir];
      if(value > 0){
	css[this.getDirProp(dir)] = value + "px";
      }
      return css;
    }.bind(this), {});
  };
  /**
   @memberof Nehan.Edge
   @return {int}
   */
  Edge.prototype.getWidth = function(){
    return this.left + this.right;
  };
  /**
   @memberof Nehan.Edge
   @return {int}
   */
  Edge.prototype.getHeight = function(){
    return this.top + this.bottom;
  };
  /**
   @memberof Nehan.Edge
   @param flow {Nehan.BoxFlow}
   @return {int}
   */
  Edge.prototype.getMeasure = function(flow){
    return flow.isTextVertical()? this.getHeight() : this.getWidth();
  };
  /**
   @memberof Nehan.Edge
   @param flow {Nehan.BoxFlow}
   @return {int}
   */
  Edge.prototype.getExtent = function(flow){
    return flow.isBlockflowVertical()? this.getHeight() : this.getWidth();
  };
  /**
   @memberof Nehan.Edge
   @param flow {Nehan.BoxFlow}
   @param values {Object}
   @param values.before {int}
   @param values.end {int}
   @param values.after {int}
   @param values.start {int}
   */
  Edge.prototype.setSize = function(flow, values){
    Nehan.BoxRect.setLogicalValues(this, flow, values);
    return this;
  };
  /**
   @memberof Nehan.Edge
   @param flow {Nehan.BoxFlow}
   @param value {int}
   */
  Edge.prototype.setStart = function(flow, value){
    this[flow.getPropStart()] = value;
  };
  /**
   @memberof Nehan.Edge
   @param flow {Nehan.BoxFlow}
   @param value {int}
   */
  Edge.prototype.setEnd = function(flow, value){
    this[flow.getPropEnd()] = value;
  };
  /**
   @memberof Nehan.Edge
   @param flow {Nehan.BoxFlow}
   @param value {int}
   */
  Edge.prototype.setBefore = function(flow, value){
    this[flow.getPropBefore()] = value;
  };
  /**
   @memberof Nehan.Edge
   @param flow {Nehan.BoxFlow}
   @param value {int}
   */
  Edge.prototype.setAfter = function(flow, value){
    this[flow.getPropAfter()] = value;
  };
  /**
   @memberof Nehan.Edge
   @param flow {Nehan.BoxFlow}
   @return {int}
   */
  Edge.prototype.getStart = function(flow){
    return this[flow.getPropStart()];
  };
  /**
   @memberof Nehan.Edge
   @param flow {Nehan.BoxFlow}
   @return {int}
   */
  Edge.prototype.getEnd = function(flow){
    return this[flow.getPropEnd()];
  };
  /**
   @memberof Nehan.Edge
   @param flow {Nehan.BoxFlow}
   @return {int}
   */
  Edge.prototype.getBefore = function(flow){
    return this[flow.getPropBefore()];
  };
  /**
   @memberof Nehan.Edge
   @param flow {Nehan.BoxFlow}
   @return {int}
   */
  Edge.prototype.getAfter = function(flow){
    return this[flow.getPropAfter()];
  };
  /**
   @memberof Nehan.Edge
   @param flow {Nehan.BoxFlow}
   @param name {String} - before, end, after, start
   */
  Edge.prototype.setByName = function(flow, name, value){
    switch(name){
    case "before":
      this.setBefore(flow, value);
      break;
    case "end":
      this.setEnd(flow, value);
      break;
    case "after":
      this.setAfter(flow, value);
      break;
    case "start":
      this.setStart(flow, value);
      break;
    default:
      console.error("Edge::setByName, undefined direction:", name);
    }
  };
  /**
   @memberof Nehan.Edge
   @param flow {Nehan.BoxFlow}
   @param name {String} - before, end, after, start
   @return {int}
   */
  Edge.prototype.getByName = function(flow, name){
    switch(name){
    case "before":
      return this.getBefore(flow);
    case "end":
      return this.getEnd(flow);
    case "after":
      return this.getAfter(flow);
    case "start":
      return this.getStart(flow);
    default:
      consolo.error("Edge::getByName, undefined direction:", name);
      return 0;
    }
  };

  return Edge;
})();
