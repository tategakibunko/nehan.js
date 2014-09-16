var LayoutGenerator = (function(){
  function LayoutGenerator(style, stream){
    this.style = style;
    this.stream = stream;
    this._parentLayout = null;
    this._childLayout = null;
    this._cachedElements = [];
    this._terminate = false; // used to force terminate generator.
  }

  // 1. create child layout context from parent layout context.
  // 2. call _yield implemented in inherited class.
  LayoutGenerator.prototype.yield = function(parent_context){
    var context = parent_context? this._createChildContext(parent_context) : this._createStartContext();
    return this._yield(context);
  };

  LayoutGenerator.prototype._yield = function(context){
    throw "LayoutGenerator::_yield must be implemented in child class";
  };

  LayoutGenerator.prototype.setTerminate = function(status){
    this._terminate = status;
  };

  LayoutGenerator.prototype.setChildLayout = function(generator){
    this._childLayout = generator;
    generator._parentLayout = this;
  };

  LayoutGenerator.prototype.hasNext = function(){
    if(this._terminate){
      return false;
    }
    if(this.hasCache()){
      return true;
    }
    if(this.hasChildLayout()){
      return true;
    }
    return this.stream? this.stream.hasNext() : false;
  };

  LayoutGenerator.prototype.hasChildLayout = function(){
    if(this._childLayout && this._childLayout.hasNext()){
      return true;
    }
    return false;
  };

  LayoutGenerator.prototype.hasCache = function(){
    return this._cachedElements.length > 0;
  };

  LayoutGenerator.prototype.yieldChildLayout = function(context){
    var next = this._childLayout.yield(context);
    return next;
  };

  LayoutGenerator.prototype.peekLastCache = function(){
    return List.last(this._cachedElements);
  };

  LayoutGenerator.prototype.pushCache = function(element){
    var cache_count = element.cacheCount || 0;
    if(cache_count > 0){
      if(cache_count >= Config.maxRollbackCount){
	console.error("[%s] too many retry:%o", this.style.getMarkupName(), this.style);
	this.setTerminate(true); // this error sometimes causes infinite loop, so force terminate generator.
	return;
      }
    }
    element.cacheCount = cache_count + 1;
    this._cachedElements.push(element);
  };

  LayoutGenerator.prototype.popCache = function(){
    var cache = this._cachedElements.pop();
    return cache;
  };

  LayoutGenerator.prototype.clearCache = function(){
    this._cachedElements = [];
  };

  // called when each time generator yields element of output, and added it.
  LayoutGenerator.prototype._onAddElement = function(block){
  };

  // called when each time generator yields output.
  LayoutGenerator.prototype._onCreate = function(context, output){
  };

  // called when generator yields final output.
  LayoutGenerator.prototype._onComplete = function(context, output){
  };

  LayoutGenerator.prototype._createStartContext = function(){
    return new LayoutContext(
      new BlockContext(this.style.contentExtent, {
	isFirstBlock:true,
	contextEdge:this.style.getBlockContextEdge()
      }),
      new InlineContext(this.style.contentMeasure)
    );
  };

  LayoutGenerator.prototype._createChildContext = function(parent_context){
    var context_edge = this.style.getBlockContextEdge();
    var is_first_block = this.stream? this.stream.isHead() : true;
    var max_extent = parent_context.getBlockRestExtent() - context_edge.before - context_edge.after;
    return new LayoutContext(
      new BlockContext(max_extent, {
	isFirstBlock:is_first_block,
	contextEdge:context_edge
      }),
      new InlineContext(this.style.contentMeasure)
    );
  };

  LayoutGenerator.prototype._createStream = function(style){
    switch(style.getMarkupName()){
    case "ruby": return new RubyTokenStream(style.markup);
    default: return new TokenStream(style.getContent());
    } 
  };

  LayoutGenerator.prototype._createFloatGenerator = function(context, first_float_gen){
    var self = this, parent_style = this.style;
    var floated_generators = [first_float_gen];
    var tokens = this.stream.iterWhile(function(token){
      if(Token.isWhiteSpace(token)){
	return true; // continue
      }
      if(!Token.isTag(token)){
	return false;
      }
      var child_style = new StyleContext(token, parent_style, {layoutContext:context});
      if(!child_style.isFloated()){
	parent_style.removeChild(child_style);
	return false;
      }
      var child_stream = self._createStream(child_style);
      var generator = self._createChildBlockGenerator(child_style, child_stream, context);
      floated_generators.push(generator);
      return true; // continue
    });
    return new FloatGenerator(this.style, this.stream, floated_generators);
  };

  LayoutGenerator.prototype._createChildBlockGenerator = function(style, stream, context){
    if(style.hasFlipFlow()){
      return new FlipGenerator(style, stream, context);
    }

    // if child style with 'pasted' attribute, yield block with direct content by LazyGenerator.
    // notice that this is nehan.js original attribute,
    // is required to show some html(like form, input etc) that can't be handled by nehan.js.
    if(style.isPasted()){
      return new LazyGenerator(style, style.createBlock({content:style.getContent()}));
    }

    // switch generator by display
    switch(style.display){
    case "list-item":
      return new ListItemGenerator(style, stream);

    case "table":
      return new TableGenerator(style, stream);

    case "table-header-group":
    case "table-row-group":
    case "table-footer-group":
      return new TableRowGroupGenerator(style, stream);

    case "table-row":
      return new TableRowGenerator(style, stream);

    case "table-cell":
      return new TableCellGenerator(style, stream);
    }

    // switch generator by markup name
    switch(style.getMarkupName()){
    case "img":
      return new LazyGenerator(style, style.createImage());

    case "hr":
      // create block with no elements, but with edge(border).
      return new LazyGenerator(style, style.createBlock());

    case "first-line":
      return new FirstLineGenerator(style, stream);

    case "details":
    case "blockquote":
    case "figure":
    case "fieldset":
      return new SectionRootGenerator(style, stream);

    case "section":
    case "article":
    case "nav":
    case "aside":
      return new SectionContentGenerator(style, stream);

    case "h1":
    case "h2":
    case "h3":
    case "h4":
    case "h5":
    case "h6":
      return new HeaderGenerator(style, stream);

    case "ul":
    case "ol":
      return new ListGenerator(style, stream);

    default:
      return new BlockGenerator(style, stream);
    }
  };

  LayoutGenerator.prototype._createChildInlineGenerator = function(style, stream, context){
    if(style.isInlineBlock()){
      return new InlineBlockGenerator(style, stream);
    }
    if(style.isPasted()){
      return new LazyGenerator(style, style.createLine({content:style.getContent()}));
    }
    switch(style.getMarkupName()){
    case "img":
      // if inline img, no content text is included in img tag, so we yield it by lazy generator.
      return new LazyGenerator(style, style.createImage());
    case "a":
      return new LinkGenerator(style, stream);
    case "page-break": case "end-page": case "pbr":
      return new BreakAfterGenerator(style);
    default:
      return new InlineGenerator(style, stream);
    }
  };

  return LayoutGenerator;
})();

