var Selectors = (function(){
  var selectors = [];

  // initialize default selectors
  for(var selector_key in Style){
    selectors.push(new Selector(selector_key, Style[selector_key]));
  }

  return {
    setValue : function(selector_key, value){
      if(Style[selector_key]){
	Args.copy(Style[selector_key], value);
      } else {
	Style[selector_key] = value;
	selectors.push(new Selector(selector_key, value));
      }
    },
    getValue : function(selector_key){
      return List.fold(selectors, {}, function(ret, selector){
	return selector.test(selector_key)? Args.copy(ret, selector.getValue()) : ret;
      });
    },
    getMergedValue : function(selector_keys){
      var self = this;
      return List.fold(selector_keys, {}, function(ret, selector_key){
	return Args.copy(ret, self.getValue(selector_key));
      });
    }
  };
})();
