var DocumentTagStream = (function(){
  function DocumentTagStream(src){
    FilteredTagStream.call(this, src, function(tag){
      var name = tag.getName();
      return (name === "!doctype" || name === "html");
    });
    if(this.isEmptyTokens()){
      this.tokens = [new Tag("html", src)];
    }
  }
  Class.extend(DocumentTagStream, FilteredTagStream);

  return DocumentTagStream;
})();
