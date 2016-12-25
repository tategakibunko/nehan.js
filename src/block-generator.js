Nehan.BlockGenerator = (function(){
  /**
   @memberof Nehan
   @class BlockGenerator
   @classdesc generator of generic block element
   @constructor
   @extends Nehan.LayoutGenerator
   @param context {Nehan.RenderingContext}
   */
  function BlockGenerator(context){
    Nehan.LayoutGenerator.call(this, context);
  }
  Nehan.Class.extend(BlockGenerator, Nehan.LayoutGenerator);

  BlockGenerator.prototype._onInitialize = function(context){
    context.initBlockClear();
  };

  BlockGenerator.prototype._onElement = function(element){
  };

  BlockGenerator.prototype._yield = function(){
    var clearance = this.context.yieldClearance();
    if(clearance){
      //console.log("clearance:", clearance);
      return clearance;
    }
    // if break-before available, page-break but only once.
    if(this.context.isBreakBefore()){
      //console.log("break before");
      return null;
    }
    while(this.hasNext()){
      var element = this._getNext();
      if(element){
	this._onElement(element);
      }
      var result = this.context.addBlockElement(element);
      if(result === Nehan.Results.OK || result === Nehan.Results.SKIP){
	continue;
      }
      if(result === Nehan.Results.EOF ||
	 result === Nehan.Results.BREAK_AFTER ||
	 result === Nehan.Results.ZERO ||
	 result === Nehan.Results.TOO_MANY_ROLLBACK ||
	 result === Nehan.Results.OVERFLOW){
	break;
      }
      console.error(result);
      throw result;
    }
    return this._createOutput();
  };

  BlockGenerator.prototype._getNext = function(){
    if(this.context.hasCache()){
      return this._popCache();
    }

    if(this.context.hasChildLayout()){
      var child = this.context.yieldChildLayout();
      return child;
    }

    // read next token
    var token = this.context.stream? this.context.stream.get() : null;
    if(token === null){
      return null;
    }

    //console.log("block token:%o", token);

    // if texts just under block level, it's delegated to same style inline-generator.
    if(token instanceof Nehan.Text){
      if(token.isWhiteSpaceOnly()){
	return this._getNext();
      }
      this.context.stream.prev();
      var inline_root_gen = this.context.createInlineRootGenerator();
      return inline_root_gen.yield();
    }

    // if tag token, inherit style
    var child_style = this.context.createChildStyle(token);
    var child_gen;

    // if empty anchor, store page pos.
    if(child_style.isEmptyAnchor()){
      this.context.addAnchor(child_style.getAnchorName());
      return this._getNext();
    }

    // if disabled style, just skip
    if(child_style.isDisabled()){
      //console.warn("disabled style:%o(%s):", child_style, child_style.getMarkupName());
      return this._getNext();
    }

    // if page-break, end page
    if(child_style.isPageBreak()){
      this.context.layoutContext.setBreakAfter(true);
      return null;
    }

    // if line-break, output empty line(extent = font-size).
    if(child_style.isLineBreak()){
      return this.context.createLineBox({
	maxExtent:this.context.style.getFontSize()
      });
    }

    if(child_style.isFloated()){
      var first_float_gen = this.context.createChildBlockGenerator(child_style);
      return this.context.createFloatGenerator(first_float_gen).yield();
    }

    // if link tag appears in block context, treat it as inline-block.
    if(child_style.getMarkupName() === "a"){
      child_style.display = "inline-block";
    }

    // if child inline or child inline-block,
    if(child_style.isInline() || child_style.isInlineBlock()){
      this.context.stream.prev();
      child_gen = this.context.createInlineRootGenerator();
      return child_gen.yield();
    }

    // other case, start child block generator
    child_gen = this.context.createChildBlockGenerator(child_style);
    return child_gen.yield();
  };

  BlockGenerator.prototype._onComplete = function(block){
    if(this.context.isBreakAfter()){
      block.breakAfter = true;
    }
  };

  BlockGenerator.prototype._createOutput = function(){
    return this.context.createBlockBox();
  };

  return BlockGenerator;
})();

