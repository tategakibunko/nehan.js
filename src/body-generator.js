var BodyGenerator = (function(){
  function BodyGenerator(text){
    var tag = new Tag("<body>", text);
    SectionRootGenerator.call(this, new StyleContext(tag, null), new TokenStream(text));
  }
  Class.extend(BodyGenerator, SectionRootGenerator);

  BodyGenerator.prototype._onCreate = function(block){
    block.pageNo = this.outlineContext.getPageNo();
    return block;
  };

  return BodyGenerator;
})();
