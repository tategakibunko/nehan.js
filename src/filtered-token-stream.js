var FilteredTokenStream = (function(){
  /**
     @memberof Nehan
     @class FilteredTokenStream
     @classdesc token stream that is filtered by [fn](token -> bool).
     @constructor
     @extends {Nehan.TokenStream}
     @param src {String} - html text
     @param fn {Function} - {@link Nehan.Token} -> bool
   */
  function FilteredTokenStream(src, fn){
    TokenStream.call(this, src);
    var order = 0;
    this.tokens = this.getAllIf(function(token){
      if(Token.isText(token)){
	return false;
      }
      if(fn(token)){
	token.order = order++;
	return true;
      }
    });
  }
  Class.extend(FilteredTokenStream, TokenStream);

  return FilteredTokenStream;
})();
