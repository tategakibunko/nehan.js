var LayoutContext = (function(){
  function LayoutContext(block, inline){
    this.block = block;
    this.inline = inline;
  }

  // extra document information
  var __header_id__ = 0;
  var __anchors__ = {};

  LayoutContext.prototype = {
    // block-level
    isBlockSpaceLeft : function(){
      return this.block.isSpaceLeft();
    },
    hasBlockSpaceFor : function(extent){
      return this.block.hasSpaceFor(extent);
    },
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
    hasBr : function(){
      return this.inline.hasBr();
    },
    setLineBreak : function(status){
      this.inline.setLineBreak(status);
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
    getInlineCharCount : function(){
      return this.inline.getCharCount();
    },
    justify : function(head_char){
      return this.inline.justify(head_char);
    }
  };

  return LayoutContext;
})();

