/**
   module of html lexing rule

   @namespace Nehan.LexingRule
*/
var LexingRule = (function(){
  var __single_tag_names__ = [
    "br",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "wbr",
    "?xml",
    "!doctype",
    "page-break",
    "end-page",
    "pbr"
  ];

  var __is_single_tag = function(tag_name){
    return List.exists(__single_tag_names__, Closure.eq(tag_name));
  };

  return {
    /**
       @memberof Nehan.LexingRule
       @return {Array.<String>}
    */
    getSingleTagNames : function(){
      return __single_tag_names__;
    },
    /**
       @memberof Nehan.LexingRule
       @param tag_name {String}
       @return {boolean}
       @example
       * LexingRule.isSingleTag("img"); // true
       * LexingRule.isSingleTag("br"); // true
       * LexingRule.isSingleTag("div"); // false
    */
    isSingleTag : function(tag_name){
      return __is_single_tag(tag_name) || false;
    },
    /**
       @memberof Nehan.LexingRule
       @param tag_name {String}
       @example
       * LexingRule.addSingleTagByName("my-custom-single-tag");
       * LexingRule.isSingleTag("my-custom-single-tag"); // true
    */
    addSingleTagByName : function(tag_name){
      if(!__is_single_tag(tag_name)){
	__single_tag_names__.push(tag_name);
      }
    }
  };
})();

