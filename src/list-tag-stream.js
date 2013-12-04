var ListTagStream = (function(){
  function ListTagStream(src){
    FilteredTagStream.call(this, src, function(tag){
      return tag.getName() === "li";
    });
  }
  Class.extend(ListTagStream, FilteredTagStream);

  return ListTagStream;
})();

