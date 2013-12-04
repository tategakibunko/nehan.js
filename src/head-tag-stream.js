var HeadTagStream = (function(){
  function HeadTagStream(src){
    FilteredTagStream.call(this, src, function(tag){
      var name = tag.getName();
      return (name === "title" ||
	      name === "meta" ||
	      name === "link" ||
	      name === "style" ||
	      name === "script");
    });
  }
  Class.extend(HeadTagStream, FilteredTagStream);

  return HeadTagStream;
})();

