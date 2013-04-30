var Event = {
  _sources:{
    // if vertical, aligned to start direction,
    // horizontal, aligned to end direction
    ".nehan-aside":{
      "onReadyBox": function(opt){
	var box = opt.box;
	box.blockAlign = box.isTextVertical()? "start" : "end";
      }
    }
  },
  _getSource : function(key){
    return this._sources[key] || null;
  },
  _getHandler : function(key, name){
    var source = this._sources[key] || null;
    if(source){
      return source[name] || null;
    }
    return null;
  },
  isEnable : function(name){
    return Config.enableEvents[name] || false;
  },
  callHandlers : function(keys, name, opt){
    var self = this;
    List.iter(keys, function(key){
      self.callHandler(key, name, opt);
    });
  },
  callHandler : function(key, name, opt){
    var handler = this._getHandler(key, name);
    if(handler){
      return handler(opt);
    }
  },
  addEventListener : function(key, name, fn){
    var source = this._getSource(key);
    if(source === null){
      source = {};
      this._sources[key] = source;
    }
    if(typeof source[name] === "undefined"){
      source[name] = fn;
    }
  }
};

