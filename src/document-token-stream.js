var DocumentTokenStream = (function(){
  /**
     @memberof Nehan
     @class DocumentTokenStream
     @classdesc token stream for &lt;document&gt; tag.
     @extends {Nehan.FilteredTokenStream}
  */
  function DocumentTokenStream(src){
    FilteredTokenStream.call(this, src, function(tag){
      var name = tag.getName();
      return (name === "!doctype" || name === "html");
    });
    if(this.isEmptyTokens()){
      this.tokens = [new Tag("html", src)];
    }
  }
  Class.extend(DocumentTokenStream, FilteredTokenStream);

  return DocumentTokenStream;
})();
