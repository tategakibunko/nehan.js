// Selector = [TypeSelector | TypeSelector + combinator + Selector]
Nehan.Selector = (function(){
  /**
   @memberof Nehan
   @class Selector
   @classdesc abstraction of css selector.
   @constructor
   @param key {String}
   @param raw_entries {Object} - unformatted css entries
  */
  function Selector(key, raw_entries){
    this.key = this._normalizeKey(key); // selector source like 'h1 > p'
    this.value = new Nehan.SelectorValue(raw_entries);
    this.elements = this._getSelectorElements(this.key); // [type-selector | combinator]
    this.spec = this._countSpec(this.elements); // count specificity
  }

  /**
   @memberof Nehan.Selector
   @param style {Nehan.Style}
   @return {boolean}
   */
  Selector.prototype.test = function(style){
    return Nehan.SelectorStateMachine.accept(style, this.elements);
  };
  /**
   @memberof Nehan.Selector
   @param style {Nehan.Style}
   @param element_name {String} - "before", "after", "first-line", "first-letter"
   @return {boolean}
   */
  Selector.prototype.testPseudoElement = function(style, element_name){
    var has_pseudo_name = this.hasPseudoElementName(element_name);
    var test_result = this.test(style);
    return has_pseudo_name && test_result;
    //return this.hasPseudoElementName(element_name) && this.test(style);
  };
  /**
   @memberof Nehan.Selector
   @param raw_entries {Object} - unformatted css entries
   */
  Selector.prototype.updateValue = function(raw_entries){
    var fmt_value = new Nehan.SelectorValue(raw_entries);
    this.value.merge(fmt_value);
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
   @return {Object} - formatted css value object
   */
  Selector.prototype.getEntries = function(){
    return this.value.getEntries();
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
    Nehan.List.iter(elements, function(token){
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

  return Selector;
})();

