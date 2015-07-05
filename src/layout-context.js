Nehan.LayoutContext = (function(){
  /**
     @memberof Nehan
     @class LayoutContext
     @classdesc generator cursor position set(inline and block).
     @constructor
     @param block {Nehan.BlockContext}
     @param inline {Nehan.InlineContext}
  */
  function LayoutContext(block, inline){
    this.block = block;
    this.inline = inline;
  }

  LayoutContext.prototype = {
    /**
       @memberof Nehan.LayoutContext
       @return {boolean}
    */
    hasBlockSpaceFor : function(extent, opt){
      return this.block.hasSpaceFor(extent, opt);
    },
    /**
       @memberof Nehan.LayoutContext
       @return {boolean}
    */
    hasBreakAfter : function(){
      return this.block.hasBreakAfter() || this.inline.hasBreakAfter() || false;
    },
    /**
       @memberof Nehan.LayoutContext
       @param element {Nehan.Box}
       @param extent {int}
    */
    addBlockElement : function(element, extent){
      this.block.addElement(element, extent);
    },
    /**
       @memberof Nehan.LayoutContext
       @return {Array.<Nehan.Box>}
    */
    getBlockElements : function(){
      return this.block.getElements();
    },
    /**
       @memberof Nehan.LayoutContext
       @return {int}
    */
    getBlockCurExtent : function(){
      return this.block.getCurExtent();
    },
    /**
       @memberof Nehan.LayoutContext
       @return {int}
    */
    getBlockMaxExtent : function(){
      return this.block.getMaxExtent();
    },
    /**
       @memberof Nehan.LayoutContext
       @return {int}
    */
    getBlockRestExtent : function(){
      return this.block.getRestExtent();
    },
    /**
       @memberof Nehan.LayoutContext
       @return {int}
    */
    getBlockLineNo : function(){
      return this.block.getLineNo();
    },
    /**
       @memberof Nehan.LayoutContext
       @return {int}
    */
    incBlockLineNo : function(){
      return this.block.incLineNo();
    },
    /**
       @memberof Nehan.LayoutContext
       @return {boolean}
    */
    isInlineEmpty : function(){
      return this.inline.isEmpty();
    },
    /**
       @memberof Nehan.LayoutContext
       @return {boolean}
    */
    isJustified : function(){
      return this.inline.isJustified();
    },
    /**
       @memberof Nehan.LayoutContext
       @return {boolean}
    */
    isLineOver : function(){
      return this.inline.isLineOver();
    },
    /**
       @memberof Nehan.LayoutContext
       @return {boolean}
    */
    hasInlineSpaceFor : function(measure){
      return this.inline.hasSpaceFor(measure);
    },
    /**
       @memberof Nehan.LayoutContext
       @return {boolean}
    */
    hasLineBreak : function(){
      return this.inline.hasLineBreak();
    },
    /**
       @memberof Nehan.LayoutContext
       @param status {boolean}
    */
    setLineBreak : function(status){
      this.inline.setLineBreak(status);
    },
    /**
       @memberof Nehan.LayoutContext
       @param status {boolean}
    */
    setLineOver: function(status){
      this.inline.setLineOver(status);
    },
    /**
       @memberof Nehan.LayoutContext
    */
    setBreakAfter : function(status){
      this.inline.setBreakAfter(status);
    },
    /**
       @memberof Nehan.LayoutContext
       @param status {boolean}
    */
    setJustified : function(status){
      this.inline.setJustified(status);
    },
    /**
       @memberof Nehan.LayoutContext
       @param measure {int}
    */
    addInlineMeasure : function(measure){
      this.inline.addMeasure(measure);
    },
    /**
       @memberof Nehan.LayoutContext
       @param element {Nehan.Box}
       @param measure {int}
    */
    addInlineBoxElement : function(element, measure){
      this.inline.addBoxElement(element, measure);
    },
    /**
       @memberof Nehan.LayoutContext
       @param element {Nehan.Box}
       @param measure {int}
    */
    addInlineTextElement : function(element, measure){
      this.inline.addTextElement(element, measure);
    },
    /**
       @memberof Nehan.LayoutContext
       @return {Nehan.Char | Nehan.Word | Nehan.Tcy}
    */
    getInlineLastElement : function(){
      return this.inline.getLastElement();
    },
    /**
       @memberof Nehan.LayoutContext
       @return {Array}
    */
    getInlineElements : function(){
      return this.inline.getElements();
    },
    /**
       @memberof Nehan.LayoutContext
       @return {int}
    */
    getInlineCurMeasure : function(){
      return this.inline.getCurMeasure();
    },
    /**
       @memberof Nehan.LayoutContext
       @return {int}
    */
    getInlineRestMeasure : function(){
      return this.inline.getRestMeasure();
    },
    /**
       @memberof Nehan.LayoutContext
       @return {int}
    */
    getInlineMaxMeasure : function(){
      return this.inline.getMaxMeasure();
    },
    /**
       @memberof Nehan.LayoutContext
       @return {int}
    */
    getInlineMaxExtent : function(){
      return this.inline.getMaxExtent();
    },
    /**
       @memberof Nehan.LayoutContext
       @return {int}
    */
    getInlineMaxFontSize : function(){
      return this.inline.getMaxFontSize();
    },
    /**
       @memberof Nehan.LayoutContext
       @return {int}
    */
    getInlineCharCount : function(){
      return this.inline.getCharCount();
    },
    /**
       justify(by sweep) inline element with next head character, return null if nothing happend, or return new tail char if justified.
       @memberof Nehan.LayoutContext
       @param head_char {Nehan.Char}
       @return {Nehan.Char | null}
    */
    justifySweep : function(head_char){
      return this.inline.justifySweep(head_char);
    },
    /**
       justify(by dangling) inline element with next head character, return null if nothing happend, or return true if dangling is ready.
       @memberof Nehan.LayoutContext
       @param head_char {Nehan.Char}
       @param head_next {Nehan.Char}
       @return {Nehan.Char | null}
    */
    justifyDangling : function(head_char, head_next){
      return this.inline.justifyDangling(head_char, head_next);
    }
  };

  return LayoutContext;
})();

