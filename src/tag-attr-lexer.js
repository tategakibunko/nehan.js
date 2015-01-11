var TagAttrLexer = (function(){
  var __rex_symbol = /[^=\s]+/;

  /**
     @memberof Nehan
     @class TagAttrLexer
     @classdesc tag attribute string lexer
     @constructor
     @param src {String}
     @description <pre>
     * lexer src is attribute parts of original tag source.
     * so if tag source is "<div class='nehan-float-start'>",
     * then lexer src is "class='nehan-float-start'".
     </pre>
  */
  function TagAttrLexer(src){
    this.buff = src;
    this._error = false;
  }

  TagAttrLexer.prototype = {
    /**
       @memberof Nehan.TagAttrLexer
       @return {boolean}
    */
    isEnd : function(){
      return this._error || (this.buff === "");
    },
    /**
       @memberof Nehan.TagAttrLexer
       @return {symbol}
    */
    get : function(){
      var c1 = this._peek();
      if(c1 === null){
	return null;
      }
      switch(c1){
      case "=":
	this._step(1);
	return c1;
      case "'": case "\"":
	return this._getLiteral(c1);
      case " ":
	this._step(1);
	return this.get(); // skip space
      default:
	return this._getSymbol();
      }
    },
    _peek : function(){
      return this.buff? this.buff.charAt(0) : null;
    },
    _step : function(length){
      this.buff = this.buff.substring(length);
    },
    _getSymbol : function(){
      var symbol = HtmlLexer.prototype._getByRex.call(this, __rex_symbol);
      if(symbol){
	this._step(symbol.length);
      }
      return symbol;
    },
    _getLiteral : function(quote_char){
      var quote_end_pos = this.buff.indexOf(quote_char, 1);
      if(quote_end_pos < 0){
	console.error("TagAttrLexer::syntax error:literal not closed(%s)", this.buff);
	this._error = true;
	return null;
      }
      var literal = this.buff.substring(1, quote_end_pos);
      this._step(quote_end_pos + 1);
      return literal;
    }
  };

  return TagAttrLexer;
})();

