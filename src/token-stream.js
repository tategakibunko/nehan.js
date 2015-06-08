var TokenStream = (function(){
  /**
     @memberof Nehan
     @class TokenStream
     @classdesc abstraction of token stream
     @constructor
     @param src {String}
     @param opt {Object}
     @param opt.lexer {Lexer} - lexer class(optional)
     @param opt.filter {Function} - token filter function(optional)
  */
  function TokenStream(src, opt){
    opt = opt || {};
    this.lexer = opt.lexer || this._createLexer(src);
    this.tokens = opt.tokens || [];
    this.pos = 0;
    this._filter = opt.filter || null;
    if(this.tokens.length === 0){
      this._loadTokens(this._filter);
    }
  }

  var __set_pseudo = function(tags){
    tags[0].setFirstChild(true);
    tags[0].setOnlyChild(tags.length === 1);
    tags[tags.length - 1].setLastChild(true);
  };

  var __set_pseudo_of_type = function(tags){
    tags[0].setFirstOfType(true);
    tags[0].setOnlyOfType(tags.length === 1);
    tags[tags.length - 1].setLastOfType(true);
  };

  TokenStream.prototype = {
    /**
       @memberof Nehan.TokenStream
       @return {boolean}
    */
    hasNext : function(){
      return (this.pos < this.tokens.length);
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
      if(text !== ""){
	this.lexer.addText(text);
	this._loadTokens(this._filter);
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
      if(token){
	this.pos++;
      }
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
       get all tokens.

       @memberof Nehan.TokenStream
       @return {Array}
    */
    getTokens : function(){
      return this.tokens;
    },
    /**
       get current token position of source text(not stream position).

       @memberof Nehan.TokenStream
       @return {int}
    */
    getSeekPos : function(){
      var token = this.tokens[Math.max(0, this.pos)];
      return token? token.spos : this.tokens[this.tokens.length - 1].spos;
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
    /**
       step stream position once if [fn(token)] is true.

       @memberof Nehan.TokenStream
       @param fn {Function}
    */
    skipIf: function(fn){
      var token = this.peek();
      return (token && fn(token))? this.get() : null;
    },
    /**
       read whole stream source.

       @memberof Nehan.TokenStream
       @param filter {Function} - filter function
       @return {Array.<token>}
    */
    _loadTokens : function(filter){
      var filter_order = 0;
      while(true){
	var token = this.lexer.get();
	if(token === null){
	  break;
	}
	if(token instanceof Char && token.isLigature()){
	  var last = List.last(this.tokens);
	  if(last instanceof Char){
	    last.setLigature(token.data);
	    continue;
	  }
	}
	if(filter === null){
	  this.tokens.push(token);
	} else if(filter && filter(token)){
	  token.order = filter_order++;
	  this.tokens.push(token);
	}
      }
      this._setPseudoAttribute(this.tokens);
    },
    _setPseudoAttribute : function(tokens){
      var tags = List.filter(tokens, function(token){
	return (token instanceof Tag);
      });
      if(tags.length === 0){
	return;
      }
      var type_of_tags = {};
      List.iter(tags, function(tag){
	var tag_name = tag.getName();
	if(type_of_tags[tag_name]){
	  type_of_tags[tag_name].push(tag);
	} else {
	  type_of_tags[tag_name] = [tag];
	}
      });
      __set_pseudo(tags);
      for(var tag_name in type_of_tags){
	__set_pseudo_of_type(type_of_tags[tag_name]);
      }
    },
    _createLexer : function(src){
      return new HtmlLexer(src);
    }
  };

  return TokenStream;
})();

