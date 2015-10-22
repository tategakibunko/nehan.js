/**
   all selector values managed by layout engine.

   @namespace Nehan.Selectors
 */
var Selectors = (function(){
  var __selectors = []; // static selectors without pseudo-element or pseudo-class.
  var __selectors_pe = []; // selectors with pseudo-element.
  var __selectors_pc = []; // selectors with pseudo-class.
  var __selectors_cache = {}; // cache for static selectors

  // sort __selectors by specificity asc.
  var __sort_selectors = function(selectors){
    selectors.sort(function(s1,s2){ return s1.spec - s2.spec; });
    return selectors;
  };

  var __is_pc_key = function(selector_key){
    return selector_key.indexOf("::") < 0 && selector_key.indexOf(":") >= 0;
  };

  var __is_pe_key = function(selector_key){
    return selector_key.indexOf("::") >= 0;
  };

  var __find_selector = function(selectors, selector_key){
    return Nehan.List.find(selectors, function(selector){
      return selector.getKey() === selector_key;
    });
  };

  var __get_target_selectors = function(selector_key){
    if(__is_pe_key(selector_key)){
      return __selectors_pe;
    }
    if(__is_pc_key(selector_key)){
      return __selectors_pc;
    }
    return __selectors;
  };

  var __update_value = function(selector_key, value){
    var style_value = new Nehan.CssHashSet(Style[selector_key]); // old style value, must be found
    style_value = style_value.union(new Nehan.CssHashSet(value)); // merge new value to old
    var target_selectors = __get_target_selectors(selector_key);
    var selector = __find_selector(target_selectors, selector_key); // selector object for selector_key, must be found
    selector.updateValue(style_value.getValues());
  };

  var __insert_value = function(selector_key, value){
    var selector = new Nehan.Selector(selector_key, value);
    var target_selectors = __get_target_selectors(selector_key);
    target_selectors.push(selector);
    return selector;
  };

  var __get_value_pe = function(style, pseudo_element_name){
    var cache_key = style.getSelectorCacheKeyPe(pseudo_element_name);
    var cache = __selectors_cache[cache_key] || null;
    var matched_selectors = cache || __selectors_pe.filter(function(selector){
      return selector.testPseudoElement(style, pseudo_element_name);
    });
    if(cache === null){
      __selectors_cache[cache_key] = matched_selectors;
    }
    return (matched_selectors.length === 0)? {} : __sort_selectors(matched_selectors).reduce(function(ret, selector){
      return ret.union(new Nehan.CssHashSet(selector.getValue()));
    }, new Nehan.CssHashSet()).getValues();
  };

  var __get_value = function(style){
    var cache_key = style.getSelectorCacheKey();
    var cache = __selectors_cache[cache_key] || null;
    var matched_static_selectors = cache || __selectors.filter(function(selector){
      return selector.test(style);
    });
    if(cache === null){
      __selectors_cache[cache_key] = matched_static_selectors;
    }
    var matched_pc_selectors = __selectors_pc.filter(function(selector){
      return selector.test(style);
    });
    var matched_selectors = matched_static_selectors.concat(matched_pc_selectors);
    return (matched_selectors.length === 0)? {} : __sort_selectors(matched_selectors).reduce(function(ret, selector){
      return ret.union(new Nehan.CssHashSet(selector.getValue()));
    }, new Nehan.CssHashSet()).getValues();
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
    Nehan.Obj.iter(Style, function(key, value){
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
