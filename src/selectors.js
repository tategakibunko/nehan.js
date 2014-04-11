var Selectors = (function(){
  var selectors = []; // selector list ordered by specificity desc.
  var selectors_pe = []; // selector (with pseudo-element) list, ordered by specificity desc.

  // sort selectors by specificity asc.
  // so higher specificity overwrites lower one.
  var sort_selectors = function(){
    selectors.sort(function(s1,s2){ return s1.spec - s2.spec; });
  };

  var sort_selectors_pe = function(){
    selectors_pe.sort(function(s1,s2){ return s1.spec - s2.spec; });
  };

  var update_value = function(selector_key, value){
    var style_value = Style[selector_key]; // old style value
    Args.copy(style_value, value); // overwrite new value to old
    var selector = List.find(selectors.concat(selectors_pe), function(selector){
      return selector.getKey() === selector_key;
    });
    if(selector){
      selector.setValue(style_value);
    }
  };

  var insert_value = function(selector_key, value){
    var selector = new Selector(selector_key, value);
    if(selector.hasPseudoElement()){
      selectors_pe.push(selector);
    } else {
      selectors.push(selector);
    }
    // to speed up 'init_selectors' function, we did not sort immediatelly after inserting value.
    // we sort entries after all selector_key and value are registered.
    return selector;
  };
  
  var get_value = function(style){
    return List.fold(selectors, {}, function(ret, selector){
      if(!selector.hasPseudoElement() && selector.test(style)){
	return Args.copy(ret, selector.getValue());
      }
      return ret;
    });
  };

  var get_value_pe = function(parent_style, pseudo_element_name){
    return List.fold(selectors_pe, {}, function(ret, selector){
      if(selector.hasPseudoElementName(pseudo_element_name) && selector.test(parent_style || null)){
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
      // if selector_key already defined, just overwrite it.
      if(Style[selector_key]){
	update_value(selector_key, value);
	return;
      }
      insert_value(selector_key, value);

      var selector = insert_value(selector_key, value);

      // notice that 'sort_selectors'(or 'sort_selectors_pe') is not called in 'insert_value'.
      Style[selector_key] = selector.getValue();
      if(selector.hasPseudoElement()){
	sort_selectors_pe();
      } else {
	sort_selectors();
      }
    },
    // pseudo_element_name: "first-letter", "first-line", "before", "after"
    getValuePe : function(parent_style, pseudo_element_name){
      return get_value_pe(parent_style, pseudo_element_name);
    },
    getValue : function(style){
      return get_value(style);
    }
  };
})();
