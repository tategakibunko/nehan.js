var BodyGenerator = (function(){
  function BodyGenerator(text){
    var tag = new Tag("<body>", text);
    SectionRootGenerator.call(this, new StyleContext(tag, null), new TokenStream(text));
  }
  Class.extend(BodyGenerator, SectionRootGenerator);

  BodyGenerator.prototype._onCreate = function(context, block){
    block.seekPos = this.stream.getSeekPos();
    block.percent = this.stream.getSeekPercent();
    block.pageNo = DocumentContext.pageNo++;

    // sometimes layout engine causes inlinite loop,
    // so terminate generator by restricting page count.
    if(DocumentContext.pageNo > Config.maxPageCount){
      this.setTerminate(true);
    }
  };

  return BodyGenerator;
})();
