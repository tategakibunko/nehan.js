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

  var __single_tag_rexes__ = [];

  var __is_single_tag = function(tag_name){
    return List.exists(__single_tag_names__, Closure.eq(tag_name));
  };

  var __is_single_tag_rex = function(tag_name){
    return List.exists(__single_tag_rexes__, function(rex){
      return rex.test(tag_name);
    });
  };

  var __find_single_tag_rex_by_rex = function(rex){
    return List.exists(__single_tag_rexes__, function(rex_){
      return rex.source === rex_.source;
    });
  };

  return {
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
      return __is_single_tag(tag_name) || __is_single_tag_rex(tag_name) || false;
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
    },
    /**
       @memberof Nehan.LexingRule
       @param rex {RegExp}
       @example
       * LexingRule.addSingleTagByName(new RegExp("my-single-\d"));
       * LexingRule.isSingleTag("my-single-1"); // true
    */
    addSingleTagByRex : function(rex){
      if(!__find_single_tag_rex_by_rex(rex)){
	__single_tag_rexes__.push(rex);
      }
    }
  };
})();

