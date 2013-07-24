var TreeGenerator = ElementGenerator.extend({
  init : function(markup, context){
    this._super(markup, context);
    this.generator = null;
    this.stream = this._createStream(markup);
    this.localPageNo = 0;
    this.localLineNo = 0;
  },
  hasNext : function(){
    if(this.generator && this.generator.hasNext()){
      return true;
    }
    return this.stream.hasNext();
  },
  backup : function(){
    this.stream.backup();
  },
  rollback : function(){
    if(this.generator){
      this.generator.rollback();
    } else {
      this.stream.rollback();
    }
  },
  getCurGenerator : function(){
    if(this.generator && this.generator.hasNext()){
      return this.generator;
    }
    return null;
  },
  // if size is not defined, rest size of parent is used.
  // if parent is null, root page is generated.
  yield : function(parent, size){
    var page_box, page_size;
    page_size = size || this._getBoxSize(parent);
    page_box = this._createBox(page_size, parent);
    var ret = this._yieldBlocksTo(page_box);
    return ret;
  },
  _getBoxSize : function(parent){
    return this._getMarkupStaticSize() || parent.getRestSize();
  },
  _getLineSize : function(parent){
    var measure = parent.getContentMeasure();
    var extent = parent.getContentExtent();
    return parent.flow.getBoxSize(measure, extent);
  },
  _createLine : function(parent){
    var size = this._getLineSize(parent);
    var line = Layout.createTextLine(size, parent);
    line.markup = this.markup;
    line.lineNo = this.localLineNo;
    return line;
  },
  _createStream : function(){
    var source = this._createSource(this.markup.getContent());
    return new TokenStream(source);
  },
  _createSource : function(text){
    return text
      .replace(/^[ \n]+/, "") // shorten head space
      .replace(/\s+$/, "") // discard tail space
      .replace(/\r/g, ""); // discard CR
  },
  _createChildInlineTreeGenerator : function(tag){
    switch(tag.getName()){
    case "ruby":
      return new RubyGenerator(tag, this.context, this.localLineNo);
    case "a":
      return new LinkGenerator(tag, this.context, this.localLineNo);
    case "first-line":
      return new FirstLineGenerator(tag, this.context, this.localLineNo);
    default:
      return new ChildInlineTreeGenerator(tag, this.context, this.localLineNo);
    }
  },
  _createChildBlockTreeGenerator : function(parent, tag){
    switch(tag.getName()){
    case "h1": case "h2": case "h3": case "h4": case "h5": case "h6":
      return new HeaderGenerator(tag, this.context);
    case "section": case "article": case "nav": case "aside":
      return new SectionContentGenerator(tag, this.context);
    case "details": case "blockquote": case "figure": case "fieldset":
      return new SectionRootGenerator(tag, this.context);
    case "table":
      return new TableGenerator(tag, this.context);
    case "tbody": case "thead": case "tfoot":
      return new TableRowGroupGenerator(tag, this.context);
    case "tr":
      return new TableRowGenerator(tag, parent, this.context);
    case "dl":
      return new DefListGenerator(tag, this.context);
    case "ul": case "ol":
      return new ListGenerator(tag, this.context);
    case "li":
      var list_style = parent.listStyle || null;
      if(list_style === null){
	return new ChildBlockTreeGenerator(tag, this.context);
      }
      if(list_style.isInside()){
	return new InsideListItemGenerator(tag, parent, this.context);
      }
      return new OutsideListItemGenerator(tag, parent, this.context);
    case "hr":
      return new HrGenerator(tag, this.context);
    default:
      return new ChildBlockTreeGenerator(tag, this.context);
    }
  },
  _onLastBlock : function(page){
  },
  // called when page box is fully filled.
  _onCompleteBlock : function(page){
  },
  // called when line box is fully filled.
  _onCompleteLine : function(ctx, line){
    line.setMaxExtent(ctx.getMaxExtent());
    line.setMaxFontSize(ctx.getMaxFontSize());
  },
  // fill page with child page elements.
  _yieldBlocksTo : function(page){
    var ctx = new BlockTreeContext(page, this.markup, this.stream, this.context);

    while(true){
      this.backup();
      var element = this._yieldPageElement(ctx, page);
      if(element == Exceptions.PAGE_BREAK){
	break;
      } else if(element == Exceptions.BUFFER_END){
	break;
      } else if(element == Exceptions.SKIP){
	break;
      } else if(element == Exceptions.RETRY){
	this.rollback();
	break;
      } else if(element == Exceptions.BREAK){
	break;
      } else if(element == Exceptions.IGNORE){
	continue;
      }

      try {
	ctx.addElement(element);
	if(this.generator){
	  this.generator.commit();
	}
	if(this._isTextLine(element)){
	  this.localLineNo++;
	}
      } catch(e){
	if(e === "OverflowBlock" || e === "EmptyBlock"){
	  this.rollback();
	}
	break;
      }
    }
    if(this.localPageNo > 0){
      page.clearBorderBefore();
    } else {
    }
    if(!this.hasNext()){
      this._onLastBlock(page);
    } else {
      page.clearBorderAfter();
    }
    this._onCompleteBlock(page);

    // if content is not empty, increment localPageNo.
    if(page.getBoxExtent() > 0){
      this.localPageNo++;
    }
    return page;
  },
  _yieldPageElement : function(ctx, parent){
    if(this.generator && this.generator.hasNext()){
      if(this.generator instanceof ChildInlineTreeGenerator){
	return this._yieldInline(parent);
      }
      return this.generator.yield(parent);
    }
    var token = ctx.getNextToken();
    if(token === null){
      return Exceptions.BUFFER_END;
    }
    // in block level, new-line character makes no sense, just ignored.
    if(Token.isChar(token) && token.isNewLineChar()){
      return Exceptions.IGNORE;
    }
    if(Token.isTag(token) && token.isPageBreakTag()){
      return Exceptions.PAGE_BREAK;
    }
    if(Token.isInline(token)){
      ctx.pushBackToken();
      return this._yieldInline(parent);
    }
    return this._yieldBlockElement(parent, token);
  },
  _yieldInline : function(parent){
    var line = this._createLine(parent);
    return this._yieldInlinesTo(line);
  },
  _yieldInlinesTo : function(line){
    var ctx = new InlineTreeContext(line, this.markup, this.stream, this.context);

    this.backup();

    while(true){
      var element = this._yieldInlineElement(ctx);
      if(typeof element === "number"){
	if(element == Exceptions.BUFFER_END){
	  ctx.setLineBreak();
	  break;
	} else if(element == Exceptions.LINE_BREAK){
	  ctx.setLineBreak();
	  break;
	} else if(element == Exceptions.IGNORE){
	  continue;
	} else {
	  alert("unexpected inline-exception:" + Exceptions.toString(element));
	  break;
	}
      }

      try {
	ctx.addElement(element);
      } catch(e){
	if(e === "OverflowInline"){
	  if(this.generator && (element instanceof Box || element instanceof Ruby)){
	    this.generator.rollback();
	  } else {
	    ctx.pushBackToken();
	  }
	}
	break;
      }

      // if devided word, line break and parse same token again.
      if(element instanceof Word && element.isDevided()){
	ctx.pushBackToken();
	break;
      }
    } // while(true)

    line = ctx.createLine();
    this._onCompleteLine(ctx, line);
    return line;
  },
  _yieldInlineElement : function(ctx){
    if(this.generator && this.generator.hasNext()){
      return this.generator.yield(ctx.line);
    }
    this.generator = null;
    var token = ctx.getNextToken();
    return this._yieldInlineToken(ctx, token);
  },
  _yieldInlineToken : function(ctx, token){
    if(token === null){
      return Exceptions.BUFFER_END;
    }
    if(token instanceof Ruby){
      return token;
    }
    // CRLF
    if(Token.isChar(token) && token.isNewLineChar()){

      // if pre, treat CRLF as line break
      if(ctx.isPreLine()){
	return Exceptions.LINE_BREAK;
      }
      // others, just ignore
      return Exceptions.IGNORE;
    }
    if(Token.isText(token)){
      return this._yieldText(ctx, token);
    }
    if(Token.isTag(token) && token.getName() === "br"){
      return Exceptions.LINE_BREAK;
    }
    // token is static size tag
    if(token.hasStaticSize()){
      return this._yieldStaticElement(ctx.line, token);
    }
    // token is inline-block tag
    if(token.isInlineBlock()){
      this.generator = new InlineBlockGenerator(token, this.context);
      return this.generator.yield(ctx.line);
    }
    // token is other inline tag
    return this._yieldInlineTag(ctx, token);
  },
  _yieldText : function(ctx, text){
    if(!text.hasMetrics()){
      text.setMetrics(ctx.getLineFlow(), ctx.getFontSize(), ctx.isTextBold());
    }
    switch(text._type){
    case "char":
    case "tcy":
      return text;
    case "word":
      return this._yieldWord(ctx, text);
    }
  },
  _yieldWord : function(ctx, word){
    var advance = word.getAdvance(ctx.getLineFlow(), ctx.getLetterSpacing());

    // if advance of this word is less than ctx.maxMeasure, just return.
    if(advance <= ctx.maxMeasure){
      word.setDevided(false);
      return word;
    }
    // if advance is lager than max_measure,
    // we must cut this word into some parts.
    var font_size = ctx.getFontSize();
    var max_measure = ctx.maxMeasure;
    var is_bold = ctx.isTextBold();
    var flow = ctx.getLineFlow();
    var part = word.cutMeasure(font_size, max_measure); // get sliced word
    part.setMetrics(flow, font_size, is_bold); // metrics for first half
    word.setMetrics(flow, font_size, is_bold); // metrics for second half
    return part;
  },
  _yieldInlineTag : function(ctx, tag){
    if(tag.isSingleTag()){
      return tag;
    }
    switch(tag.getName()){
    case "script":
      ctx.addScript(tag);
      return Exceptions.IGNORE;
    case "style":
      ctx.addStyle(tag);
      return Exceptions.IGNORE;
    default:
      this.generator = this._createChildInlineTreeGenerator(tag, this.localLineNo);
      this.generator.startPos = this.stream.pos - 1;
      return this.generator.yield(ctx.line);
    }
  },
  _yieldBlockElement : function(parent, tag){
    if(tag.hasStaticSize()){
      return this._yieldStaticTag(parent, tag);
    }

    // if different flow is defined in this block tag,
    // yield it as single inline page with rest size of current parent.
    if(tag.hasFlow() && tag.getCssAttr("flow") != parent.getFlowName()){
      var inline_size = parent.getRestSize();
      var generator = new InlinePageGenerator(tag, this.context);
      return generator.yield(parent, inline_size);
    }
    this.generator = this._createChildBlockTreeGenerator(parent, tag);
    return this.generator.yield(parent);
  },
  _yieldStaticTag : function(parent, tag){
    var box = this._yieldStaticElement(parent, tag);
    if(!(box instanceof Box)){
      return box; // exception
    }

    // pushed box is treated as a single block element.
    if(tag.isPush()){
      return box;
    }

    // floated box is treated as a single block element(with rest spaces filled by other elements).
    if(box instanceof Box && box.logicalFloat){
      return this._yieldFloatedBlock(parent, box, tag);
    }

    return box; // return as single block.
  },
  _yieldFloatedBlock : function(parent, aligned_box, tag){
    var generator = new FloatedBlockTreeGenerator(this.markup, this.stream, this.context, aligned_box);
    var block = generator.yield(parent);
    this.generator = generator.getCurGenerator(); // inherit generator of aligned area
    return block;
  }
});
