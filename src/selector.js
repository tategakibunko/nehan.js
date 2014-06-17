// Selector = [TypeSelector | TypeSelector + combinator + Selector]
var Selector = (function(){
  function Selector(key, value){
    this.key = this._normalizeKey(key); // selector source like 'h1 > p'
    this.value = this._formatValue(value); // associated css value object like {font-size:16px}
    this.elements = this._getSelectorElements(this.key); // [type-selector | combinator]
    this.spec = this._countSpec(this.elements); // count specificity
  }

  Selector.prototype = {
    test : function(style){
      return SelectorStateMachine.accept(style, this.elements);
    },
    // element_name: "before", "after", "first-line", "first-letter"
    testPseudoElement : function(style, element_name){
      return this.hasPseudoElementName(element_name) && this.test(style);
    },
    updateValue : function(value){
      for(var prop in value){
	var fmt_value = CssParser.formatValue(prop, value[prop]);
	var fmt_prop = CssParser.formatProp(prop);
	var old_value = this.value[fmt_prop] || null;
	if(typeof old_value === "object" && typeof fmt_value === "object"){
	  Args.copy(old_value, fmt_value);
	} else {
	  this.value[fmt_prop] = fmt_value; // direct value or function
	}
      }
    },
    getKey : function(){
      return this.key;
    },
    getValue : function(){
      return this.value;
    },
    getSpec : function(){
      return this.spec;
    },
    hasPseudoElement : function(){
      return this.key.indexOf("::") >= 0;
    },
    hasPseudoElementName : function(element_name){
      return this.key.indexOf("::" + element_name) >= 0;
    },
    // count selector 'specificity'
    // see http://www.w3.org/TR/css3-selectors/#specificity
    _countSpec : function(elements){
      var a = 0, b = 0, c = 0;
      List.iter(elements, function(token){
	if(token instanceof TypeSelector){
	  a += token.getIdSpec();
	  b += token.getClassSpec() + token.getPseudoClassSpec() + token.getAttrSpec();
	  c += token.getNameSpec();
	}
      });
      return parseInt([a,b,c].join(""), 10); // maybe ok in most case.
    },
    _getSelectorElements : function(key){
      var lexer = new SelectorLexer(key);
      return lexer.getTokens();
    },
    _normalizeKey : function(key){
      key = (key instanceof RegExp)? "/" + key.source + "/" : key;
      return Utils.trim(key).toLowerCase().replace(/\s+/g, " ");
    },
    _formatValue : function(value){
      var ret = {};
      for(var prop in value){
	var fmt_prop = CssParser.formatProp(prop);
	var fmt_value = CssParser.formatValue(prop, value[prop]);
	ret[fmt_prop] = fmt_value;
      }
      return ret;
    }
  };

  return Selector;
})();

