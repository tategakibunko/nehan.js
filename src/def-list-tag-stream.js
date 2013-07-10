var DefListTagStream = FilteredTagStream.extend({
  init : function(src, font_size, max_size){
    this._super(src, function(tag){
      var name = tag.getName();
      return (name === "dt" || name === "dd");
    });
  }
});

