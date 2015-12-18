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
    var token = null, prop = null, attrs = {};
    var assign = function(prop, value){
      attrs[prop] = String(value); // right value is always string
    };
    while(prop !== null || !lexer.isEnd()){
      token = lexer.get();
      if(token === null){
	if(prop){
	  assign(prop, true);
	  prop = null;
	}
      } else if(token === "=" && prop){
	assign(prop, lexer.get() || true);
	prop = null;
      } else if(prop){
	// value without right value like 'checked', 'selected' etc.
	assign(prop, true);
	prop = token;
      } else if(token && token !== "="){
	prop = token;
      }
    }
    return attrs;
  }
};
