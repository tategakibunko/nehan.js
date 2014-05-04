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

  var is_pe_key = function(selector_key){
    return selector_key.indexOf("::") >= 0;
  };

  var find_selector = function(selector_key){
    var dst_selectors = is_pe_key(selector_key)? selectors_pe : selectors;
    return List.find(dst_selectors, function(selector){
      return selector.getKey() === selector_key;
    });
  };

  var update_value = function(selector_key, value){
    var style_value = Style[selector_key]; // old style value, must be found
    Args.copy(style_value, value); // overwrite new value to old
    var selector = find_selector(selector_key); // selector object for selector_key, must be found
    selector.updateValue(style_value);
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

  // apply Selector::test to style.
  // if matches, copy selector value to result object.
  // offcource, higher specificity overwrite lower one.
  var get_value = function(style){
    return List.fold(selectors, {}, function(ret, selector){
      return selector.test(style)? Args.copy(ret, selector.getValue()) : ret;
    });
  };

  // 'p::first-letter'
  // => style = 'p', pseudo_element_name = 'first-letter'
  var get_value_pe = function(style, pseudo_element_name){
    return List.fold(selectors_pe, {}, function(ret, selector){
      return selector.test(style, pseudo_element_name)? Args.copy(ret, selector.getValue()) : ret;
    });
  };

  var set_value = function(selector_key, value){
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
  };

  var init_selectors = function(){
    // initialize selector list
    Obj.iter(Style, function(key, value){
      insert_value(key, value);
    });
    sort_selectors();
    sort_selectors_pe();
  };

  init_selectors();

  return {
    // selector_key: selector string
    // [example] => 'p.some', 'li.foo'
    //
    // value: associated selector value object.
    // [example] => {'color':'black', 'font-size':'16px'}
    setValue : function(selector_key, value){
      set_value(selector_key, value);
    },
    setValues : function(values){
      for(var selector_key in values){
	set_value(selector_key, values[selector_key]);
      }
    },
    // get selector css that matches to the style context.
    //
    // style: style context
    getValue : function(style){
      return get_value(style);
    },
    // get selector css that matches to the pseudo element of some style context.
    // notice that if selector_key is "p::first-letter",
    // pseudo-element is "first-letter" and style-context is "p".
    //
    // style: 'parent' style of pseudo-element
    // pseudo_element_name: "first-letter", "first-line", "before", "after" are available
    getValuePe : function(style, pseudo_element_name){
      return get_value_pe(style, pseudo_element_name);
    }
  };
})();
