var TokenStream = (function(){
  /**
     @memberof Nehan
     @class TokenStream
     @classdesc abstraction of token stream with background buffering.
     @constructor
     @param src {String}
  */
  function TokenStream(src){
    this.lexer = this._createLexer(src);
    this.tokens = [];
    this.pos = 0;
    this.eof = false;
    this._doBuffer();
  }

  TokenStream.prototype = {
    /**
       @memberof Nehan.TokenStream
       @return {boolean}
    */
    hasNext : function(){
      return (!this.eof || this.pos < this.tokens.length);
    },
    /**
       @memberof Nehan.TokenStream
       @return {boolean}
    */
    isEmptyLexer : function(){
      return this.lexer.isEmpty();
    },
    /**
       @memberof Nehan.TokenStream
       @return {boolean}
    */
    isEmptyTokens : function(){
      return this.tokens.length === 0;
    },
    /**
       @memberof Nehan.TokenStream
       @return {boolean}
    */
    isHead : function(){
      return this.pos === 0;
    },
    /**
       @memberof Nehan.TokenStream
       @param text {String}
    */
    addText : function(text){
      // check if already done, and text is not empty.
      if(this.eof && text !== ""){
	this.lexer.addText(text);
	this.eof = false;
      }
    },
    /**
       step backward current stream position.

       @memberof Nehan.TokenStream
    */
    prev : function(){
      this.pos = Math.max(0, this.pos - 1);
    },
    /**
       set stream position directly.

       @memberof Nehan.TokenStream
       @param pos {int}
    */
    setPos : function(pos){
      this.pos = pos;
    },
    /**
       set current stream position to the beginning of stream.

       @memberof Nehan.TokenStream
    */
    rewind : function(){
      this.pos = 0;
    },
    /**
       look current token but not step forward current position.

       @memberof Nehan.TokenStream
       @return {token}
    */
    peek : function(off){
      var offset = off || 0;
      var index = Math.max(0, this.pos + offset);
      if(index >= this.tokens.length){
	if(this.eof){
	  return null;
	}
	this._doBuffer();
      }
      var token = this.tokens[index];
      if(token){
	token.pos = index;
	return token;
      }
      return null;
    },
    /**
       get current stream token and step forward current position.

       @memberof Nehan.TokenStream
       @return {token}
    */
    get : function(){
      var token = this.peek();
      this.pos++;
      return token;
    },
    /**
       get stream soruce as text.

       @memberof Nehan.TokenStream
       @return {String}
    */
    getSrc : function(){
      return this.lexer.getSrc();
    },
    /**
       get current stream position.

       @memberof Nehan.TokenStream
       @return {int}
    */
    getPos : function(){
      return this.pos;
    },
    /**
       get current token count.

       @memberof Nehan.TokenStream
       @return {int}
    */
    getTokenCount : function(){
      return this.tokens.length;
    },
    /**
       get current token position of source text(not stream position).

       @memberof Nehan.TokenStream
       @return {int}
    */
    getSeekPos : function(){
      var token = this.tokens[this.pos];
      return token? token.spos : 0;
    },
    /**
       get current seek pos as percent.

       @memberof Nehan.TokenStream
       @return {int}
    */
    getSeekPercent : function(){
      var seek_pos = this.getSeekPos();
      return this.lexer.getSeekPercent(seek_pos);
    },
    /**
       read whole stream source, and return all tokens immediately.

       @memberof Nehan.TokenStream
       @return {Array.<token>}
    */
    getAll : function(){
      while(!this.eof){
	this._doBuffer();
      }
      return this.tokens;
    },
    /**
       read whole stream source, and return all tokens immediately, but filter by [fn].

       @memberof Nehan.TokenStream
       @param fn {Function}
       @return {Array.<token>}
    */
    getAllIf : function(fn){
      return List.filter(this.getAll(), function(token){
	return fn(token);
      });
    },
    /**
       iterate tokens by [fn].

       @memberof Nehan.TokenStream
       @param fn {Function}
    */
    iterWhile : function(fn){
      var token;
      while(this.hasNext()){
	token = this.get();
	if(token === null || !fn(token)){
	  this.prev();
	  break;
	}
      }
    },
    /**
       step stream position while [fn(token)] is true.

       @memberof Nehan.TokenStream
       @param fn {Function}
    */
    skipUntil : function(fn){
      while(this.hasNext()){
	var token = this.get();
	if(token === null){
	  break;
	}
	if(!fn(token)){
	  this.prev();
	  break;
	}
      }
    },
    _createLexer : function(src){
      return new HtmlLexer(src);
    },
    _doBuffer : function(){
      var buff_len = Config.lexingBufferLen;
      for(var i = 0; i < buff_len; i++){
	var token = this.lexer.get();
	if(token === null){
	  this.eof = true;
	  break;
	}
	this.tokens.push(token);
      }
    }
  };

  return TokenStream;
})();

