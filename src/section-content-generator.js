var SectionContentGenerator = ChildBlockTreeGenerator.extend({
  init : function(markup, context){
    this._super(markup, context);
    this.context.logStartSection(markup);
  },
  _onLastTree : function(page){
    this.context.logEndSection(this.markup);
  }
});
