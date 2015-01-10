/**
   css utility module
   @namespace Nehan.Css
*/
var Css = {
  /**
     @memberof Nehan.Css
     @param args {Object}
     @return {String}
     @example
     * Css.toString({"color":"red", "font-size":16}); // "color:'red'; 'font-size':16"
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
     @param name {String}
     @return {String}
     @example
     * Css.addNehanPrefix("foo"); // "nehan-foo"
  */
  addNehanPrefix : function(name){
    return "nehan-" + name;
  },
  /**
     @memberof Nehan.Css
     @param name {String}
     @return {String}
     @example
     * Css.addNehanHeaderPrefix("foo"); // "nehan-header-foo"
  */
  addNehanHeaderPrefix : function(name){
    return "nehan-header-" + name;
  },
  /**
     @memberof Nehan.Css
     @param name {String}
     @return {String}
     @example
     * Css.addNehanTocLinkPrefix("foo"); // "nehan-toc-link-foo"
  */
  addNehanTocLinkPrefix : function(name){
    return "nehan-toc-link-" + name;
  }
};
