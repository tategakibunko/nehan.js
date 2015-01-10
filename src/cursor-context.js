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
    */
    isInlineEmpty : function(){
      return this.inline.isEmpty();
    },
    /**
       @memberof Nehan.CursorContext
    */
    hasInlineSpaceFor : function(measure){
      return this.inline.hasSpaceFor(measure);
    },
    /**
       @memberof Nehan.CursorContext
    */
    hasLineBreak : function(){
      return this.inline.hasLineBreak();
    },
    /**
       @memberof Nehan.CursorContext
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
    */
    addInlineElement : function(element, measure){
      this.inline.addElement(element, measure);
    },
    /**
       @memberof Nehan.CursorContext
    */
    getInlineLastText : function(){
      return this.inline.getLastText();
    },
    /**
       @memberof Nehan.CursorContext
    */
    getInlineTexts : function(){
      return this.inline.getTexts();
    },
    /**
       @memberof Nehan.CursorContext
    */
    getInlineElements : function(){
      return this.inline.getElements();
    },
    /**
       @memberof Nehan.CursorContext
    */
    getInlineCurMeasure : function(){
      return this.inline.getCurMeasure();
    },
    /**
       @memberof Nehan.CursorContext
    */
    getInlineRestMeasure : function(){
      return this.inline.getRestMeasure();
    },
    /**
       @memberof Nehan.CursorContext
    */
    getInlineMaxMeasure : function(){
      return this.inline.getMaxMeasure();
    },
    /**
       @memberof Nehan.CursorContext
    */
    getInlineMaxExtent : function(){
      return this.inline.getMaxExtent();
    },
    /**
       @memberof Nehan.CursorContext
    */
    getInlineMaxFontSize : function(){
      return this.inline.getMaxFontSize();
    },
    /**
       @memberof Nehan.CursorContext
    */
    getInlineCharCount : function(){
      return this.inline.getCharCount();
    },
    /**
       @memberof Nehan.CursorContext
    */
    justify : function(head_char){
      return this.inline.justify(head_char);
    }
  };

  return CursorContext;
})();

