var SelectorLexer = (function(){
  function SelectorLexer(src){
    this.buff = this._normalize(src);
  }

  var rex_type = /^[\w-_\.#\*!\?]+/;
  var rex_attr = /^\[[^\]]+\]/;
  var rex_pseudo = /^:{1,2}[\w-_]+/;
  
  SelectorLexer.prototype = {
    getTokens : function(){
      var tokens = [];
      while(this.buff !== ""){
	var token = this._getNextToken();
	if(token === null){
	  break;
	}
	tokens.push(token);
      }
      return tokens;
    },
    _getNextToken : function(){
      if(this.buff === ""){
	return null;
      }
      var c1 = this.buff.charAt(0);
      switch(c1){
      case "+": case "~": case ">": // combinator
	this._stepBuff(1);
	return c1;
      case ":": // pseudo without type-selector
	var pseudo = this._getPseudo();
	return this._parseType("body", [], pseudo);
      default: // type-selecor
	var type = this._getType();
	if(type){
	  var attrs = this._getAttrs();
	  var pseudo = this._getPseudo();
	  return this._parseType(type, attrs, pseudo);
	}
      }
      throw "invalid selector:[" + this.buff + "]";
    },
    _normalize : function(src){
      return Utils.trim(src).replace(/\s+/g, " ");
    },
    _stepBuff : function(count){
      this.buff = Utils.trim(this.buff.slice(count));
    },
    _parseType : function(str, attrs, pseudo){
      return new TypeSelector({
	name:this._getName(str),
	id:this._getId(str),
	className:this._getClassName(str),
	attrs:attrs,
	pseudo:(pseudo? (new PseudoSelector(pseudo)) : null)
      });
    },
    _getByRex : function(rex){
      var ret = null;
      var match = this.buff.match(rex);
      if(match){
	ret = match[0];
	this._stepBuff(ret.length);
      }
      return ret;
    },
    _getName : function(str){
      return str.replace(/[\.#].+$/, "");
    },
    _getId : function(str){
      var parts = str.split("#");
      return (parts.length > 0)? parts[1] : "";
    },
    _getClassName : function(str){
      var parts = str.split(".");
      return (parts.length >= 2)? parts[1] : "";
    },
    _getType : function(){
      return this._getByRex(rex_type);
    },
    _getAttrs : function(){
      var attrs = [];
      while(true){
	var attr = this._getByRex(rex_attr);
	if(attr){
	  attrs.push(new AttrSelector(attr));
	} else {
	  break;
	}
      }
      return attrs;
    },
    _getPseudo : function(){
      return this._getByRex(rex_pseudo);
    }
  };

  return SelectorLexer;
})();

