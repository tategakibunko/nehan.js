Nehan.RenderingContext = (function(){
  function RenderingContext(opt){
    opt = opt || {};
    this.yieldCount = 0;
    this.terminate = false;
    this.generator = null; // set by constructor of LayoutGenerator
    //this.breakBefore = false; // TODO
    this.cachedElements = [];
    this.parent = opt.parent || null;
    this.child = opt.child || null;
    this.style = opt.style || null;
    this.stream = opt.stream || null;
    this.lazyOutput = opt.lazyOutput || null;
    this.floatedGenerators = opt.floatedGenerators || [];
    this.parallelGenerators = opt.parallelGenerators || [];
    this.layoutContext = opt.layoutContext || null;
    this.selectors = opt.selectors || new Nehan.Selectors(Nehan.Stylesheet.create());
    this.documentContext = opt.documentContext || new Nehan.DocumentContext();
  }

  RenderingContext.prototype.create = function(opt){
    return new RenderingContext({
      parent:opt.parent || null,
      style:opt.style || null,
      stream:opt.stream || null,
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
      style:opt.style || this.style,
      stream:opt.stream || this.stream,
      floatedGenerators:opt.floatedGenerators || this.floatedGenerators,
      parallelGenerators:opt.parallelGenerators || this.parallelGenerators,
      layoutContext:this.layoutContext || this.layoutContext,
      selectors:this.selectors, // always same
      documentContext:this.documentContext // always ame
    });
  };

  RenderingContext.prototype.getChildContext = function(){
    return this.child || null;
  };

  RenderingContext.prototype.getContent = function(){
    return this.stream? this.stream.getSrc() : "";
  };

  RenderingContext.prototype.yieldChildLayout = function(){
    return this.child.generator.yield();
  };

  RenderingContext.prototype.setStyle = function(key, value){
    this.selectors.setValue(key, value);
  };

  RenderingContext.prototype.setStyles = function(values){
    for(var key in values){
      this.selectors.setValue(key, values[key]);
    }
  };

  RenderingContext.prototype.debugBlockElement = function(element, extent){
    var name = this.getGeneratorName();
    var bc = this.layoutContext.block;
    console.log("%s:%o, e(%d / %d)", name, element, (bc.curExtent + extent), bc.maxExtent);
  };

  RenderingContext.prototype.debugInlineElement = function(element, measure){
    var name = this.getGeneratorName();
    var ic = this.layoutContext.inline;
    var data = element.toString();
    console.log("%s:%o(%s), m(%d / %d)", name, element, data, (ic.curMeasure + measure), ic.maxMeasure);
  };

  RenderingContext.prototype.debugTextElement = function(element, measure){
    var name = this.getGeneratorName();
    var ic = this.layoutContext.inline;
    var data = element.data || "";
    console.log("%s:%o(%s), m(%d / %d)", name, element, data, (ic.curMeasure + measure), ic.maxMeasure);
  };

  RenderingContext.prototype.addAnchor = function(){
    var anchor_name = this.style.getMarkupAttr("name");
    if(anchor_name){
      this.documentContext.addAnchor(anchor_name);
    }
  };

  RenderingContext.prototype.getContextEdgeExtent = function(){
    return this.isFirstOutput()? this.style.getEdgeBefore() : 0;
  };

  RenderingContext.prototype.getContextEdgeMeasure = function(){
    return this.isFirstOutput()? this.style.getEdgeStart() : 0;
  };

  RenderingContext.prototype.getParentRestExtent = function(){
    return this.parent.layoutContext.getBlockRestExtent();
  };

  RenderingContext.prototype.getParentRestMeasure = function(){
    return this.parent.layoutContext.getInlineRestMeasure();
  };

  RenderingContext.prototype.createInlineLayoutContext = function(){
    var edge_measure = this.getContextEdgeMeasure();

    // inline with parent
    if(this.parent && this.parent.layoutContext){
      var max_measure = this.getParentRestMeasure() - edge_measure;
      return this.layoutContext = new Nehan.LayoutContext(
	this.layoutContext.block,
	new Nehan.InlineContext(max_measure)
      );
    }

    return new Nehan.LayoutContext(
      this.layoutContext.block, // inline generator inherits block context as it is.
      new Nehan.InlineContext(this.layoutContext.getInlineRestMeasure())
    );
  };

  RenderingContext.prototype.createBlockLayoutContext = function(){
    var edge_extent = this.getContextEdgeExtent();

    // block with parent
    if(this.parent && this.parent.layoutContext){
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

  RenderingContext.prototype.createInlineBlockLayoutContext = function(){
    return new Nehan.LayoutContext(
      new Nehan.BlockContext(this.parent.layoutContext.getBlockRestExtent() - this.style.getEdgeExtent()),
      new Nehan.InlineContext(this.parent.layoutContext.getInlineRestMeasure() - this.style.getEdgeMeasure())
    );
  };

  RenderingContext.prototype.isInline = function(){
    return (
      this.style.isInline() ||
	this.generator instanceof Nehan.TextGenerator ||
	this.generator instanceof Nehan.InlineGenerator
    );
  };

  RenderingContext.prototype.createLayoutContext = function(){
    if(!this.style || this.style.getMarkupName() === "html"){
      return null;
    }
    if(this.isInline()){
      return this.createInlineLayoutContext();
    }
    if(this.style.isInlineBlock()){
      return this.createInlineBlockLayoutContext();
    }
    return this.createBlockLayoutContext();
  };

  RenderingContext.prototype.getMarkupName = function(){
    return this.style? this.style.getMarkupName() : "";
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

  RenderingContext.prototype.setOwnerGenerator = function(generator){
    this.generator = generator;
    var markup = this.style? this.style.markup : null;
    var measure = this.layoutContext? this.layoutContext.inline.maxMeasure : "auto";
    var extent = this.layoutContext? this.layoutContext.block.maxExtent : "auto";
    console.log("%s created, context = %o(m=%o, e=%o)", this.getGeneratorName(), this, measure, extent);
  };

  RenderingContext.prototype.hasChildLayout = function(){
    if(this.child && this.child.generator && this.child.generator.hasNext()){
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

  RenderingContext.prototype.popCache = function(){
    return this.cachedElements.pop();
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

  RenderingContext.prototype.getGeneratorName = function(){
    var markup_name = this.getMarkupName();
    if(this.generator instanceof Nehan.DocumentGenerator){
      return "(root)";
    }
    if(this.generator instanceof Nehan.TextGenerator){
      return markup_name + "(text)";
    }
    if(this.generator instanceof Nehan.InlineGenerator){
      return markup_name + "(inline)";
    }
    return markup_name + "(" + this.style.display + ")";
  };

  RenderingContext.prototype.getAnchorPageNo = function(anchor_name){
    return this.documentContext.getAnchorPageNo(anchor_name);
  };
  
  RenderingContext.prototype.createOutlineElement = function(callbacks){
    return this.documentContext.createBodyOutlineElement(callbacks);
  };

  RenderingContext.prototype.createChildContext = function(child_style, opt){
    opt = opt || {};
    this.child = this.create({
      parent:this,
      style:child_style,
      stream:(opt.stream || this.createStream(child_style))
    });
    return this.child;
  };

  RenderingContext.prototype.getParentStyle = function(){
    return this.parent? this.parent.style : null;
  };

  RenderingContext.prototype.createChildStyle = function(markup, args){
    return new Nehan.Style(this.selectors, markup, this.style, args || {});
  };

  RenderingContext.prototype.createStyle = function(markup, parent_style, args){
    return new Nehan.Style(this.selectors, markup, parent_style, args || {});
  };

  RenderingContext.prototype.createStream = function(style){
    var markup_name = style.getMarkupName();
    var markup_content = style.getContent();
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
      return new Nehan.TokenStream(markup_content, {
	flow:style.flow
      });
    }
  };

  // inline is recursively broken by 'block_gen'.
  RenderingContext.prototype.breakInline = function(block_gen){
    console.log("[%s] break inline:%o", this.getMarkupName(), this);
    /* old version
    if(this.childGenerator && this.childGenerator.context.style.isInline()){
      this.childGenerator.context.setTerminate(true);
      this.childGenerator.context.breakInline(true);
      this.childGenerator = block_gen;
    }*/

    /* new draft
    this.setTerminate(true);
    if(this.parent === null){
      return;
    }
    if(this.parent && this.parent.style.isInline()){
      this.parent.breakInline(block_gen);
    } else {
      this.parent.setChildGenerator(block_gen);
    }
     */
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
    //console.log("createChildBlockGenerator(%s):%s", child_style.getMarkupName(), child_style.markup.getContent());

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

    var child_context = this.createChildContext(child_style, {
      stream:child_stream || this.createStream(child_style)
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
    switch(child_style.getMarkupName()){
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

  RenderingContext.prototype.createChildInlineGenerator = function(style, stream){
    if(style.isPasted()){
      return new Nehan.LazyGenerator(
	this.create({
	  parent:this,
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
	  parent:this,
	  lazyOutput:style.createImage()
	})
      );
    }

    var child_context = this.createChildContext(style, {
      stream:(stream || this.createStream(style))
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

  RenderingContext.prototype.createTextStream = function(text){
    if(text instanceof Nehan.Tcy || text instanceof Nehan.Word){
      return new Nehan.TokenStream(text.getData(), {
	flow:this.style.flow,
	tokens:[text]
      });
    }
    var content = text.getContent();
    return new Nehan.TokenStream(content, {
      flow:this.style.flow,
      lexer:new Nehan.TextLexer(content)
    });
  };

  RenderingContext.prototype.createChildTextGenerator = function(text){
    return new Nehan.TextGenerator(
      this.createChildContext(this.style, {
	stream:this.createTextStream(text)
      })
    );
  };

  RenderingContext.prototype.getHeaderRank = function(){
    if(this.style){
      return this.style.getHeaderRank();
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
    this.outlineContext = new Nehan.OutlineContext(this.getMarkupName());
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
      type:this.getMarkupName(),
      pageNo:this.documentContext.getPageNo()
    });
  };
  /**
   called when section content(article, aside, nav, section) ends.

   @memberof Nehan.RenderingContext
   @method startSectionContext
   */
  RenderingContext.prototype.endSectionContext = function(){
    this.getOutlineContext().endSection(this.getMarkupName());
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