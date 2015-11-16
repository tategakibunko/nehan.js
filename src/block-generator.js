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
    this.blockId = context.genBlockId();
  }
  Nehan.Class.extend(BlockGenerator, Nehan.LayoutGenerator);

  BlockGenerator.prototype._yield = function(){
    var clearance = this.context.yieldBlockClear();
    if(clearance){
      return clearance;
    }
    // if break-before available, page-break but only once.
    if(this.context.isBreakBefore()){
      this.context.clearBreakBefore();
      return null;
    }
    while(this.hasNext()){
      var element = this._getNext();
      try {
	this.context.addBlockElement(element);
      } catch (e){
	console.warn(e);
	break;
      }
    }
    return this._createOutput();
  };

  BlockGenerator.prototype._getNext = function(){
    if(this.context.hasCache()){
      var cache = this.context.popCache();
      console.info("use cache:", cache);
      return cache;
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

    // if disabled style, just skip
    if(child_style.isDisabled()){
      return this._getNext();
    }

    // if page-break, end page
    if(child_style.isPageBreak()){
      this.context.setBreakAfter(true);
      return null;
    }

    // if line-break, output empty line(extent = font-size).
    if(child_style.isLineBreak()){
      return this.context.style.createLine(this.context, {
	maxExtent:this.context.style.getFontSize()
      });
    }

    if(child_style.isFloated()){
      child_gen = this.context.createFloatGenerator(child_style);
      return child_gen.yield();
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

  BlockGenerator.prototype._createOutput = function(){
    var block = this.context.createBlock();

    // call _onCreate callback for 'each' output
    this._onCreate(block);

    // call _onComplete callback for 'final' output
    if(!this.hasNext()){
      this._onComplete(block);
    }
    return block;
  };

  return BlockGenerator;
})();

