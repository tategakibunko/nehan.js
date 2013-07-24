var ChildInlineTreeGenerator = InlineTreeGenerator.extend({
  init : function(markup, context, parent_line_no){
    this._super(markup, this._createStream(markup), context);
    this.parentLineNo = parent_line_no;
    this.rollbacked = false;
  },
  rollback : function(){
    this._super();

    // avoid duplicate increment for parentLineNo
    if(!this.rollbacked){
      this.parentLineNo++;
      this.rollbacked = true;
    }
  },
  isCommit : function(){
    return this._commit;
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
  _onCompleteTree : function(ctx, line){
    line.shortenMeasure();
  }
});

