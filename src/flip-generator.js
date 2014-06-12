var FlipGenerator = (function(){
  function FlipGenerator(style, stream){
    BlockGenerator.call(this, style, stream);
  }
  Class.extend(FlipGenerator, BlockGenerator);

  FlipGenerator.prototype.yield = function(context){
    // [measure of this.style] -> [extent of this.style.parent]
    // [extent of this.style]  -> [measure of this.style.parent]
    this.style.updateContextSize(context.getBlockRestExtent(), context.getInlineMaxMeasure());
    return BlockGenerator.prototype.yield.call(this);
  };

  return FlipGenerator;
})();

