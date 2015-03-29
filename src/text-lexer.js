var TextLexer = (function (){
  var __rex_tcy = /\d\d|!\?|!!|\?!|\?\?/;
  var __rex_word = /^[\w!\.\?\/\:#;"',]+/;
  var __rex_char_ref = /^&[^;\s]+;/;

  /**
     @memberof Nehan
     @class TextLexer
     @classdesc lexer of html text elements.
     @constructor
     @param src {String}
  */
  function TextLexer(src){
    HtmlLexer.call(this, src);
  }

  Class.extend(TextLexer, HtmlLexer);

  TextLexer.prototype._getToken = function(){
    if(this.buff === ""){
      return null;
    }
    var str = this._getByRex(__rex_word);
    if(str){
      if(str.length === 1){
	return new Char(this._stepBuff(1), false);
      } else if(str.length === 2 && str.match(__rex_tcy)){
	return new Tcy(this._stepBuff(str.length));
      }
      return new Word(this._stepBuff(str.length));
    }
    str = this._getByRex(__rex_char_ref);
    if(str){
      return new Char(this._stepBuff(str.length), true);
    }
    str = this.buff.substring(0, 1);
    return new Char(this._stepBuff(1), false);
  };

  TextLexer.prototype._getByRex = function(rex){
    var rex_result = this.buff.match(rex);
    return rex_result? rex_result[0] : null;
  };

  return TextLexer;
})();

