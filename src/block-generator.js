Nehan.BlockGenerator = (function(){
  /**
     @memberof Nehan
     @class BlockGenerator
     @classdesc generator of generic block element
     @constructor
     @extends Nehan.LayoutGenerator
     @param style {Nehan.Style}
     @param stream {Nehan.TokenStream}
  */
  function BlockGenerator(context){
    Nehan.LayoutGenerator.call(this, context);
    this.blockId = context.genBlockId();
  }
  Nehan.Class.extend(BlockGenerator, Nehan.LayoutGenerator);

  BlockGenerator.prototype._yield = function(){
    if(!this.context.layoutContext.hasBlockSpaceFor(1, !this.hasNext())){
      return null;
    }
    var clear = this.context.style.clear;
    if(clear && !clear.isDoneAll() && this.context.parent && this.context.parent.floatGroup){
      var float_group = this.context.parent.floatGroup;
      var float_direction = float_group.getFloatDirection();
      if(float_group.isLast() && !float_group.hasNext() && clear.hasDirection(float_direction.getName())){
	clear.setDone(float_direction.getName());
	return this._createWhiteSpace();
      }
      if(!clear.isDoneAll()){
	return this._createWhiteSpace();
      }
    }

    // if break-before available, page-break but only once.
    if(this.context.style.isBreakBefore()){
      this.context.style.clearBreakBefore(); // [TODO] move clearance status to rendering-context class.
      return null;
    }
    while(true){
      if(!this.hasNext()){
	return this._createOutput(); // output last block
      }
      var element = this._getNext();
      if(element === null){
	console.log("[%s]:EOF", this.context.getMarkupName());
	return this._createOutput();
      }
      if(element.isVoid()){
	continue;
      }
      if(element.hasLineBreak){
	this.context.documentContext.incLineBreakCount();
      }
      var extent = this.context.getElementLayoutExtent(element);
      this.context.debugBlockElement(element, extent);
      if(!this.context.layoutContext.hasBlockSpaceFor(extent)){
	this.context.pushCache(element);
	return this._createOutput();
      }
      this._addElement(element, extent);
      if(!this.context.layoutContext.hasBlockSpaceFor(1) || this.context.layoutContext.hasBreakAfter()){
	return this._createOutput();
      }
    }
  };

  /**
     @memberof Nehan.BlockGenerator
     @method popCache
     @return {Nehan.Box} temporary stored cached element for next time yielding.
  */
  BlockGenerator.prototype.popCache = function(){
    var cache = this.context.popCache();

    if(cache && cache.isLine()){
      // restore cached line with correct line no
      if(this.context.getBlockLineNo() === 0){
	cache.lineNo = 0;
	this.context.incBlockLineNo(); // cached line is next first line(of next block), so increment line no in block level this.context.
      }
      // if cache is inline(with no <br>), and measure size is not same as current block measure, reget it.
      // this is caused by float-generator, because in floating layout, inline measure is changed by it's cursor position.
      if((!cache.hasLineBreak || (cache.hasLineBreak && cache.hyphenated)) && cache.getLayoutMeasure(this.context.style.flow) < this.context.style.contentMeasure && this._child){
	//console.info("inline float fix, line = %o(%s), context = %o, child_gen = %o", cache, cache.toString(), context, this._child);

	// resume inline context
	var context2 = this._createChildContext();
	context2.inline.elements = cache.elements;
	context2.inline.curMeasure = cache.getLayoutMeasure(this.context.style.flow);
	context2.inline.maxFontSize = cache.maxFontSize || this.context.style.getFontSize();
	context2.inline.maxExtent = cache.maxExtent || 0;
	context2.inline.charCount = cache.charCount || 0;
	var line = this._child._yield(context2);
	//console.log("line:%o(line no = %d)", line, line.lineNo);
	return line;
      }
    }
    return cache;
  };

  BlockGenerator.prototype._getNext = function(){
    if(this.context.hasCache()){
      var cache = this.context.popCache();
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
      var igen = this.context.createChildInlineGenerator(this.context.style, this.context.stream); // share same style and stream.
      var tgen = igen.context.createChildTextGenerator(token); // text-generator is child of igen.
      return this.context.yieldChildLayout();
    }

    // if tag token, inherit style
    var child_style = this.context.createChildStyle(token);

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
      return this.context.style.createLine({
	maxExtent:this.context.style.getFontSize()
      });
    }

    if(child_style.isFloated()){
      this.context.createFloatGenerator(child_style);
      return this.context.yieldChildLayout();
    }

    // if child inline or child inline-block,
    if(child_style.isInline() || child_style.isInlineBlock()){
      this.context.createChildInlineGenerator(child_style);
      return this.context.yieldChildLayout();
    }

    // other case, start child block generator
    this.context.createChildBlockGenerator(child_style);
    return this.context.yieldChildLayout();
  };

  BlockGenerator.prototype._addElement = function(element, extent){
    this.context.layoutContext.addBlockElement(element, extent);
    this._onAddElement(element);
  };

  BlockGenerator.prototype._createWhiteSpace = function(){
    return this.context.style.createBlock({
      extent:this.context.getBlockMaxExtent(),
      elements:[],
      useBeforeEdge:false,
      useAfterEdge:false,
      restMeasure:0,
      resetExtent:0
    });
  };

  BlockGenerator.prototype._createOutput = function(){
    var extent = this.context.layoutContext.getBlockCurExtent();
    var elements = this.context.layoutContext.getBlockElements();
    if(extent === 0 || elements.length === 0){
      if(!this.context.hasCache() && this.context.isFirstOutput()){
	// size 'zero' has special meaning... so we use 1.
	return new Nehan.Box(new Nehan.BoxSize(1,1), this.context.style, "void"); // empty void element
      }
      return null;
    }
    var after_edge_size = this.context.style.getEdgeAfter();
    var block_args = {
      blockId:this.blockId,
      extent:extent,
      elements:elements,
      breakAfter:this.context.layoutContext.hasBreakAfter(),
      useBeforeEdge:this.context.isFirstOutput(),
      useAfterEdge:(!this.hasNext() && after_edge_size <= this.context.layoutContext.getBlockRestExtent()),
      restMeasure:this.context.layoutContext.getInlineRestMeasure(),
      restExtent:this.context.layoutContext.getBlockRestExtent()
    };
    if(typeof this.rootBlockId !== "undefined"){
      block_args.rootBlockId = this.rootBlockId;
    }
    var block = this.context.style.createBlock(block_args);

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

