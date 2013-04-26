var AlignedPageGenerator = PageGenerator.extend({
  init : function(stream, context, aligned_box){
    this.context = context;
    this.stream = stream;
    this.alignedBox = aligned_box;
  },
  yield: function(parent){
    var backupPos2 = this.stream.backupPos; // backup the 'backup pos'
    var wrap_box = this._getAlignedWrapBox(parent, this.alignedBox);
    var rest_size = this._getAlignedRestSize(parent, wrap_box, this.alignedBox);
    var rest_box = this._createBox(rest_size, wrap_box, parent);
    var rest_page = this._yieldPageTo(rest_box);
    if(this.alignedBox.blockAlign === "start"){
      wrap_box.addChild(this.alignedBox);
      wrap_box.addChild(rest_page);
    } else {
      wrap_box.addChild(rest_page);
      wrap_box.addChild(this.alignedBox);
    }
    this.stream.backupPos = backupPos2; // restore backup pos
    return wrap_box;
  },
  // aligned area has no markup, so create page box in manual.
  _createBox : function(size, wrap_box, parent){
    var box = Layout.createBox(size, wrap_box, "box");
    box.setFlow(parent.flow);

    // every lines already has a single tail space to handle 'justify'.
    // so we add block space for only target that is aligned to 'start'.
    if(this.alignedBox.blockAlign === "start"){
      var edge = new BoxEdge();
      var spacing_size = Layout.getAlignedSpacingSize();
      edge.setEdgeStart("margin", box.flow, spacing_size);
      box.setEdgeBySub(edge);
    }
    return box;
  },
  _getAlignedWrapBox : function(parent, aligned_box){
    var wrap_measure = parent.getContentMeasure();
    var wrap_extent = aligned_box.getBoxExtent(parent.flow);
    var wrap_box_size = parent.flow.getBoxSize(wrap_measure, wrap_extent);
    var wrap_box = Layout.createBox(wrap_box_size, parent, "box");
    var wrap_flow = parent.getAlignedWrapFlow();
    wrap_box.setParent(parent, false);
    wrap_box.setFlow(wrap_flow);
    aligned_box.setParent(wrap_box, true);
    return wrap_box;
  },
  _getAlignedRestSize : function(parent, wrap_box, aligned_box){
    var rest_measure = parent.getContentMeasure() - aligned_box.getBoxMeasure(parent.flow);
    var rest_extent = aligned_box.getBoxExtent(parent.flow);
    return parent.flow.getBoxSize(rest_measure, rest_extent);
  }
});
