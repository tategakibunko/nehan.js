var DefListTagStream = (function(){
  function DefListTagStream(src){
    FilteredTagStream.call(this, src, function(tag){
      var name = tag.getName();
      return (name === "dt" || name === "dd");
    });
  }
  Class.extend(DefListTagStream, FilteredTagStream);

  return DefListTagStream;
})();

