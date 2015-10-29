Nehan.InlineBlockGenerator = (function (){
  /**
     @memberof Nehan
     @class InlineBlockGenerator
     @classdesc generator of element with display:'inline-block'.
     @extends {Nehan.BlockGenerator}
     @param style {Nehan.Style}
     @param stream {Nehan.TokenStream}
  */
  function InlineBlockGenerator(style, stream){
    Nehan.BlockGenerator.call(this, style, stream);
  }
  Nehan.Class.extend(InlineBlockGenerator, Nehan.BlockGenerator);

  InlineBlockGenerator.prototype._onCreate = function(context, block){
    var max_inline = Nehan.List.maxobj(block.elements, function(element){
      return element.getContentMeasure();
    });
    if(max_inline){
      block.size.setMeasure(this.style.flow, max_inline.getContentMeasure());
    }
    return block;
  };

  InlineBlockGenerator.prototype._createChildContext = function(parent_context){
    return new Nehan.LayoutContext(
      new Nehan.BlockContext(parent_context.getBlockRestExtent() - this.style.getEdgeExtent()),
      new Nehan.InlineContext(parent_context.getInlineRestMeasure() - this.style.getEdgeMeasure())
    );
  };

  return InlineBlockGenerator;
})();
