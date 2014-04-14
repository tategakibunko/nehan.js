var FlipGenerator = (function(){
  function FlipGenerator(style, stream, outline_context){
    BlockGenerator.call(this, style, stream, outline_context);
  }
  Class.extend(FlipGenerator, BlockGenerator);

  FlipGenerator.prototype.yield = function(context){
    // [measure of this.style] -> [extent of this.style.parent]
    // [extent of this.style]  -> [measure of this.style.parent]
    this.cloneStyle({
      measure:context.getBlockRestExtent(),
      extent:context.getInlineMaxMeasure()
    });
    return BlockGenerator.prototype.yield.call(this);
  };

  return FlipGenerator;
})();

