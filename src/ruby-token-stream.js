var RubyTokenStream = (function(){
  /**
     token stream of &lt;ruby&gt; tag content.

     @memberof Nehan
     @class RubyTokenStream
     @classdesc 
     @constructor
     @extends {Nehan.TokenStream}
     @param markup {Nehan.Tag}
  */
  function RubyTokenStream(markup_ruby){
    TokenStream.call(this, markup_ruby.getContent());
    this.getAll();
    this.tokens = this._parse(markup_ruby);
    this.rewind();
  }
  Class.extend(RubyTokenStream, TokenStream);

  RubyTokenStream.prototype._parse = function(markup_ruby){
    var ret = [];
    while(this.hasNext()){
      ret.push(this._parseRuby(markup_ruby));
    }
    return ret;
  };

  RubyTokenStream.prototype._parseRuby = function(markup_ruby){
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
      if(Token.isTag(token) && token.getName() === "rb"){
	rbs = this._parseRb(token.getContent())
      }
      if(token instanceof Text){
	rbs = this._parseRb(token.getContent());
      }
    }
    return new Ruby(rbs, rt);
  };

  RubyTokenStream.prototype._parseRb = function(content){
    var lexer = new TextLexer(content);
    return (new TokenStream(content, lexer)).getAll();
  };

  return RubyTokenStream;
})();

