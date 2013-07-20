var Selector = (function(){
  function Selector(key, value){
    this.key = this._normalizeKey(key);
    this.value = this._formatValue(value);
    this.tokens = this._getSelectorTokens(this.key);
    this.specificity = this._getSpecificity(this.tokens);
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
    getKey : function(){
      return this.key;
    },
    getValue : function(){
      return this.value;
    },
    test : function(markup){
      return SelectorStateMachine.accept(this.tokens, markup);
    },
    isPseudoElement : function(){
      return this.key.indexOf("::") >= 0;
    },
    hasPseudoElement : function(element_name){
      return this.key.indexOf("::" + element_name) >= 0;
    },
    _getSpecificity : function(tokens){
      return 0; // TODO
    },
    _getSelectorTokens : function(key){
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

