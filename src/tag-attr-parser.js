var TagAttrParser = (function(){
  /**
     @memberof Nehan
     @class TagAttrParser
     @classdesc tag attribute parser
     @constructor
     @param src {String}
  */
  function TagAttrParser(src){
    this._lexer = new TagAttrLexer(src);
    this._attrs = {};
    this._left = null;
  }

  TagAttrParser.prototype = {
    /**
       @memberof Nehan.TagAttrParser
       @return {Object}
    */
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
	  this._attrs[this._left] = "true";
	  this._left = null;
	}
      } else if(token === "="){
	if(this._left === null){
	  throw "TagAttrParser::syntax error(=)";
	}
	this._attrs[this._left] = this._lexer.get() || "true";
	this._left = null;
	return;
      } else if(this._left){
	this._attrs[this._left] = "true";
	this._left = token;
      } else {
	this._left = token;
      }
    }
  };

  return TagAttrParser;
})();
