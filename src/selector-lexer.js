Nehan.SelectorLexer = (function(){
  /**
     @memberof Nehan
     @class SelectorLexer
     @classdesc lexer of css selector
     @constructor
  */
  function SelectorLexer(src){
    this.buff = this._normalize(src);
  }

  var __rex_name = /^[\w-_\*!\?]+/;
  var __rex_name_by_rex = /^\/[^\/]+\//;
  var __rex_id = /^#[\w-_]+/;
  var __rex_class = /^\.[\w-_]+/;
  var __rex_attr = /^\[[^\]]+\]/;
  var __rex_pseudo_ident = /^:{1,2}[\w-_]+/;
  var __rex_pseudo_args = /\(.*?\)/;

  /**
   @memberof Nehan.SelectorLexer
   @return {Array.<Nehan.CompoundSelector>}
   */
  SelectorLexer.prototype.getTokens = function(){
    var tokens = [];
    while(this.buff !== ""){
      var token = this._getNextToken();
      if(token === null){
	break;
      }
      tokens.push(token);
    }
    return tokens;
  };

  SelectorLexer.prototype._getNextToken = function(){
    this.buff = Nehan.Utils.trim(this.buff);
    if(this.buff === ""){
      return null;
    }
    var c1 = this.buff.charAt(0);
    switch(c1){
    case "+": case "~": case ">": // combinator
      this._stepBuff(1);
      return c1;
    default: // type-selecor
      return this._getCompoundSelector();
    }
    throw "invalid selector:[" + this.buff + "]";
  };

  SelectorLexer.prototype._normalize = function(src){
    return Nehan.Utils.trim(src).replace(/\s+/g, " ");
  };

  SelectorLexer.prototype._stepBuff = function(count){
    this.buff = Nehan.Utils.trim(this.buff.slice(count));
  };

  SelectorLexer.prototype._getByRex = function(rex){
    var ret = null;
    var match = this.buff.match(rex);
    if(match){
      ret = match[0];
      this._stepBuff(ret.length);
    }
    return ret;
  };

  SelectorLexer.prototype._getCompoundSelector = function(){
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
    return new Nehan.CompoundSelector({
      name:name,
      nameRex:name_rex,
      id:id,
      classes:classes,
      attrs:attrs,
      pseudo:pseudo
    });
  };

  SelectorLexer.prototype._getName = function(){
    return this._getByRex(__rex_name);
  };

  // type name defined by regexp
  // "/h[1-6]/.nehan-some-class span"
  // => /h[1-6]/
  SelectorLexer.prototype._getNameRex = function(){
    var name_rex = this._getByRex(__rex_name_by_rex);
    if(name_rex === null){
      return null;
    }
    return new RegExp(name_rex.replace(/[\/]/g, ""));
  };

  SelectorLexer.prototype._getId = function(){
    var id = this._getByRex(__rex_id);
    return id? id.substring(1) : null;
  };

  SelectorLexer.prototype._getClasses = function(){
    var classes = [];
    while(true){
      var klass = this._getClass();
      if(klass === null){
	break;
      }
      classes.push(klass);
    }
    return classes;
  };

  SelectorLexer.prototype._getClass = function(){
    var klass = this._getByRex(__rex_class);
    return klass? klass.substring(1) : null;
  };

  SelectorLexer.prototype._getAttrs = function(){
    var attrs = [];
    while(true){
      var attr = this._getByRex(__rex_attr);
      if(attr === null){
	break;
      }
      attrs.push(new Nehan.AttrSelector(attr));
    }
    return attrs;
  };

  SelectorLexer.prototype._getPseudo = function(){
    var pseudo_ident = this._getByRex(__rex_pseudo_ident);
    if(!pseudo_ident){
      return null;
    }
    var pseudo_args_str = this._getByRex(__rex_pseudo_args);
    if(!pseudo_args_str){
      return new Nehan.PseudoSelector(pseudo_ident);
    }
    pseudo_args_str = pseudo_args_str.replace(/\s/g, "").replace("(", "").replace(")", "");
    var pseudo_args = Nehan.Utils.splitBy(pseudo_args_str, ",");
    return new Nehan.PseudoSelector(pseudo_ident, pseudo_args);
  };

  return SelectorLexer;
})();

