var FlipGenerator = (function(){
  function FlipGenerator(style, stream, outline_context, layout_context){
    this.originalParent = style.parent; // original parent before creating clone parent.
    
    // this is flip generator, so extent of element this gen yields is measure from the view of parent generator(measure also the same).
    // so we clone parent to make parent generator capture output-element as original flow.
    // [before clone parent] original_parent -> this.style
    // [after  clone parent] original_parent -> new_parent -> this.style
    style.cloneParent("div", {
      measure:layout_context.getBlockRestExtent(),
      extent:layout_context.getInlineMaxMeasure()
    });
    BlockGenerator.call(this, style, stream, outline_context);
  }
  Class.extend(FlipGenerator, BlockGenerator);

  FlipGenerator.prototype._yield = function(parent_context){
    // if start context, update parent with new content-size.
    if(typeof parent_context === "undefined"){
      this.style.updateParent(
	this.style.parent.clone({
	  measure:this.originalParentStyle.getContentExtent(),
	  extent:this.originalParentStyle.getContentMeasure()
	})
      );
    }
    return BlockGenerator.prototype._yield.call(this, parent_context);
  };

  // create flip start context
  // original parent = parent of parent of this.style(grand parent).
  // measure of original parent = max_extent
  // extent of original parent = max_measure
  FlipGenerator.prototype._createStartContext = function(){
    return new LayoutContext(
      new BlockContext(this.originalParent.getContentMeasure()),
      new InlineContext(this.originalParent.getContentExtent())
    );
  };

  FlipGenerator.prototype._createChildContext = function(parent_context){
    return new LayoutContext(
      new BlockContext(parent_context.getInlineMaxMeasure()),
      new InlineContext(parent_context.getBlockRestExtent() - this.style.getContextEdgeMeasure())
    );
  };

  return FlipGenerator;
})();

