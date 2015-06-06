var CursorContext = (function(){
  /**
     @memberof Nehan
     @class CursorContext
     @classdesc generator cursor position set(inline and block).
     @constructor
     @param block {Nehan.BlockContext}
     @param inline {Nehan.InlineContext}
  */
  function CursorContext(block, inline){
    this.block = block;
    this.inline = inline;
  }

  CursorContext.prototype = {
    /**
       @memberof Nehan.CursorContext
       @return {boolean}
    */
    hasBlockSpaceFor : function(extent, opt){
      return this.block.hasSpaceFor(extent, opt);
    },
    /**
       @memberof Nehan.CursorContext
       @return {boolean}
    */
    hasBreakAfter : function(){
      return this.block.hasBreakAfter() || this.inline.hasBreakAfter() || false;
    },
    /**
       @memberof Nehan.CursorContext
       @param element {Nehan.Box}
       @param extent {int}
    */
    addBlockElement : function(element, extent){
      this.block.addElement(element, extent);
    },
    /**
       @memberof Nehan.CursorContext
       @return {Array.<Nehan.Box>}
    */
    getBlockElements : function(){
      return this.block.getElements();
    },
    /**
       @memberof Nehan.CursorContext
       @return {int}
    */
    getBlockCurExtent : function(){
      return this.block.getCurExtent();
    },
    /**
       @memberof Nehan.CursorContext
       @return {int}
    */
    getBlockMaxExtent : function(){
      return this.block.getMaxExtent();
    },
    /**
       @memberof Nehan.CursorContext
       @return {int}
    */
    getBlockRestExtent : function(){
      return this.block.getRestExtent();
    },
    /**
       @memberof Nehan.CursorContext
       @return {int}
    */
    getBlockLineNo : function(){
      return this.block.getLineNo();
    },
    /**
       @memberof Nehan.CursorContext
       @return {int}
    */
    incBlockLineNo : function(){
      return this.block.incLineNo();
    },
    /**
       @memberof Nehan.CursorContext
       @return {boolean}
    */
    isInlineEmpty : function(){
      return this.inline.isEmpty();
    },
    /**
       @memberof Nehan.CursorContext
       @return {boolean}
    */
    isJustified : function(){
      return this.inline.isJustified();
    },
    /**
       @memberof Nehan.CursorContext
       @return {boolean}
    */
    isLineOver : function(){
      return this.inline.isLineOver();
    },
    /**
       @memberof Nehan.CursorContext
       @return {boolean}
    */
    hasInlineSpaceFor : function(measure){
      return this.inline.hasSpaceFor(measure);
    },
    /**
       @memberof Nehan.CursorContext
       @return {boolean}
    */
    hasLineBreak : function(){
      return this.inline.hasLineBreak();
    },
    /**
       @memberof Nehan.CursorContext
       @param status {boolean}
    */
    setLineBreak : function(status){
      this.inline.setLineBreak(status);
    },
    /**
       @memberof Nehan.CursorContext
       @param status {boolean}
    */
    setLineOver: function(status){
      this.inline.setLineOver(status);
    },
    /**
       @memberof Nehan.CursorContext
    */
    setBreakAfter : function(status){
      this.inline.setBreakAfter(status);
    },
    /**
       @memberof Nehan.CursorContext
       @param status {boolean}
    */
    setJustified : function(status){
      this.inline.setJustified(status);
    },
    /**
       @memberof Nehan.CursorContext
       @param measure {int}
    */
    addInlineMeasure : function(measure){
      this.inline.addMeasure(measure);
    },
    /**
       @memberof Nehan.CursorContext
       @param element {Nehan.Box}
       @param measure {int}
    */
    addInlineBoxElement : function(element, measure){
      this.inline.addBoxElement(element, measure);
    },
    /**
       @memberof Nehan.CursorContext
       @param element {Nehan.Box}
       @param measure {int}
    */
    addInlineTextElement : function(element, measure){
      this.inline.addTextElement(element, measure);
    },
    /**
       @memberof Nehan.CursorContext
       @return {Nehan.Char | Nehan.Word | Nehan.Tcy}
    */
    getInlineLastElement : function(){
      return this.inline.getLastElement();
    },
    /**
       @memberof Nehan.CursorContext
       @return {Array}
    */
    getInlineElements : function(){
      return this.inline.getElements();
    },
    /**
       @memberof Nehan.CursorContext
       @return {int}
    */
    getInlineCurMeasure : function(){
      return this.inline.getCurMeasure();
    },
    /**
       @memberof Nehan.CursorContext
       @return {int}
    */
    getInlineRestMeasure : function(){
      return this.inline.getRestMeasure();
    },
    /**
       @memberof Nehan.CursorContext
       @return {int}
    */
    getInlineMaxMeasure : function(){
      return this.inline.getMaxMeasure();
    },
    /**
       @memberof Nehan.CursorContext
       @return {int}
    */
    getInlineMaxExtent : function(){
      return this.inline.getMaxExtent();
    },
    /**
       @memberof Nehan.CursorContext
       @return {int}
    */
    getInlineMaxFontSize : function(){
      return this.inline.getMaxFontSize();
    },
    /**
       @memberof Nehan.CursorContext
       @return {int}
    */
    getInlineCharCount : function(){
      return this.inline.getCharCount();
    },
    /**
       justify(by sweep) inline element with next head character, return null if nothing happend, or return new tail char if justified.
       @memberof Nehan.CursorContext
       @param head_char {Nehan.Char}
       @return {Nehan.Char | null}
    */
    justifySweep : function(head_char){
      return this.inline.justifySweep(head_char);
    },
    /**
       justify(by dangling) inline element with next head character, return null if nothing happend, or return true if dangling is ready.
       @memberof Nehan.CursorContext
       @param head_char {Nehan.Char}
       @param head_next {Nehan.Char}
       @return {Nehan.Char | null}
    */
    justifyDangling : function(head_char, head_next){
      return this.inline.justifyDangling(head_char, head_next);
    }
  };

  return CursorContext;
})();

