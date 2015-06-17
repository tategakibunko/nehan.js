/**
   all selector values managed by layout engine.

   @namespace Nehan.Selectors
 */
var Selectors = (function(){
  var __selectors = []; // selector list ordered by specificity desc.
  var __selectors_pe = []; // selector (with pseudo-element) list, ordered by specificity desc.

  // sort __selectors by specificity asc.
  // so higher specificity overwrites lower one.
  var __sort_selectors = function(){
    __selectors.sort(function(s1,s2){ return s1.spec - s2.spec; });
  };

  var __sort_selectors_pe = function(){
    __selectors_pe.sort(function(s1,s2){ return s1.spec - s2.spec; });
  };

  var __is_pe_key = function(selector_key){
    return selector_key.indexOf("::") >= 0;
  };

  var __find_selector = function(selector_key){
    var dst_selectors = __is_pe_key(selector_key)? __selectors_pe : __selectors;
    return List.find(dst_selectors, function(selector){
      return selector.getKey() === selector_key;
    });
  };

  var __update_value = function(selector_key, value){
    var style_value = new CssHashSet(Style[selector_key]); // old style value, must be found
    style_value = style_value.union(new CssHashSet(value)); // merge new value to old
    var selector = __find_selector(selector_key); // selector object for selector_key, must be found
    selector.updateValue(style_value.getValues());
  };

  var __insert_value = function(selector_key, value){
    var selector = new Selector(selector_key, value);
    if(selector.hasPseudoElement()){
      __selectors_pe.push(selector);
    } else {
      __selectors.push(selector);
    }
    // to speed up 'init_selectors' function, we did not sort immediatelly after inserting value.
    // we sort entries after all selector_key and value are registered.
    return selector;
  };

  // apply Selector::test to style.
  // if matches, copy selector value to result object.
  // offcource, higher specificity overwrite lower one.
  var __get_value = function(style){
    return List.fold(__selectors, new CssHashSet(), function(ret, selector){
      if(!selector.test(style)){
	return ret;
      }
      return ret.union(new CssHashSet(selector.getValue()));
    }).getValues();
  };

  // 'p::first-letter'
  // => style = 'p', pseudo_element_name = 'first-letter'
  var __get_value_pe = function(style, pseudo_element_name){
    return List.fold(__selectors_pe, new CssHashSet(), function(ret, selector){
      if(!selector.testPseudoElement(style, pseudo_element_name)){
	return ret;
      }
      return ret.union(new CssHashSet(selector.getValue()));
    }).getValues();
  };

  var __set_value = function(selector_key, value){
    // if selector_key already defined, just overwrite it.
    if(Style[selector_key]){
      __update_value(selector_key, value);
      return;
    }
    __insert_value(selector_key, value);

    var selector = __insert_value(selector_key, value);

    // notice that '__sort_selectors'(or '__sort_selectors_pe') is not called in '__insert_value'.
    Style[selector_key] = selector.getValue();
    if(selector.hasPseudoElement()){
      __sort_selectors_pe();
    } else {
      __sort_selectors();
    }
  };

  var __init_selectors = function(){
    // initialize selector list
    Obj.iter(Style, function(key, value){
      __insert_value(key, value);
    });
    __sort_selectors();
    __sort_selectors_pe();
  };

  __init_selectors();

  return {
    /**
       @memberof Nehan.Selectors
       @param selector_key {String}
       @param value {css_value}
       @example
       * Selectors.setValue("li.foo", {"font-size":19});
    */
    setValue : function(selector_key, value){
      __set_value(selector_key, value);
    },
    /**
       @memberof Nehan.Selectors
       @param values {Object}
       @example
       * Selectors.setValues({
       *   "body":{"color":"red", "background-color":"white"},
       *   "h1":{"font-size":24}
       * });
    */
    setValues : function(values){
      for(var selector_key in values){
	__set_value(selector_key, values[selector_key]);
      }
    },
    /**
       get selector css that matches to the style context.

       @memberof Nehan.Selectors
       @param style {Nehan.StyleContext}
       @return {css_value}
    */
    getValue : function(style){
      return __get_value(style);
    },
    /**<pre>
     * get selector css that matches to the pseudo element of some style context.
     * notice that if selector_key is "p::first-letter",
     * pseudo-element is "first-letter" and style is "p".
     *</pre>

       @memberof Nehan.Selectors
       @param style {Nehan.StyleContext} - 'parent' style context of pseudo-element
       @param pseudo_element_name {String} - "first-letter", "first-line", "before", "after"
       @return {css_value}
    */
    getValuePe : function(style, pseudo_element_name){
      return __get_value_pe(style, pseudo_element_name);
    }
  };
})();
