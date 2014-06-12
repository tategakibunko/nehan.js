var SectionRootGenerator = (function(){
  function SectionRootGenerator(style, stream){
    BlockGenerator.call(this, style, stream);
    this.style.startOutlineContext(); // create new section root
  }
  Class.extend(SectionRootGenerator, BlockGenerator);

  SectionRootGenerator.prototype._onComplete = function(context, block){
    this.style.endOutlineContext();
  };

  return SectionRootGenerator;
})();
