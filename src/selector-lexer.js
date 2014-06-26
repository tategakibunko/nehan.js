var SelectorLexer = (function(){
  function SelectorLexer(src){
    this.buff = this._normalize(src);
  }

  var __rex_name = /^[\w-_\*!\?]+/;
  var __rex_name_by_rex = /^\/[^\/]+\//;
  var __rex_id = /^#[\w-_]+/;
  var __rex_class = /^\.[\w-_]+/;
  var __rex_attr = /^\[[^\]]+\]/;
  var __rex_pseudo = /^:{1,2}[\w-_]+/;

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
      this.buff = Utils.trim(this.buff);
      if(this.buff === ""){
	return null;
      }
      var c1 = this.buff.charAt(0);
      switch(c1){
      case "+": case "~": case ">": // combinator
	this._stepBuff(1);
	return c1;
      default: // type-selecor
	return this._getTypeSelector();
      }
      throw "invalid selector:[" + this.buff + "]";
    },
    _normalize : function(src){
      return Utils.trim(src).replace(/\s+/g, " ");
    },
    _stepBuff : function(count){
      this.buff = Utils.trim(this.buff.slice(count));
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
    _getTypeSelector : function(){
      var buff_len_before = this.buff.length;
      var name = this._getName();
      var name_rex = (name === null)? this._getNameRex() : null;
      var id = this._getId();
      var classes = this._getClasses();
      var attrs = this._getAttrs();
      var pseudo = this._getPseudo();

      // if size of this.buff is not changed, there is no selector element.
      if(this.buff.length === buff_len_before){
	throw "invalid selector:[" + this.buff + "]";
      }
      return new TypeSelector({
	name:name,
	nameRex:name_rex,
	id:id,
	classes:classes,
	attrs:attrs,
	pseudo:pseudo
      });
    },
    _getName : function(){
      return this._getByRex(__rex_name);
    },
    // type name defined by regexp
    // "/h[1-6]/.nehan-some-class span"
    // => /h[1-6]/
    _getNameRex : function(){
      var name_rex = this._getByRex(__rex_name_by_rex);
      if(name_rex === null){
	return null;
      }
      return new RegExp(name_rex.replace(/[\/]/g, ""));
    },
    _getId : function(){
      var id = this._getByRex(__rex_id);
      return id? id.substring(1) : null;
    },
    _getClasses : function(){
      var classes = [];
      while(true){
	var klass = this._getClass();
	if(klass === null){
	  break;
	}
	classes.push(klass);
      }
      return classes;
    },
    _getClass : function(){
      var klass = this._getByRex(__rex_class);
      return klass? klass.substring(1) : null;
    },
    _getAttrs : function(){
      var attrs = [];
      while(true){
	var attr = this._getByRex(__rex_attr);
	if(attr === null){
	  break;
	}
	attrs.push(new AttrSelector(attr));
      }
      return attrs;
    },
    _getPseudo : function(){
      var pseudo = this._getByRex(__rex_pseudo);
      return pseudo? new PseudoSelector(pseudo) : null;
    }
  };

  return SelectorLexer;
})();

