Nehan.RenderingContext = (function(){
  function RenderingContext(opt){
    opt = opt || {};
    this.yieldCount = 0;
    this.terminate = false;
    //this.breakBefore = false; // TODO
    this.cachedElements = [];
    this.parent = opt.parent || null;
    this.markup = opt.markup || null;
    this.style = opt.style || null;
    this.stream = opt.stream || null;
    this.lazyOutput = opt.lazyOutput || null;
    this.childGenerator = opt.childGenerator || null;
    this.floatedGenerators = opt.floatedGenerators || [];
    this.parallelGenerators = opt.parallelGenerators || [];
    this.layoutContext = opt.layoutContext || null;
    this.selectors = opt.selectors || new Nehan.Selectors(Nehan.Stylesheet.create());
    this.documentContext = opt.documentContext || new Nehan.DocumentContext();
  }

  RenderingContext.prototype.create = function(opt){
    return new RenderingContext({
      parent:opt.parent || null,
      markup:opt.markup || null,
      style:opt.style || null,
      stream:opt.stream || null,
      childGenerator:opt.childGenerator || null,
      floatedGenerators:opt.floatedGenerators || [],
      parallelGenerators:opt.parallelGenerators || [],
      layoutContext:this.layoutContext || null,
      selectors:this.selectors, // always same
      documentContext:this.documentContext // always ame
    });
  };

  RenderingContext.prototype.extend = function(opt){
    return new RenderingContext({
      parent:opt.parent || this.parent,
      markup:opt.markup || this.markup,
      style:opt.style || this.style,
      stream:opt.stream || this.stream,
      childGenerator:opt.childGenerator || this.childGenerator,
      floatedGenerators:opt.floatedGenerators || this.floatedGenerators,
      parallelGenerators:opt.parallelGenerators || this.parallelGenerators,
      layoutContext:this.layoutContext || this.layoutContext,
      selectors:this.selectors, // always same
      documentContext:this.documentContext // always ame
    });
  };

  RenderingContext.prototype.getContent = function(){
    return this.stream? this.stream.getSrc() : "";
  };

  RenderingContext.prototype.yieldChildLayout = function(){
    return this.childGenerator.yield();
  };

  RenderingContext.prototype.setStyle = function(key, value){
    this.selectors.setValue(key, value);
  };

  RenderingContext.prototype.setStyles = function(values){
    for(var key in values){
      this.selectors.setValue(key, values[key]);
    }
  };

  RenderingContext.prototype.addAnchor = function(){
    var anchor_name = this.markup.getAttr("name");
    if(anchor_name){
      this.documentContext.addAnchor(anchor_name);
    }
  };

  RenderingContext.prototype.getContextEdgeExtent = function(){
    return this.isFirstOutput()? this.style.getEdgeBefore() : 0;
  };

  RenderingContext.prototype.getParentRestExtent = function(){
    return this.parent.layoutContext.getBlockRestExtent();
  };

  RenderingContext.prototype.createStartBlockLayoutContext = function(){
    var edge_extent = this.getContextEdgeExtent();
  };

  RenderingContext.prototype.createLayoutContext = function(){
    if(!this.style){ // document, html
      return new Nehan.LayoutContext(
	new Nehan.BlockContext(screen.width),
	new Nehan.InlineContext(screen.height)
      );
    }
    // inline
    if(this.style.isInline()){
      return new Nehan.LayoutContext(
	this.layoutContext.block, // inline generator inherits block context as it is.
	new Nehan.InlineContext(this.layoutContext.getInlineRestMeasure())
      );
    }
    // inline-block
    if(this.style.isInlineBlock()){
      return new Nehan.LayoutContext(
	new Nehan.BlockContext(this.parent.layoutContext.getBlockRestExtent() - this.style.getEdgeExtent()),
	new Nehan.InlineContext(this.parent.layoutContext.getInlineRestMeasure() - this.style.getEdgeMeasure())
      );
    }
    var edge_extent = this.getContextEdgeExtent();

    // block with parent
    if(this.parent){
      var max_extent = this.getParentRestExtent() - edge_extent;
      return this.layoutContext = new Nehan.LayoutContext(
	new Nehan.BlockContext(max_extent, {
	  lineNo:this.layoutContext.lineNo
	}),
	new Nehan.InlineContext(this.style.contentMeasure)
      );
    }

    // block witout parent
    return new Nehan.LayoutContext(
      new Nehan.BlockContext(this.style.outerExtent - edge_extent),
      new Nehan.InlineContext(this.style.contentMeasure)
    );
  };

  RenderingContext.prototype.initLayoutContext = function(){
    this.layoutContext = this.createLayoutContext();
  };

  RenderingContext.prototype.hasNext = function(){
    if(this.terminate){
      return false;
    }
    if(this.hasCache()){
      return true;
    }
    if(this.hasChildLayout()){
      return true;
    }
    if(this.hasNextFloat()){
      return true;
    }
    if(this.hasNextParallelLayout()){
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

  RenderingContext.prototype.hasChildLayout = function(){
    if(this.childGenerator && this.childGenerator.hasNext()){
      return true;
    }
    return false;
  };

  RenderingContext.prototype.hasNextFloat = function(){
    return Nehan.List.exists(this.floatedGenerators, function(gen){
      return gen.hasNext();
    });
  };

  RenderingContext.prototype.hasNextParallelLayout = function(){
    return Nehan.List.exists(this.parallelGenerators, function(gen){
      return gen.hasNext();
    });
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

  RenderingContext.prototype.getElementLayoutExtent = function(element){
    return element.getLayoutExtent(this.style.flow);
  };

  RenderingContext.prototype.getElementLayoutMeasure = function(element){
    return element.getLayoutMeasure(this.style.flow);
  };

  RenderingContext.prototype.genBlockId = function(){
    return this.documentContext.genBlockId();
  };

  RenderingContext.prototype.genRootBlockId = function(){
    return this.documentContext.genRootBlockId();
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

  RenderingContext.prototype.createChildContext = function(opt){
    var markup = opt.markup || null;
    var style = opt.style || this.createChildStyle(markup);
    var stream = opt.stream || this.createStream(markup, style);
    return this.create({
      markup:markup,
      style:style,
      stream:stream
    });
  };

  RenderingContext.prototype.getParentStyle = function(){
    return this.parent? this.parent.style : null;
  };

  RenderingContext.prototype.createChildStyle = function(markup, args){
    return new Nehan.Style(this.selectors, markup, this.getParentStyle(), args || {});
  };

  RenderingContext.prototype.createStyle = function(markup, parent, args){
    return new Nehan.Style(this.selectors, markup, parent, args || {});
  };

  RenderingContext.prototype.createStream = function(markup, style){
    var markup_name = markup.getName();
    var markup_content = markup.getContent();
    style = style || this.createChildStyle(markup);
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

  // inline is recursively broken by 'block_gen'.
  RenderingContext.prototype.breakInline = function(block_gen){
    this.setTerminate(true);
    if(this.parent === null){
      return;
    }
    if(this.parent && this.parent.style.isInline()){
      this.parent.breakInline(block_gen);
    } else {
      this.parent.setChildGenerator(block_gen);
    }
  };

  RenderingContext.prototype.createFloatGenerator = function(first_float_style){
    var first_float_gen = this.createChildBlockGenerator(first_float_style);
    var floated_generators = [first_float_gen];
    this.stream.iterWhile(function(token){
      if(token instanceof Nehan.Text && token.isWhiteSpaceOnly()){
	return true; // skip and continue
      }
      if(!Nehan.Token.isTag(token)){
	return false; // break
      }
      var child_style = this.createChildStyle(token);
      if(!child_style.isFloated()){
	this.style.removeChild(child_style);
	return false; // break
      }
      var generator = this.createChildBlockGenerator(child_style);
      floated_generators.push(generator);
      return true; // continue
    }.bind(this));

    // float-generator wraps floating-elements and rest-space-element.
    return new Nehan.FloatGenerator(this.extend({
      floatedGenerators:floated_generators,

      // create child generator to yield rest-space of float-elements with logical-float "start".
      // notice that this generator uses 'clone' of original style, because content size changes by position,
      // but on the other hand, original style is referenced by float-elements as their parent style.
      // so we must keep original style immutable.
      childGenerator:new Nehan.BlockGenerator(this.extend({
	style:this.style.clone({"float":"start"})
      }))
    }));
  };

  RenderingContext.prototype.createChildBlockGenerator = function(child_style, child_stream){
    // if child style with 'pasted' attribute, yield block with direct content by LazyGenerator.
    // notice that this is nehan.js original attribute,
    // is required to show some html(like form, input etc) that can't be handled by nehan.js.
    if(child_style.isPasted()){
      return new Nehan.LazyGenerator(
	this.create({
	  lazyOutput:child_style.createBlock({
	    content:child_style.getContent()
	  })
	})
      );
    }

    var child_markup = child_style.markup;
    var child_context = this.createChildContext({
      markup:child_style.markup,
      style:child_style,
      stream:child_stream || this.createStream(child_style.markup)
    });

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
      return new Nehan.LazyGenerator(
	this.create({
	  lazyOutput:child_style.createImage()
	})
      );

    case "hr":
      // create block with no elements, but with edge(border).
      return new Nehan.LazyGenerator(
	this.create({
	  lazyOutput:child_style.createBlock()
	})
      );

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

  RenderingContext.prototype.createTextGenerator = function(text){
    if(text instanceof Nehan.Tcy || text instanceof Nehan.Word){
      return new Nehan.TextGenerator(
	this.create({
	  markup:this.style.markup,
	  style:this.style,
	  stream:new Nehan.TokenStream(text.getData(), {
	    flow:this.style.flow,
	    tokens:[text]
	  })
	})
      );
    }
    var content = text.getContent();
    return new Nehan.TextGenerator(
      this.create({
	markup:this.style.markup,
	style:this.style,
	stream:new Nehan.TokenStream(content, {
	  flow:this.style.flow,
	  lexer:new Nehan.TextLexer(content)
	})
      })
    );
  };

  RenderingContext.prototype.createChildInlineGenerator = function(style, stream, text_gen){
    if(style.isPasted()){
      return new Nehan.LazyGenerator(
	this.create({
	  lazyOutput:style.createLine({
	    content:style.getContent()
	  })
	})
      );
    }
    var markup_name = style.getMarkupName();
    if(markup_name === "img"){
      // if inline img, no content text is included in img tag, so we yield it by lazy generator.
      return new Nehan.LazyGenerator(
	this.create({
	  lazyOutput:style.createImage()
	})
      );
    }

    var child_context = this.create({
      markup:style.markup,
      style:style,
      stream:(stream || this.createStream(style.markup)),
      childGenerator:(text_gen || null)
    });

    if(style.isInlineBlock()){
      return new Nehan.InlineBlockGenerator(child_context);
    }
    switch(markup_name){
    case "ruby":
      return new Nehan.TextGenerator(child_context);
    case "a":
      return new Nehan.LinkGenerator(child_context);
    default:
      return new Nehan.InlineGenerator(child_context);
    }
  };

  RenderingContext.prototype.getHeaderRank = function(){
    if(this.markup.getName().match(/h([1-6])/)){
      return parseInt(RegExp.$1, 10);
    }
    return 0;
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

  return RenderingContext;
})();
