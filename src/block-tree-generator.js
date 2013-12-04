var BlockTreeGenerator = (function(){
  function BlockTreeGenerator(context){
    ElementGenerator.call(this, context);
    this.generator = null;
  }
  Class.extend(BlockTreeGenerator, ElementGenerator);

  BlockTreeGenerator.prototype.hasNext = function(){
    if(this._terminate){
      return false;
    }
    if(this.generator && this.generator.hasNext()){
      return true;
    }
    return this.context.hasNextToken();
  };

  BlockTreeGenerator.prototype.getCurGenerator = function(){
    if(this.generator && this.generator.hasNext()){
      return this.generator;
    }
    return null;
  };

  // called when page box is fully filled.
  BlockTreeGenerator.prototype._onCompleteBlock = function(page){
  };

  BlockTreeGenerator.prototype._onLastBlock = function(page){
  };

  // if size is not defined, rest size of parent is used.
  // if parent is null, root page is generated.
  BlockTreeGenerator.prototype.yield = function(parent, size){
    var page_box, page_size;
    page_size = size || this._getBoxSize(parent);
    page_box = this._createBox(page_size, parent);
    if(page_box.isDisplayNone()){
      this._terminate = true;
      return Exceptions.IGNORE;
    }
    return this._yieldBlocksTo(page_box);
  };

  // fill page with child page elements.
  BlockTreeGenerator.prototype._yieldBlocksTo = function(page){
    this.context.createBlockContext(page);
    if(this.generator){
      this.generator.context.blockContext = this.context.blockContext;
    }

    while(true){
      var element = this._yieldBlockElement(page);
      if(typeof element === "number"){ // exception
	if(element == Exceptions.IGNORE){
	  continue;
	} else if(element == Exceptions.SINGLE_RETRY){
	  this.context.pushBackToken();
	  page.breakAfter = true;
	  break;
	} else if(element == Exceptions.PAGE_BREAK){
	  page.breakAfter = true;
	  break;
	} else {
	  break;
	}
      }
      try {
	var break_before = element.breakBefore || false;
	var break_after = element.breakAfter || false;
	if(break_before){
	  page.breakAfter = true;
	  break;
	}
	if(element.logicalFloat){
	  page.logicalFloat = element.logicalFloat;
	  element = this._yieldFloatedBlock(page, element);
	}
	this.context.addBlockElement(element);
	if(break_after){
	  page.breakAfter = true;
	  break;
	}
      } catch(e){
	if(e === "FinishBlock"){
	  page.breakAfter = true;
	}
	break;
      }
    }
    if(!this.context.isFirstLocalPage()){
      page.clearBorderBefore();
    }
    if(!this.hasNext()){
      this._onLastBlock(page);
    } else {
      page.clearBorderAfter();
    }
    this._onCompleteBlock(page);

    // if content is not empty, increment local page no.
    if(page.getBoxExtent() > 0){
      this.context.stepLocalPageNo();
    }
    return page;
  };

  BlockTreeGenerator.prototype._yieldBlockElement = function(parent){
    if(this.generator && this.generator.hasNext()){
      return this.generator.yield(parent);
    }
    this.generator = null;
    var token = this.context.getNextToken();
    if(token === null){
      return Exceptions.BUFFER_END;
    }
    var is_tag = Token.isTag(token);
    if(Token.isChar(token) && token.isNewLineChar()){
      return Exceptions.IGNORE;
    }
    if(is_tag && token.isPageBreakTag()){
      return Exceptions.PAGE_BREAK;
    }
    if(is_tag && token.isMetaTag()){
      return Exceptions.IGNORE;
    }
    if(is_tag){
      this.context.inheritMarkup(token);
    }
    if(is_tag && token.hasStaticSize() && token.isBlock()){
      this.generator = this._createStaticGenerator(token);
      return this.generator.yield(parent);
    }
    if(Token.isText(token) || Token.isInline(token)){
      this.context.pushBackToken();
      this.generator = new InlineTreeGenerator(
	this.context.createInlineRoot(this.context.markup, this.context.stream)
      );
      return this.generator.yield(parent);
    }
    // now token is not text, it's a tag object.
    if(token.isInline() || token.isInlineBlock()){
      this.generator = this._createChildInlineTreeGenerator(token);
      return this.generator.yield(parent);
    }
    // if different flow is defined in this block tag,
    // yield it as single inline page with rest size of current parent.
    if(token.hasFlow() && token.getCssAttr("flow") != parent.getFlowName()){
      var inline_size = parent.getRestSize();
      var generator = new InlinePageGenerator(this.context.createBlockRoot(token));
      return generator.yield(parent, inline_size);
    }
    this.generator = this._createChildBlockTreeGenerator(parent, token);
    return this.generator.yield(parent);
  };

  BlockTreeGenerator.prototype._yieldFloatedBlock = function(parent, floated_box){
    if(parent.getContentMeasure() <= floated_box.getBoxMeasure()){
      return floated_box;
    }
    var generator = new FloatedBlockTreeGenerator(this.context.createFloatedRoot(), floated_box);
    var block = generator.yield(parent);
    this.generator = generator.getCurGenerator(); // inherit generator of aligned area
    if(this.generator){
      this.generator.context.blockContext = this.context.blockContext; // and inherit parent block context
    }
    return block;
  };

  return BlockTreeGenerator;
})();

