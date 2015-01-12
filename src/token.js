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
    return token._type === "tag";
  },
  /**
     @memberof Nehan.Token
     @param {token}
     @return {boolean}
  */
  isText : function(token){
    return token._type === "char" || token._type === "word" || token._type === "tcy" || token._type === "ruby";
  },
  /**
     @memberof Nehan.Token
     @param {token}
     @return {boolean}
  */
  isChar : function(token){
    return token._type === "char";
  },
  /**
     @memberof Nehan.Token
     @param {token}
     @return {boolean}
  */
  isWord : function(token){
    return token._type === "word";
  },
  /**
     @memberof Nehan.Token
     @param {token}
     @return {boolean}
  */
  isTcy : function(token){
    return token._type === "tcy";
  },
  /**
     @memberof Nehan.Token
     @param {token}
     @return {boolean}
  */
  isNewLine : function(token){
    return token instanceof Char && token.isNewLineChar();
  },
  /**
     @memberof Nehan.Token
     @param {token}
     @return {boolean}
  */
  isWhiteSpace : function(token){
    return token instanceof Char && token.isWhiteSpaceChar();
  }
};

