var StaticBlockGenerator = BlockGenerator.extend({
  yield : function(parent, size){
    var box = this._createBox(size, parent);
    if(this.markup.isPush()){
      box.backward = true;
    }
    if(this.markup.isPull()){
      box.forward = true;
    }
    // get rest size without edge of box.
    var rest_size = parent.getRestSize();
    rest_size.width -= box.getEdgeWidth();
    rest_size.height -= box.getEdgeHeight();
    
    // even if edge can't be included, retry.
    if(!rest_size.isValid()){
      return Exceptions.RETRY;
    }
    // if rest size has prenty of space for this box, just return as it it.
    if(rest_size.canInclude(box.size)){
      return box;
    }
    var root_page_size = Layout.getStdPageSize();
    var reduced_size = box.size.resizeWithin(parent.flow, rest_size);

    // use reduced size if
    // 1. even root size of page can't include this box
    // 2. or reduced box size is within Config.minBlockScaleDownRate of original
    if(!root_page_size.canInclude(box.size) ||
       reduced_size.percentFrom(box.size) >= Config.minBlockScaleDownRate){
      box.size = reduced_size;
      return box;
    }
    return Exceptions.RETRY;
  },
  _setEdge : function(box, edge){
    box.setEdge(edge); // set edge as normal box model.
    return box;
  }
});

