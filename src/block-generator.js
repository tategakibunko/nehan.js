var BlockGenerator = (function(){
  function BlockGenerator(style, stream, outline_context){
    LayoutGenerator.call(this, style, stream);
    this.outlineContext = outline_context;
  }
  Class.extend(BlockGenerator, LayoutGenerator);

  var get_line_start_pos = function(line){
    var head = line.elements[0];
    return (head instanceof Box)? head.style.getMarkupPos() : head.pos;
  };

  BlockGenerator.prototype.popCache = function(context){
    var cache = LayoutGenerator.prototype.popCache.call(this);

    // if cache is inline, and measure size varies, reget line if need.
    if(this.hasChildLayout() && cache.display === "inline"){
      if(cache.getLayoutMeasure(this.style.flow) <= this.style.contentMeasure && cache.br){
	return cache;
      }
      this._childLayout.stream.setPos(get_line_start_pos(cache)); // rewind stream to the head of line.
      this._childLayout.clearCache(); // stream rewinded, so cache must be destroyed.
      return this.yieldChildLayout(context);
    }
    return cache;
  };

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
      if(!context.isBlockSpaceLeft()){
	break;
      }
    }
    return this._createOutput(context);
  };

  BlockGenerator.prototype._getNext = function(context){
    if(this.hasCache()){
      var cache = this.popCache(context);
      return cache;
    }
    
    if(this.hasChildLayout()){
      return this.yieldChildLayout(context);
    }

    // read next token
    var token = this.stream? this.stream.get() : null;
    if(token === null){
      return null;
    }

    // if text, push back stream and restart current style and stream as child inline generator.
    if(Token.isText(token)){
      // skip while-space token in block level.
      if(Token.isWhiteSpace(token)){
	this.stream.skipUntil(Token.isWhiteSpace);
	return this._getNext(context);
      }
      this.stream.prev();
      this.setChildLayout(new InlineGenerator(this.style, this.stream, this.outlineContext));
      return this.yieldChildLayout(context);
    }

    // if br in block-level, skip it.
    if(token instanceof Tag && token.getName() === "br"){
      return this._getNext(context);
    }

    // if tag token, inherit style
    var child_style = new StyleContext(token, this.style, {layoutContext:context});

    if(child_style.isDisabled()){
      return this._getNext(context); // just skip
    }

    // if child inline-block, start child inline generator with first_generator.
    if(child_style.isInlineBlock()){
      var first_stream = this._createStream(child_style, token);
      var first_generator = new BlockGenerator(child_style, first_stream, this.outlineContext);
      this.setChildLayout(new InlineGenerator(this.style, this.stream, this.outlineContext, first_generator));
      return this.yieldChildLayout(context);
    }

    // if child style(both inline or block) is floated,
    // push back stream and delegate current style and stream to FloatGenerator
    if(child_style.isFloated()){
      this.stream.prev();
      this.setChildLayout(new FloatGenerator(this.style, this.stream, context, this.outlineContext));
      return this.yieldChildLayout(context);
    }

    var child_stream = this._createStream(child_style, token);

    // if child inline, delegate current style and stream to child inline-generator with first_generator.
    if(child_style.isInline()){
      var first_generator;
      // if inline img, no content text is included in img tag, so we yield it by lazy generator.
      if(child_style.getMarkupName() === "img"){
	first_generator = new LazyGenerator(child_style, child_style.createImage());
      } else {
	first_generator = new InlineGenerator(child_style, child_stream, this.outlineContext);
      }
      this.setChildLayout(new InlineGenerator(this.style, this.stream, this.outlineContext, first_generator));
      return this.yieldChildLayout(context);
    }

    // if child_style has flip flow
    if(child_style.hasFlipFlow()){
      this.setChildLayout(new FlipGenerator(child_style, child_stream, this.outlineContext, context));
      return this.yieldChildLayout(context);
    }

    // switch generator by display
    switch(child_style.display){
    case "list-item":
      this.setChildLayout(new ListItemGenerator(child_style, child_stream, this.outlineContext));
      return this.yieldChildLayout(context);
      
    case "table":
      this.setChildLayout(new TableGenerator(child_style, child_stream, this.outlineContext));
      return this.yieldChildLayout(context);

    case "table-header-group":
    case "table-row-group":
    case "table-footer-group":
      this.setChildLayout(new TableRowGroupGenerator(child_style, child_stream, this.outlineContext));
      return this.yieldChildLayout(context);

    case "table-row":
      this.setChildLayout(new TableRowGenerator(child_style, child_stream, this.outlineContext));
      return this.yieldChildLayout(context);

    case "table-cell":
      this.setChildLayout(new TableCellGenerator(child_style, child_stream));
      return this.yieldChildLayout(context);
    }

    // switch generator by markup name
    switch(child_style.getMarkupName()){
    case "img":
      return child_style.createImage();

    case "hr":
      // create block with no elements, but with edge(border).
      return child_style.createBlock();

    case "page-break": case "end-page": case "pbr":
      return null; // page-break

    case "first-line":
      this.setChildLayout(new FirstLineGenerator(child_style, child_stream, this.outlineContext));
      return this.yieldChildLayout(context);

    case "details":
    case "blockquote":
    case "figure":
    case "fieldset":
      this.setChildLayout(new SectionRootGenerator(child_style, child_stream));
      return this.yieldChildLayout(context);

    case "section":
    case "article":
    case "nav":
    case "aside":
      this.setChildLayout(new SectionContentGenerator(child_style, child_stream, this.outlineContext));
      return this.yieldChildLayout(context);

    case "h1":
    case "h2":
    case "h3":
    case "h4":
    case "h5":
    case "h6":
      this.setChildLayout(new HeaderGenerator(child_style, child_stream, this.outlineContext));
      return this.yieldChildLayout(context);

    case "ul":
    case "ol":
      this.setChildLayout(new ListGenerator(child_style, child_stream, this.outlineContext));
      return this.yieldChildLayout(context);

    default:
      this.setChildLayout(new BlockGenerator(child_style, child_stream, this.outlineContext));
      return this.yieldChildLayout(context);
    }
  };

  BlockGenerator.prototype._addElement = function(context, element, extent){
    if(element === null){
      return;
    }
    if(this.style.isPushed() || element.pushed){
      context.pushBlockElement(element, extent);
    } else if(this.style.isPulled() || element.pulled){
      context.pullBlockElement(element, extent);
    } else {
      context.addBlockElement(element, extent);
    }

    // call _onAddElement callback for each 'element' of output.
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
      elements:elements
    });

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

