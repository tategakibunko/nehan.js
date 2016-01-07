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

  // @return {Nehan.Char(ref)}
  UprightTextLexer._getToken = function(){
    if(this.buff === ""){
      return null;
    }
    var pat;

    // character reference
    pat = this._matchCharRef();
    if(pat){
      return new Nehan.Char({ref:this._stepBuff(pat.length)});
    }

    // single character
    return new Nehan.Char({data:this._stepBuff(1)});
  };

  return UprightTextLexer;
})();
