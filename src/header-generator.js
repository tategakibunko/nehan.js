var HeaderGenerator = (function(){
  function HeaderGenerator(style, stream, outline_context){
    BlockGenerator.call(this, style, stream, outline_context);
  }
  Class.extend(HeaderGenerator, BlockGenerator);

  HeaderGenerator.prototype._onComplete = function(block){
    var header_id = this.outlineContext.addHeader({
      type:this.style.getMarkupName(),
      rank:this.style.getHeaderRank(),
      title:this.style.getMarkupContent()
    });
    block.id = Css.addNehanHeaderPrefix(header_id);
  };
  
  return HeaderGenerator;
})();

