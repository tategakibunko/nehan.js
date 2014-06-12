var InlineBlockGenerator = (function (){
  function InlineBlockGenerator(style, stream){
    BlockGenerator.call(this, style, stream);
  }
  Class.extend(InlineBlockGenerator, BlockGenerator);

  InlineBlockGenerator.prototype._onCreate = function(context, block){
    var max_inline = List.maxobj(block.elements, function(element){
      return element.getContentMeasure();
    });
    if(max_inline){
      block.size.setMeasure(this.style.flow, max_inline.getContentMeasure());
    }
    return block;
  };

  InlineBlockGenerator.prototype._createChildContext = function(parent_context){
    return new LayoutContext(
      new BlockContext(parent_context.getBlockRestExtent() - this.style.getEdgeExtent()),
      new InlineContext(parent_context.getInlineRestMeasure() - this.style.getEdgeMeasure())
    );
  };

  return InlineBlockGenerator;
})();
