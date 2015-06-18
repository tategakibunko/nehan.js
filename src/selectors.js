/**
   all selector values managed by layout engine.

   @namespace Nehan.Selectors
 */
var Selectors = (function(){
  var __selectors = []; // selector list(NOT ordered by specificity desc).

  // sort __selectors by specificity asc.
  var __sort_selectors = function(selectors){
    selectors.sort(function(s1,s2){ return s1.spec - s2.spec; });
    return selectors;
  };

  var __find_selector = function(selectors, selector_key){
    return List.find(selectors, function(selector){
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
    __selectors.push(selector);
    return selector;
  };

  // apply Selector::test(or testPseudoElement) to style.
  var __get_value = function(style, pseudo_element_name){
    var matched_selectors = List.filter(__selectors, function(selector){
      var is_pseudo_selector = selector.hasPseudoElement();
      if(!pseudo_element_name && is_pseudo_selector){
	return false;
      }
      if(pseudo_element_name && !is_pseudo_selector){
	return false;
      }
      if(is_pseudo_selector){
	return selector.testPseudoElement(style, pseudo_element_name);
      }
      return selector.test(style);
    });
    if(matched_selectors.length === 0){
      return {};
    }
    //console.log("[%s(pe=%o)]%o matched selectors:%o", style.getMarkupName(), pseudo_element_name, style.markup, matched_selectors);
    var values = List.fold(__sort_selectors(matched_selectors), new CssHashSet(), function(ret, selector){
      return ret.union(new CssHashSet(selector.getValue()));
    }).getValues();
    //console.log("[%s]:%o", style.getMarkupName(), values);
    return values;
  };

  var __set_value = function(selector_key, value){
    if(Style[selector_key]){
      __update_value(selector_key, value);
      return;
    }
    var selector = __insert_value(selector_key, value);
    Style[selector_key] = selector.getValue();
  };

  var __init_selectors = function(){
    Obj.iter(Style, function(key, value){
      __insert_value(key, value);
    });
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
    getValue : function(style, pseudo_element_name){
      return __get_value(style, pseudo_element_name || null);
    }
  };
})();
