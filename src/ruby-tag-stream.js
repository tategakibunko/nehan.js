var RubyTagStream = TokenStream.extend({
  init : function(src){
    this._super(src);
    this.getAll();
    this.tokens = this._parse();
    this.rewind();
  },
  _parse : function(stream){
    var ret = [];
    while(this.hasNext()){
      ret.push(this._parseRuby());
    }
    return ret;
  },
  _parseRuby : function(stream){
    var rbs = [];
    var rt = null;
    while(true){
      var token = this.get();
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
});

