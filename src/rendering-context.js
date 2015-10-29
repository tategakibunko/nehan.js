Nehan.RenderingContext = (function(){
  function RenderingContext(opt){
    opt = opt || {};
    this.yieldCount = 0;
    this.terminate = false;
    this.childGenerator = null;
    //this.breakBefore = false; // TODO
    this.cachedElement = [];
    this.parent = opt.parent || null;
    this.child = null;
    this.markup = opt.markup || null;
    this.style = opt.style || null;
    this.stream = opt.stream || null;
    this.selectors = opt.selectors || new Nehan.Selectors(Nehan.Stylesheet.create());
    this.layoutContext = opt.layoutContext || new Nehan.LayoutContext();
    this.documentContext = opt.documentContext || new Nehan.DocumentContext();
  }

  RenderingContext.prototype.create = function(opt){
    return new RenderingContext({
      parent:opt.parent || null,
      markup:opt.markup || null,
      style:opt.style || null,
      stream:opt.stream || null,
      selectors:this.selectors, // always same
      layoutContext:this.layoutContext, // always same
      documentContext:this.documentContext // always ame
    });
  };

  RenderingContext.prototype.hasNext = function(generator){
    if(this.terminate){
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

  RenderingContext.prototype.addText = function(text){
    if(this.stream){
      this.stream.addText(text);
    }
  };

  RenderingContext.prototype.setTerminate = function(status){
    this.terminate = status;
  };

  RenderingContext.prototype.setChildGenerator = function(generator){
    this.childGenerator = generator;
  };

  RenderingContext.prototype.yieldChildLayout = function(){
    this.childGenerator.yield(this);
  };

  RenderingContext.prototype.hasChildLayout = function(){
    if(this.childGenerator && this.childGenerator.hasNext()){
      return true;
    }
    return false;
  };

  RenderingContext.prototype.hasCache = function(){
    return this.cachedElements.length > 0;
  };

  RenderingContext.prototype.peekLastCache = function(){
    return Nehan.List.last(this.cachedElements);
  };

  RenderingContext.prototype.clearCache = function(cache){
    this.cachedElements = [];
  };

  RenderingContext.prototype.pushCache = function(element){
    var cache_count = element.cacheCount || 0;
    if(cache_count > 0){
      if(cache_count >= Nehan.Config.maxRollbackCount){
	var element_str = (element instanceof Nehan.Box)? element.toString() : (element.data || "??");
	console.warn("[%s] too many retry:%o, element:%o(%s)", this.style.getMarkupName(), this.style, element, element_str);
	// to avoid infinite loop, force child or this generator terminate!
	if(this.child && this.child.hasNext()){
	  this.child.setTerminate(true);
	} else {
	  this.setTerminate(true);
	}
	return;
      }
    }
    element.cacheCount = cache_count + 1;
    this.cachedElements.push(element);
  };

  RenderingContext.prototype.pushCache = function(){
    return this.cachedElements.pop();
  };

  RenderingContext.prototype.setChildGenerator = function(generator){
    this.childGenerator = generator;
  };

  RenderingContext.prototype.hasBlockSpaceFor = function(extent, opt){
    return this.layoutContext.hasBlockSpaceFor(extent, opt);
  };

  RenderingContext.prototype.getElementLayoutExtent = function(element){
    return element.getLayoutExtent(this.style.flow);
  };

  RenderingContext.prototype.incLineBreakCount = function(){
    return this.documentContext.ingLineBreakCount();
  };

  RenderingContext.prototype.getBlockId = function(){
    return this.documentContext.genBlockId();
  };

  RenderingContext.prototype.getRootBlockId = function(){
    return this.documentContext.genRootBlockId();
  };

  RenderingContext.prototype.createChildStyle = function(markup, args){
    return new Nehan.Style(this.selectors, markup, this.style, args || {});
  };

  RenderingContext.prototype.createStyle = function(markup, parent, args){
    return new Nehan.Style(this.selectors, markup, parent, args || {});
  };

  RenderingContext.prototype.isFirstOutput = function(){
    return this.yieldCount === 0;
  };

  RenderingContext.prototype.getAnchorPageNo = function(anchor_name){
    return this.documentContext.getAnchorPageNo(anchor_name);
  };
  
  RenderingContext.prototype.createOutlineElement = function(callbacks){
    return this.documentContext.createBodyOutlineElement(callbacks);
  };

  RenderingContext.prototype.createStartBlockLayoutContext = function(){
    var edge_size = this._getContextEdgeSize();
    var context = new Nehan.LayoutContext(
      new Nehan.BlockContext(this.style.outerExtent - edge_size),
      new Nehan.InlineContext(this.style.contentMeasure)
    );
    //console.info("[%s]start context:%o", this.style.markupName, context);
    return context;
  };

  RenderingContext.prototype.createChildBlockLayoutContext = function(){
    var edge_size = this._getContextEdgeSize();
    var max_extent = this.layoutContext.getBlockRestExtent() - edge_size;
    var child_context = new Nehan.LayoutContext(
      new Nehan.BlockContext(max_extent, {
	lineNo:this.layoutContext.lineNo
      }),
      new Nehan.InlineContext(this.style.contentMeasure)
    );
    //console.info("[%s]child context:%o", this.style.markupName, child_context);
    return child_context;
  };

  RenderingContext.prototype.startChildInlineLayout = function(){
  };

  RenderingContext.prototype.createChildContext = function(markup, style){
    style = style || this.createChildStyle(markup);
    var stream = this.createStream(markup, style);
    return this.create({
      style:style,
      stream:stream
    });
  };

  RenderingContext.prototype.createStream = function(markup, style){
    var markup_name = this.markup.getName();
    var markup_content = this.markup.getContent();
    if(style.getTextCombine() === "horizontal" || markup_name === "tcy"){
      return new Nehan.TokenStream(markup_content, {
	flow:style.flow,
	tokens:[new Nehan.Tcy(markup_content)]
      });
    }
    switch(markup_name){
    case "html":
      var html_stream = new Nehan.TokenStream(markup_content, {
	filter:Nehan.Closure.isTagName(["head", "body"])
      });
      if(html_stream.isEmptyTokens()){
	html_stream.tags = [new Nehan.Tag("body", markup_content)];
      }
      return html_stream;

    case "tbody": case "thead": case "tfoot":
      return new Nehan.TokenStream(markup_content, {
	flow:style.flow,
	filter:Nehan.Closure.isTagName(["tr"])
      });
    case "tr":
      return new Nehan.TokenStream(markup_content, {
	flow:style.flow,
	filter:Nehan.Closure.isTagName(["td", "th"])
      });
    case "word":
      return new Nehan.TokenStream(markup_content, {
	flow:style.flow,
	tokens:[new Nehan.Word(markup_content)]
      });
    case "ruby":
      return new Nehan.RubyTokenStream(markup_content);
    default:
      return new Nehan.TokenStream(this.style.getContent(), {
	flow:style.flow
      });
    }
  };

  RenderingContext.prototype.createFloatGenerator = function(first_float_gen){
    var self = this, parent_style = this.style;
    var floated_generators = [first_float_gen];
    var tokens = this.stream.iterWhile(function(token){
      if(token instanceof Nehan.Text && token.isWhiteSpaceOnly()){
	return true;
      }
      if(!Nehan.Token.isTag(token)){
	return false;
      }
      var child_style = new Nehan.Style(self, token, parent_style, {cursorContext:self.layoutContext});
      if(!child_style.isFloated()){
	parent_style.removeChild(child_style);
	return false;
      }
      var child_stream = self._createStream(child_style);
      var generator = self.createChildBlockGenerator(self.create({
	style:child_style,
	stream:child_stream
      }));
      floated_generators.push(generator);
      return true; // continue
    });
    return new Nehan.FloatGenerator(this, floated_generators);
  };

  RenderingContext.prototype.createChildBlockGenerator = function(child_markup){
    var child_style = this.createChildStyle(child_markup);

    // if child style with 'pasted' attribute, yield block with direct content by LazyGenerator.
    // notice that this is nehan.js original attribute,
    // is required to show some html(like form, input etc) that can't be handled by nehan.js.
    if(child_style.isPasted()){
      return new Nehan.LazyGenerator(child_style, child_style.createBlock({
	content:child_style.getContent()
      }));
    }

    var child_context = this.createChildContext(child_markup, child_style);

    if(child_style.hasFlipFlow()){
      return new Nehan.FlipGenerator(child_context);
    }

    // switch generator by display
    switch(child_style.display){
    case "list-item":
      return new Nehan.ListItemGenerator(child_context);

    case "table":
      return new Nehan.TableGenerator(child_context);

    case "table-row":
      return new Nehan.TableRowGenerator(child_context);

    case "table-cell":
      return new Nehan.TableCellGenerator(child_context);
    }

    // switch generator by markup name
    switch(child_markup.getName()){
    case "img":
      return new Nehan.LazyGenerator(child_style, child_style.createImage());

    case "hr":
      // create block with no elements, but with edge(border).
      return new Nehan.LazyGenerator(child_style, child_style.createBlock());

    case "first-line":
      return new Nehan.FirstLineGenerator(child_context);

    case "details":
    case "blockquote":
    case "figure":
    case "fieldset":
      return new Nehan.SectionRootGenerator(child_context);

    case "section":
    case "article":
    case "nav":
    case "aside":
      return new Nehan.SectionContentGenerator(child_context);

    case "h1":
    case "h2":
    case "h3":
    case "h4":
    case "h5":
    case "h6":
      return new Nehan.HeaderGenerator(child_context);

    case "ul":
    case "ol":
      return new Nehan.ListGenerator(child_context);

    default:
      return new Nehan.BlockGenerator(child_context);
    }
  };

  RenderingContext.prototype.createTextGenerator = function(style, text){
    if(text instanceof Nehan.Tcy || text instanceof Nehan.Word){
      return new Nehan.TextGenerator(this.style, new Nehan.TokenStream(text.getData(), {
	flow:style.flow,
	tokens:[text]
      }));
    }
    var content = text.getContent();
    return new Nehan.TextGenerator(this.style, new Nehan.TokenStream(content, {
      flow:style.flow,
      lexer:new Nehan.TextLexer(content)
    }));
  };

  RenderingContext.prototype.createChildInlineGenerator = function(text_gen){
    var child_context = this.createChildContext(this.markup, this.stream); // share markup and stream

    if(style.isPasted()){
      return new Nehan.LazyGenerator(style, style.createLine({content:style.getContent()}));
    }
    if(style.isInlineBlock()){
      return new Nehan.InlineBlockGenerator(style, stream);
    }
    switch(style.getMarkupName()){
    case "ruby":
      return new Nehan.TextGenerator(style, stream);
    case "img":
      // if inline img, no content text is included in img tag, so we yield it by lazy generator.
      return new Nehan.LazyGenerator(style, style.createImage());
    case "a":
      return new Nehan.LinkGenerator(style, stream);
    default:
      return new Nehan.InlineGenerator(style, stream);
    }
  };

  /**
   @memberof Nehan.RenderingContext
   @return {Nehan.OutlinContext}
   */
  RenderingContext.prototype.getOutlineContext = function(){
    return this.outlineContext || (this.parent? this.parent.getOutlineContext() : null);
  };

  /**
   called when section root(body, blockquote, fieldset, figure, td) starts.

   @memberof Nehan.RenderingContext
   */
  RenderingContext.prototype.startOutlineContext = function(){
    this.outlineContext = new Nehan.OutlineContext(this.markup.getName());
  };

  /**
   called when section root(body, blockquote, fieldset, figure, td) ends.

   @memberof Nehan.RenderingContext
   @method endOutlineContext
   */
  RenderingContext.prototype.endOutlineContext = function(){
    this.documentContext.addOutlineContext(this.getOutlineContext());
  };

  /**
   called when section content(article, aside, nav, section) starts.

   @memberof Nehan.RenderingContext
   @method startSectionContext
   */
  RenderingContext.prototype.startSectionContext = function(){
    this.getOutlineContext().startSection({
      type:this.markup.getName(),
      pageNo:this.documentContext.getPageNo()
    });
  };
  /**
   called when section content(article, aside, nav, section) ends.

   @memberof Nehan.RenderingContext
   @method startSectionContext
   */
  RenderingContext.prototype.endSectionContext = function(){
    this.getOutlineContext().endSection(this.markup.getName());
  };

  /**
   called when heading content(h1-h6) starts.

   @memberof Nehan.RenderingContext
   @method startHeaderContext
   @return {string} header id
   */
  RenderingContext.prototype.startHeaderContext = function(opt){
    return this.getOutlineContext().addHeader({
      headerId:this.documentContext.genHeaderId(),
      pageNo:this.documentContext.getPageNo(),
      type:opt.type,
      rank:opt.rank,
      title:opt.title
    });
  };

  RenderingContext.prototype._getContextEdgeSize = function(){
    return this.isFirstOutput()? this.style.getEdgeBefore() : 0;
  };

  return RenderingContext;
})();
