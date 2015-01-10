var HtmlTokenStream = (function(){
  /**
     @memberof Nehan
     @class HtmlTokenStream
     @classdesc token stream for &lt;html&gt; tag(head, body).
     @extends {Nehan.FilteredTokenStream}
     @param src {String} - content text of &lt;html&gt; tag.
  */
  function HtmlTokenStream(src){
    FilteredTokenStream.call(this, src, function(tag){
      var name = tag.getName();
      return (name === "head" || name === "body");
    });
  }
  Class.extend(HtmlTokenStream, FilteredTokenStream);

  return HtmlTokenStream;
})();

