var SectionRootGenerator = ChildBlockTreeGenerator.extend({
  init : function(context){
    this._super(context);
    this.context.startSectionRoot();
  },
  hasOutline : function(root_name){
    var buffer = this.getOutlineBuffer(root_name);
    return buffer.isEmpty() === false;
  },
  getOutlineBuffer : function(root_name){
    var name = root_name || this.context.getMarkupName();
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
  getAnchorPageNo : function(anchor_name){
    return this.context.getAnchorPageNo(anchor_name);
  },
  setAnchor : function(name, page_no){
    this.context.setAnchor(name, page_no);
  },
  _onLastBlock : function(page){
    this.context.endSectionRoot();
    this._super();
  }
});
