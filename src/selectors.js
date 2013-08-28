var Selectors = (function(){
  var selectors = [];
  var selectors_pe = [];

  var sort_selectors = function(){
    selectors.sort(function(s1,s2){ return s1.spec - s2.spec; });
  };

  var sort_selectors_pe = function(){
    selectors_pe.sort(function(s1,s2){ return s1.spec - s2.spec; });
  };

  var update_value = function(selector_key, value){
    var style_value = Style[selector_key];
    Args.copy(style_value, value);
    var selector = List.find(selectors.concat(selectors_pe), function(selector){
      return selector.getKey() === selector_key;
    });
    if(selector){
      selector.setValue(style_value);
    }
  };

  var insert_value = function(selector_key, value){
    var selector = new Selector(selector_key, value);
    if(selector.isPseudoElement()){
      selectors_pe.push(selector);
    } else {
      selectors.push(selector);
    }
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

  var init_selectors = function(){
    // initialize selector list
    Obj.iter(Style, function(obj, key, value){
      insert_value(key, value);
    });
    sort_selectors();
    sort_selectors_pe();
  };

  init_selectors();

  return {
    setValue : function(selector_key, value){
      if(Style[selector_key]){
	update_value(selector_key, value);
      } else {
	var selector = insert_value(selector_key, value);
	Style[selector_key] = selector.getValue();
	if(selector.isPseudoElement()){
	  sort_selectors_pe();
	} else {
	  sort_selectors();
	}
      }
    },
    getValuePe : function(markup, pseudo_element){
      return get_value_pe(markup, pseudo_element);
    },
    getValue : function(markup){
      return get_value(markup);
    }
  };
})();
