var HtmlTagStream = FilteredTagStream.extend({
  init : function(src){
    this._super(src, function(tag){
      return (tag.isSameAs("head") || tag.isSameAs("body"));
    });
  }
});

