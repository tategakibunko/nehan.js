var HtmlTagStream = (function(){
  function HtmlTagStream(src){
    FilteredTagStream.call(this, src, function(tag){
      var name = tag.getName();
      return (name === "head" || name === "body");
    });
  }
  Class.extend(HtmlTagStream, FilteredTagStream);

  return HtmlTagStream;
})();

