var ListTagStream = FilteredTagStream.extend({
  init : function(src){
    this._super(src, function(tag){
      return tag.getName() === "li";
    });
  }
});

