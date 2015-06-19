/**
   all selector values managed by layout engine.

   @namespace Nehan.Selectors
 */
var Selectors = (function(){
  var __selectors = []; // selector (without pseudo-element) list.
  var __selectors_pe = []; // selector (with pseudo-element) list.

  // sort __selectors by specificity asc.
  var __sort_selectors = function(selectors){
    selectors.sort(function(s1,s2){ return s1.spec - s2.spec; });
    return selectors;
  };

  var __is_pe_key = function(selector_key){
    return selector_key.indexOf("::") >= 0;
  };

  var __find_selector = function(selectors, selector_key){
    return Nehan.List.find(selectors, function(selector){
      return selector.getKey() === selector_key;
    });
  };

  var __update_value = function(selector_key, value){
    var style_value = new CssHashSet(Style[selector_key]); // old style value, must be found
    style_value = style_value.union(new CssHashSet(value)); // merge new value to old
    var target_selectors = __is_pe_key(selector_key)? __selectors_pe : __selectors;
    var selector = __find_selector(target_selectors, selector_key); // selector object for selector_key, must be found
    selector.updateValue(style_value.getValues());
  };

  var __insert_value = function(selector_key, value){
    var selector = new Selector(selector_key, value);
    var target_selectors = __is_pe_key(selector_key)? __selectors_pe : __selectors;
    target_selectors.push(selector);
    return selector;
  };

  var __get_value_pe = function(style, pseudo_element_name){
    var matched_selectors = Nehan.List.filter(__selectors_pe, function(selector){
      return selector.testPseudoElement(style, pseudo_element_name);
    });
    return (matched_selectors.length === 0)? {} : Nehan.List.fold(__sort_selectors(matched_selectors), new CssHashSet(), function(ret, selector){
      return ret.union(new CssHashSet(selector.getValue()));
    }).getValues();
  };

  var __get_value = function(style){
    var matched_selectors = Nehan.List.filter(__selectors, function(selector){
      return selector.test(style);
    });
    return (matched_selectors.length === 0)? {} : Nehan.List.fold(__sort_selectors(matched_selectors), new CssHashSet(), function(ret, selector){
      return ret.union(new CssHashSet(selector.getValue()));
    }).getValues();
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
       @return {Nehan.Selector}
    */
    get : function(selector_key){
      return __find_selector(__selectors, selector_key);
    },
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
     * if selector_key is "p::first-letter",
     * [pseudo_element_name] is "first-letter" and [style] is style-context of "p".
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
