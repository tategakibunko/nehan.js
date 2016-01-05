/**
 misc utility module.

 @namespace Nehan.Utils
 */
Nehan.Utils = {
  /**
   convert [decial] number by [base]

   @memberof Nehan.Utils
   @param deciaml {int}
   @param base {int}
   @return {Array.<int>}
   */
  convBase : function(decimal, base){
    if(decimal === 0){
      return [0];
    }
    var ret = [];
    var work = decimal;
    while(work > 0){
      ret.unshift(work % base);
      work = Math.floor(work / base);
    }
    return ret;
  },
  /**
   @memberof Nehan.Utils
   @param str {String}
   */
  trimHeadCRLF : function(str){
    return str.replace(/^[\r|\n]+/, "");
  },
  /**
   @memberof Nehan.Utils
   @param str {String}
   */
  trimTailCRLF : function(str){
    return str.replace(/[\r|\n]+$/, "");
  },
  /**
   @memberof Nehan.Utils
   @param str {String}
   */
  trimCRLF : function(str){
    return this.trimTailCRLF(this.trimHeadCRLF(str));
  },
  /**
   @memberof Nehan.Utils
   @param str {String}
   */
  trim : function(str){
    return str.replace(/^\s+/, "").replace(/\s+$/, "");
  },
  /**
   @memberof Nehan.Utils
   @param str {String}
   */
  cutQuote : function(str){
    return str.replace(/['\"]/g, "");
  },
  /**
   @memberof Nehan.Utils
   @param str {String}
   @example
   * Nehan.Utils.capitalize("japan"); // "Japan"
   */
  capitalize : function(str){
    if(str === ""){
      return "";
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  },
  /**
   @memberof Nehan.Utils
   @param p1 {String}
   @param p2 {String}
   @example
   * Nehan.Utils.filenameConcat("/path/to", "foo"); // "/path/to/foo"
   * Nehan.Utils.filenameConcat("/path/to/", "foo"); // "/path/to/foo"
   */
  filenameConcat : function(p1, p2){
    p1 = (p1==="")? "" : (p1.slice(-1) === "/")? p1 : p1 + "/";
    p2 = (p2==="")? "" : (p2[0] === "/")? p2.substring(1, p2.length) : p2;
    return p1 + p2;
  },
  /**
   @memberof Nehan.Utils
   @param name {String}
   @example
   * Nehan.Utils.camelToChain("fontSize"); // "font-size"
   */
  camelToChain : function(name){
    return name.replace(/([A-Z])/g, function(match, p1){
      return "-" + p1.toLowerCase();
    });
  },
  /**
   @memberof Nehan.Utils
   @param name {String}
   @example
   * Nehan.Utils.camelize("font-size"); // "fontSize"
   */
  camelize : function(name){
    return (name.indexOf("-") < 0)? name : name.split("-").map(function(part, i){
      return (i === 0)? part : this.capitalize(part);
    }.bind(this)).join("");
  },
  /**
   @memberof Nehan.Utils
   @param str {String}
   @param splitter {String}
   @return {Array<String>}
   */
  splitBy : function(str, splitter){
    if(str.indexOf(splitter) < 0){
      return [str];
    }
    return str.split(splitter);
  },
  /**
   @memberof Nehan.Utils
   @param str {String}
   @return {Array<String>}
   */
  splitBySpace : function(str){
    if(str.indexOf(" ") < 0){
      return [str];
    }
    return str.split(/\s+/);
  },
  /**
   @memberof Nehan.Utils
   @param value {Any}
   @return {bool}
   */
  isNumber : function(value){
    if(value === Infinity){
      return true;
    }
    if(typeof(value) != "number" && typeof(value) != "string"){
      return false;
    }
    return (value == parseFloat(value) && isFinite(value));
  },
  /**
   @memberof Nehan.Utils
   @param em {float}
   @return {int}
   */
  getEmSize: function(em, base_size){
    return Math.round(base_size * em);
  },
  /**
   @memberof Nehan.Utils
   @param pt {float}
   @return {int}
   */
  getPxFromPt: function(pt){
    return Math.round(pt * 4 / 3);
  },
  /**
   @memberof Nehan.Utils
   @param pt {float}
   @parma max_value {int}
   @return {int}
   */
  getPercentValue : function(percent, max_value){
    return Math.round(max_value * percent / 100);
  },
  /**
   @memberof Nehan.Utils
   @param text {String}
   @param letter_modifier {Function} first_letter:string -> string
   @return {String}
   */
  replaceFirstLetter : function(text, letter_modifier){
    return text.replace(/(^(<[^>]+>|[\s\n])*)(\S)/mi, function(match, p1, p2, p3){
      return p1 + letter_modifier(p3);
    });
  },
  /**
   @memberof Nehan.Utils
   @param char_ref {String}
   @return {int}
   @example
   * Nehan.Utils.charCodeOfCharRef("&#xFB00;"); // => 64256
   * Nehan.Utils.charCodeOfCharRef("&#64256;"); // => 64256
   */
  charCodeOfCharRef : function(char_ref){
    if(char_ref.indexOf("&#x") === 0){
      return parseInt(char_ref.replace("&#x", "").replace(";", ""), 16);
    }
    return parseInt(char_ref.replace("&#", "").replace(";", ""), 10);
  },
  /**
   @memberof Nehan.Utils
   @param char_ref {String}
   @return {bool}
   */
  isNumCharRef : function(char_ref){
    return /&#x?[0-9a-f]{4,};/i.test(char_ref);
  },
  /**
   @memberof Nehan.Utils
   @param char_ref {String}
   @return {String}
   */
  charRefToUni : function(char_ref){
    if(!this.isNumCharRef(char_ref)){
      return char_ref;
    }
    return String.fromCharCode(this.charCodeOfCharRef(char_ref));
  }
};
