var BlockTreeGenerator = ElementGenerator.extend({
  init : function(markup, context){
    this._super(markup, context);
    this.generator = null;
    this.rollbackCount = 0;
    this.stream = this._createStream();
    this.localPageNo = 0;
    this.pageBreakBefore = this._isPageBreakBefore();
    this.context.pushBlockTag(this.markup);
  },
  hasNext : function(){
    if(this.generator && this.generator.hasNext()){
      return true;
    }
    return this.stream.hasNext();
  },
  backup : function(){
    if(this.generator){
      this.generator.backup();
    }
  },
  rollback : function(){
    this.rollbackCount++;
    if(this.rollbackCount > Config.maxRollbackCount){
      throw "too many rollbacks";
    }
    if(this.generator){
      this.generator.rollback();
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
    if(this.stream.isEmpty()){
      return Exceptions.SKIP;
    }
    // let this generator yield PAGE_BREAK exception(only once).
    if(this.pageBreakBefore){
      this.pageBreakBefore = false;
      return Exceptions.PAGE_BREAK;
    }
    var page_box, page_size;
    page_size = size || this._getBoxSize(parent);
    page_box = this._createBox(page_size, parent);
    var ret = this._yieldPageTo(page_box);
    return ret;
  },
  _getBoxSize : function(parent){
    return parent.getRestSize();
  },
  // fill page with child page elements.
  _yieldPageTo : function(page){
    var cur_extent = 0;
    var max_extent = page.getContentExtent();
    var page_flow = page.flow;

    while(true){
      this.backup();
      var element = this._yieldPageElement(page);
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
      var extent = element.getBoxExtent(page_flow);
      cur_extent += extent;
      if(cur_extent > max_extent || this._isEmptyElement(page_flow, element)){
	this.rollback();
	break;
      }

      page.addChildBlock(element);

      if(cur_extent == max_extent){
	break;
      }
      if(element.pageBreakAfter){
	page.pageBreakAfter = true; // propagate pageBreakAfter to parent box
	break;
      }
    }
    if(this.localPageNo > 0){
      page.clearBorderBefore();
    }
    if(!this.hasNext()){
      this._onLastTree(page);
    } else {
      page.clearBorderAfter();
    }
    this.rollbackCount = 0;
    this._onCompleteTree(page);

    // if content is not empty, increment localPageNo.
    if(cur_extent > 0){
      this.localPageNo++;
    }
    return page;
  },
  _isPageBreakBefore : function(){
    return this.markup.getCssAttr("page-break-before", "") === "always";
  },
  _isEmptyElement : function(flow, element){
    return (element instanceof Box) && !element.isTextLine() && (element.getContentExtent(flow) <= 0);
  },
  _createStream : function(){
    var source = this._createSource(this.markup.content);
    return new TokenStream(source);
  },
  // caution:
  // this is not first preprocess.
  // first conversion is in PageStream::_createSource, which discards comment, invalid tags .. etc.
  // so this time we convert other things according to this generator locally.
  _createSource : function(text){
    return text
      .replace(/^[ \n]+/, "") // shorten head space
      .replace(/\s+$/, "") // discard tail space
      .replace(/\r/g, ""); // discard CR
  },
  _onLastTree : function(page){
    this.context.popBlockTag();
  },
  // called when page box is fully filled by blocks.
  _onCompleteTree : function(page){
  },
  _yieldPageElement : function(parent){
    if(this.generator && this.generator.hasNext()){
      return this.generator.yield(parent);
    }
    var token = this.stream.get();
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
      // this is not block level element, so we push back this token,
      // and delegate this stream to InlineTreeGenerator from the head of this inline element.
      this.stream.prev();
      this.generator = new InlineTreeGenerator(this.markup, this.stream, this.context);
      return this.generator.yield(parent);
    }
    return this._yieldBlockElement(parent, token);
  },
  _yieldBlockElement : function(parent, tag){
    if(tag.hasStaticSize()){
      return this._yieldStaticTag(parent, tag);
    }

    // if different flow is defined in this block tag,
    // yield it as single inline page with rest size of current parent.
    if(tag.hasFlow() && tag.getCssAttr("flow") != parent.getFlowName()){
      var inline_size = parent.getRestSize();
      var generator = new InlinePageGenerator(tag, this.context.createInlineRoot());
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
    var generator = new FloatedBlockTreeGenerator(this.stream, this.context, aligned_box);
    var block = generator.yield(parent);
    this.generator = generator.getCurGenerator(); // inherit generator of aligned area
    return block;
  },
  _createChildBlockTreeGenerator : function(parent, tag){
    switch(tag.getName()){
    case "h1": case "h2": case "h3": case "h4": case "h5": case "h6":
      return this._getHeaderLineGenerator(parent, tag);
    case "section": case "article": case "nav": case "aside":
      return this._getSectionContentGenerator(parent, tag);
    case "details": case "blockquote": case "figure": case "fieldset":
      return this._getSectionRootGenerator(parent, tag);
    case "table":
      return this._getTableGenerator(parent, tag);
    case "tbody": case "thead": case "tfoot":
      return this._getTableRowGroupGenerator(parent, tag);
    case "tr":
      return this._getTableRowGenerator(parent, tag);
    case "dl":
      return this._getDefListGenerator(parent, tag);
    case "ul": case "ol":
      return this._getListGenerator(parent, tag);
    case "li":
      return this._getListItemGenerator(parent, tag);
    case "hr":
      return this._getHorizontalRuleGenerator(parent, tag);
    default:
      return new ChildBlockTreeGenerator(tag, this.context);
    }
  },
  _getSectionContentGenerator : function(parent, tag){
    return new SectionContentGenerator(tag, this.context);
  },
  _getSectionRootGenerator : function(parent, tag){
    return new SectionRootGenerator(tag, this.context);
  },
  _getHorizontalRuleGenerator : function(parent, tag){
    return new HorizontalRuleGenerator(tag, this.context);
  },
  _getHeaderLineGenerator : function(parent, tag){
    return new HeaderGenerator(tag, this.context);
  },
  _getListGenerator : function(parent, tag){
    return new ListGenerator(tag, this.context);
  },
  _getListItemGenerator : function(parent, tag){
    var list_style = parent.listStyle || null;
    if(list_style === null){
      return new ChildBlockTreeGenerator(tag, this.context);
    }
    if(list_style.isInside()){
      return new InsideListItemGenerator(tag, parent, this.context);
    }
    return new OutsideListItemGenerator(tag, parent, this.context);
  },
  _getDefListGenerator : function(parent, tag){
    return new DefListGenerator(tag, this.context);
  },
  _getTableGenerator : function(parent, tag){
    return new TableGenerator(tag, this.context);
  },
  _getTableRowGroupGenerator : function(parent, tag){
    return new TableRowGroupGenerator(tag, this.context);
  },
  _getTableRowGenerator : function(parent, tag){
    return new TableRowGenerator(tag, parent, this.context.createInlineRoot());
  }
});
