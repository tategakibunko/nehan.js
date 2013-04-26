var SectionContentGenerator = ChildPageGenerator.extend({
  init : function(markup, context){
    this._super(markup, context);
    this.context.logStartSection(markup);
  },
  _onLastPage : function(page){
    this.context.logEndSection(this.markup);
  }
});
