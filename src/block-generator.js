var BlockGenerator = (function(){
  function BlockGenerator(style, stream, outline_context){
    LayoutGenerator.call(this, style, stream);
    this.outlineContext = outline_context;
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

    // if tag token, inherit style
    var child_style = new StyleContext(token, this.style, {layoutContext:context});

    // if disabled style, just skip
    if(child_style.isDisabled()){
      return this._getNext(context);
    }

    // if child style(both inline or block) is floated,
    // push back stream and delegate current style and stream to FloatGenerator
    if(child_style.isFloated()){
      this.stream.prev();
      this.setChildLayout(new FloatGenerator(this.style, this.stream, context, this.outlineContext));
      return this.yieldChildLayout(context);
    }

    // if child inline-block, start child inline generator with first iblock generator.
    if(child_style.isInlineBlock()){
      var iblock_stream = this._createStream(child_style);
      var iblock_generator = new InlineBlockGenerator(child_style, iblock_stream, this.outlineContext);
      this.setChildLayout(new InlineGenerator(this.style, this.stream, this.outlineContext, iblock_generator));
      return this.yieldChildLayout(context);
    }

    // if child style with 'pasted' attribute,
    // yield immediatelly with pasted content.
    // notice that this is nehan.js original attribute,
    // to show some html(like form, input etc) that nehan.js can't layout.
    if(child_style.isPasted()){
      return child_style.createBlock({
	pastedContent:child_style.getContent()
      });
    }

    var child_stream = this._createStream(child_style);

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
      context.setBreakAfter(true);
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
    if(element.breakAfter){
      context.setBreakAfter(true);
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
      elements:elements,
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

