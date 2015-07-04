/**
   @memberof Nehan
   @namespace Nehan.TagAttrParser
*/
Nehan.TagAttrParser = {
  /**
     @memberof Nehan.TagAttrParser
     @param src {string}
     @return {Object}
  */
  parse : function(src){
    var lexer = new Nehan.TagAttrLexer(src);
    var token = null, left = null, attrs = {};
    while(left !== null || !lexer.isEnd()){
      token = lexer.get();
      if(token === null){
	if(left){
	  attrs[left] = "true";
	  left = null;
	}
      } else if(token === "=" && left){
	attrs[left] = lexer.get() || "true";
	left = null;
      } else if(left){
	// value without right value like 'checked', 'selected' etc.
	attrs[left] = "true";
	left = token;
      } else if(token && token !== "="){
	left = token;
      }
    }
    return attrs;
  }
};
