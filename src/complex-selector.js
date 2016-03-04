// ComplexSelector = [CompoundSelector | combinator]
Nehan.ComplexSelector = (function(){
  /**
   @memberof Nehan
   @class ComplexSelector
   @classdesc abstraction of css complex selector.
   @constructor
   @param key {String}
  */
  function ComplexSelector(key){
    this.key = this._normalizeKey(key);
    this.elements = this._getSelectorElements(this.key); // [compound-selector | combinator]
    this.spec = this._countSpec(this.elements); // count specificity
  }

  /**
   @memberof Nehan.ComplexSelector
   @param style {Nehan.Style}
   @return {boolean}
   */
  ComplexSelector.prototype.test = function(style){
    return Nehan.SelectorStateMachine.accept(style, this.elements);
  };
  /**
   @memberof Nehan.ComplexSelector
   @param style {Nehan.Style}
   @param element_name {String} - "before", "after", "first-line", "first-letter"
   @return {boolean}
   */
  ComplexSelector.prototype.testPseudoElement = function(style, element_name){
    var has_pseudo_name = this.hasPseudoElementName(element_name);
    var test_result = this.test(style);
    return has_pseudo_name && test_result;
  };
  /**
   @memberof Nehan.ComplexSelector
   @return {String}
   */
  ComplexSelector.prototype.getKey = function(){
    return this.key;
  };
  /**
   @memberof Nehan.ComplexSelector
   @return {int} selector specificity
   */
  ComplexSelector.prototype.getSpec = function(){
    return this.spec;
  };
  /**
   @memberof Nehan.ComplexSelector
   @return {boolean}
   */
  ComplexSelector.prototype.hasPseudoElement = function(){
    return this.key.indexOf("::") >= 0;
  };
  /**
   @memberof Nehan.ComplexSelector
   @param element_name {String} - "first-letter", "first-line"
   @return {boolean}
   */
  ComplexSelector.prototype.hasPseudoElementName = function(element_name){
    return this.key.indexOf("::" + element_name) >= 0;
  };

  // count selector 'specificity'
  // see http://www.w3.org/TR/css3-selectors/#specificity
  ComplexSelector.prototype._countSpec = function(elements){
    var a = 0, b = 0, c = 0;
    Nehan.List.iter(elements, function(token){
      if(token instanceof Nehan.CompoundSelector){
	a += token.getIdSpec();
	b += token.getClassSpec() + token.getPseudoClassSpec() + token.getAttrSpec();
	c += token.getNameSpec();
      }
    });
    return parseInt([a,b,c].join(""), 10); // maybe ok in most case.
  };

  ComplexSelector.prototype._getSelectorElements = function(key){
    var lexer = new Nehan.SelectorLexer(key);
    return lexer.getTokens();
  };

  ComplexSelector.prototype._normalizeKey = function(key){
    key = (key instanceof RegExp)? "/" + key.source + "/" : key;
    return Nehan.Utils.trim(key).replace(/\s+/g, " ");
  };

  return ComplexSelector;
})();

