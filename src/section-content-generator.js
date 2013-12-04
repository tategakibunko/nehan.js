var SectionContentGenerator = (function(){
  function SectionContentGenerator(context){
    ChildBlockTreeGenerator.call(this, context);
    this.context.logStartSection();
  }
  Class.extend(SectionContentGenerator, ChildBlockTreeGenerator);

  SectionContentGenerator.prototype._onLastBlock = function(page){
    this.context.logEndSection();
  };

  return SectionContentGenerator;
})();

