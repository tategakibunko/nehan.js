Nehan.RenderingContext = (function(){
  function RenderingContext(opt){
    opt = opt || {};
    this.yieldCount = 0;
    this.terminate = false;
    this.generator = null; // set by constructor of LayoutGenerator
    this.cachedElements = [];
    this.parent = opt.parent || null;
    this.child = opt.child || null;
    this.style = opt.style || null;
    this.stream = opt.stream || null;
    this.layoutContext = opt.layoutContext || null;
    this.selectors = opt.selectors || new Nehan.Selectors(Nehan.Stylesheet.create());
    this.documentContext = opt.documentContext || new Nehan.DocumentContext();
    this.pageEvaluator = opt.pageEvaluator || new Nehan.PageEvaluator(this);
  }

  // -----------------------------------------------
  // [add]
  // -----------------------------------------------
  RenderingContext.prototype.addPage = function(page){
    this.documentContext.addPage(page);
  };

  RenderingContext.prototype.addAnchor = function(){
    var anchor_name = this.style.getMarkupAttr("name");
    if(anchor_name){
      this.documentContext.addAnchor(anchor_name);
    }
  };

  RenderingContext.prototype.addBlockElement = function(element){
    if(element === null){
      console.log("[%s]:eof", this.getGeneratorName());
      throw "eof"; // no more output
    }
    if(element.isVoid()){
      return; // just skip
    }
    var max_size = this.getContextMaxExtentForAdd();
    var max_measure = this.layoutContext.getInlineMaxMeasure();
    var element_size = element.getLayoutExtent(this.style.flow);
    var prev_extent = this.layoutContext.getBlockCurExtent();
    var next_extent = prev_extent + element_size;

    // first output, but child layout over, try to cancel after edge.
    if(this.layoutContext.block.elements.length === 0 && next_extent > max_size && element.edge){
      var over_size = next_extent - max_size;
      var cancel_size = element.edge.cancelAfter(this.style.flow, over_size);
      next_extent -= cancel_size;
      element_size -= cancel_size;
    }

    this.debugBlockElement(element, element_size);

    if(element.isResumableLine(max_measure) && this.hasChildLayout() && this.child.isInline()){
      this.child.setResumeLine(element);
      return;
    }

    if(next_extent <= max_size){
      this.layoutContext.addBlockElement(element, element_size);
      if(element.hasLineBreak){
	this.documentContext.incLineBreakCount();
      }
    }
    if(next_extent > max_size){
      this.pushCache(element);
    }
    // if overflow, penetrate page-break to parent layout.
    if(element.breakAfter || next_extent >= max_size){
      if(element.breakAfter){
	console.info("inherit break after");
      } else {
	console.info("size over");
      }
      this.setBreakAfter(true);
      throw "break-after";
    }
  };

  RenderingContext.prototype.addInlineElement = function(element){
    if(element === null){
      console.log("[%s]:eof", this.getGeneratorName());
      throw "eof";
    }
    var max_size = this.layoutContext.getInlineMaxMeasure();
    var element_size = this.getElementLayoutMeasure(element);
    var prev_measure = this.layoutContext.getInlineCurMeasure(this.style.flow);
    var next_measure = prev_measure + element_size;

    //this.debugInlineElement(element, element_size);

    if(element_size === 0){
      throw "zero";
    }
    if(next_measure <= max_size){
      this.layoutContext.addInlineBoxElement(element, element_size);
      if(element.hangingPunctuation){
	if(element.hangingPunctuation.style === this.style){
	  var chr = this.yieldHangingChar(element.hangingPunctuation.data);
	  this.layoutContext.addInlineBoxElement(chr, 0);
	} else {
	  this.layoutContext.setHangingPunctuation(element.hangingPunctuation); // inherit to parent generator
	}
      }
      if(element.hasLineBreak){
	this.layoutContext.setLineBreak(true);
	throw "line-break";
      }
    }
    if(next_measure > max_size){
      this.pushCache(element);
    }
    if(next_measure >= max_size){
      throw "overflow";
    }
  };

  RenderingContext.prototype.addTextElement = function(element){
    if(element === null){
      throw "eof";
    }
    var max_size = this.layoutContext.getInlineMaxMeasure();
    var element_size = this.getTextMeasure(element);
    var prev_measure = this.layoutContext.getInlineCurMeasure(this.style.flow);
    var next_measure = prev_measure + element_size;
    var next_token = this.stream.peek();

    //this.debugTextElement(element, element_size);
    
    if(element_size === 0){
      throw "zero";
    }
    // skip head space for first word element if not 'white-space:pre'
    if(prev_measure === 0 &&
       max_size === this.style.contentMeasure &&
       this.style.isPre() === false &&
       next_token instanceof Nehan.Word &&
       element instanceof Nehan.Char &&
       element.isWhiteSpace()){
      return;
    }
    if(next_measure <= max_size){
      this.layoutContext.addInlineTextElement(element, element_size);
    }
    if(next_measure > max_size){
      this.pushCache(element);
    }
    if(next_measure >= max_size){
      this.layoutContext.setLineOver(true);
      throw "overflow";
    }
  };

  // -----------------------------------------------
  // [apply]
  // -----------------------------------------------
  RenderingContext.prototype.applyHyphenate = function(){
    if(!this.isHyphenateEnable()){
      return;
    }
    this._hyphenate();
  };

  // -----------------------------------------------
  // [clear]
  // -----------------------------------------------
  RenderingContext.prototype.clearCache = function(cache){
    this.cachedElements = [];
  };

  RenderingContext.prototype.clearBreakBefore = function(){
    this.breakBefore = true; // set already break flag.
  };

  // -----------------------------------------------
  // [create]
  // -----------------------------------------------
  RenderingContext.prototype.create = function(opt){
    return new RenderingContext({
      parent:opt.parent || null,
      style:opt.style || null,
      stream:opt.stream || null,
      layoutContext:this.layoutContext || null,
      selectors:this.selectors, // always same
      documentContext:this.documentContext, // always saame
      pageEvaluator:this.pageEvaluator // always same
    });
  };

  RenderingContext.prototype.createInlineLayoutContext = function(){
    return new Nehan.LayoutContext(
      new Nehan.BlockContext(this.getContextMaxExtent()),
      new Nehan.InlineContext(this.getContextMaxMeasure())
    );
  };

  RenderingContext.prototype.createBlockLayoutContext = function(){
    return new Nehan.LayoutContext(
      new Nehan.BlockContext(this.getContextMaxExtent()),
      new Nehan.InlineContext(this.style.contentMeasure)
    );
  };

  RenderingContext.prototype.createInlineBlockLayoutContext = function(){
    return new Nehan.LayoutContext(
      new Nehan.BlockContext(this.getContextMaxExtent()),
      new Nehan.InlineContext(this.getContextMaxMeasure())
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

  RenderingContext.prototype.createListContext = function(){
    var item_tags = this.stream.getTokens();
    var item_count = item_tags.length;
    var indent_size = 0;

    // find max marker size from all list items.
    item_tags.forEach(function(item_tag, index){
      // wee neeed [li][li::marker] context.
      var item_style = this.createTmpChildStyle(item_tag);
      var item_context = this.createChildContext(item_style);
      var marker_tag = new Nehan.Tag("marker");
      var marker_html = this.style.getListMarkerHtml(index + 1);
      marker_tag.setContent(marker_html);
      var marker_style = item_context.createTmpChildStyle(marker_tag);
      //console.log("marker style:%o", marker_style);
      var marker_context = item_context.createChildContext(marker_style);
      var marker_box = new Nehan.InlineGenerator(marker_context).yield();
      var marker_measure = marker_box? marker_box.getLayoutMeasure() : 0;
      //console.log("RenderingContext::marker context:%o", marker_context);
      indent_size = Math.max(indent_size, marker_measure);
    }.bind(this));

    console.info("indent size:%d, body size:%d", indent_size, (this.style.contentMeasure - indent_size));

    return {
      itemCount:item_count,
      indentSize:indent_size,
      bodySize:(this.style.contentMeasure - indent_size)
    };
  };

  RenderingContext.prototype.createOutlineElementByName = function(outline_name, callbacks){
    return this.documentContext.createOutlineElementByName(outline_name, callbacks);
  };

  RenderingContext.prototype.createChildContext = function(child_style, opt){
    opt = opt || {};
    this.child = this.create({
      parent:this,
      style:child_style,
      stream:(opt.stream || this.createStream(child_style))
    });
    child_style.context = this.child;
    return this.child;
  };

  RenderingContext.prototype.createStyle = function(markup, parent_style, args){
    return new Nehan.Style(this, markup, parent_style, args || {});
  };

  RenderingContext.prototype.createChildStyle = function(markup, args){
    return new Nehan.Style(this, markup, this.style, args || {});
  };

  RenderingContext.prototype.createTmpChildStyle = function(markup, args){
    var style = this.createChildStyle(markup, args);
    this.style.removeChild(style);
    return style;
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
    case "ul": case "ol":
      return new Nehan.TokenStream(markup_content, {
	flow:style.flow,
	filter:Nehan.Closure.isTagName(["li"])
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

  RenderingContext.prototype.createFloatGenerator = function(first_float_gen){
    console.log("create float generator!");
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

    var float_root_style = this.createTmpChildStyle(new Nehan.Tag("float-root"), {display:"block"});
    var float_root_context = this.createChildContext(float_root_style);
    float_root_context.floatedGenerators = floated_generators;

    var space_style = float_root_context.createChildStyle(new Nehan.Tag("space"), {display:"block"});
    var space_context = float_root_context.createChildContext(space_style, {stream:this.stream});
    var space_gen = new Nehan.BlockGenerator(space_context);

    return new Nehan.FloatGenerator(float_root_context);
  };

  RenderingContext.prototype.createChildBlockGenerator = function(child_style, child_stream){
    //console.log("createChildBlockGenerator(%s):%s", child_style.getMarkupName(), child_style.markup.getContent());
    child_stream = child_stream || this.createStream(child_style);
    var child_context = this.createChildContext(child_style, {
      stream:child_stream
    });

    var direct_block = this.yieldBlockDirect(child_context);
    if(direct_block){
      child_context.lazyOutput = direct_block;
      return new Nehan.LazyGenerator(child_context);
    }

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

  // create inline root, and parse again.
  // example:
  // [p(block)][text][/p(block)] ->[p(block)][p(inline)][text][/p(inline)][/p(block)]
  RenderingContext.prototype.createInlineRootGenerator = function(){
    return this.createChildInlineGenerator(this.style, this.stream);
  };

  RenderingContext.prototype.createChildInlineGenerator = function(style, stream){
    var child_context = this.createChildContext(style, {
      stream:(stream || this.createStream(style))
    });

    var direct_block = this.yieldInlineDirect(child_context);
    if(direct_block){
      child_context.lazyOutput = direct_block;
      return new Nehan.LazyGenerator(child_context);
    }

    if(this.parent.style !== style && style.isInlineBlock()){
      return new Nehan.InlineBlockGenerator(child_context);
    }
    switch(style.getMarkupName()){
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

  RenderingContext.prototype.createPageBreak = function(){
  };

  RenderingContext.prototype.createWhiteSpace = function(){
    return this.createBlockBox({
      noEdge:true,
      extent:this.layoutContext.getBlockMaxExtent(),
      elements:[]
    });
  };

  RenderingContext.prototype.createWrapBlock = function(measure, extent, elements){
    var size = this.style.flow.getBoxSize(measure, extent);
    var box = new Nehan.Box(size, this);
    box.display = "block";
    box.elements = elements;
    return box;
  };

  RenderingContext.prototype.createBlockBoxClasses = function(){
    var classes = ["nehan-block", "nehan-" + this.getMarkupName()];
    if(this.style.markup.isHeaderTag()){
      classes.push("nehan-header");
    }
    classes = classes.concat(this.style.markup.getClasses());
    return classes;
  };

  RenderingContext.prototype.createBlockBoxContextEdge = function(){
    if(!this.style.edge){
      return null;
    }
    if(this.style.getMarkupName() === "hr"){
      return this.style.edge; // can't modify
    }
    var use_before_edge = this.isFirstOutput();
    var use_after_edge = !this.hasNext();
    if(use_before_edge && use_after_edge){
      return this.style.edge;
    }
    var edge = this.style.edge.clone();
    if(!use_before_edge){
      edge.clearBefore(this.style.flow);
    }
    if(!use_after_edge){
      edge.clearAfter(this.style.flow);
    }
    return edge;
  };

  RenderingContext.prototype.createBlockBox = function(opt){
    opt = opt || {};
    var measure =(typeof opt.measure !== "undefined")? opt.measure : this.layoutContext.getInlineMaxMeasure();
    var extent = (typeof opt.extent !== "undefined")? opt.extent : this.layoutContext.getBlockCurExtent();
    var elements = opt.elements || this.layoutContext.getBlockElements();
    if(this.isBody()){
      extent = this.style.contentExtent;
    }
    var box_size = this.style.flow.getBoxSize(measure, extent);
    var box = new Nehan.Box(box_size, this);
    box.elements = elements;
    box.content = opt.content || null;
    box.display = (this.style.display === "inline-block")? this.style.display : "block";
    box.edge = opt.noEdge? null : this.createBlockBoxContextEdge();
    box.classes = this.createBlockBoxClasses();
    box.charCount = elements.reduce(function(total, element){
      return total + (element.charCount || 0);
    }, 0);
    box.breakAfter = this.layoutContext.hasBreakAfter();
    if(this.style.getMarkupName() !== "hr" && (extent === 0 || elements.length === 0)){
      console.warn("zero block? %o", box);
      box.breakAfter = true;
    }
    if(this.style.isPushed()){
      box.pushed = true;
    } else if(this.style.isPulled()){
      box.pulled = true;
    }
    console.log("box(%s) break after:%o", box.toString(), box.breakAfter);
    return box;
  };

  RenderingContext.prototype.createLineBox = function(opt){
    opt = opt || {};
    var is_inline_root = this.isInlineRoot();
    var elements = opt.elements || this.layoutContext.getInlineElements();
    var measure = is_inline_root? this.getContextMaxMeasure() : this.layoutContext.getInlineCurMeasure();
    var max_extent = opt.maxExtent || this.layoutContext.getInlineMaxExtent() || this.style.getFontSize() || this.staticExtent;
    if(this.style.staticMeasure && !is_inline_root){
      measure = this.style.contentMeasure;
    }
    /*
    if((this.style.parent && opt.measure && !is_inline_root) || (this.style.display === "inline-block")){
      measure = this.staticMeasure || this.layoutContext.getInlineCurMeasure();
    }*/
    var line_size = this.style.flow.getBoxSize(measure, max_extent);
    var classes = ["nehan-inline", "nehan-inline-" + this.style.flow.getName()].concat(this.style.markup.getClasses());
    var line = new Nehan.Box(line_size, this, "line-block");
    line.display = "inline"; // caution: display of anonymous line shares it's parent markup.
    line.elements = elements;
    line.classes = is_inline_root? classes : classes.concat("nehan-" + this.style.getMarkupName());
    line.charCount = opt.charCount || this.layoutContext.getInlineCharCount();
    line.maxFontSize = this.layoutContext.getInlineMaxFontSize();
    line.maxExtent = this.layoutContext.getInlineMaxExtent();
    line.content = opt.content || null;
    line.isInlineRoot = is_inline_root;
    line.hasLineBreak = this.layoutContext.hasLineBreak();
    line.hangingPunctuation = this.layoutContext.getHangingPunctuation();

    // edge of root line is disabled.
    // for example, consider '<p>aaa<span>bbb</span>ccc</p>'.
    // anonymous line block('aaa' and 'ccc') is already edged by <p> in block level.
    // so if line is anonymous, edge must be ignored.
    line.edge = (this.style.edge && !is_inline_root)? this.style.edge : null;

    // backup other line data. mainly required to restore inline-context.
    if(is_inline_root){
      line.lineNo = opt.lineNo;
      line.breakAfter = this.layoutContext.hasBreakAfter();
      line.hyphenated = this.layoutContext.isHyphenated();
      line.inlineMeasure = this.layoutContext.getInlineCurMeasure(); // actual measure
      line.classes.push("nehan-root-line");

      // set baseline
      Nehan.Baseline.set(line);

      // set text-align
      if(this.style.textAlign && (this.style.textAlign.isCenter() || this.style.textAlign.isEnd())){
	this.style.textAlign.setAlign(line);
      } else if(this.style.textAlign && this.style.textAlign.isJustify()){
	this.style.textAlign.setJustify(line);
      }
      // set edge for line-height
      var edge_size = Math.floor(line.maxFontSize * this.style.getLineHeight()) - line.maxExtent;
      if(line.elements.length > 0 && edge_size > 0){
	line.edge = new Nehan.BoxEdge();
	line.edge.padding.setBefore(this.style.flow, edge_size);
      }
    }

    // set position in parent stream.
    if(this.parent && this.parent.stream){
      line.pos = Math.max(0, this.parent.stream.getPos() - 1);
    }

    if(this.style.isInlineRoot()){
      this.layoutContext.incBlockLineNo();
    }
    return line;
  };

  RenderingContext.prototype.createTextBox = function(opt){
    opt = opt || {};
    var elements = opt.elements || this.layoutContext.getInlineElements();
    var extent = this.layoutContext.getInlineMaxExtent() || this.style.getFontSize();
    var measure = this.layoutContext.getInlineCurMeasure();

    if(this.layoutContext.isInlineEmpty()){
      extent = 0;
    } else if(this.style.isTextEmphaEnable()){
      extent = this.style.getEmphaTextBlockExtent();
    } else if(this.style.markup.name === "ruby"){
      extent = this.style.getRubyTextBlockExtent();
    }
    var line_size = this.style.flow.getBoxSize(measure, extent);
    var classes = ["nehan-text-block"].concat(this.style.markup.getClasses());
    var line = new Nehan.Box(line_size, this, "text-block");
    line.display = "inline";
    line.elements = elements;
    line.classes = classes;
    line.charCount = this.layoutContext.getInlineCharCount();
    line.maxFontSize = this.layoutContext.getInlineMaxFontSize() || this.style.getFontSize();
    line.maxExtent = extent;
    line.content = opt.content || null;
    line.hasLineBreak = this.layoutContext.hasLineBreak(); // is line-break is included?
    line.hyphenated = this.layoutContext.isHyphenated();
    line.lineOver = this.layoutContext.isLineOver(); // is line full-filled?
    line.hangingPunctuation = this.layoutContext.getHangingPunctuation();
    line.isEmpty = this.layoutContext.isInlineEmpty();
    //line.breakAfter = this.layoutContext.hasBreakAfter();

    // set position in parent stream.
    if(this.parent && this.parent.stream){
      line.pos = Math.max(0, this.parent.stream.getPos() - 1);
    }
    return line;
  };

  // -----------------------------------------------
  // [debug]
  // -----------------------------------------------
  RenderingContext.prototype.debugBlockElement = function(element, extent){
    var name = this.getGeneratorName();
    var size = element.size;
    var bc = this.layoutContext.block;
    var str = element.toString();
    var max = bc.maxExtent;
    var prev = bc.curExtent;
    var next = prev + extent;
    var parent_rest = this.parent && this.parent.layoutContext? this.parent.layoutContext.getBlockRestExtent() : this.layoutContext.getBlockRestExtent();
    console.info("[add block] %s:%o(%d x %d), e(%d / %d) -> e(%d / %d), +%d(prest:%d)\n%s", name, element, size.width, size.height, prev, max, next, max, extent, parent_rest, str);
    if(next > max){
      console.log("over %c%d", "color:red", (next - max));
    }
  };

  RenderingContext.prototype.debugInlineElement = function(element, measure){
    var name = this.getGeneratorName();
    var ic = this.layoutContext.inline;
    var str = element.toString();
    var max = ic.maxMeasure;
    var prev = ic.curMeasure;
    var next = prev + measure;
    console.log("[add inline] %s:%o(%s), m(%d / %d) -> m(%d / %d), +%d", name, element, str, prev, max, next, max, measure);
  };

  RenderingContext.prototype.debugTextElement = function(element, measure){
    var name = this.getGeneratorName();
    var ic = this.layoutContext.inline;
    var str = element.data || "";
    var max = ic.maxMeasure;
    var prev = ic.curMeasure;
    var next = prev + measure;
    console.log("[add text] %s:%o(%s), m(%d / %d) -> m(%d / %d), +%d", name, element, str, prev, max, next, max, measure);
  };

  // -----------------------------------------------
  // [end]
  // -----------------------------------------------
  /**
   called when section root(body, blockquote, fieldset, figure, td) ends.

   @memberof Nehan.RenderingContext
   @method endOutlineContext
   */
  RenderingContext.prototype.endOutlineContext = function(){
    this.documentContext.addOutlineContext(this.getOutlineContext());
  };

  /**
   called when section content(article, aside, nav, section) ends.

   @memberof Nehan.RenderingContext
   @method startSectionContext
   */
  RenderingContext.prototype.endSectionContext = function(){
    this.getOutlineContext().endSection(this.getMarkupName());
  };

  // -----------------------------------------------
  // [extend]
  // -----------------------------------------------
  RenderingContext.prototype.extend = function(opt){
    return new RenderingContext({
      parent:opt.parent || this.parent,
      style:opt.style || this.style,
      stream:opt.stream || this.stream,
      layoutContext:this.layoutContext || this.layoutContext,
      selectors:this.selectors, // always same
      documentContext:this.documentContext, // always same
      pageEvaluator:this.pageEvaluator // always same
    });
  };

  // -----------------------------------------------
  // [gen]
  // -----------------------------------------------
  RenderingContext.prototype.genBlockId = function(){
    return this.documentContext.genBlockId();
  };

  RenderingContext.prototype.genRootBlockId = function(){
    return this.documentContext.genRootBlockId();
  };

  // -----------------------------------------------
  // [get]
  // -----------------------------------------------
  RenderingContext.prototype.getFlow = function(){
    return this.style.flow;
  };

  RenderingContext.prototype.getMarkupName = function(){
    return this.style? this.style.getMarkupName() : "";
  };

  RenderingContext.prototype.getDisplay = function(){
    return this.style? this.style.display : "";
  };

  RenderingContext.prototype.getWritingDirection = function(){
    return "vert"; // TODO
  };

  RenderingContext.prototype.getPage = function(index){
    var page = this.documentContext.pages[index] || null;
    if(page instanceof Nehan.Box){
      page = this.pageEvaluator.evaluate(page);
      this.documentContext.pages[index] = page;
      return page;
    }
    return page;
  };

  RenderingContext.prototype.getChildContext = function(){
    return this.child || null;
  };

  RenderingContext.prototype.getContent = function(){
    return this.stream? this.stream.getSrc() : "";
  };

  RenderingContext.prototype.getBlockRestExtent = function(){
    return this.layoutContext.getBlockRestExtent();
  };

  RenderingContext.prototype.getContextMaxMeasure = function(){
    var max_size = (this.parent && this.parent.layoutContext)? this.parent.layoutContext.getInlineRestMeasure() : this.style.contentMeasure;
    return Math.min(max_size, this.style.contentMeasure);
  };

  RenderingContext.prototype.getEdgeExtent = function(){
    if(this.generator instanceof Nehan.TextGenerator){
      return 0;
    }
    if(this.isInlineRoot()){
      return 0;
    }
    return this.style.getEdgeExtent(this.style.flow);
  };

  RenderingContext.prototype.getEdgeBefore = function(){
    if(this.generator instanceof Nehan.TextGenerator){
      return 0;
    }
    if(this.isInlineRoot()){
      return 0;
    }
    return this.style.getEdgeBefore();
  };

  RenderingContext.prototype.getEdgeAfter = function(){
    if(this.generator instanceof Nehan.TextGenerator){
      return 0;
    }
    if(this.isInlineRoot()){
      return 0;
    }
    return this.style.getEdgeAfter();
  };

  RenderingContext.prototype.getParentRestExtent = function(){
    if(this.parent && this.parent.layoutContext){
      return this.parent.layoutContext.getBlockRestExtent();
    }
    return null;
  };

  RenderingContext.prototype.getContextMaxExtent = function(){
    var max_size = this.getParentRestExtent() || this.style.outerExtent;
    var first_edge_size = this.getEdgeBefore();

    if(this.style.staticExtent){
      max_size = Math.min(max_size, this.style.outerExtent);
    }

    if(this.isFirstOutput()){
      return Math.max(0, max_size - first_edge_size);
    }

    return max_size;
  };

  // max extent size at the phase of adding actual element.
  RenderingContext.prototype.getContextMaxExtentForAdd = function(){
    var max_size = this.layoutContext.getBlockMaxExtent();
    var tail_edge_size = this.getEdgeAfter();

    // if final, tail edge size is required.
    if(!this.hasNext()){
      return max_size - tail_edge_size;
    }
    return max_size;
  };

  RenderingContext.prototype.getElementLayoutExtent = function(element){
    return element.getLayoutExtent(this.style.flow);
  };

  RenderingContext.prototype.getElementLayoutMeasure = function(element){
    return element.getLayoutMeasure(this.style.flow);
  };

  RenderingContext.prototype.getTextMeasure = function(element){
    return element.getAdvance(this.style.flow, this.style.letterSpacing || 0);
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
    if(this.generator instanceof Nehan.BlockGenerator){
      return markup_name + "(block)";
    }
    return markup_name + "(" + this.getDisplay() + ")";
  };

  RenderingContext.prototype.getAnchorPageNo = function(anchor_name){
    return this.documentContext.getAnchorPageNo(anchor_name);
  };
  
  RenderingContext.prototype.getParentStyle = function(){
    return this.parent? this.parent.style : null;
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

  // -----------------------------------------------
  // [has]
  // -----------------------------------------------
  RenderingContext.prototype.hasNext = function(){
    if(this.terminate){
      return false;
    }
    if(this.hasCache()){
      return true;
    }
    if(this.child && this.hasChildLayout()){
      return true;
    }
    if(this.floatGenerators && this.hasNextFloat()){
      return true;
    }
    if(this.parallelGenerators && this.hasNextParallelLayout()){
      return true;
    }
    return this.stream? this.stream.hasNext() : false;
  };

  RenderingContext.prototype.hasChildLayout = function(){
    return this.child && this.child.generator && this.child.generator.hasNext();
  };

  RenderingContext.prototype.hasNextFloat = function(){
    return this.floatedGenerators && Nehan.List.exists(this.floatedGenerators, function(gen){
      return gen.hasNext();
    });
  };

  RenderingContext.prototype.hasNextParallelLayout = function(){
    return this.parallelGenerators && Nehan.List.exists(this.parallelGenerators, function(gen){
      return gen.hasNext();
    });
  };

  RenderingContext.prototype.hasCache = function(){
    return this.cachedElements.length > 0;
  };

  RenderingContext.prototype.hasFloatStackCache = function(){
    return this.floatStackCaches && this.floatStackCaches.length > 0;
  };

  // -----------------------------------------------
  // [init]
  // -----------------------------------------------
  RenderingContext.prototype.initLayoutContext = function(){
    this.layoutContext = this.createLayoutContext();
    if(this.resumeLine){
      this.layoutContext.resumeLine(this.resumeLine);
      this.resumeLine = null;
    }
  };

  RenderingContext.prototype.initBlockClear = function(){
    var value = this.style.getCssAttr("clear");
    if(value){
      this.clear = new Nehan.Clear(value);
    }
  };

  RenderingContext.prototype.initListContext = function(){
    this.listContext = this.createListContext();
  };

  // -----------------------------------------------
  // [is]
  // -----------------------------------------------
  RenderingContext.prototype.isBody = function(){
    return this.getMarkupName() === "body";
  };

  RenderingContext.prototype.isInline = function(){
    return (
      this.style.isInline() ||
      this.generator instanceof Nehan.TextGenerator ||
      this.generator instanceof Nehan.InlineGenerator
    );
  };

  RenderingContext.prototype.isInlineRoot = function(){
    if(this.style !== this.parent.style){
      return false;
    }
    if(this.generator instanceof Nehan.TextGenerator){
      return false;
    }
    return (this.generator instanceof Nehan.InlineGenerator ||
	    this.generator instanceof Nehan.InlineBlockGenerator);
    //return this.generator instanceof Nehan.InlineGenerator && this.style.isInlineRoot();
  };

  RenderingContext.prototype.isBreakBefore = function(){
    return this.style.isBreakBefore() && (typeof this.breakBefore === "undefined");
  };

  RenderingContext.prototype.isFirstOutput = function(){
    return this.yieldCount === 0;
  };

  RenderingContext.prototype.isTextVertical = function(){
    return this.style.isTextVertical();
  };

  RenderingContext.prototype.isHyphenateEnable = function(){
    if(this.layoutContext.isInlineEmpty()){
      return false;
    }
    if(this.layoutContext.hasLineBreak()){
      return false;
    }
    if(!this.style.isHyphenationEnable()){
      return false;
    }
    // if there is space more than 1em, restrict hyphenation.
    if(this.layoutContext.getInlineRestMeasure() > this.style.getFontSize()){
      return false;
    }
    return true;
  };

  // -----------------------------------------------
  // [peek]
  // -----------------------------------------------
  RenderingContext.prototype.peekLastCache = function(){
    return Nehan.List.last(this.cachedElements);
  };

  // -----------------------------------------------
  // [pop]
  // -----------------------------------------------
  RenderingContext.prototype.popCache = function(){
    var cache = this.cachedElements.pop();
    console.info("use cache:%o(%s)", cache, this.stringOfElement(cache));
    cache.breakAfter = false;
    return cache;
  };

  RenderingContext.prototype.popFloatStackCache = function(){
    return this.floatStackCaches.pop();
  };

  // -----------------------------------------------
  // [push]
  // -----------------------------------------------
  RenderingContext.prototype.pushCache = function(element){
    var size = (element instanceof Nehan.Box)? element.getLayoutExtent(this.style.flow) : (element.bodySize || 0);
    console.log("push cache:%o(e = %d, text = %s)", element, size, this.stringOfElement(element));
    element.cacheCount = (element.cacheCount || 0) + 1;
    /*
    if(this.hasChildLayout()){
      this.child.yieldCount--;
    }*/
    if(element.cacheCount >= Nehan.Config.maxRollbackCount){
      console.error("too many rollback! context:%o, element:%o", this, element);
      throw "too many rollback";
    }
    this.cachedElements.push(element);
  };

  RenderingContext.prototype.pushFloatStackCache = function(cache){
    this.floatStackCaches = this.floatStackCaches || [];
    this.floatStackCaches.push(cache);
  };

  // -----------------------------------------------
  // [set]
  // -----------------------------------------------
  RenderingContext.prototype.setTerminate = function(status){
    this.terminate = status;
  };

  RenderingContext.prototype.setBreakAfter = function(status){
    this.layoutContext.setBreakAfter(status);
    console.log("setBreakAfter");
  };

  RenderingContext.prototype.setOwnerGenerator = function(generator){
    this.generator = generator;
    this._name = this.getGeneratorName();
    console.log("generator:%s", this.getGeneratorName());
  };

  RenderingContext.prototype.setResumeLine = function(line){
    console.warn("setResumeLine:%o", line);
    this.resumeLine = line;
  };

  RenderingContext.prototype.setStyle = function(key, value){
    this.selectors.setValue(key, value);
  };

  RenderingContext.prototype.setStyles = function(values){
    for(var key in values){
      this.selectors.setValue(key, values[key]);
    }
  };

  // -----------------------------------------------
  // [start]
  // -----------------------------------------------
  /**
   called when section root(body, blockquote, fieldset, figure, td) starts.

   @memberof Nehan.RenderingContext
   */
  RenderingContext.prototype.startOutlineContext = function(){
    this.outlineContext = new Nehan.OutlineContext(this.getMarkupName());
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

  // -----------------------------------------------
  // [stringOf]
  // -----------------------------------------------
  RenderingContext.prototype.stringOfTree = function(){
    var leaf = this.getGeneratorName();
    if(this.parent){
      return this.parent.stringOfTree() + ">" + leaf;
    }
    return leaf;
  };

  RenderingContext.prototype.stringOfElement = function(element){
    if(element instanceof Nehan.Box){
      return element.toString();
    }
    return element.data || "<obj>";
  };

  // -----------------------------------------------
  // [update]
  // -----------------------------------------------
  RenderingContext.prototype.updateContextSize = function(measure, extent){
    this.style.updateContextSize(measure, extent);
    if(this.child){
      this.child.updateContextSize(measure, extent);
    }
  };

  RenderingContext.prototype.updateParent = function(parent_context){
    if(this.isInline()){
      this.updateInlineParent(parent_context);
    }
    this.updateBlockParent(parent_context);
  };

  RenderingContext.prototype.updateBlockParent = function(parent_context){
    console.log("[update block parent] %s > %s", parent_context._name, this._name);
    this.parent = parent_context;
    parent_context.child = this;
    this.style.updateContextSize(parent_context.style.contentMeasure, parent_context.style.contentExtent);
    if(this.child){
      this.child.updateParent(this);
    }
  };

  RenderingContext.prototype.updateInlineParent = function(parent_context){
    console.log("[update inline parent] %s > %s", parent_context._name, this._name);
    this.style = parent_context.style;
    this.parent = parent_context;
    parent_context.child = this;
    if(this.child){
      this.child.updateParent(this);
    }
  };

  // -----------------------------------------------
  // [yield]
  // -----------------------------------------------
  RenderingContext.prototype.yieldChildLayout = function(){
    return this.child.generator.yield();
  };

  RenderingContext.prototype.yieldClearance = function(){
    if(!this.clear || !this.parent || !this.parent.floatGroup){
      return null;
    }
    var float_group = this.parent.floatGroup;
    var float_direction = float_group.getFloatDirection();
    var direction_name = float_direction.getName();

    // if meet the final output of the last float stack with same clear direction,
    // yield white space but set done status to clear object.
    if(float_group.isLast() && !float_group.hasNext() && this.clear.hasDirection(direction_name)){
      this.clear.setDone(direction_name);
      return this.createWhiteSpace();
    }
    // if any other clear direction that is not cleared, continue yielding white space.
    if(!this.clear.isDoneAll()){
      return this.createWhiteSpace();
    }
    return null;
  };

  RenderingContext.prototype.yieldBlockDirect = function(child_context){
    if(child_context.style.isPasted()){
      return this.yieldPastedBlock(child_context);
    }
    switch(child_context.style.getMarkupName()){
    case "img": return child_context.yieldImage();
    case "hr": return child_context.yieldHorizontalRule();
    }
    return null;
  };

  RenderingContext.prototype.yieldInlineDirect = function(child_context){
    if(child_context.style.isPasted()){
      return this.yieldPastedLine(child_context);
    }
    switch(child_context.style.getMarkupName()){
    case "img": return child_context.yieldImage(child_context);
    }
    return null;
  };

  RenderingContext.prototype.yieldPastedLine = function(child_context){
    return child_context.createLineBox({
      content:child_context.style.getContent()
    });
  };

  RenderingContext.prototype.yieldPastedBlock = function(child_context){
    return child_context.createBlockBox({
      measure:child_context.style.contentMeasure,
      extent:child_context.style.contentExtent,
      content:child_context.style.getContent()
    });
  };

  RenderingContext.prototype.yieldImage = function(opt){
    opt = opt || {};

    // image size always considered as horizontal mode.
    var width = this.style.getMarkupAttr("width")? parseInt(this.style.getMarkupAttr("width"), 10) : (this.style.staticMeasure || this.style.getFontSize());
    var height = this.style.getMarkupAttr("height")? parseInt(this.style.getMarkupAttr("height"), 10) : (this.style.staticExtent || this.style.getFontSize());
    var classes = ["nehan-block", "nehan-image"].concat(this.style.markup.getClasses());
    var image_size = new Nehan.BoxSize(width, height);
    var image = new Nehan.Box(image_size, this);
    image.display = this.style.display; // inline, block, inline-block
    image.edge = this.style.edge || null;
    image.classes = classes;
    image.charCount = 0;
    if(this.style.isPushed()){
      image.pushed = true;
    } else if(this.style.isPulled()){
      image.pulled = true;
    }
    image.breakAfter = this.style.isBreakAfter() || opt.breakAfter || false;
    return image;
  };

  RenderingContext.prototype.yieldHorizontalRule = function(){
    return this.createBlockBox({
      elements:[],
      extent:2
    });
  };

  RenderingContext.prototype.yieldHangingChar = function(chr){
    chr.setMetrics(this.style.flow, this.style.getFont());
    var font_size = this.style.getFontSize();
    return this.style.createTextBlock(this, {
      elements:[chr],
      measure:chr.bodySize,
      extent:font_size,
      charCount:0,
      maxExtent:font_size,
      maxFontSize:font_size
    });
  };

  RenderingContext.prototype.yieldParallelBlocks = function(chr){
    var blocks = this.parallelGenerators.map(function(gen){
      return gen.yield();
    });

    if(blocks.every(function(block){
      return block === null || block.getContentExtent() <= 0;
    })){
      //this.setTerminate(true);
      return null;
    }

    var flow = this.style.flow;
    var max_block =  Nehan.List.maxobj(blocks, function(block){
      return block? block.getLayoutExtent(flow) : 0;
    });
    //console.log("max parallel cell:%o(extent = %d)", max_block, max_block.getLayoutExtent());
    var wrap_measure = this.layoutContext.getInlineMaxMeasure();
    var wrap_extent = max_block.getLayoutExtent(flow);
    var inner_extent = max_block.getContentExtent(flow);
    var uniformed_blocks = blocks.map(function(block, i){
      var context = this.parallelGenerators[i].context;
      if(block === null){
	return context.createBlockBox({
	  elements:[],
	  extent:inner_extent
	});
      }
      return block.resizeExtent(flow, inner_extent);
    }.bind(this));

    return this.createWrapBlock(wrap_measure, wrap_extent, uniformed_blocks);
  };

  RenderingContext.prototype.yieldFloatStack = function(){
    if(this.hasFloatStackCache()){
      return this.popFloatStackCache();
    }
    var start_blocks = [], end_blocks = [];
    Nehan.List.iter(this.floatedGenerators, function(gen){
      var block = gen.yield();
      if(!block || block.getContentExtent() <= 0){
	return;
      }
      if(gen.context.style.isFloatStart()){
	start_blocks.push(block);
      } else if(gen.context.style.isFloatEnd()){
	end_blocks.push(block);
      }
    });
    return new Nehan.FloatGroupStack(this.style.flow, start_blocks, end_blocks);
  };

  RenderingContext.prototype.yieldFloatSpace = function(float_group, measure, extent){
    console.info("yieldFloatSpace(float_group = %o, m = %d, e = %d)", float_group, measure, extent);
    this.child.updateContextSize(measure, extent);
    this.child.floatGroup = float_group;
    return this.yieldChildLayout();
  };

  // -----------------------------------------------
  // [private]
  // -----------------------------------------------
  // hyphenate between two different inline generator.
  RenderingContext.prototype._hyphenateSibling = function(generator){
    var next_token = generator.stream.peek();
    var tail = this.layoutContext.getInlineLastElement();
    var head = (next_token instanceof Nehan.Text)? next_token.getHeadChar() : null;
    if(this.style.isHangingPuncEnable() && head && head.isHeadNg()){
      next_token.cutHeadChar();
      this.layoutContext.setHangingPunctuation({
	data:head,
	style:this._getSiblingStyle()
      });
      return;
    } else if(tail && tail instanceof Nehan.Char && tail.isTailNg() && this.layoutContext.getInlineElements().length > 1){
      this.layoutContext.popInlineElement();
      this.stream.setPos(tail.pos);
      this.layoutContext.setLineBreak(true);
      this.layoutContext.setHyphenated(true);
      this.clearCache();
    }
  };

  RenderingContext.prototype._getSiblingContext = function(){
    if(this.getMarkupName() === "rt"){
      return null;
    }
    var root_line = this.parent;
    while(root_line && root_line.style === this.style){
      root_line = root_line.parent || null;
    }
    return root_line || this.parent || null;
  };

  RenderingContext.prototype._getSiblingStyle = function(){
    var sibling = this._getSiblingContext();
    return (sibling && sibling.style)? sibling.style : null;
  };

  RenderingContext.prototype._getSiblingStream = function(){
    var sibling = this._getSiblingContext();
    return (sibling && sibling.stream)? sibling.stream : null;
  };

  RenderingContext.prototype._peekSiblingNextToken = function(){
    var sibling_stream = this._getSiblingStream();
    return sibling_stream? sibling_stream.peek() : null;
  };

  RenderingContext.prototype._peekSiblingNextHeadChar = function(){
    var head_c1;
    var token = this._peekSiblingNextToken();
    if(token instanceof Nehan.Text){
      head_c1 = token.getContent().substring(0,1);
      return new Nehan.Char(head_c1);
    }
    // if parent next token is not Nehan::Text,
    // it's hard to find first character, so skip it.
    return null;
  };

  RenderingContext.prototype._hyphenate = function(){
    // by stream.getToken(), stream pos has been moved to next pos already, so cur pos is the next head.
    var orig_head = this.peekLastCache() || this.stream.peek(); // original head token at next line.
    if(orig_head === null){
      var sibling = this._getSiblingContext();
      if(sibling && sibling.stream){
	this._hyphenateSibling(sibling);
      }
      return;
    }
    // hyphenate by hanging punctuation.
    var head_next = this.stream.peek();
    head_next = (head_next && orig_head.pos === head_next.pos)? this.stream.peek(1) : head_next;
    var is_single_head_ng = function(head, head_next){
      return (head instanceof Nehan.Char && head.isHeadNg()) &&
	!(head_next instanceof Nehan.Char && head_next.isHeadNg());
    };
    if(this.style.isHangingPuncEnable() && is_single_head_ng(orig_head, head_next)){
      this.layoutContext.addInlineTextElement(orig_head, 0);
      if(head_next){
	this.stream.setPos(head_next.pos);
      } else {
	this.stream.get();
      }
      this.layoutContext.setLineBreak(true);
      this.layoutContext.setHyphenated(true);
      this.clearCache();
      return;
    }
    // hyphenate by sweep.
    var new_head = this.layoutContext.hyphenateSweep(orig_head); // if fixed, new_head token is returned.
    if(new_head){
      //console.log("hyphenate by sweep:orig_head:%o, new_head:%o", orig_head, new_head);
      var hyphenated_measure = new_head.bodySize || 0;
      if(Math.abs(new_head.pos - orig_head.pos) > 1){
	hyphenated_measure = Math.abs(new_head.pos - orig_head.pos) * this.style.getFontSize(); // [FIXME] this is not accurate size.
      }
      this.layoutContext.addInlineMeasure(-1 * hyphenated_measure); // subtract sweeped measure.
      //console.log("hyphenate and new head:%o", new_head);
      this.stream.setPos(new_head.pos);
      this.layoutContext.setLineBreak(true);
      this.layoutContext.setHyphenated(true);
      this.clearCache(); // stream position changed, so disable cache.
    }
  };

  return RenderingContext;
})();
