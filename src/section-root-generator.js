var SectionRootGenerator = (function(){
  function SectionRootGenerator(style, stream){
    BlockGenerator.call(this, style, stream);
    this.outlineContext = new OutlineContext(style); // create new section root
  }
  Class.extend(SectionRootGenerator, BlockGenerator);

  SectionRootGenerator.prototype._onCreate = function(block){
    block.pageNo = this.outlineContext.getPageNo();
    block.seekPos = this.stream.getSeekPos();
    block.percent = this.stream.getSeekPercent();
    this.outlineContext.stepPageNo();
  };

  SectionRootGenerator.prototype._onComplete = function(){
    DocumentContext.addOutlineContext(this.outlineContext);
  };

  return SectionRootGenerator;
})();
