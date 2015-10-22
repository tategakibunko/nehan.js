// Selector = [TypeSelector | TypeSelector + combinator + Selector]
Nehan.Selector = (function(){
  /**
     @memberof Nehan
     @class Selector
     @classdesc abstraction of css selector.
     @constructor
     @param key {String}
     @param value {css_value}
  */
  function Selector(key, value){
    this.key = this._normalizeKey(key); // selector source like 'h1 > p'
    this.value = this._formatValue(value); // associated css value object like {font-size:16px}
    this.elements = this._getSelectorElements(this.key); // [type-selector | combinator]
    this.spec = this._countSpec(this.elements); // count specificity
  }

  /**
   @memberof Nehan.Selector
   @param style {Nehan.StyleContext}
   @return {boolean}
   */
  Selector.prototype.test = function(style){
    return Nehan.SelectorStateMachine.accept(style, this.elements);
  };
  /**
   @memberof Nehan.Selector
   @param style {Nehan.StyleContext}
   @param element_name {String} - "before", "after", "first-line", "first-letter"
   @return {boolean}
   */
  Selector.prototype.testPseudoElement = function(style, element_name){
    return this.hasPseudoElementName(element_name) && this.test(style);
  };
  /**
   @memberof Nehan.Selector
   @param value {css_value}
   */
  Selector.prototype.updateValue = function(value){
    for(var prop in value){
      var fmt_value = Nehan.CssParser.formatValue(prop, value[prop]);
      var norm_prop = (typeof fmt_value !== "function")? Nehan.CssParser.normalizeProp(prop) : Nehan.Utils.camelToChain(prop);
      var old_value = this.value[norm_prop] || null;
      if(old_value !== null && typeof old_value === "object" && typeof fmt_value === "object"){
	Nehan.Args.copy(old_value, fmt_value);
      } else {
	this.value[norm_prop] = fmt_value; // direct value or function
      }
    }
  };
  /**
   @memberof Nehan.Selector
   @return {String}
   */
  Selector.prototype.getKey = function(){
    return this.key;
  };
  /**
   @memberof Nehan.Selector
   @return {css_value}
   */
  Selector.prototype.getValue = function(){
    return this.value;
  };
  /**
   @memberof Nehan.Selector
   @return {int} selector specificity
   */
  Selector.prototype.getSpec = function(){
    return this.spec;
  };
  /**
   @memberof Nehan.Selector
   @return {boolean}
   */
  Selector.prototype.hasPseudoElement = function(){
    return this.key.indexOf("::") >= 0;
  };
  /**
   @memberof Nehan.Selector
   @param element_name {String} - "first-letter", "first-line"
   @return {boolean}
   */
  Selector.prototype.hasPseudoElementName = function(element_name){
    return this.key.indexOf("::" + element_name) >= 0;
  };

  // count selector 'specificity'
  // see http://www.w3.org/TR/css3-selectors/#specificity
  Selector.prototype._countSpec = function(elements){
    var a = 0, b = 0, c = 0;
    elements.forEach(function(token){
      if(token instanceof Nehan.TypeSelector){
	a += token.getIdSpec();
	b += token.getClassSpec() + token.getPseudoClassSpec() + token.getAttrSpec();
	c += token.getNameSpec();
      }
    });
    return parseInt([a,b,c].join(""), 10); // maybe ok in most case.
  };

  Selector.prototype._getSelectorElements = function(key){
    var lexer = new Nehan.SelectorLexer(key);
    return lexer.getTokens();
  };

  Selector.prototype._normalizeKey = function(key){
    key = (key instanceof RegExp)? "/" + key.source + "/" : key;
    return Nehan.Utils.trim(key).toLowerCase().replace(/\s+/g, " ");
  };

  Selector.prototype._formatValue = function(value){
    var ret = {};
    for(var prop in value){
      var norm_prop = Nehan.CssParser.normalizeProp(prop);
      var fmt_value = Nehan.CssParser.formatValue(prop, value[prop]);
      ret[norm_prop] = fmt_value;
    }
    return ret;
  };

  return Selector;
})();

