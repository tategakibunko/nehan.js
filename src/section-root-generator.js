var SectionRootGenerator = (function(){
  function SectionRootGenerator(style, stream){
    BlockGenerator.call(this, style, stream);
    this.pageNo = 0;
    this.outlineContext = new OutlineContext(style);
  }
  Class.extend(SectionRootGenerator, BlockGenerator);

  SectionRootGenerator.prototype._onAddElement = function(element){
    if(element.style.isHeader()){
      this.__addHeaderElement(element.style);
    }
  };

  SectionRootGenerator.prototype._onComplete = function(){
    console.log("[%s] on complete", this.style.getMarkupName());
    DocumentContext.addOutlineContext(this.outlineContext);
    this.pageNo++;
  };

  SectionRootGenerator.prototype._addHeaderElement = function(element){
  };

  SectionRootGenerator.prototype._addHeaderElement = function(element){
    this.outlineContext.addSectionHeader({
      type:element.style.getMarkupName(),
      rank:element.style.getHeaderRank(),
      title:element.style.getMarkupContent(),
      pageNo:this.pageNo
    });
  };

  return SectionRootGenerator;
})();
