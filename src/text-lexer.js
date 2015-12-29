Nehan.TextLexer = (function (){
  var __rex_tcy = /^(?:\d\d|!\?|!!|\?!|\?\?)/;
  var __rex_tail_tcy = /(?:\d\d|!\?|!!|\?!|\?\?)$/;
  var __rex_float = /^\d+\.\d+/;
  var __rex_digit = /^\d+/;
  var __rex_time_hm = /^(?:\d{1,2}:)+\d{1,2}/;
  var __rex_date_ymd = /^(?:\d{1,4}\/)?\d{1,2}\/\d{1,2}/;
  var __rex_date_ymd_dot = /^\d{1,4}\.\d{1,2}\.\d{1,2}(?!\d)/;
  var __rex_money = /^(?:\d+,)+\d+/;
  var __rex_word = /^[a-zA-Z0-9.!?\/:$#"',’_%“”@]+/;
  var __rex_char_ref = /^&.+?;/;
  var __rex_half_single_tcy = /^[a-zA-Z0-9!?]/;
  var __rex_typographic_ligature = /^[\ufb00-\ufb06]/; // ff,fi,fl,ffi,ffl,ft,st
  var __typographic_ligature_refs = [
    "&#64256;", // ff
    "&#64257;", // fi
    "&#64258;", // fl
    "&#64259;", // ffi
    "&#64260;", // ffl
    "&#64261;", // ft
    "&#64262;"  // st
  ];

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

    // character reference
    pat = this._getByRex(__rex_char_ref);
    if(pat){
      var chr = new Nehan.Char({ref:this._stepBuff(pat.length)});
      // if typographic_ligature + word, pack as single word.
      if(Nehan.List.exists(__typographic_ligature_refs, Nehan.Closure.eq(pat))){
	var next = this._parseAsWord();
	if(next){
	  if(next instanceof Nehan.Word){
	    next.data = pat + next.data;
	    //console.log("(ligature + word):%o", next.data);
	    return next;
	  }
	  this.buff = next.data + this.buff; // push back
	}
      }
      //console.log("character reference:%o", pat);
      return chr;
    }

    // fetch as word -> token
    var token = this._parseAsWord();
    if(token){
      return token;
    }

    // typographic ligature
    pat = this.buff.substring(0, 1);
    if(__rex_typographic_ligature.test(pat)){
      //console.log("typographic ligature:%o", pat);
      return new Nehan.Word(this._stepBuff(1));
    }

    // simple character
    return new Nehan.Char({data:this._stepBuff(1)});
  };

  TextLexer.prototype._parseAsWord = function(rex, buff){
    var pat, pat2;

    // logest word pattern
    pat = this._getByRex(__rex_word);
    if(pat){
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
      pat2 = this._getByRex(__rex_money); // 1,000
      if(pat2){
	//console.log("money?:%o", pat2);
	return new Nehan.Word(this._stepBuff(pat2.length));
      }
      pat2 = this._getByRex(__rex_date_ymd_dot); // 2000.01.01
      if(pat2){
	return new Nehan.Word(this._stepBuff(pat2.length));
      }
      pat2 = this._getByRex(__rex_float); // 1.23
      if(pat2){
	//console.log("float:%o", pat2);
	return new Nehan.Word(this._stepBuff(pat2.length));
      }
      pat2 = this._getByRex(__rex_time_hm); // 01:23
      if(pat2){
	//console.log("time(hm):%o", pat2);
	return new Nehan.Word(this._stepBuff(pat2.length));
      }
      pat2 = this._getByRex(__rex_date_ymd); // 2000/01/01, 01/01
      if(pat2){
	//console.log("date(ymd):%o", pat2);
	return new Nehan.Word(this._stepBuff(pat2.length));
      }
      pat2 = this._getByRex(__rex_digit); // 1234
      if(pat2){
	if(pat2.length <= 2){
	  //console.log("tcy(digit2):%o", pat2);
	  return new Nehan.Tcy(this._stepBuff(pat2.length));
	}
	//console.log("digit:%o", pat2);
	return new Nehan.Word(this._stepBuff(pat2.length));
      }
      // if word + tcy(digit), divide it.
      //pat2 = this._getByRex(/(?<!\d)\d\d$/, pat);
      pat2 = this._getByRex(/^[^\d]\d{1,2}$/, pat); // :12 => word(:) + tcy(12)
      if(pat2){
	//console.log("divided single word:%o", pat2.charAt(0));
	return new Nehan.Word(this._stepBuff(1));
      }
      //console.log("word:%o", pat);
      return new Nehan.Word(this._stepBuff(pat.length));
    }
    return null;
  };

  TextLexer.prototype._getByRex = function(rex, buff){
    buff = buff || this.buff;
    var rex_result = buff.match(rex);
    return rex_result? rex_result[0] : null;
  };

  return TextLexer;
})();

