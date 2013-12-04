var SectionRootGenerator = (function(){
  function SectionRootGenerator(context){
    ChildBlockTreeGenerator.call(this, context);
    this.context.startSectionRoot();
  }
  Class.extend(SectionRootGenerator, ChildBlockTreeGenerator);

  SectionRootGenerator.prototype.hasOutline = function(root_name){
    var buffer = this.getOutlineBuffer(root_name);
    return buffer.isEmpty() === false;
  };

  SectionRootGenerator.prototype.getOutlineBuffer = function(root_name){
    var name = root_name || this.context.getMarkupName();
    return this.context.getOutlineBuffer(name);
  };

  SectionRootGenerator.prototype.getOutlineTree = function(root_name){
    var buffer = this.getOutlineBuffer(root_name);
    var tree = (new OutlineParser(buffer)).getTree();
    return tree;
  };

  SectionRootGenerator.prototype.getAnchors = function(){
    return this.context.getAnchors();
  };

  SectionRootGenerator.prototype.getAnchorPageNo = function(anchor_name){
    return this.context.getAnchorPageNo(anchor_name);
  };

  SectionRootGenerator.prototype.setAnchor = function(name, page_no){
    this.context.setAnchor(name, page_no);
  };

  SectionRootGenerator.prototype._onLastBlock = function(page){
    this.context.endSectionRoot();
    ChildBlockTreeGenerator.prototype._onLastBlock.call(this, page);
  };

  return SectionRootGenerator;
})();

