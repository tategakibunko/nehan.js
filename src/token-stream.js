Nehan.TokenStream = (function(){
  /**
   @memberof Nehan
   @class TokenStream
   @classdesc abstraction of token stream
   @constructor
   @param src {String}
   @param opt {Object}
   @param opt.lexer {Lexer} - lexer class(optional)
   @param opt.flow {Nehan.BoxFlow} - document flow(optional)
   @param opt.filter {Function} - token filter function(optional)
   */
  function TokenStream(opt){
    opt = opt || {};
    this.lexer = opt.lexer || null;
    this.tokens = opt.tokens || [];
    this.pos = 0;
    if(this.lexer && this.tokens.length === 0){
      this._loadTokens(opt.filter || null);
    }
  }

  var __set_pseudo = function(tokens){
    var first = tokens[0];
    var last = tokens[tokens.length - 1];
    if(first && first instanceof Nehan.Tag){
      first.setFirstChild(true);
      first.setOnlyChild(tokens.length === 1);
    }
    if(last && last instanceof Nehan.Tag){
      last.setLastChild(true);
    }
  };

  var __set_pseudo_of_type = function(tags){
    tags[0].setFirstOfType(true);
    tags[0].setOnlyOfType(tags.length === 1);
    tags[tags.length - 1].setLastOfType(true);
  };

  /**
   @memberof Nehan.TokenStream
   @return {boolean}
   */
  TokenStream.prototype.hasNext  = function(){
    return (this.pos < this.tokens.length);
  };
  /**
   @memberof Nehan.TokenStream
   @return {boolean}
   */
  TokenStream.prototype.isEmptyTokens  = function(){
    return this.tokens.length === 0;
  };
  /**
   @memberof Nehan.TokenStream
   @return {boolean}
   */
  TokenStream.prototype.isHead  = function(){
    return this.pos === 0;
  };
  /**
   step backward current stream position.

   @memberof Nehan.TokenStream
   */
  TokenStream.prototype.prev  = function(){
    this.pos = Math.max(0, this.pos - 1);
  };
  /**
   set stream position directly.

   @memberof Nehan.TokenStream
   @param pos {int}
   */
  TokenStream.prototype.setPos  = function(pos){
    this.pos = pos;
  };
  /**
   set current stream position to the beginning of stream.

   @memberof Nehan.TokenStream
   */
  TokenStream.prototype.rewind  = function(){
    this.pos = 0;
  };
  /**
   look current token but not step forward current position.

   @memberof Nehan.TokenStream
   @return {token}
   */
  TokenStream.prototype.peek  = function(off){
    var offset = off || 0;
    var index = Math.max(0, this.pos + offset);
    var token = this.tokens[index];
    if(token){
      token.pos = index;
      return token;
    }
    return null;
  };
  /**
   get current stream token and step forward current position.

   @memberof Nehan.TokenStream
   @return {token}
   */
  TokenStream.prototype.get  = function(){
    var token = this.peek();
    if(token){
      this.pos++;
    }
    return token;
  };
  /**
   get stream soruce as text.

   @memberof Nehan.TokenStream
   @return {String}
   */
  TokenStream.prototype.getSrc  = function(){
    return this.lexer? this.lexer.getSrc() : "";
  };
  /**
   get current stream position.

   @memberof Nehan.TokenStream
   @return {int}
   */
  TokenStream.prototype.getPos  = function(){
    return this.pos;
  };
  /**
   get current token count.

   @memberof Nehan.TokenStream
   @return {int}
   */
  TokenStream.prototype.getTokenCount  = function(){
    return this.tokens.length;
  };
  /**
   get all tokens.

   @memberof Nehan.TokenStream
   @return {Array}
   */
  TokenStream.prototype.getTokens  = function(){
    return this.tokens;
  };
  /**
   get current token position of source text(not stream position).

   @memberof Nehan.TokenStream
   @return {int}
   */
  TokenStream.prototype.getSeekPos  = function(){
    var token = this.tokens[Math.max(0, this.pos)];
    return token? token.spos : this.tokens[this.tokens.length - 1].spos;
  };
  /**
   get current seek pos as percent.

   @memberof Nehan.TokenStream
   @return {int}
   */
  TokenStream.prototype.getSeekPercent  = function(){
    if(this.lexer){
      return this.lexer.getSeekPercent(this.getSeekPos());
    }
    return Math.round(100 * this.pos / this.tokens.length);
  };
  /**
   iterate tokens by [fn].

   @memberof Nehan.TokenStream
   @param fn {Function}
   */
  TokenStream.prototype.iterWhile  = function(fn){
    var token;
    while(this.hasNext()){
      token = this.get();
      if(token === null || !fn(token)){
	this.prev();
	break;
      }
    }
  };
  /**
   step stream position once if [fn(token)] is true.

   @memberof Nehan.TokenStream
   @param fn {Function}
   */
  TokenStream.prototype.skipIf = function(fn){
    var token = this.peek();
    return (token && fn(token))? this.get() : null;
  };
  /**
   read whole stream source.

   @memberof Nehan.TokenStream
   @param filter {Function} - filter function
   @return {Array.<token>}
   */
  TokenStream.prototype._loadTokens  = function(filter){
    var filter_order = 0;
    while(true){
      var token = this.lexer.get();
      if(token === null){
	break;
      }
      if(token instanceof Nehan.Char && token.isLigature()){
	var last = Nehan.List.last(this.tokens);
	if(last instanceof Nehan.Char){
	  last.setLigature(token.data);
	  continue;
	}
      }
      if(filter === null){
	this.tokens.push(token);
      } else if(filter(token)){
	token.order = filter_order++;
	this.tokens.push(token);
      }
    }
    this._setPseudoAttribute(this.tokens);
  };

  /*
   <div>
     some text here...<!-- this text-node is 'first' child!! -->
     <h1>foo header</h1><!-- note that this is 'second' child!! -->
   </div>
   */
  TokenStream.prototype._setPseudoAttribute  = function(tokens){
    var type_of_tags = {};
    // if first token is just a white-spaces, not treat it as 'first-child'.
    if(tokens.length > 0 && tokens[0] instanceof Nehan.Text && tokens[0].isWhiteSpaceOnly()){
      tokens = tokens.slice(1);
    }
    Nehan.List.iter(tokens, function(token){
      if(token instanceof Nehan.Tag === false){
	return;
      }
      var tag_name = token.getName();
      if(type_of_tags[tag_name]){
	type_of_tags[tag_name].push(token);
      } else {
	type_of_tags[tag_name] = [token];
      }
    });
    __set_pseudo(tokens);
    for(var tag_name in type_of_tags){
      __set_pseudo_of_type(type_of_tags[tag_name]);
    }
  };

  return TokenStream;
})();

