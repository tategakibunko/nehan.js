var ChildInlineTreeGenerator = InlineTreeGenerator.extend({
  init : function(markup, context){
    this.markup = markup;
    this.context = context;
    this.context.pushInlineTag(this.markup);
    this.stream = this._createStream();
    this.lineNo = 0;
  },
  _createStream : function(){
    return new TokenStream(this.markup.getContent());
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
  _onLastTree : function(){
    this.context.popInlineTag();
  },
  _onCompleteTree : function(ctx, line){
    line.shortenMeasure();
    this.lineNo++;
  }
});

