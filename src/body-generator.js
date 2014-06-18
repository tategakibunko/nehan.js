var BodyGenerator = (function(){
  function BodyGenerator(text){
    var tag = new Tag("<body>", text);
    SectionRootGenerator.call(this, new StyleContext(tag, null), new TokenStream(text));
  }
  Class.extend(BodyGenerator, SectionRootGenerator);

  BodyGenerator.prototype._onCreate = function(context, block){
    block.seekPos = this.stream.getSeekPos();
    block.charPos = DocumentContext.getCharPos();
    block.percent = this.stream.getSeekPercent();
    block.pageNo = DocumentContext.getPageNo();

    DocumentContext.stepCharPos(block.charCount || 0);
    DocumentContext.stepPageNo();

    // sometimes layout engine causes inlinite loop,
    // so terminate generator by restricting page count.
    if(DocumentContext.getPageNo() >= Config.maxPageCount){
      this.setTerminate(true);
    }
  };

  return BodyGenerator;
})();
