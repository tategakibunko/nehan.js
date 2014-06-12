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
    isSingleTag : function(tag_name){
      return __is_single_tag(tag_name) || __is_single_tag_rex(tag_name) || false;
    },
    addSingleTagByName : function(tag_name){
      if(!__is_single_tag(tag_name)){
	__single_tag_names__.push(tag_name);
      }
    },
    addSingleTagByRex : function(rex){
      if(!__find_single_tag_rex_by_rex(rex)){
	__single_tag_rexes__.push(rex);
      }
    }
  };
})();

