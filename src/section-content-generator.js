var SectionContentGenerator = ChildBlockTreeGenerator.extend({
  init : function(context){
    this._super(context);
    this.context.logStartSection();
  },
  _onLastBlock : function(page){
    this.context.logEndSection();
  }
});
