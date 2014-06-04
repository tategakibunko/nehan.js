var TagAttrParser = (function(){
  function TagAttrParser(src){
    this._lexer = new TagAttrLexer(src);
    this._attrs = {};
    this._left = null;
  }

  TagAttrParser.prototype = {
    parse : function(){
      while(!this._isEnd()){
	this._parseAttr();
      }
      return this._attrs;
    },
    _isEnd : function(){
      return this._left === null && this._lexer.isEnd();
    },
    _parseAttr : function(){
      var token = this._lexer.get();
      if(token === null){
	if(this._left){
	  this._attrs[this._left] = true;
	  this._left = null;
	}
      } else if(token === "="){
	if(this._left === null){
	  throw "TagAttrParser::syntax error(" + src + ")";
	}
	var right = this._lexer.get();
	this._attrs[this._left] = right? this._parseRight(right) : true;
	this._left = null;
	return;
      } else if(this._left){
	this._attrs[this._left] = true;
	this._left = token;
      } else {
	this._left = token;
      }
    },
    _parseRight : function(token){
      switch(token){
      case "true": return true;
      case "false": return false;
      default: return token;
      }
    }
  };

  return TagAttrParser;
})();
