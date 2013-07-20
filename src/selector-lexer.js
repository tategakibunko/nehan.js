var SelectorLexer = (function(){
  function SelectorLexer(src){
    this.buff = this._normalize(src);
  }

  var rex_type = /^[\w-_\.#\*]+/;
  var rex_attr = /^\[[^\]]+\]/;
  var rex_pseudo = /^:{1,2}[\w-_]+/;
  
  SelectorLexer.prototype = {
    getTokens : function(){
      var tokens = [];
      var push = function(token){ tokens.push(token); };
      while(this.buff !== ""){
	var token = this._getNextToken();
	if(token === null){
	  break;
	}
	push(token);
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
      default: // selector-type
	var type = this._getType();
	if(type){
	  var attr = this._getAttr();
	  var pseudo = this._getPseudo();
	  return this._parseType(type, attr, pseudo);
	}
      }
      throw "invalid selector:" + this.buff;
    },
    _normalize : function(src){
      return Utils.trim(src).replace(/\s+/g, " ");
    },
    _stepBuff : function(count){
      this.buff = Utils.trim(this.buff.slice(count));
    },
    _parseType : function(str, attr, pseudo){
      return new SelectorType({
	name:this._getName(str),
	id:this._getId(str),
	className:this._getClassName(str),
	attr:(attr? (new SelectorAttr(attr)) : null),
	pseudo:(pseudo? (new SelectorPseudo(pseudo)) : null)
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
    _getAttr : function(){
      return this._getByRex(rex_attr);
    },
    _getPseudo : function(){
      return this._getByRex(rex_pseudo);
    }
  };

  return SelectorLexer;
})();

