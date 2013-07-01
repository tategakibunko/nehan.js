var ChildInlineTreeGenerator = InlineTreeGenerator.extend({
  init : function(markup, context){
    this.markup = markup;
    this.context = context;
    this.stream = this._createStream();
    this.context.pushInlineTag(this.markup);
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
  _onCompleteTree : function(ctx, line){
    this.context.popInlineTagByName(this.markup.getName());
    line.shortenMeasure();
  }
});

