var TokenStream = Class.extend({
  init : function(src, lexer){
    this.lexer = lexer || new HtmlLexer(src);
    this.tokens = [];
    this.pos = 0;
    this.backupPos = 0;
    this.eof = false;
    this._doBuffer();
  },
  hasNext : function(){
    return !this.isEnd();
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
  isEnd : function(){
    return (this.eof && this.pos >= this.tokens.length);
  },
  backup : function(){
    if(this.hasNext()){
      this.backupPos = this.pos;
    }
  },
  look : function(index){
    return this.tokens[index] || null;
  },
  rollback : function(){
    this.pos = this.backupPos;
  },
  next : function(cnt){
    var count = cnt || 1;
    this.pos = this.pos + count;
  },
  prev : function(){
    this.pos = Math.max(0, this.pos - 1);
  },
  setPos : function(pos){
    this.pos = pos;
  },
  skipIf : function(fn){
    var token = this.peek();
    if(token && fn(token)){
      this.next();
    }
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
    token.pos = index;
    return token;
  },
  get : function(){
    var token = this.peek();
    this.pos++;
    return token;
  },
  getPos : function(){
    return this.pos;
  },
  getBackupPos : function(){
    return this.backupPos;
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
  // iterate while fn(pos, token) returns true.
  // so loop is false break
  iterWhile : function(start_pos, fn){
    var ptr = (arguments.length == 1)? this.pos : start_pos;
    while(ptr >= 0){
      if(ptr >= this.tokens.length){
	if(this.eof){
	  break;
	}
	this._doBuffer();
	this.iterWhile(ptr, fn);
	break;
      }
      if(!fn(ptr, this.tokens[ptr])){
	break;
      }
      ptr++;
    }
  },
  // reverse iterate while fn(pos, token) returns true.
  // so loop is false break
  revIterWhile : function(start_pos, fn){
    var ptr = (arguments.length == 1)? this.pos : start_pos;
    while(ptr >= 0){
      if(!fn(ptr, this.tokens[ptr])){
	break;
      }
      ptr--;
    }
  },
  findTextPrev : function(start_p){
    var start_pos = (typeof start_pos != "undefined")? start_p : this.pos;
    var text = null;
    this.revIterWhile(start_pos - 1, function(pos, token){
      if(Token.isText(token)){
	text = token;
	return false; // break
      }
      return true; // continue
    });
    return text;
  },
  findTextNext : function(start_p){
    var start_pos = (typeof start_p != "undefined")? start_p : this.pos;
    var text = null;
    this.iterWhile(start_pos + 1, function(pos, token){
      if(Token.isText(token)){
	text = token;
	return false; // break
      }
      return true; // continue
    });
    return text;
  },
  _doBuffer : function(){
    var self = this;
    var buff_len = Config.lexingBufferLen;
    var push = function(token){
      self.tokens.push(token);
    };
    for(var i = 0; i < buff_len; i++){
      var token = this.lexer.get();
      if(token === null){
	this.eof = true;
	break;
      }
      push(token);
    }
  }
});
