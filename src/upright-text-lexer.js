Nehan.UprightTextLexer = (function(){
  /**
   @memberof Nehan
   @class UprightTextLexer
   @constructor
   @extends {Nehan.TextLexer}
   @param src {String}
  */
  function UprightTextLexer(src){
    Nehan.TextLexer.call(this, src);
  }

  Nehan.Class.extend(UprightTextLexer, Nehan.TextLexer);

  // @return {Nehan.Char(ref)|Nehan.Tcy}
  UprightTextLexer.prototype._getToken = function(){
    if(this.buff === ""){
      return null;
    }
    var pat, data;

    // character reference
    pat = this._matchCharRef();
    if(pat){
      //console.log("single char ref:%o", pat);
      data = this._stepBuff(pat.length);
      return new Nehan.Char({ref:data});
    }

    // single character
    data = this._stepBuff(1);
    if(this._matchWord(data)){
      //console.log("single tcy:%s", data);
      return new Nehan.Tcy(data);
    }
    //console.log("single char:%s", data);
    return new Nehan.Char({data:data});
  };

  return UprightTextLexer;
})();
