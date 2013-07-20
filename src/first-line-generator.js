var FirstLineGenerator = ChildInlineTreeGenerator.extend({
  init : function(markup, context){
    this._super(markup, context);
  },
  _createLine : function(parent){
    if(this.lineNo > 0){
      // first-line tag has finished, so reset normal css of parent.
      this.markup.rename(this.markup.parent.getName());
      this.markup.regetSelectorValue();
    }
    return this._super(parent);
  }
});

