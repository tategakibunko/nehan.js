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
  Nehan.Class.extend(BlockGenerator, LayoutGenerator);

  BlockGenerator.prototype._yield = function(context){
    if(!context.hasBlockSpaceFor(1, !this.hasNext())){
      return null;
    }
    var clear = this.style.clear;
    if(clear && !clear.isDoneAll() && this._parent && this._parent.floatGroup){
      var float_group = this._parent.floatGroup;
      var float_direction = float_group.getFloatDirection();
      if(float_group.isLast() && clear.hasDirection(float_direction.getName())){
	clear.setDone(float_direction.getName());
      }
      return this._createWhiteSpace(context);
    }

    // if break-before available, page-break but only once.
    if(this.style.isBreakBefore()){
      this.style.clearBreakBefore();
      return null;
    }
    while(true){
      if(!this.hasNext()){
	return this._createOutput(context); // output last block
      }
      var element = this._getNext(context);
      if(element === null){
	return this._createOutput(context);
      }
      if(element.isVoid()){
	continue;
      }
      var extent = element.getLayoutExtent(this.style.flow);
      if(!context.hasBlockSpaceFor(extent)){
	this.pushCache(element);
	return this._createOutput(context);
      }
      this._addElement(context, element, extent);
      if(!context.hasBlockSpaceFor(1) || context.hasBreakAfter()){
	return this._createOutput(context);
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

    if(cache && cache.isLine()){
      // restore cached line with correct line no
      if(context.getBlockLineNo() === 0){
	cache.lineNo = 0;
	context.incBlockLineNo(); // cached line is next first line, so increment line no in block level context.
      }
      // if cache is inline(with no <br>), and measure size is not same as current block measure, reget it.
      // this is caused by float-generator, because in floating layout, inline measure is changed by it's cursor position.
      if((!cache.lineBreak || (cache.lineBreak && cache.justified)) && cache.getLayoutMeasure(this.style.flow) < this.style.contentMeasure && this._child){
	//console.info("inline float fix, line = %o(%s), context = %o, child_gen = %o", cache, cache.toString(), context, this._child);

	// resume inline context
	var context2 = this._createChildContext(context);
	context2.inline.elements = cache.elements;
	context2.inline.curMeasure = cache.getLayoutMeasure(this.style.flow);
	context2.inline.maxFontSize = cache.maxFontSize || this.style.getFontSize();
	context2.inline.maxExtent = cache.maxExtent || 0;
	context2.inline.charCount = cache.charCount || 0;
	var line = this._child._yield(context2);
	//console.log("line:%o(line no = %d)", line, line.lineNo);
	return line;
      }
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
    if(token instanceof Nehan.Text){
      if(token.isWhiteSpaceOnly()){
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
      return this._getNext(context);
    }

    // if page-break, end page
    if(child_style.isPageBreak()){
      context.setBreakAfter(true);
      return null;
    }

    // if line-break, output empty line(extent = font-size).
    if(child_style.isLineBreak()){
      return this.style.createLine({
	maxExtent:this.style.getFontSize()
      });
    }

    var child_stream = this._createStream(child_style);

    if(child_style.isFloated()){
      var first_float_gen = this._createChildBlockGenerator(child_style, child_stream, context);
      this.setChildLayout(this._createFloatGenerator(context, first_float_gen));
      return this.yieldChildLayout(context);
    }

    // if child inline or child inline-block,
    if(child_style.isInline() || child_style.isInlineBlock()){
      var first_inline_gen = this._createChildInlineGenerator(child_style, child_stream, context);
      this.setChildLayout(new InlineGenerator(this.style, this.stream, first_inline_gen));
      return this.yieldChildLayout(context);
    }

    // other case, start child block generator
    this.setChildLayout(this._createChildBlockGenerator(child_style, child_stream, context));
    return this.yieldChildLayout(context);
  };

  BlockGenerator.prototype._addElement = function(context, element, extent){
    context.addBlockElement(element, extent);
    this._onAddElement(context, element);
  };

  BlockGenerator.prototype._createWhiteSpace = function(context){
    return this.style.createBlock({
      extent:context.getBlockMaxExtent(),
      elements:[],
      useBeforeEdge:false,
      useAfterEdge:false,
      restMeasure:0,
      resetExtent:0
    });
  };

  BlockGenerator.prototype._createOutput = function(context){
    var extent = context.getBlockCurExtent();
    var elements = context.getBlockElements();
    if(extent === 0 || elements.length === 0){
      /*
      var cache = (this._cachedElements.length > 0)? this._cachedElements[0] : null;
      var cache_str = cache? cache.toString() : "null";
      //console.log("void, gen:%o(yielded=%d), context:%o, cache:%o(%s), stream at:%d(has next:%o)", this, this._yieldCount, context, cache, cache_str, this.stream.getPos(), this.stream.hasNext());
      */
      if(!this.hasCache() && this.isFirstOutput()){
	// size 'zero' has special meaning... so we use 1.
	return new Box(new Nehan.BoxSize(1,1), this.style, "void"); // empty void element
      }
      return null;
    }
    var after_edge_size = this.style.getEdgeAfter();
    var block_args = {
      blockId:this.blockId,
      extent:extent,
      elements:elements,
      breakAfter:context.hasBreakAfter(),
      useBeforeEdge:this.isFirstOutput(),
      useAfterEdge:(!this.hasNext() && after_edge_size <= context.getBlockRestExtent()),
      restMeasure:context.getInlineRestMeasure(),
      restExtent:context.getBlockRestExtent()
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

