var RubyTagStream = TokenStream.extend({
  init : function(markup_ruby){
    this._super(markup_ruby.getContent());
    this.getAll();
    this.tokens = this._parse(markup_ruby);
    this.rewind();
  },
  _parse : function(markup_ruby){
    var ret = [];
    while(this.hasNext()){
      ret.push(this._parseRuby(markup_ruby));
    }
    return ret;
  },
  _parseRuby : function(markup_ruby){
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

