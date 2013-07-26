var ChildInlineTreeGenerator = TreeGenerator.extend({
  init : function(context, parent_line_no){
    this._super(context);
    this.parentLineNo = parent_line_no;
  },
  yield : function(parent){
    return this._yieldInline(parent);
  },
  getParentPos : function(){
    return this.context.markup.pos;
  },
  getParentLineNo : function(){
    return this.parentLineNo;
  },
  stepParentLineNo : function(){
    this.parentLineNo++;
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
  _onCompleteLine : function(line){
    line.shortenMeasure();
  }
});

