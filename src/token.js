/**
   utility module to check token type.

   @namespace Nehan.Token
*/
var Token = {
  /**
     @memberof Nehan.Token
     @param {token}
     @return {boolean}
  */
  isTag : function(token){
    return token instanceof Nehan.Tag;
  },
  /**
     @memberof Nehan.Token
     @param {token}
     @return {boolean}
  */
  isText : function(token){
    return (
      token instanceof Text ||
      token instanceof Char ||
      token instanceof Word ||
      token instanceof Tcy ||
      token instanceof Ruby
    );
  },
  /**
     @memberof Nehan.Token
     @param {token}
     @return {boolean}
  */
  isChar : function(token){
    return token instanceof Char;
  },
  /**
     @memberof Nehan.Token
     @param {token}
     @return {boolean}
  */
  isWord : function(token){
    return token instanceof Word;
  },
  /**
     @memberof Nehan.Token
     @param {token}
     @return {boolean}
  */
  isTcy : function(token){
    return token instanceof Tcy;
  },
  /**
     @memberof Nehan.Token
     @param {token}
     @return {boolean}
  */
  isEmphaTargetable : function(token){
    return token instanceof Char || token instanceof Tcy;
  },
  /**
     @memberof Nehan.Token
     @param {token}
     @return {boolean}
  */
  isNewLine : function(token){
    return token instanceof Char && token.isNewLine();
  },
  /**
     @memberof Nehan.Token
     @param {token}
     @return {boolean}
  */
  isWhiteSpace : function(token){
    return token instanceof Char && token.isWhiteSpace();
  }
};

