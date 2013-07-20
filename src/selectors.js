var Selectors = (function(){
  var selectors = [];
  var selectors_pe = [];

  Obj.iter(Style, function(obj, key, val){
    var selector = new Selector(key, val);
    selectors.push(selector);
    if(selector.isPseudoElement()){
      selectors_pe.push(selector);
    }
  });

  var update_value = function(selector_key, value){
    Args.copy(Style[selector_key], value);
  };

  var insert_value = function(selector_key, value){
    var selector = new Selector(selector_key, value);
    selectors.push(selector);
    if(selector.isPseudoElement()){
      selectors_pe.push(selector);
    }
    Style[selector_key] = selector.getValue();

    // TODO: re-sort
  };
  
  var get_value = function(markup){
    return List.fold(selectors, {}, function(ret, selector){
      if(!selector.isPseudoElement() && selector.test(markup)){
	return Args.copy(ret, selector.getValue());
      }
      return ret;
    });
  };

  var get_value_pe = function(markup, pseudo_element){
    return List.fold(selectors_pe, {}, function(ret, selector){
      if(selector.hasPseudoElement(pseudo_element) && selector.test(markup)){
	return Args.copy(ret, selector.getValue());
      }
      return ret;
    });
  };

  return {
    setValue : function(selector_key, value){
      if(Style[selector_key]){
	update_value(selector_key, value);
      } else {
	insert_value(selector_key, value);
      }
    },
    getValue : function(markup, pseudo_element){
      if(pseudo_element){
	return get_value_pe(markup, pseudo_element);
      }
      return get_value(markup);
    }
  };
})();
