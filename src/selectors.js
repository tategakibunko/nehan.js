var Selectors = (function(){
  var selectors = [];

  // initialize default selectors
  for(var selector_key in Style){
    selectors.push(new Selector(selector_key, Style[selector_key]));
  }

  var is_edge_prop = function(prop){
    return (prop === "margin" ||
	    prop === "padding" ||
	    prop === "border-width" ||
	    prop === "border-radius");
  };

  var merge_edge = function(edge1, edge2){
    // conv both edge to standard edge format({before:x, end:x, after:x, start:x}).
    var std_edge1 = EdgeParser.parse(edge1);
    var std_edge2 = EdgeParser.parse(edge2);
    return Args.copy(std_edge1, std_edge2);
  };

  var merge = function(dst, obj){
    for(var prop in obj){
      // edge value is constructed with multiple values, so need to merge.
      if(is_edge_prop(prop)){
	dst[prop] = dst[prop]? merge_edge(dst[prop], obj[prop]) : obj[prop];
      } else {
	dst[prop] = obj[prop];
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
