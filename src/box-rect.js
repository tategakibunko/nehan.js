var BoxRect = {
  iter : function(obj, fn){
    List.iter(Const.cssBoxDirs, function(dir){
      if(obj[dir]){
	fn(dir, obj[dir]);
      }
    });
  },
  map : function(obj, fn){
    if(obj instanceof Array){
      return List.map(obj, fn);
    }
    if(typeof obj === "object"){
      return Obj.map(obj, fn);
    }
    return fn(obj);
  },
  setValue : function(dst, flow, value){
    if(value instanceof Array){
      this.setByArray(dst, flow, value);
    } else if(typeof value === "object"){
      this.setByObject(dst, flow, value);
    } else {
      this.setAll(dst, value);
    }
    return dst;
  },
  setBefore : function(dst, flow, value){
    dst[flow.getPropBefore()] = value;
  },
  setAfter : function(dst, flow, value){
    dst[flow.getPropAfter()] = value;
  },
  setStart : function(dst, flow, value){
    dst[flow.getPropStart()] = value;
  },
  setEnd : function(dst, flow, value){
    dst[flow.getPropEnd()] = value;
  },
  setByArray : function(dst, flow, value){
    switch(value.length){
    case 1:
      this.setAll(dst, value[0]);
      break;
    case 2:
      this.setBefore(dst, flow, value[0]);
      this.setAfter(dst, flow, value[0]);
      this.setStart(dst, flow, value[1]);
      this.setEnd(dst, flow, value[1]);
      break;
    case 3:
      this.setBefore(dst, flow, value[0]);
      this.setEnd(dst, flow, value[1]);
      this.setStart(dst, flow, value[1]);
      this.setAfter(dst, flow, value[2]);
      break;
    case 4:
      this.setBefore(dst, flow, value[0]);
      this.setEnd(dst, flow, value[1]);
      this.setAfter(dst, flow, value[2]);
      this.setStart(dst, flow, value[3]);
      break;
    }
  },
  setByObject : function(dst, flow, value){
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
  },
  setAll : function(dst, value){
    List.iter(Const.cssBoxDirs, function(dir){
      dst[dir] = value;
    });
  }
};

