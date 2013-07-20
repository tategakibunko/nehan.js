var Selectors = (function(){
  var selectors = [];
  var selectors_pe = [];

  var update_value = function(selector_key, value){
    Args.copy(Style[selector_key], value);
  };

  var insert_value = function(selector_key, value){
    var selector = new Selector(selector_key, value);
    if(selector.isPseudoElement()){
      selectors_pe.push(selector);
    } else {
      selectors.push(selector);
    }
    selectors.sort(function(s1,s2){ return s2.spec - s1.spec; });
    return selector;
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

  // initialize selector list
  Obj.iter(Style, function(obj, key, value){
    insert_value(key, value);
  });

  return {
    setValue : function(selector_key, value){
      if(Style[selector_key]){
	update_value(selector_key, value);
      } else {
	var selector = insert_value(selector_key, value);
	Style[selector_key] = selector.getValue();
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
