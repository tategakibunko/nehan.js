var DirectTokenStream = (function(){
  function DirectTokenStream(tokens){
    TokenStream.call(this, "");
    this.tokens = tokens;
  }
  Class.extend(DirectTokenStream, TokenStream);

  DirectTokenStream.prototype.isEmpty = function(){
    return this.tokens.length === 0;
  };

  return DirectTokenStream;
})();
