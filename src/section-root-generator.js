var SectionRootGenerator = ChildBlockTreeGenerator.extend({
  init : function(markup, context){
    this._super(markup, context);
    this.context.startSectionRoot(markup);
  },
  hasOutline : function(root_name){
    var buffer = this.getOutlineBuffer(root_name);
    return buffer.isEmpty() === false;
  },
  getOutlineBuffer : function(root_name){
    var name = root_name || this.markup.getName();
    return this.context.getOutlineBuffer(name);
  },
  getOutlineTree : function(root_name){
    var buffer = this.getOutlineBuffer(root_name);
    var tree = (new OutlineParser(buffer)).getTree();
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
  _onLastBlock : function(page){
    this.context.endSectionRoot(this.markup);
    this._super();
  }
});
