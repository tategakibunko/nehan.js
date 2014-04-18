var ListGenerator = (function(){
  function ListGenerator(style, stream, outline_context){
    BlockGenerator.call(this, style, stream, outline_context);
    this.style.markerSize = this._getMarkerSize(this.stream.getTokenCount());
  }
  Class.extend(ListGenerator, BlockGenerator);

  ListGenerator.prototype._getMarkerSize = function(item_count){
    var max_marker_text = this.style.getMarkerHtml(item_count);
    var gen = new InlineGenerator(this.style, new TokenStream(max_marker_text));
    var line = gen.yield();
    var marker_measure = line? line.inlineMeasure + Math.floor(this.style.getFontSize() / 2) : this.style.getFontSize();
    var marker_extent = line? line.size.getExtent(this.style.flow) : this.style.getFontSize();
    return this.style.flow.getBoxSize(marker_measure, marker_extent);
  };

  return ListGenerator;
})();

