var LayoutContext = (function(){
  function LayoutContext(block, inline){
    this.block = block;
    this.inline = inline;
  }

  LayoutContext.prototype = {
    // block-level
    isBlockSpaceLeft : function(){
      return this.block.isSpaceLeft();
    },
    hasBlockSpaceFor : function(extent, opt){
      return this.block.hasSpaceFor(extent, opt);
    },
    hasBreakAfter : function(){
      return this.block.hasBreakAfter() || this.inline.hasBreakAfter() || false;
    },
    addBlockElement : function(element, extent){
      this.block.addElement(element, extent);
    },
    getBlockElements : function(){
      return this.block.getElements();
    },
    getBlockCurExtent : function(){
      return this.block.getCurExtent();
    },
    getBlockMaxExtent : function(){
      return this.block.getMaxExtent();
    },
    getBlockRestExtent : function(){
      return this.block.getRestExtent();
    },
    // inline-level
    isInlineEmpty : function(){
      return this.inline.isEmpty();
    },
    isInlineSpaceLeft : function(){
      return this.inline.isSpaceLeft();
    },
    hasInlineSpaceFor : function(measure){
      return this.inline.hasSpaceFor(measure);
    },
    hasLineBreak : function(){
      return this.inline.hasLineBreak();
    },
    setLineBreak : function(status){
      this.inline.setLineBreak(status);
    },
    setBreakAfter : function(status){
      this.inline.setBreakAfter(status);
    },
    addInlineElement : function(element, measure){
      this.inline.addElement(element, measure);
    },
    getInlineLastText : function(){
      return this.inline.getLastText();
    },
    getInlineTexts : function(){
      return this.inline.getTexts();
    },
    getInlineElements : function(){
      return this.inline.getElements();
    },
    getInlineCurMeasure : function(){
      return this.inline.getCurMeasure();
    },
    getInlineRestMeasure : function(){
      return this.inline.getRestMeasure();
    },
    getInlineMaxMeasure : function(){
      return this.inline.getMaxMeasure();
    },
    getInlineMaxExtent : function(){
      return this.inline.getMaxExtent();
    },
    getInlineMaxFontSize : function(){
      return this.inline.getMaxFontSize();
    },
    getInlineCharCount : function(){
      return this.inline.getCharCount();
    },
    justify : function(head_char){
      return this.inline.justify(head_char);
    }
  };

  return LayoutContext;
})();

