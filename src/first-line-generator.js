var FirstLineGenerator = ChildInlineTreeGenerator.extend({
  _createLine : function(parent){
    if(this.lineNo > 0){
      // first-line tag has finished, so reset normal css of parent.
      this.context.markup.rename(this.context.markupInline.parent.getName());
      this.context.markup.regetSelectorValue();
    }
    return this._super(parent);
  }
});

