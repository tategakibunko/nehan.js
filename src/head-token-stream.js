var HeadTokenStream = (function(){
  /**
     @memberof Nehan
     @class HeadTokenStream
     @classdesc tokens of &lt;head&gt; tag content(title, meta, link, style, script).
     @constructor
     @extends {Nehan.FilteredTokenStream}
  */
  function HeadTokenStream(src){
    FilteredTokenStream.call(this, src, function(tag){
      var name = tag.getName();
      return (name === "title" ||
	      name === "meta" ||
	      name === "link" ||
	      name === "style" ||
	      name === "script");
    });
  }
  Class.extend(HeadTokenStream, FilteredTokenStream);

  return HeadTokenStream;
})();

