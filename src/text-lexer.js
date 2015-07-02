var TextLexer = (function (){
  var __rex_tcy = /\d\d|!\?|!!|\?!|\?\?/;
  var __rex_word = /^[a-zA-Z0-9.!?\/:$#;"',_%]+/;
  var __rex_char_ref = /^&[^;\s]+;/;
  var __rex_half_single_tcy = /[a-zA-Z0-9!?]/;

  /**
     @memberof Nehan
     @class TextLexer
     @classdesc lexer of html text elements.
     @constructor
     @param src {String}
  */
  function TextLexer(src){
    Nehan.HtmlLexer.call(this, src);
  }

  Nehan.Class.extend(TextLexer, Nehan.HtmlLexer);

  TextLexer.prototype._getToken = function(){
    if(this.buff === ""){
      return null;
    }
    var str = this._getByRex(__rex_word);
    if(str){
      if(str.length === 1){
	if(__rex_half_single_tcy.test(str)){
	  return new Nehan.Tcy(this._stepBuff(1));
	}
	return new Nehan.Char(this._stepBuff(1), false);
      } else if(str.length === 2 && str.match(__rex_tcy)){
	return new Nehan.Tcy(this._stepBuff(str.length));
      }
      return new Nehan.Word(this._stepBuff(str.length));
    }
    str = this._getByRex(__rex_char_ref);
    if(str){
      return new Nehan.Char(this._stepBuff(str.length), true);
    }
    str = this.buff.substring(0, 1);
    return new Nehan.Char(this._stepBuff(1), false);
  };

  TextLexer.prototype._getByRex = function(rex){
    var rex_result = this.buff.match(rex);
    return rex_result? rex_result[0] : null;
  };

  return TextLexer;
})();

