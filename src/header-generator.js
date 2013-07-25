var HeaderGenerator = ChildBlockTreeGenerator.extend({
  _onCompleteBlock : function(page){
    this._super(page);
    var header_id = this.context.logSectionHeader();
    page.id = Css.addNehanHeaderPrefix(header_id);
  },
  _onCreateBox : function(box, parent){
    box.addClass("nehan-header");
  }
});
