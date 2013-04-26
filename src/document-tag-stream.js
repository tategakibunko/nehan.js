var DocumentTagStream = FilteredTagStream.extend({
  init : function(src){
    this._super(src, function(tag){
      return (tag.isSameAs("!doctype") || tag.isSameAs("html"));
    });
  }
});

