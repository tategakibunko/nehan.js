var SelectorLexer = (function(){
  function SelectorLexer(src){
    this.buff = this._normalize(src);
  }

  var rex_name = /^[\w-_\*!\?]+/;
  var rex_rexed_name = /^\/[^\/]+\//;
  var rex_id = /^#[\w-_]+/;
  var rex_class = /^\.[\w-_]+/;
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
      var name = this._getName() || this._getRexedName();
      var id = this._getId();
      var klass = this._getClass();
      var attrs = this._getAttrs();
      var pseudo = this._getPseudo();
      return new TypeSelector({
	name:((name && typeof name === "string")? name : null),
	rexedName:((name && name instanceof RegExp)? name : null),
	id:id,
	className:klass,
	attrs:attrs,
	pseudo:pseudo
      });
    },
    _getName : function(){
      return this._getByRex(rex_type_name);
    },
    // type name defined by regexp
    // "/h[1-6]/.nehan-some-class span"
    // => /h[16]/
    _getRexedName : function(){
      var rexed_name = this._getByRex(rex_rexed_name);
      if(rexed_name === null){
	return null;
      }
      return new RegExp(rexed_name.replace(/[\/]/g, ""));
    },
    _getName : function(){
      return this._getByRex(rex_name);
    },
    _getId : function(){
      var id = this._getByRex(rex_id);
      return id? id.substring(1) : null;
    },
    _getClass : function(){
      var klass = this._getByRex(rex_class);
      return klass? klass.substring(1) : null;
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
      var pseudo = this._getByRex(rex_pseudo);
      return pseudo? new PseudoSelector(pseudo) : null;
    }
  };

  return SelectorLexer;
})();

