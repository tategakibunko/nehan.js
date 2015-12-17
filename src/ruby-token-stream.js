Nehan.RubyTokenStream = (function(){
  /**
   token stream of &lt;ruby&gt; tag content.

   @memberof Nehan
   @class RubyTokenStream
   @classdesc
   @constructor
   @extends {Nehan.TokenStream}
   @param str {String} - content string of <ruby> tag.
   */
  function RubyTokenStream(str){
    this.tokens = this._parse(new Nehan.TokenStream({
      lexer:new Nehan.HtmlLexer(str)
    }));
    this.pos = 0;
  }
  Nehan.Class.extend(RubyTokenStream, Nehan.TokenStream);

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
      if(Nehan.Token.isTag(token) && token.getName() === "rt"){
	rt = token;
	break;
      }
      if(Nehan.Token.isTag(token) && token.getName() === "rb"){
	rbs = this._parseRb(token.getContent());
      }
      if(token instanceof Nehan.Text){
	rbs = this._parseRb(token.getContent());
      }
    }
    return new Nehan.Ruby(rbs, rt);
  };

  RubyTokenStream.prototype._parseRb = function(content){
    return new Nehan.TokenStream({
      lexer:new Nehan.TextLexer(content)
    }).getTokens();
  };

  return RubyTokenStream;
})();

