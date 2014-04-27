// Selector = [TypeSelector | TypeSelector + combinator + Selector]
var Selector = (function(){
  function Selector(key, value){
    this.key = this._normalizeKey(key); // selector source like 'h1 > p'
    this.value = this._formatValue(value); // associated css value object like {font-size:16px}
    this.parts = this._getSelectorParts(this.key); // [type-selector | combinator]
    this.spec = this._countSpec(this.parts); // specificity
  }

  var set_format_value = function(ret, prop, format_value){
    if(format_value instanceof Array){
      set_format_values(ret, format_value);
    } else {
      ret[prop] = format_value;
    }
  };

  var set_format_values = function(ret, format_values){
    List.iter(format_values, function(fmt_value){
      for(var prop in fmt_value){
	set_format_value(ret, prop, fmt_value[prop]);
      }
    });
  };

  Selector.prototype = {
    test : function(style, pseudo_element_name){
      if(pseudo_element_name && !this.hasPseudoElementName(pseudo_element_name)){
	return false;
      }
      return SelectorStateMachine.accept(style, this.parts);
    },
    updateValue : function(value){
      for(var prop in value){
	var fmt_value = CssParser.format(prop, value[prop]);
	if(typeof this.value[prop] === "object" && typeof fmt_value === "object"){
	  Args.copy(this.value[prop], fmt_value);
	} else {
	  this.value[prop] = fmt_value;
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
    _countSpec : function(parts){
      var a = 0, b = 0, c = 0;
      List.iter(parts, function(token){
	if(token instanceof TypeSelector){
	  a += token.getIdSpec();
	  b += token.getClassSpec() + token.getPseudoClassSpec() + token.getAttrSpec();
	  c += token.getTypeSpec();
	}
      });
      return parseInt([a,b,c].join(""), 10); // maybe ok in most case.
    },
    _getSelectorParts : function(key){
      var lexer = new SelectorLexer(key);
      return lexer.getTokens();
    },
    _normalizeKey : function(key){
      return Utils.trim(key).toLowerCase().replace(/\s+/g, " ");
    },
    _formatValue : function(value){
      var ret = {};
      for(var prop in value){
	set_format_value(ret, prop, CssParser.format(prop, value[prop]));
      }
      return ret;
    }
  };

  return Selector;
})();

