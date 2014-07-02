var BlockGenerator = (function(){
  function BlockGenerator(style, stream){
    LayoutGenerator.call(this, style, stream);
  }
  Class.extend(BlockGenerator, LayoutGenerator);

  BlockGenerator.prototype._yield = function(context){
    if(!context.isBlockSpaceLeft()){
      return null;
    }
    while(this.hasNext()){
      var element = this._getNext(context);
      if(element === null){
	break;
      }
      var extent = element.getLayoutExtent(this.style.flow);
      if(!context.hasBlockSpaceFor(extent)){
	this.pushCache(element);
	break;
      }
      this._addElement(context, element, extent);
      if(!context.isBlockSpaceLeft() || context.hasBreakAfter()){
	break;
      }
    }
    return this._createOutput(context);
  };

  BlockGenerator.prototype.popCache = function(context){
    var cache = LayoutGenerator.prototype.popCache.call(this);

    // if cache is inline, and measure size varies, reget line if need.
    if(cache && cache.display === "inline" && cache.getLayoutMeasure(this.style.flow) < this.style.contentMeasure && !cache.br){
      this._childLayout.rollback(cache);
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

    // skip while-space in block-level.
    if(Token.isWhiteSpace(token)){
      this.stream.skipUntil(Token.isWhiteSpace);
      return this._getNext(context);
    }

    // if text, push back stream and restart current style and stream as child inline generator.
    if(Token.isText(token)){
      this.stream.prev();
      this.setChildLayout(new InlineGenerator(this.style, this.stream));
      return this.yieldChildLayout(context);
    }

    // if tag token, inherit style
    var child_style = new StyleContext(token, this.style, {layoutContext:context});

    // if disabled style, just skip
    if(child_style.isDisabled()){
      this.style.removeChild(child_style);
      return this._getNext(context);
    }

    var child_stream = this._createStream(child_style);

    if(child_style.isFloated()){
      var first_float_gen = this._createChildBlockGenerator(child_style, child_stream, context);
      this.setChildLayout(this._createFloatGenerator(context, first_float_gen));
      return this.yieldChildLayout(context);
    }

    // if child inline or child inline-block,
    // delegate current style and stream to child inline-generator with first child inline generator.
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
    this._onAddElement(element);
  };

  BlockGenerator.prototype._createOutput = function(context){
    var extent = context.getBlockCurExtent();
    var elements = context.getBlockElements();
    if(extent === 0 || elements.length === 0){
      return null;
    }
    var block = this.style.createBlock({
      extent:extent,
      elements:elements,
      isFirst:(this._yieldCount === 0),
      isLast:(this.hasNext() === false),
      breakAfter:context.hasBreakAfter()
    });

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

