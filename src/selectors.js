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
	var selector = new Selector(selector_key, value);
	selectors.push(selector);
	Style[selector_key] = selector.getValue();
      }
    },
    /*
    getValue : function(markup){
      var css = List.fold(selectors, {}, function(ret, selector){
	if(selector.test(markup)){
	  var value = selector.getValue();
	  console.log("%s matches %s:%o", markup.src, selector.key, value);
	  return Args.copy(ret, value);
	}
	return ret;
      });
      console.log("merged value is:%o", css);
      return css;
    }*/
    getValue : function(markup){
      return List.fold(selectors, {}, function(ret, selector){
	return selector.test(markup)? Args.copy(ret, selector.getValue()) : ret;
      });
    }
  };
})();
