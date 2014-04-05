var SectionContentGenerator = (function(){
  function SectionContentGenerator(style, stream, outline_context){
    BlockGenerator.call(this, style, stream, outline_context);
    this.outlineContext.startSection(this.style.getMarkupName());
  }
  Class.extend(SectionContentGenerator, BlockGenerator);

  SectionContentGenerator.prototype._onComplete = function(block){
    this.context.endSection(this.style.getMarkupName());
  };

  return SectionContentGenerator;
})();

