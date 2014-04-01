var LayoutContext = (function(){
  function LayoutContext(block, inline){
    this.block = block;
    this.inline = inline;
  }

  LayoutContext.prototype = {
    debug : function(title){
      console.log("[%s]:(rest_m,rest_e) = (%d,%d)", title, this.inline.getRestMeasure(), this.block.getRestExtent());
    },
    // block-level
    addBlockElement : function(element, extent){
      this.block.addElement(element, extent);
    },
    pushBlockElement : function(element, extent){
      this.block.pushElement(element, extent);
    },
    pullBlockElement : function(element, extent){
      this.block.pullElement(element, extent);
    },
    getBlockElements : function(){
      return this.block.getElements();
    },
    getBlockExtent : function(){
      return this.block.getExtent();
    },
    getBlockMaxExtent : function(){
      return this.block.getMaxExtent();
    },
    getBlockRestExtent : function(){
      return this.block.getRestExtent();
    },
    setBlockMaxExtent : function(extent){
      return this.block.setMaxExtent(extent);
    },
    createChildBlockContext : function(){
      return new LayoutContext(
	new BlockLayoutContext(this.block.getRestExtent()),
	new InlineLayoutContext(this.inline.getRestMeasure())
      );
    },
    createStaticBlockContext : function(measure, extent){
      return new LayoutContext(
	new BlockLayoutContext(extent),
	new InlineLayoutContext(measure)
      );
    },
    // inline-level
    isInlineEmpty : function(){
      return this.inline.isEmpty();
    },
    hasLineBreak : function(){
      return this.inline.hasLineBreak();
    },
    setLineBreak : function(status){
      this.inline.setLineBreak(status);
    },
    setInlineMaxMeasure : function(measure){
      return this.inline.setMaxMeasure(measure);
    },
    addInlineElement : function(element, measure){
      this.inline.addElement(element, measure);
    },
    getInlinePrevText : function(){
      return this.inline.getPrevText();
    },
    getInlineTexts : function(){
      return this.inline.getTexts();
    },
    getInlineElements : function(){
      return this.inline.getElements();
    },
    getInlineMeasure : function(){
      return this.inline.getMeasure();
    },
    getInlineRestMeasure : function(){
      return this.inline.getRestMeasure();
    },
    getInlineMaxMeasure : function(){
      return this.inline.getMaxMeasure();
    },
    getInlineCharCount : function(){
      return this.inline.getCharCount();
    },
    createChildInlineContext : function(){
      return new LayoutContext(
	this.block,
	new InlineLayoutContext(this.inline.getRestMeasure())
      );
    },
    justify : function(head_char){
      return this.inline.justify(head_char);
    },
    restoreInlineContext : function(line){
      this.inline.restoreContext(line);
      return this;
    }
  };

  return LayoutContext;
})();

