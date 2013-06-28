var RubyStream = (function(){
  function RubyStream(content){
    this.rubies = this._parseAll(new TokenStream(content));
    this.pos = 0;
  }

  RubyStream.prototype = {
    backup : function(){
      this.backupPos = this.pos;
    },
    rollback : function(){
      if(typeof this.backupPos != "undefined"){
	this.pos = this.backupPos;
      }
    },
    hasNext : function(){
      return this.pos < this.rubies.length;
    },
    peek : function(){
      if(!this.hasNext()){
	return null;
      }
      return this.rubies[this.pos];
    },
    get : function(){
      var ruby = this.peek();
      ruby.index = this.pos;
      this.pos++;
      return ruby;
    },
    getPos : function(){
      return this.pos;
    },
    isHead : function(){
      return this.pos === 0;
    },
    prev : function(){
      this.pos = Math.max(0, this.pos - 1);
    },
    _parseAll : function(stream){
      var ret = [];
      while(stream.hasNext()){
	ret.push(this._parseRuby(stream));
      }
      return ret;
    },
    _parseRuby : function(stream){
      var rbs = [];
      var rt = null;
      while(true){
	var token = stream.get();
	if(token === null){
	  break;
	}
	if(Token.isTag(token) && token.getName() === "rt"){
	  rt = token;
	  break;
	}
	if(Token.isText(token)){
	  rbs.push(token);
	}
      }
      return new Ruby(rbs, rt);
    }
  };

  return RubyStream;
})();
