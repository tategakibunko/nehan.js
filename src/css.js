/**
   css utility module
   @namespace Nehan.Css
*/
Nehan.Css = {
  normalizeKey : function(key){
    return Nehan.Utils.trim(key)
      .toLowerCase()
      .replace(/\s+/g, " ") // many space -> single space
      .replace(/\s+,/g, ",") // cut space around comma before
      .replace(/,\s+/g, ",") // cut space around comma after
      .replace(/\s+\(/g, "(") // cut space around left paren before
      .replace(/\(\s+/g, "(") // cut space around left paren after
    ;
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
      .replace(/\s+\(/g, "(") // cut space around left paren before
      .replace(/\(\s+/g, "(") // cut space around left paren after
      .replace(/\s+\)/g, ")") // cut space around right paren before
      .replace(/\)\s+/g, ")") // cut space around right paren after
    ;
  },
  /**
   @memberof Nehan.Css
   @param css_image_url{String}
   @return {String}
   @example
   * Nehan.Css.getImageURL("url('foo.png')"); // => 'foo.png'
   */
  getImageURL : function(css_image_url){
    return css_image_url
      .replace(/url/gi, "")
      .replace(/'/g, "")
      .replace(/"/g, "")
      .replace(/\(/g, "")
      .replace(/\)/g, "")
      .replace(/\s/g, "")
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
  }
};
