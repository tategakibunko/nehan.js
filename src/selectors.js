Nehan.Selectors = (function(){
  /**
   @memberof Nehan
   @class Nehan.Selectors
   @classdesc  all selector values managed by layout engine.
   @constructor
  */
  function Selectors(stylesheet){
    this.stylesheet = stylesheet || {};
    this.selectors = []; // static selectors without pseudo-element or pseudo-class.
    this.selectorsPe = []; // selectors with pseudo-element.
    this.selectorsPc = []; // selectors with pseudo-class.
    this.selectorsCache = {}; // cache for static selectors
    this._initialize();
  }

  Selectors.prototype._initialize = function(){
    Nehan.Obj.iter(this.stylesheet, function(key, value){
      this._insertValue(key, value);
    }.bind(this));
    this.setValues(Nehan.globalStyle || {}); // set global style.
  };

  // sort __selectors by specificity asc.
  Selectors.prototype._sortSelectors = function(selectors){
    selectors.sort(function(s1,s2){ return s1.spec - s2.spec; });
    return selectors;
  };

  Selectors.prototype._isPcKey = function(selector_key){
    return selector_key.indexOf("::") < 0 && selector_key.indexOf(":") >= 0;
  };

  Selectors.prototype._isPeKey = function(selector_key){
    return selector_key.indexOf("::") >= 0;
  };

  Selectors.prototype._findSelector = function(selectors, selector_key){
    return Nehan.List.find(selectors, function(selector){
      return selector.getKey() === selector_key;
    });
  };

  Selectors.prototype._getTargetSelectors = function(selector_key){
    if(this._isPeKey(selector_key)){
      return this.selectorsPe;
    }
    if(this._isPcKey(selector_key)){
      return this.selectorsPc;
    }
    return this.selectors;
  };

  Selectors.prototype._updateValue = function(selector_key, value){
    var style_value = new Nehan.CssHashSet(this.stylesheet[selector_key]); // old style value, must be found
    style_value = style_value.union(new Nehan.CssHashSet(value)); // merge new value to old
    var target_selectors = this._getTargetSelectors(selector_key);
    var selector = this._findSelector(target_selectors, selector_key); // selector object for selector_key, must be found
    selector.updateValue(style_value.getValues());
  };

  Selectors.prototype._insertValue = function(selector_key, value){
    var selector = new Nehan.Selector(selector_key, value);
    var target_selectors = this._getTargetSelectors(selector_key);
    target_selectors.push(selector);
    return selector;
  };

  /**
   @memberof Nehan.Selectors
   @param selector_key {String}
   @return {Nehan.Selector}
   */
  Selectors.prototype.get = function(selector_key){
    return this._findSelector(this.selectors, selector_key);
  };

  /**
   @memberof Nehan.Selectors
   @param selector_key {String}
   @param value {css_value}
   @example
   * Selectors.setValue("li.foo", {"font-size":19});
   */
  Selectors.prototype.setValue = function(selector_key, value){
    if(this.stylesheet[selector_key]){
      this._updateValue(selector_key, value);
      return;
    }
    var selector = this._insertValue(selector_key, value);
    this.stylesheet[selector_key] = selector.getValue();
  };

  /**
   @memberof Nehan.Selectors
   @param values {Object}
   @example
   * Selectors.setValues({
   *   "body":{"color":"red", "background-color":"white"},
   *   "h1":{"font-size":24}
   * });
   */
  Selectors.prototype.setValues = function(values){
    for(var selector_key in values){
      this.setValue(selector_key, values[selector_key]);
    }
  };

  /**
   get selector css that matches to the style context.

   @memberof Nehan.Selectors
   @param style {Nehan.Style}
   @return {css_value}
   */
  Selectors.prototype.getValue = function(style){
    var cache_key = style.getSelectorCacheKey();
    var cache = this.selectorsCache[cache_key] || null;
    var matched_static_selectors = cache || this.selectors.filter(function(selector){
      return selector.test(style);
    });
    if(cache === null){
      this.selectorsCache[cache_key] = matched_static_selectors;
    }
    var matched_pc_selectors = this.selectorsPc.filter(function(selector){
      return selector.test(style);
    });
    var matched_selectors = matched_static_selectors.concat(matched_pc_selectors);
    return (matched_selectors.length === 0)? {} : this._sortSelectors(matched_selectors).reduce(function(ret, selector){
      return ret.union(new Nehan.CssHashSet(selector.getValue()));
    }, new Nehan.CssHashSet()).getValues();
  };

  /**<pre>
   * get selector css that matches to the pseudo element of some style context.
   * if selector_key is "p::first-letter",
   * [pseudo_element_name] is "first-letter" and [style] is style-context of "p".
   *</pre>
   @memberof Nehan.Selectors
   @param style {Nehan.Style} - 'parent' style context of pseudo-element
   @param pseudo_element_name {String} - "first-letter", "first-line", "before", "after"
   @return {css_value}
   */
  Selectors.prototype.getValuePe = function(style, pseudo_element_name){
    var cache_key = style.getSelectorCacheKeyPe(pseudo_element_name);
    var cache = this.selectorsCache[cache_key] || null;
    var matched_selectors = cache || this.selectorsPe.filter(function(selector){
      return selector.testPseudoElement(style, pseudo_element_name);
    });
    if(cache === null){
      this.selectorsCache[cache_key] = matched_selectors;
    }
    return (matched_selectors.length === 0)? {} : this._sortSelectors(matched_selectors).reduce(function(ret, selector){
      return ret.union(new Nehan.CssHashSet(selector.getValue()));
    }, new Nehan.CssHashSet()).getValues();
  };

  return Selectors;
})();
