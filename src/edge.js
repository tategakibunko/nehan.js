var Edge = (function(){
  /**
     @memberof Nehan
     @class Edge
     @classdesc abstraction of physical edge size for each css directions(top, right, bottom, left).
     @constructor
     @param type {String} - "margin" or "padding" or "border"
  */
  function Edge(type){
    this._type = type;
    this.top = 0;
    this.right = 0;
    this.bottom = 0;
    this.left = 0;
  }

  Edge.prototype = {
    /**
       @memberof Nehan.Edge
    */
    clear : function(){
      this.top = 0;
      this.right = 0;
      this.bottom = 0;
      this.left = 0;
    },
    /**
       @memberof Nehan.Edge
    */
    clearBefore : function(flow){
      this[flow.getPropBefore()] = 0;
    },
    /**
       @memberof Nehan.Edge
    */
    clearAfter : function(flow){
      this[flow.getPropAfter()] = 0;
    },
    /**
       @memberof Nehan.Edge
       @param dst {Nehan.Edge}
       @return {Nehan.Edge}
    */
    copyTo : function(dst){
      var self = this;
      Nehan.List.iter(Nehan.Const.cssBoxDirs, function(dir){
	dst[dir] = self[dir];
      });
      return dst;
    },
    /**
       @memberof Nehan.Edge
       @param dir {String} - "top", "right", "bottom", "left"
       @return {String}
    */
    getDirProp : function(dir){
      return [this._type, dir].join("-");
    },
    /**
       @memberof Nehan.Edge
       @return {Object}
    */
    getCss : function(){
      var css = {};
      var self = this;
      Nehan.List.iter(["top", "right", "bottom", "left"], function(dir){
	var value = self[dir];
	if(value > 0){
	  css[self.getDirProp(dir)] = self[dir] + "px";
	}
      });
      return css;
    },
    /**
       @memberof Nehan.Edge
       @return {int}
    */
    getWidth : function(){
      return this.left + this.right;
    },
    /**
       @memberof Nehan.Edge
       @return {int}
    */
    getHeight : function(){
      return this.top + this.bottom;
    },
    /**
       @memberof Nehan.Edge
       @param flow {Nehan.BoxFlow}
       @return {int}
    */
    getMeasure : function(flow){
      return flow.isTextVertical()? this.getHeight() : this.getWidth();
    },
    /**
       @memberof Nehan.Edge
       @param flow {Nehan.BoxFlow}
       @return {int}
    */
    getExtent : function(flow){
      return flow.isBlockflowVertical()? this.getHeight() : this.getWidth();
    },
    /**
       @memberof Nehan.Edge
       @param flow {Nehan.BoxFlow}
       @param size {Object}
       @param size.top {int}
       @param size.right {int}
       @param size.bottom {int}
       @param size.left {int}
    */
    setSize : function(flow, size){
      Nehan.BoxRect.setValue(this, flow, size);
    },
    /**
       @memberof Nehan.Edge
       @param flow {Nehan.BoxFlow}
       @param value {int}
    */
    setStart : function(flow, value){
      this[flow.getPropStart()] = value;
    },
    /**
       @memberof Nehan.Edge
       @param flow {Nehan.BoxFlow}
       @param value {int}
    */
    setEnd : function(flow, value){
      this[flow.getPropEnd()] = value;
    },
    /**
       @memberof Nehan.Edge
       @param flow {Nehan.BoxFlow}
       @param value {int}
    */
    setBefore : function(flow, value){
      this[flow.getPropBefore()] = value;
    },
    /**
       @memberof Nehan.Edge
       @param flow {Nehan.BoxFlow}
       @param value {int}
    */
    setAfter : function(flow, value){
      this[flow.getPropAfter()] = value;
    },
    /**
       @memberof Nehan.Edge
       @param flow {Nehan.BoxFlow}
       @return {int}
    */
    getStart : function(flow){
      return this[flow.getPropStart()];
    },
    /**
       @memberof Nehan.Edge
       @param flow {Nehan.BoxFlow}
       @return {int}
    */
    getEnd : function(flow){
      return this[flow.getPropEnd()];
    },
    /**
       @memberof Nehan.Edge
       @param flow {Nehan.BoxFlow}
       @return {int}
    */
    getBefore : function(flow){
      return this[flow.getPropBefore()];
    },
    /**
       @memberof Nehan.Edge
       @param flow {Nehan.BoxFlow}
       @return {int}
    */
    getAfter : function(flow){
      return this[flow.getPropAfter()];
    },
    /**
       @memberof Nehan.Edge
       @param flow {Nehan.BoxFlow}
       @param name {String} - before, end, after, start
    */
    setByName : function(flow, name, value){
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
    },
    /**
       @memberof Nehan.Edge
       @param flow {Nehan.BoxFlow}
       @param name {String} - before, end, after, start
       @return {int}
    */
    getByName : function(flow, name){
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
    }
  };

  return Edge;
})();
