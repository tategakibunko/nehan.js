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
   @return {int}
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
    return str.replace(/^\n+/, "");
  },
  /**
   @memberof Nehan.Utils
   @param str {String}
   */
  trimFootCRLF : function(str){
    return str.replace(/\n+$/, "");
  },
  /**
   @memberof Nehan.Utils
   @param str {String}
   */
  trimCRLF : function(str){
    return this.trimFootCRLF(this.trimHeadCRLF(str));
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
   @return {String}
   */
  normalizeCssValueStr : function(str){
    return str
      .replace(/;/g, "") // disable terminater
      .replace(/^\s+/, "") // cut head space
      .replace(/\s+$/, "") // cut tail space
      .replace(/\s+/g, " ") // many space -> single space
      .replace(/\s+\//g, "/") // cut space around slash before
      .replace(/\/\s+/g, "/") // cut space around slash after
    ;
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
  }
};
