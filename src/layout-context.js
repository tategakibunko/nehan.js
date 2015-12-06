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
  LayoutContext.prototype.getBlockCount = function(){
    return this.getBlockElements().length;
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
  LayoutContext.prototype.hasLineBreak = function(){
    return this.inline.hasLineBreak();
  };
  /**
   @memberof Nehan.LayoutContext
   @param status {boolean}
   */
  LayoutContext.prototype.resumeLine = function(line){
    this.inline.resumeLine(line);
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
    this.block.setBreakAfter(status);
  };
  /**
   @memberof Nehan.LayoutContext
   @param status {boolean}
   */
  LayoutContext.prototype.setHyphenated = function(status){
    this.inline.setHyphenated(status);
  };
  /**
   set hanging punctuation across multiple inline-generators.

   [example]
   Think text-gen1(foo) and text-gen2(, and fuga),
   and assume that 'foo' is at the tail of line,
   and ', and fuga' is at the head of next line.

     ## before
     body
       span
         text-gen1(foo)
       text-gen2(, and fuga)
     
   But ',' is head-NG, so ',' is borrowed to text-gen1, and content of text-gen2 is sliced.

     ## after
     body
       span
         text-gen1(foo,)
       text-gen2(and fuga)

   @memberof Nehan.LayoutContext
   @param hanging_punctuation {Object}
   @param hanging_punctuation.data {Nehan.Char}
   @param hanging_punctuation.style {Nehan.Style}
   */
  LayoutContext.prototype.setHangingPunctuation = function(hunging_punctuation){
    this._hangingPunctuation = hunging_punctuation;
  };
  /**
   @memberof Nehan.LayoutContext
   @return hanging_punctuation {Object}
   */
  LayoutContext.prototype.getHangingPunctuation = function(){
    return this._hangingPunctuation || null;
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
   @memberof Nehan.LayoutContext
   @return {Nehan.Char | Nehan.Word | Nehan.Tcy}
   */
  LayoutContext.prototype.popInlineElement = function(){
    return this.inline.popElement();
  };

  /**
   @memberof Nehan.LayoutContext
   @return {boolean}
   */
  LayoutContext.prototype.isBreakAfter = function(){
    return this.block.isBreakAfter();
  };
  return LayoutContext;
})();

