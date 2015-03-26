var BlockGenerator = (function(){
  /**
     @memberof Nehan
     @class BlockGenerator
     @classdesc generator of generic block element
     @constructor
     @extends Nehan.LayoutGenerator
     @param style {Nehan.StyleContext}
     @param stream {Nehan.TokenStream}
  */
  function BlockGenerator(style, stream){
    LayoutGenerator.call(this, style, stream);
    if(this.style.getParentMarkupName() === "body"){
      this.rootBlockId = DocumentContext.genRootBlockId();
    }
    this.blockId = DocumentContext.genBlockId();
  }
  Class.extend(BlockGenerator, LayoutGenerator);

  BlockGenerator.prototype._yield = function(context){
    if(!context.hasBlockSpaceFor(1, !this.hasNext())){
      return null;
    }

    // if break-before available, page-break but only once.
    if(this.style.isBreakBefore()){
      this.style.clearBreakBefore();
      return null;
    }
    while(true){
      if(!this.hasNext()){
	return this._createOutput(context, true); // output last block
      }
      var element = this._getNext(context);
      var is_last_block = !this.hasNext();
      if(element === null){
	return this._createOutput(context, is_last_block);
      }
      var extent = element.getLayoutExtent(this.style.flow);
      if(!context.hasBlockSpaceFor(extent, is_last_block)){
	this.pushCache(element);
	return this._createOutput(context, false);
      }
      this._addElement(context, element, extent);
      if(!context.hasBlockSpaceFor(1, is_last_block) || context.hasBreakAfter()){
	return this._createOutput(context, is_last_block);
      }
    }
  };

  /**
     @memberof Nehan.BlockGenerator
     @method popCache
     @return {Nehan.Box} temporary stored cached element for next time yielding.
  */
  BlockGenerator.prototype.popCache = function(context){
    var cache = LayoutGenerator.prototype.popCache.call(this);

    // if cache is inline(with no <br>), and measure size is not same as current block measure, reget it.
    // this is caused by float-generator, because in floating layout, inline measure is changed by it's cursor position.
    //if(cache && cache.display === "inline" && cache.getLayoutMeasure(this.style.flow) < this.style.contentMeasure && !cache.br && this._child && this._child.rollback){
    if(cache && cache.display === "inline" && cache.getLayoutMeasure(this.style.flow) < this.style.contentMeasure && this._child && this._child.rollback){
      this._child.rollback(cache);
      return this.yieldChildLayout(context);
    }
    return cache;
  };

  BlockGenerator.prototype._getNext = function(context){
    if(this.hasCache()){
      var cache = this.popCache(context);
      return cache;
    }

    if(this.hasChildLayout()){
      var child = this.yieldChildLayout(context);
      return child;
    }

    // read next token
    var token = this.stream? this.stream.get() : null;
    if(token === null){
      return null;
    }

    //console.log("block token:%o", token);

    // text block
    if(token instanceof Text){
      if(token.isWhiteSpaceOnly()){
	//console.log("[block] white space only, skip it");
	return this._getNext(context);
      }
      var text_gen = this._createTextGenerator(this.style, token);
      this.setChildLayout(new InlineGenerator(this.style, this.stream, text_gen));
      return this.yieldChildLayout(context);
    }

    // if tag token, inherit style
    var child_style = new StyleContext(token, this.style, {cursorContext:context});

    // if disabled style, just skip
    if(child_style.isDisabled()){
      this.style.removeChild(child_style);
      return this._getNext(context);
    }

    // if page-break, end page
    if(child_style.isPageBreak()){
      context.setBreakAfter(true);
      return null;
    }

    var child_stream = this._createStream(child_style);

    if(child_style.isFloated()){
      var first_float_gen = this._createChildBlockGenerator(child_style, child_stream, context);
      this.setChildLayout(this._createFloatGenerator(context, first_float_gen));
      return this.yieldChildLayout(context);
    }

    // if child inline or child inline-block,
    if(child_style.isInlineBlock() || child_style.isInline()){
      var first_inline_gen = this._createChildInlineGenerator(child_style, child_stream, context);
      this.setChildLayout(new InlineGenerator(this.style, this.stream, first_inline_gen));
      return this.yieldChildLayout(context);
    }

    // other case, start child block generator
    this.setChildLayout(this._createChildBlockGenerator(child_style, child_stream, context));
    return this.yieldChildLayout(context);
  };

  BlockGenerator.prototype._addElement = function(context, element, extent){
    if(element === null){
      return;
    }
    context.addBlockElement(element, extent);
    this._onAddElement(context, element);
  };

  BlockGenerator.prototype._createOutput = function(context, is_last_block){
    var extent = context.getBlockCurExtent();
    var elements = context.getBlockElements();
    if(extent === 0 || elements.length === 0){
      return null;
    }
    var block_args = {
      blockId:this.blockId,
      extent:extent,
      elements:elements,
      breakAfter:context.hasBreakAfter(),
      cancelEdge:context.getBlockCancelEdge(is_last_block)
    };
    if(typeof this.rootBlockId !== "undefined"){
      block_args.rootBlockId = this.rootBlockId;
    }
    var block = this.style.createBlock(block_args);

    // call _onCreate callback for 'each' output
    this._onCreate(context, block);

    // call _onComplete callback for 'final' output
    if(!this.hasNext()){
      this._onComplete(context, block);
    }
    return block;
  };

  return BlockGenerator;
})();

