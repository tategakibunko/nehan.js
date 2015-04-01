var RubyTokenStream = (function(){
  /**
     token stream of &lt;ruby&gt; tag content.

     @memberof Nehan
     @class RubyTokenStream
     @classdesc 
     @constructor
     @extends {Nehan.TokenStream}
     @param str {String}
  */
  function RubyTokenStream(str){
    this.tokens = this._parse(new TokenStream(str));
    this.pos = 0;
  }
  Class.extend(RubyTokenStream, TokenStream);

  RubyTokenStream.prototype._parse = function(stream){
    var tokens = [];
    while(stream.hasNext()){
      tokens.push(this._parseRuby(stream));
    }
    return tokens;
  };

  RubyTokenStream.prototype._parseRuby = function(stream){
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
    return new TokenStream(content, {
      lexer:new TextLexer(content)
    }).getTokens();
  };

  return RubyTokenStream;
})();

