var ListGenerator = (function(){
  function ListGenerator(style, stream){
    BlockGenerator.call(this, style, stream);
    this.style.markerSize = this._getMarkerSize(this.stream.getTokenCount());
  }
  Class.extend(ListGenerator, BlockGenerator);

  // before yield list layout, we have to calclate max marker size by total child_count(item_count).
  ListGenerator.prototype._getMarkerSize = function(item_count){
    var max_marker_html = this.style.getMarkerHtml(item_count);
    // create temporary inilne-generator but using clone style, this is because sometimes marker html includes "<span>" element,
    // and we have to avoid 'appendChild' from child-generator of this tmp generator.
    var tmp_gen = new InlineGenerator(this.style.clone(), new TokenStream(max_marker_html));
    var line = tmp_gen.yield();
    var marker_measure = line? line.inlineMeasure + Math.floor(this.style.getFontSize() / 2) : this.style.getFontSize();
    var marker_extent = line? line.size.getExtent(this.style.flow) : this.style.getFontSize();
    return this.style.flow.getBoxSize(marker_measure, marker_extent);
  };

  return ListGenerator;
})();

