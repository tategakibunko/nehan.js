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
       @param is_last_block {boolean}
       @return {Object} {before:[int value], after:[int value]}
    */
    getBlockCancelEdge : function(is_last_block){
      return this.block.getCancelEdge(is_last_block);
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
    */
    setBreakAfter : function(status){
      this.inline.setBreakAfter(status);
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
    getInlineLastText : function(){
      return this.inline.getLastText();
    },
    /**
       @memberof Nehan.CursorContext
       @return {Array.<Nehan.Char | Nehan.Word | Nehan.Tcy>}
    */
    getInlineTexts : function(){
      return this.inline.getTexts();
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
       justify inline element with next head character, return null if nothing happend, or return new tail char if justified.
       @memberof Nehan.CursorContext
       @param head_char {Nehan.Char}
       @return {Nehan.Char | null}
    */
    justify : function(head_char){
      return this.inline.justify(head_char);
    }
  };

  return CursorContext;
})();

