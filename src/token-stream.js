var TokenStream = (function(){
  function TokenStream(src){
    this.lexer = this._createLexer(src);
    this.tokens = [];
    this.pos = 0;
    this.eof = false;
    this._doBuffer();
  }

  TokenStream.prototype = {
    hasNext : function(){
      return (!this.eof || this.pos < this.tokens.length);
    },
    isEmpty : function(){
      return this.lexer.isEmpty();
    },
    isEmptyTokens : function(){
      return this.tokens.length === 0;
    },
    isHead : function(){
      return this.pos === 0;
    },
    prev : function(){
      this.pos = Math.max(0, this.pos - 1);
    },
    setPos : function(pos){
      this.pos = pos;
    },
    rewind : function(){
      this.pos = 0;
    },
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
    get : function(){
      var token = this.peek();
      this.pos++;
      return token;
    },
    getSrc : function(){
      return this.lexer.getSrc();
    },
    getPos : function(){
      return this.pos;
    },
    getTokenCount : function(){
      return this.tokens.length;
    },
    getSeekPos : function(){
      var token = this.tokens[this.pos];
      return token? token.spos : 0;
    },
    getSeekPercent : function(){
      var seek_pos = this.getSeekPos();
      return this.lexer.getSeekPercent(seek_pos);
    },
    getAll : function(){
      while(!this.eof){
	this._doBuffer();
      }
      return this.tokens;
    },
    getAllIf : function(fn){
      return List.filter(this.getAll(), function(token){
	return fn(token);
      });
    },
    getWhile : function(fn){
      var ret = [], token;
      while(this.hasNext()){
	token = this.get();
	if(token && fn(token)){
	  ret.push(token);
	} else {
	  this.prev();
	  break;
	}
      }
      return ret;
    },
    // break if fn(x) return null.
    mapWhile : function(fn){
      var ret = [], token, output;
      while(this.hasNext()){
	token = this.get();
	output = fn(token);
	if(token && output){
	  ret.push(output);
	} else {
	  this.prev();
	  break;
	}
      }
      return ret;
    },
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

