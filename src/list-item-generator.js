var ListItemGenerator = (function(){
  function ListItemGenerator(style, stream, context){
    ParallelGenerator.call(this, style, [
      this._createListMarkGenerator(context, style),
      this._createListBodyGenerator(context, style, stream)
    ]);
  }
  Class.extend(ListItemGenerator, ParallelGenerator);

  ListItemGenerator.prototype._createListMarkGenerator = function(context, style){
    var marker_size = style.parent.markerSize;
    var item_order = style.getChildIndex();
    var marker_text = style.parent.getMarkerHtml(item_order + 1);
    var measure = marker_size.getMeasure(style.flow);
    var marker_style = style.createChild("li-marker", {
      "float":"start",
      "class":"nehan-li-mark",
      "measure":measure
    });

    return new BlockGenerator(marker_style, new TokenStream(marker_text));
  };

  ListItemGenerator.prototype._createListBodyGenerator = function(context, style, stream){
    var marker_size = style.parent.markerSize;
    var measure = style.getContentMeasure() - marker_size.getMeasure(style.flow);
    var body_style = style.createChild("li-body", {
      "float":"start",
      "class":"nehan-li-body",
      "measure":measure
    });

    return new BlockGenerator(body_style, stream);
  };

  ListItemGenerator.prototype._alignContentExtent = function(blocks, content_extent){
    if(this.style.isTextVertical()){
      return blocks;
    }
    return ParallelGenerator.prototype._alignContentExtent.call(this, blocks, content_extent);
  };

  return ListItemGenerator;
})();
  
