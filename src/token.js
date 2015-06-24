/**
   utility module to check token type.

   @namespace Nehan.Token
*/
Nehan.Token = {
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
      token instanceof Nehan.Text ||
      token instanceof Nehan.Char ||
      token instanceof Nehan.Word ||
      token instanceof Nehan.Tcy ||
      token instanceof Nehan.Ruby
    );
  },
  /**
     @memberof Nehan.Token
     @param {token}
     @return {boolean}
  */
  isChar : function(token){
    return token instanceof Nehan.Char;
  },
  /**
     @memberof Nehan.Token
     @param {token}
     @return {boolean}
  */
  isWord : function(token){
    return token instanceof Nehan.Word;
  },
  /**
     @memberof Nehan.Token
     @param {token}
     @return {boolean}
  */
  isTcy : function(token){
    return token instanceof Nehan.Tcy;
  },
  /**
     @memberof Nehan.Token
     @param {token}
     @return {boolean}
  */
  isEmphaTargetable : function(token){
    return token instanceof Nehan.Char || token instanceof Nehan.Tcy;
  },
  /**
     @memberof Nehan.Token
     @param {token}
     @return {boolean}
  */
  isNewLine : function(token){
    return token instanceof Nehan.Char && token.isNewLine();
  },
  /**
     @memberof Nehan.Token
     @param {token}
     @return {boolean}
  */
  isWhiteSpace : function(token){
    return token instanceof Nehan.Char && token.isWhiteSpace();
  }
};

