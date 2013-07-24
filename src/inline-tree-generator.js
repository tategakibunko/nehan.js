var ChildInlineTreeGenerator = TreeGenerator.extend({
  init : function(markup, context, parent_line_no){
    this._super(markup, context);
    this.parentLineNo = parent_line_no;
  },
  yield : function(parent){
    return this._yieldInline(parent);
  },
  getParentPos : function(){
    return this.markup.pos;
  },
  getParentLineNo : function(){
    return this.parentLineNo;
  },
  _createStream : function(markup){
    return new TokenStream(markup.getContent());
  },
  _createLine : function(parent){
    var line = this._super(parent);
    this._setBoxStyle(line, parent);
    return line;
  },
  _getLineSize : function(parent){
    var measure = parent.getTextRestMeasure();
    var extent = parent.getContentExtent();
    return parent.flow.getBoxSize(measure, extent);
  },
  _onCompleteLine : function(ctx, line){
    line.shortenMeasure();
  }
});

