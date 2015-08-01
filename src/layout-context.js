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

  /**
   @memberof Nehan.LayoutContext
   @return {boolean}
   */
  LayoutContext.prototype.hasBlockSpaceFor = function(extent, opt){
    return this.block.hasSpaceFor(extent, opt);
  };
  /**
   @memberof Nehan.LayoutContext
   @return {boolean}
   */
  LayoutContext.prototype.hasBreakAfter = function(){
    return this.block.hasBreakAfter() || this.inline.hasBreakAfter() || false;
  };
  /**
   @memberof Nehan.LayoutContext
   @param element {Nehan.Box}
   @param extent {int}
   */
  LayoutContext.prototype.addBlockElement = function(element, extent){
    this.block.addElement(element, extent);
  };
  /**
   @memberof Nehan.LayoutContext
   @return {Array.<Nehan.Box>}
   */
  LayoutContext.prototype.getBlockElements = function(){
    return this.block.getElements();
  };
  /**
   @memberof Nehan.LayoutContext
   @return {int}
   */
  LayoutContext.prototype.getBlockCurExtent = function(){
    return this.block.getCurExtent();
  };
  /**
   @memberof Nehan.LayoutContext
   @return {int}
   */
  LayoutContext.prototype.getBlockMaxExtent = function(){
    return this.block.getMaxExtent();
  };
  /**
   @memberof Nehan.LayoutContext
   @return {int}
   */
  LayoutContext.prototype.getBlockRestExtent = function(){
    return this.block.getRestExtent();
  };
  /**
   @memberof Nehan.LayoutContext
   @return {int}
   */
  LayoutContext.prototype.getBlockLineNo = function(){
    return this.block.getLineNo();
  };
  /**
   @memberof Nehan.LayoutContext
   @return {int}
   */
  LayoutContext.prototype.incBlockLineNo = function(){
    return this.block.incLineNo();
  };
  /**
   @memberof Nehan.LayoutContext
   @return {boolean}
   */
  LayoutContext.prototype.isInlineEmpty = function(){
    return this.inline.isEmpty();
  };
  /**
   @memberof Nehan.LayoutContext
   @return {boolean}
   */
  LayoutContext.prototype.isHyphenated = function(){
    return this.inline.isHyphenated();
  };
  /**
   @memberof Nehan.LayoutContext
   @return {boolean}
   */
  LayoutContext.prototype.isLineOver = function(){
    return this.inline.isLineOver();
  };
  /**
   @memberof Nehan.LayoutContext
   @return {boolean}
   */
  LayoutContext.prototype.hasInlineSpaceFor = function(measure){
    return this.inline.hasSpaceFor(measure);
  };
  /**
   @memberof Nehan.LayoutContext
   @return {boolean}
   */
  LayoutContext.prototype.hasLineBreak = function(){
    return this.inline.hasLineBreak();
  };
  /**
   @memberof Nehan.LayoutContext
   @param status {boolean}
   */
  LayoutContext.prototype.setLineBreak = function(status){
    this.inline.setLineBreak(status);
  };
  /**
   @memberof Nehan.LayoutContext
   @param status {boolean}
   */
  LayoutContext.prototype.setLineOver= function(status){
    this.inline.setLineOver(status);
  };
  /**
   @memberof Nehan.LayoutContext
   */
  LayoutContext.prototype.setBreakAfter = function(status){
    this.inline.setBreakAfter(status);
  };
  /**
   @memberof Nehan.LayoutContext
   @param status {boolean}
   */
  LayoutContext.prototype.setHyphenated = function(status){
    this.inline.setHyphenated(status);
  };
  /**
   @memberof Nehan.LayoutContext
   @param measure {int}
   */
  LayoutContext.prototype.addInlineMeasure = function(measure){
    this.inline.addMeasure(measure);
  };
  /**
   @memberof Nehan.LayoutContext
   @param element {Nehan.Box}
   @param measure {int}
   */
  LayoutContext.prototype.addInlineBoxElement = function(element, measure){
    this.inline.addBoxElement(element, measure);
  };
  /**
   @memberof Nehan.LayoutContext
   @param element {Nehan.Box}
   @param measure {int}
   */
  LayoutContext.prototype.addInlineTextElement = function(element, measure){
    this.inline.addTextElement(element, measure);
  };
  /**
   @memberof Nehan.LayoutContext
   @return {Nehan.Char | Nehan.Word | Nehan.Tcy}
   */
  LayoutContext.prototype.getInlineLastElement = function(){
    return this.inline.getLastElement();
  };
  /**
   @memberof Nehan.LayoutContext
   @return {Array}
   */
  LayoutContext.prototype.getInlineElements = function(){
    return this.inline.getElements();
  };
  /**
   @memberof Nehan.LayoutContext
   @return {int}
   */
  LayoutContext.prototype.getInlineCurMeasure = function(){
    return this.inline.getCurMeasure();
  };
  /**
   @memberof Nehan.LayoutContext
   @return {int}
   */
  LayoutContext.prototype.getInlineRestMeasure = function(){
    return this.inline.getRestMeasure();
  };
  /**
   @memberof Nehan.LayoutContext
   @return {int}
   */
  LayoutContext.prototype.getInlineMaxMeasure = function(){
    return this.inline.getMaxMeasure();
  };
  /**
   @memberof Nehan.LayoutContext
   @return {int}
   */
  LayoutContext.prototype.getInlineMaxExtent = function(){
    return this.inline.getMaxExtent();
  };
  /**
   @memberof Nehan.LayoutContext
   @return {int}
   */
  LayoutContext.prototype.getInlineMaxFontSize = function(){
    return this.inline.getMaxFontSize();
  };
  /**
   @memberof Nehan.LayoutContext
   @return {int}
   */
  LayoutContext.prototype.getInlineCharCount = function(){
    return this.inline.getCharCount();
  };
  /**
   hyphenate(by sweep) inline element with next head character, return null if nothing happend, or return new tail char if hyphenated.
   @memberof Nehan.LayoutContext
   @param head_char {Nehan.Char}
   @return {Nehan.Char | null}
   */
  LayoutContext.prototype.hyphenateSweep = function(head_char){
    return this.inline.hyphenateSweep(head_char);
  };
  /**
   hyphenate(by dangling) inline element with next head character, return null if nothing happend, or return true if dangling is ready.
   @memberof Nehan.LayoutContext
   @param head_char {Nehan.Char}
   @param head_next {Nehan.Char}
   @return {Nehan.Char | null}
   */
  LayoutContext.prototype.hyphenateDangling = function(head_char, head_next){
    return this.inline.hyphenateDangling(head_char, head_next);
  };

  return LayoutContext;
})();

