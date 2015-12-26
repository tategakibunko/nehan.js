Nehan.TextLexer = (function (){
  var __rex_tcy = /\d\d|!\?|!!|\?!|\?\?/;
  var __rex_float = /^\d+\.\d+/;
  var __rex_digit = /^\d+/;
  var __rex_word = /^[a-zA-Z0-9.!?\/:$#;"',_%]+/;
  var __rex_char_ref = /^&[^;\s]+;/;
  var __rex_half_single_tcy = /[a-zA-Z0-9!?]/;
  var __rex_typographic_ligature = /[\ufb00-\ufb06]/; // ff,fi,fl,ffi,ffl,ft

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
    var pat, pat2;
    pat = this._getByRex(__rex_word); // logest word pattern first
    if(pat){
      if(pat.length === 1){
	if(__rex_half_single_tcy.test(pat)){
	  return new Nehan.Tcy(this._stepBuff(1));
	}
	return new Nehan.Char({data:this._stepBuff(1)});
      }
      pat2 = this._getByRex(__rex_float);
      if(pat2){
	return new Nehan.Word(this._stepBuff(pat2.length));
      }
      pat2 = this._getByRex(__rex_digit);
      if(pat2){
	if(pat2.length <= 2){
	  return new Nehan.Tcy(this._stepBuff(pat2.length));
	}
	return new Nehan.Word(this._stepBuff(pat2.length));
      }
      if(pat.length === 2 && pat.match(__rex_tcy)){
	return new Nehan.Tcy(this._stepBuff(pat.length));
      }
      return new Nehan.Word(this._stepBuff(pat.length));
    }
    pat = this._getByRex(__rex_char_ref);
    if(pat){
      return new Nehan.Char({ref:this._stepBuff(pat.length)});
    }
    pat = this.buff.subpating(0, 1);
    if(__rex_typographic_ligature.test(pat)){
      return new Nehan.Word(this._stepBuff(1));
    }
    return new Nehan.Char({data:this._stepBuff(1)});
  };

  TextLexer.prototype._getByRex = function(rex){
    var rex_result = this.buff.match(rex);
    return rex_result? rex_result[0] : null;
  };

  return TextLexer;
})();

