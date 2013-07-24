var HeaderGenerator = ChildBlockTreeGenerator.extend({
  _onCompleteBlock : function(page){
    this._super(page);
    page.id = Css.addNehanHeaderPrefix(this.context.logSectionHeader(this.markup));
  },
  _onCreateBox : function(box, parent){
    box.addClass("nehan-header");
  }
});
