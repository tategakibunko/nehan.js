var ChildInlineTreeGenerator = InlineTreeGenerator.extend({
  init : function(markup, context, parent){
    this.markup = markup;
    this.context = context;
    this.stream = this._createStream();
    this.context.pushInlineTag(this.markup, parent);
  },
  _createStream : function(){
    return new TokenStream(this.markup.getContent());
  },
  _onCompleteTree : function(line){
    this.context.popInlineTagByName(this.markup.getName());
  }
});

