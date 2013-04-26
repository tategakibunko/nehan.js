var HeaderGenerator = ChildPageGenerator.extend({
  _onCompletePage : function(page){
    this._super(page);
    page.id = Css.addNehanHeaderPrefix(this.context.logSectionHeader(this.markup));
  },
  _onCompleteBox : function(box, parent){
    box.addClass("nehan-header");
  }
});
