var SectionRootGenerator = (function(){
  function SectionRootGenerator(style, stream){
    BlockGenerator.call(this, style, stream);
    this.outlineContext = new OutlineContext(style); // create new section root
  }
  Class.extend(SectionRootGenerator, BlockGenerator);

  SectionRootGenerator.prototype._onCreate = function(block){
    this.outlineContext.stepPageNo();
  };

  SectionRootGenerator.prototype._onComplete = function(block){
    DocumentContext.addOutlineContext(this.outlineContext);
    //var tree = this.outlineContext.outputTree();
    //var dom_tree = this.outlineContext.outputNode();
  };

  return SectionRootGenerator;
})();
