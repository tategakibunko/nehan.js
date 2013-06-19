var Selectors = (function(){
  var selectors = [];

  // initialize default selectors
  for(var selector_key in Style){
    selectors.push(new Selector(selector_key, Style[selector_key]));
  }

  var merge_edge = function(edge1, edge2, prop){
    // conv both edge to standard edge format({before:x, end:x, after:x, start:x}).
    var std_edge1 = EdgeParser.normalize(edge1, prop);
    var std_edge2 = EdgeParser.normalize(edge2, prop);
    return Args.copy(std_edge1, std_edge2);
  };

  var merge = function(dst, obj){
    for(var prop in obj){
      switch(prop){
      case "margin":
      case "padding":
      case "border-width":
      case "border-radius":
      case "border-style":
      case "border-color":
	//dst[prop] = dst[prop]? merge_edge(dst[prop], obj[prop], prop) : obj[prop];
	dst[prop] = merge_edge(dst[prop] || {}, obj[prop], prop);
	break;
      default:
	dst[prop] = obj[prop];
	break;
      }
    }
    return dst;
  };

  return {
    setValue : function(selector_key, value){
      var old_value = Style[selector_key] || null;
      if(old_value){
	merge(old_value, value);
      } else {
	Style[selector_key] = value;
	selectors.push(new Selector(selector_key, value));
      }
    },
    getValue : function(selector_key){
      return List.fold(selectors, {}, function(ret, selector){
	return selector.test(selector_key)? merge(ret, selector.getValue()) : ret;
      });
    },
    getMergedValue : function(selector_keys){
      var self = this;
      return List.fold(selector_keys, {}, function(ret, selector_key){
	return merge(ret, self.getValue(selector_key));
      });
    }
  };
})();
