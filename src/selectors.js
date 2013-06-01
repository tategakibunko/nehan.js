var Selectors = (function(){
  var selectors = [];
  // initialize default selectors
  for(var key in Style){
    selectors.push(new Selector(key, Style[key]));
  }

  var merge_edge = function(edge1, edge2){
    // conv both edge to standard edge format({before:x, end:x, after:x, start:x}).
    var std_edge1 = EdgeParser.parse(edge1);
    var std_edge2 = EdgeParser.parse(edge2);
    return Args.copy(std_edge1, std_edge2);
  };

  var merge = function(dst, obj){
    for(var prop in obj){
      // edge value is constructed with multiple values, so need to merge.
      if(prop === "margin" || prop === "border" || prop === "padding"){
	dst[prop] = dst[prop]? merge_edge(dst[prop], obj[prop]) : obj[prop];
      } else {
	dst[prop] = obj[prop];
      }
    }
    return dst;
  };

  var get_selector_value = function(selector_key){
    return List.fold(selectors, {}, function(ret, selector){
      return selector.test(selector_key)? merge(ret, selector.getValue()) : ret;
    });
  };

  return {
    addSelector : function(selector_key){
      if(!List.exists(selectors, function(selector){ return selector.getKey() === selector_key; })){
	selectors.push(new Selector(selector_key, Style[selector_key]));
      }
    },
    getValue : function(selector_keys){
      return List.fold(selector_keys, {}, function(ret, selector_key){
	return merge(ret, get_selector_value(selector_key));
      });
    }
  };
})();
