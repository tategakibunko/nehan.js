var ListItemGenerator = (function(){
  function ListItemGenerator(style, stream, outline_context){
    ParallelGenerator.call(this, style, [
      this._createListMarkGenerator(style, outline_context),
      this._createListBodyGenerator(style, stream, outline_context)
    ]);
  }
  Class.extend(ListItemGenerator, ParallelGenerator);

  ListItemGenerator.prototype._createListMarkGenerator = function(style, outline_context){
    var marker_size = style.parent.markerSize || style.flow.getBoxSize(Layout.fontSize * 2, Layout.fontSize);
    var item_order = style.getChildIndex();
    var marker_text = style.parent.getMarkerHtml(item_order + 1);
    var measure = marker_size.getMeasure(style.flow);
    var marker_style = style.createChild("li-marker", {
      "float":"start",
      "class":"nehan-li-marker",
      "measure":measure
    });
    return new BlockGenerator(marker_style, new TokenStream(marker_text), outline_context);
  };

  ListItemGenerator.prototype._createListBodyGenerator = function(style, stream, outline_context){
    var marker_size = style.parent.markerSize || style.flow.getBoxSize(Layout.fontSize * 2, Layout.fontSize);
    var measure = style.contentMeasure - marker_size.getMeasure(style.flow);
    var body_style = style.createChild("li-body", {
      "float":"start",
      "class":"nehan-li-body",
      "measure":measure
    });
    return new BlockGenerator(body_style, stream, outline_context);
  };

  return ListItemGenerator;
})();
  
