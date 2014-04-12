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
      if(cache.getBoxMeasure(this.style.flow) <= this.style.getContentMeasure() && cache.br){
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
    while(true){
      var element = this._getNext(context);
      if(element === null){
	break;
      }
      var extent = element.getBoxExtent(this.style.flow);
      if(!context.hasBlockSpaceFor(extent)){
	this.pushCache(element);
	break;
      }
      this._addElement(context, element, extent);
      if(!context.isBlockSpaceLeft()){
	break;
      }
    }
    return this._createBlock(context);
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
    var token = this.stream.get();
    if(token === null){
      return null;
    }

    // if tag token, inherit style
    var child_style = (token instanceof Tag)? new StyleContext(token, this.style) : this.style;

    // if inline text or child inline or inline-block,
    // push back stream and delegate current style and stream to InlineGenerator
    if(Token.isText(token) || child_style.isInline() || child_style.isInlineBlock()){
      this.stream.prev();

      // outline context is required when inline generator yields 'inline-block'.
      this.setChildLayout(new InlineGenerator(this.style, this.stream, this.outlineContext));
      return this.yieldChildLayout(context);
    }

    // if child block with float
    // push back stream and delegate current style and stream to FloatGenerator
    if(child_style.isFloated()){
      this.stream.prev();
      this.setChildLayout(new FloatGenerator(this.style, this.stream, this.outlineContext));
      return this.yieldChildLayout(context);
    }

    var child_stream = this._createStream(child_style, token);

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
    this._onAddElement(element);
  };

  var count_line = function(elements){
    var callee = arguments.callee;
    return List.fold(elements, 0, function(ret, element){
      if(element === null){
	return ret;
      }
      return (element.display === "inline")? ret + 1 : ret + callee(element.elements);
    });
  };

  BlockGenerator.prototype._createBlock = function(context){
    var extent = context.getBlockCurExtent();
    var elements = context.getBlockElements();
    if(extent === 0 || elements.length === 0){
      return null;
    }
    var block = this.style.createBlock({
      extent:extent,
      elements:elements
    });

    // if orphans available, and line count is less than it, cache and page-break temporally.
    var orphans_count = this.style.getOrphansCount();
    if(orphans_count > 0 && count_line(block.elements) < orphans_count && this.hasNext()){
      this.pushCache(block);
      return null; // temporary page-break;
    }
    this._onCreate(block);
    if(!this.hasNext()){
      this._onComplete(block);
    }
    return block;
  };

  BlockGenerator.prototype._onAddElement = function(block){
  };

  BlockGenerator.prototype._onCreate = function(block){
  };

  BlockGenerator.prototype._onComplete = function(block){
  };

  return BlockGenerator;
})();

