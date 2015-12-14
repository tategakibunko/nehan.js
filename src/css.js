/**
   css utility module
   @namespace Nehan.Css
*/
Nehan.Css = {
  /**
     @memberof Nehan.Css
     @param args {Object}
     @return {String}
     @example
     * Nehan.Css.toString({"color":"red", "font-size":16}); // "color:'red'; 'font-size':16"
  */
  toString : function(args){
    var tmp = [];
    for(var prop in args){
      tmp.push(prop + ":" + args[prop]);
    }
    return tmp.join(";");
  },
  /**
   @memberof Nehan.Css
   @param str {String}
   @return {String}
   */
  normalizeValue : function(str){
    return str
      .replace(/;/g, "") // disable terminater
      .replace(/^\s+/, "") // cut head space
      .replace(/\s+$/, "") // cut tail space
      .replace(/\s+/g, " ") // many space -> single space
      .replace(/\s+,/g, ",") // cut space around comma before
      .replace(/,\s+/g, ",") // cut space around comma after
      .replace(/\s+\//g, "/") // cut space around slash before
      .replace(/\/\s+/g, "/") // cut space around slash after
      .replace(/\s+\(/g, "/") // cut space around left paren before
      .replace(/\)\s+/g, "/") // cut space around right paren after
    ;
  },
  /**
     @memberof Nehan.Css
     @param name {String}
     @return {String}
     @example
     * Nehan.Css.addNehanPrefix("foo"); // "nehan-foo"
  */
  addNehanPrefix : function(name){
    return (name.indexOf("nehan-") === 0)? name : "nehan-" + name;
  },
  /**
     @memberof Nehan.Css
     @param name {String}
     @return {String}
     @example
     * Nehan.Css.addNehanHeaderPrefix("foo"); // "nehan-header-foo"
  */
  addNehanHeaderPrefix : function(name){
    return "nehan-header-" + name;
  },
  /**
     @memberof Nehan.Css
     @param name {String}
     @return {String}
     @example
     * Nehan.Css.addNehanTocLinkPrefix("foo"); // "nehan-toc-link-foo"
  */
  addNehanTocLinkPrefix : function(name){
    return "nehan-toc-link-" + name;
  },
  /**
     set vender-prefixed css value like(-webkit-opacity, -moz-opacity etc).

     @memberof Nehan.Css
     @param 
     @param dst {Object}
     @param name {String}
     @param value {String}
     @return {Object}
     @example
     * Nehan.Css.setCssValueWithVender({}, "writing-mode", "vertical-rl");
  */
  setCssValueWithVender: function(dst, name, value){
    dst[name] = value; // no prefixed version
    Nehan.List.iter(Nehan.Const.cssVenderPrefixes, function(prefix){
      dst[prefix + "-" + name] = value;
    });
    return dst;
  }
};
