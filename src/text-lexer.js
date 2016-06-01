Nehan.TextLexer = (function (){
  var __rex_tcy = /^(?:\d\d|!\?|!!|\?!|\?\?)/;
  var __rex_tail_tcy = /(?:\d\d|!\?|!!|\?!|\?\?)$/;
  var __rex_float = /^\d+\.\d+/;
  var __rex_digit = /^\d+/;
  var __rex_digit_group = /^(?:\d+[.:/])+\d+(?!\d)/;
  var __rex_money = /^(?:\d+,)+\d+/;
  var __rex_char_ref = /^&.+?;/;
  var __rex_half_single_tcy = /^[a-zA-Z0-9!?]/;
  var __typographic_ligature_refs = [
    "&#xFB00;", // ff
    "&#xFB01;", // fi
    "&#xFB02;", // fl
    "&#xFB03;", // ffi
    "&#xFB04;", // ffl
    "&#xFB05;", // ft
    "&#xFB06;"  // st
  ];

  /**
   @memberof Nehan
   @class TextLexer
   @classdesc lexer of html text elements.
   @constructor
   @extends {Nehan.HtmlLexer}
   @param src {String}
  */
  function TextLexer(src){
    Nehan.HtmlLexer.call(this, src);
  }

  Nehan.Class.extend(TextLexer, Nehan.HtmlLexer);

  // @return {Nehan.Char | Nehan.Tcy | Nehan.Word}
  TextLexer.prototype._getToken = function(){
    if(this.buff === ""){
      return null;
    }
    var pat;

    // character reference
    pat = this._matchCharRef();
    if(pat){
      return this._parseAsCharRef(pat);
    }

    // word
    pat = this._matchWord(); // longuest word pattern
    if(pat){
      var word = this._parseAsWord(pat);
      // check if connected by software hyphen(&shy;)
      if(this.buff.indexOf("&shy;") === 0){
	word.data += "&shy;";
	this._stepBuff(5); // "&shy;".length
	var next = this._getToken();
	if(next){
	  word.data += next.data;
	  //console.log("&shy; connected word:%o", word);
	}
      }
      return word;
    }

    // single character
    return this._parseAsChar();
  };

  // @return {Nehan.Char}
  TextLexer.prototype._parseAsChar = function(){
    var lead = this.buff.charCodeAt(0);
    // check surrogate pair
    if(0xd800 <= lead && lead <= 0xdbff){
      var trail = this.buff.charCodeAt(1);
      if(trail && 0xdc00 <= trail && trail <= 0xdfff){
	return new Nehan.Char({data:this._stepBuff(2)});
      }
    }
    return new Nehan.Char({data:this._stepBuff(1)});
  };

  // @return {Nehan.Char | Nehan.Word}
  TextLexer.prototype._parseAsCharRef = function(pat){
    var chr = new Nehan.Char({ref:this._stepBuff(pat.length)});
    // if typographic_ligature + word, pack as single word.
    if(Nehan.List.exists(__typographic_ligature_refs, Nehan.Closure.eq(pat))){
      var next = this._parseAsWord(pat);
      if(next && next instanceof Nehan.Word){
	next.data = pat + next.data;
	//console.log("(typographic_ligature + word):%o", next.data);
	return next;
      }
      // if look-ahead is not word, push-back to buffer.
      if(next){
	this.buff = next.data + this.buff;
      }
    }
    //console.log("character reference:%o", pat);
    return chr;
  };

  // @return {Nehan.Char | Nehan.Tcy | Nehan.Word}
  TextLexer.prototype._parseAsWord = function(pat){
    var pat2;

    //console.log("longest word:%o", pat);
    // length 1
    if(pat.length === 1){
      if(__rex_half_single_tcy.test(pat)){
	//console.log("tcy(1):%o", pat);
	return new Nehan.Tcy(this._stepBuff(1));
      }
      //console.log("char:%o", pat);
      return new Nehan.Char({data:this._stepBuff(1)});
    }
    // length 2 and tcy pattern
    if(pat.length === 2 && __rex_tcy.test(pat)){
      //console.log("tcy(2):%o", pat);
      return new Nehan.Tcy(this._stepBuff(2));
    }
    pat2 = this._match(__rex_money); // 1,000
    if(pat2){
      //console.log("money?:%o", pat2);
      return new Nehan.Word(this._stepBuff(pat2.length));
    }
    pat2 = this._match(__rex_digit_group); // 2000.01.01, 12:34, 2001/12/12 ... etc
    if(pat2){
      //console.log("digit group?:%o", pat2);
      return new Nehan.Word(this._stepBuff(pat2.length));
    }
    pat2 = this._match(__rex_float); // 1.23
    if(pat2){
      //console.log("float:%o", pat2);
      return new Nehan.Word(this._stepBuff(pat2.length));
    }
    pat2 = this._match(__rex_digit); // 1234
    if(pat2){
      if(pat2.length <= 2){
	//console.log("tcy(digit2):%o", pat2);
	return new Nehan.Tcy(this._stepBuff(pat2.length));
      }
      //console.log("digit:%o", pat2);
      return new Nehan.Word(this._stepBuff(pat2.length));
    }
    // if word + tcy(digit), divide it.
    //pat2 = this._match(/(?<!\d)\d\d$/, pat);
    pat2 = this._match(/^[^\d]\d{1,2}$/, pat); // :12 => word(:) + tcy(12)
    if(pat2){
      //console.log("divided single word:%o", pat2.charAt(0));
      return new Nehan.Word(this._stepBuff(1));
    }
    //console.log("word:%o", pat);
    return new Nehan.Word(this._stepBuff(pat.length));
  };

  TextLexer.prototype._match = function(rex, buff){
    buff = buff || this.buff;
    var rex_result = buff.match(rex);
    return rex_result? rex_result[0] : null;
  };

  TextLexer.prototype._matchWord = function(buff){
    return this._match(Nehan.Config.rexWord, buff || null);
  };

  TextLexer.prototype._matchCharRef = function(buff){
    return this._match(__rex_char_ref, buff || null);
  };

  return TextLexer;
})();

