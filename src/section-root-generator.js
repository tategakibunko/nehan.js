var SectionRootGenerator = ChildPageGenerator.extend({
  init : function(markup, context){
    this._super(markup, context);
    this.context.startSectionRoot(markup);
  },
  getOutlineTree : function(root_name){
    var name = root_name || this.markup.getName();
    var logs = this.context.getOutlineLog(name);
    var tree = (new OutlineGenerator(logs)).yield();
    return tree;
  },
  getAnchors : function(){
    return this.context.getAnchors();
  },
  getAnchorPageNo : function(name){
    return this.context.getAnchorPageNo(name);
  },
  setAnchor : function(name, page_no){
    this.context.setAnchor(name, page_no);
  },
  _onLastPage : function(page){
    this.context.endSectionRoot(this.markup);
  }
});
