var BodyGenerator = (function(){
  function BodyGenerator(text){
    var tag = new Tag("<body>", text);
    SectionRootGenerator.call(this, new StyleContext(tag, null), new TokenStream(text));
  }
  Class.extend(BodyGenerator, SectionRootGenerator);

  BodyGenerator.prototype._onCreate = function(block){
    block.seekPos = this.stream.getSeekPos();
    block.percent = this.stream.getSeekPercent();
    block.pageNo = DocumentContext.pageNo++;
  };

  return BodyGenerator;
})();
