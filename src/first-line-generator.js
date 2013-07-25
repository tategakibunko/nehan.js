var FirstLineGenerator = ChildInlineTreeGenerator.extend({
  _createLine : function(parent){
    if(this.lineNo > 0){
      // first-line tag has finished, so reset normal css of parent.
      this.context.markupInline.rename(this.context.markupInline.parent.getName());
      this.context.markupInline.regetSelectorValue();
    }
    return this._super(parent);
  }
});

