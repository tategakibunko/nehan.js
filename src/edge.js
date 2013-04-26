var Edge = Class.extend({
  init : function(type){
    this._type = type;
    this.top = 0;
    this.right = 0;
    this.bottom = 0;
    this.left = 0;
  },
  clear : function(){
    this.top = 0;
    this.right = 0;
    this.bottom = 0;
    this.left = 0;
  },
  isEnable : function(){
    return this.top !== 0 || this.right !== 0 || this.bottom !== 0 || this.left !== 0;
  },
  getDirProp : function(dir){
    return [this._type, dir].join("-");
  },
  getCss : function(){
    var css = {};
    var self = this;
    List.iter(["top", "right", "bottom", "left"], function(dir){
      var value = self[dir];
      if(value > 0){
	css[self.getDirProp(dir)] = self[dir] + "px";
      }
    });
    return css;
  },
  getWidth : function(){
    return this.left + this.right;
  },
  getHeight : function(){
    return this.top + this.bottom;
  },
  getMeasureSize : function(flow){
    return flow.isTextVertical()? this.getHeight() : this.getWidth();
  },
  getExtentSize : function(flow){
    return flow.isBlockflowVertical()? this.getHeight() : this.getWidth();
  },
  setSize : function(flow, size){
    if(size instanceof Array){
      this.setSizeByArray(flow, size);
    } else if(typeof size == "object"){
      this.setSizeByObj(flow, size);
    } else {
      this.setAll(flow, size);
    }
  },
  setSizeByObj : function(flow, size){
    if(typeof size.start != "undefined"){
      this.setStart(flow, size.start);
    }
    if(typeof size.end != "undefined"){
      this.setEnd(flow, size.end);
    }
    if(typeof size.before != "undefined"){
      this.setBefore(flow, size.before);
    }
    if(typeof size.after != "undefined"){
      this.setAfter(flow, size.after);
    }
  },
  setSizeByArray : function(flow, size){
    switch(size.length){
    case 1:
      this.setAll(flow, size[0]);
      break;
    case 2:
      this.setBefore(flow, size[0]);
      this.setAfter(flow, size[0]);
      this.setStart(flow, size[1]);
      this.setEnd(flow, size[1]);
      break;
    case 3:
      this.setBefore(flow, size[0]);
      this.setEnd(flow, size[1]);
      this.setStart(flow, size[1]);
      this.setAfter(flow, size[2]);
      break;
    case 4:
      this.setBefore(flow, size[0]);
      this.setEnd(flow, size[1]);
      this.setAfter(flow, size[2]);
      this.setStart(flow, size[3]);
      break;
    }
  },
  setAll : function(flow, value){
    this.setSize(flow, {
      start:value,
      end:value,
      before:value,
      after:value
    });
  },
  setStart : function(flow, value){
    this[flow.getPropStart()] = value;
  },
  setEnd : function(flow, value){
    this[flow.getPropEnd()] = value;
  },
  setBefore : function(flow, value){
    this[flow.getPropBefore()] = value;
  },
  setAfter : function(flow, value){
    this[flow.getPropAfter()] = value;
  },
  getStart : function(flow){
    return this[flow.getPropStart()];
  },
  getEnd : function(flow){
    return this[flow.getPropEnd()];
  },
  getBefore : function(flow){
    return this[flow.getPropBefore()];
  },
  getAfter : function(flow){
    return this[flow.getPropAfter()];
  },
  getLogicalSize : function(flow, dir){
    return this[flow.getProp(dir)];
  },
  setLogicalSize : function(flow, dir, val){
    this[flow.getProp(dir)] = val;
  }
});
