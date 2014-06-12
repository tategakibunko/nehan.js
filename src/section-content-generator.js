var SectionContentGenerator = (function(){
  function SectionContentGenerator(style, stream){
    BlockGenerator.call(this, style, stream);
    this.style.startSectionContext();
  }
  Class.extend(SectionContentGenerator, BlockGenerator);

  SectionContentGenerator.prototype._onComplete = function(context, block){
    this.style.endSectionContext();
  };

  return SectionContentGenerator;
})();

