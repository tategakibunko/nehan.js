var HeadTagStream = FilteredTagStream.extend({
  init : function(src){
    this._super(src, function(tag){
      return (tag.isSameAs("title") ||
	      tag.isSameAs("meta") ||
	      tag.isSameAs("link") ||
	      tag.isSameAs("style") ||
	      tag.isSameAs("script"));
    });
  }
});

