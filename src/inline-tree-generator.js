// TODO:
// although it is quite rare situation, ruby disappears when
// 1. line overflow by tail ruby and
// 2. it is placed at the head of next line but
// 3. parent page can't contain the line because of block level overflow.
// then after rollback and 2nd-yielding by parent generator,
// ruby disappears because stream already steps to the next pos of ruby.
// any good idea to solve this problem?
var InlineTreeGenerator = ElementGenerator.extend({
  init : function(markup, stream, context){
    this.markup = markup;
    this.stream = stream;
    this.context = context;
    this.parentMarkup = context.getCurBlockTag();
    this._hasNext = this.stream.hasNext();
    if(this.markup){
      this.context.pushInlineTag(this.markup);
    }
  },
  hasNext : function(){
    if(!this._hasNext){
      return false;
    }
    if(this.generator && this.generator.hasNext()){
      return true;
    }
    return this.stream.hasNext();
  },
  backup : function(){
    this.stream.backup();
  },
  // caution! : this rollback function is to be ALWAYS called from parent generator.
  // so do not call this from this generator.
  rollback : function(){
    this.stream.rollback();
    if(this.generator){
      this.generator.rollback();
    } else {
      this.generator = null;
    }
  },
  yield : function(parent){
    //var ctx = new LineContext(parent, this.stream, this.context);
    this.context.setNewLine(parent, this.stream);

    // even if extent for basic line is not left,
    // just break and let parent generator break page.
    if(!ctx.canContainBasicLine()){
      return Exceptions.BREAK;
    }

    // backup inline head position.
    this.backup();

    while(true){
      var element = this._yieldElement(ctx);

      if(element == Exceptions.BUFFER_END){
	ctx.setLineBreak();
	break;
      } else if(element == Exceptions.SKIP){
	return Exceptions.IGNORE;
      } else if(element == Exceptions.LINE_BREAK){
	ctx.setLineBreak();
	break;
      } else if(element == Exceptions.RETRY){
	ctx.setLineBreak();
	break;
      } else if(element == Exceptions.IGNORE){
	continue;
      }
      var advance = this._getAdvance(ctx, element); // size of inline flow.
      var extent = this._getExtent(ctx, element); // size of block flow.
      var font_size = this._getFontSize(ctx, element); // font size of element.

      // if overflow inline max, line break.
      if(!ctx.canContain(element, advance, extent)){
	if(this.generator){
	  this.generator.rollback();
	} else {
	  ctx.pushBackToken();
	}
	break;
      }
      ctx.addElement(element, {
	advance:advance,
	extent:extent,
	fontSize:font_size
      });

      // if devided word, line break and parse same token again.
      if(element instanceof Word && element.isDevided()){
	ctx.pushBackToken();
	break;
      }
    }
    var line = ctx.createLine();
    if(!this.hasNext()){
      this._onLastTree(line);
    }
    this._onCompleteTree(line);
    return line;
  },
  _onLastTree : function(line){
    if(this.markup){
      this.context.popInlineTagByName(this.markup.getName());
    }
  },
  _onCompleteTree : function(line){
  },
  _getExtent : function(ctx, element){
    if(Token.isText(element)){
      return element.fontSize;
    }
    if(Token.isTag(element)){
      if(element.edge){
	var font_size = ctx.getInlineFontSize();
	var edge_size = element.edge.getExtentSize(ctx.getParentFlow());
	return font_size + edge_size;
      }
      return 0;
    }
    if(element instanceof Ruby){
      return element.getExtent();
    }
    if(element instanceof Box){
      return element.getBoxExtent(ctx.getParentFlow());
    }
    return 0;
  },
  _getFontSize : function(ctx, element){
    if(Token.isText(element)){
      return element.fontSize;
    }
    if(element instanceof Ruby){
      return element.getFontSize();
    }
    return 0;
  },
  _getAdvance : function(ctx, element){
    if(Token.isText(element)){
      return element.getAdvance(ctx.getParentFlow(), ctx.letterSpacing);
    }
    if(Token.isTag(element)){
      if(element.edge){
	return element.edge.getMeasureSize(ctx.getParentFlow());
      }
      return 0;
    }
    if(element instanceof Ruby){
      return element.getAdvance(ctx.getParentFlow());
    }
    return element.getBoxMeasure(ctx.getParentFlow());
  },
  _yieldElement : function(ctx){
    if(this.generator && this.generator.hasNext()){
      return this.generator.yield(ctx);
    }
    this.generator = null;
    var token = ctx.getNextToken();
    return this._yieldToken(ctx, token);
  },
  _yieldToken : function(ctx, token){
    if(token === null){
      return Exceptions.BUFFER_END;
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
    // if pseudo-element tag,
    // copy style of <this.parentMarkup.name>:<pseudo-name> dynamically.
    if(this.parentMarkup && token.isPseudoElementTag()){
      var pseudo_name = token.getPseudoElementName();
      var pseudo_css_attr = this.parentMarkup.getPseudoCssAttr(pseudo_name);
      for(var prop in pseudo_css_attr){
	if(prop !== "content"){
	  token.setCssAttr(prop, pseudo_css_attr[prop]);
	}
      }
    }
    // if block element, break line and force terminate generator
    if(token.isBlock()){
      ctx.pushBackToken(); // push back this token(this block is handled by parent generator).
      this._hasNext = false; // force terminate
      return ctx.isEmptyText()? Exceptions.SKIP : Exceptions.LINE_BREAK;
    }
    // token is static size tag
    if(token.hasStaticSize()){
      return this._yieldStaticElement(ctx.parent, token, this.context);
    }
    // token is inline-block tag
    if(token.isInlineBlock()){
      this.generator = new InlineBlockGenerator(token, ctx.createInlineRoot());
      return this.generator.yield(ctx);
    }
    // token is other inline tag
    return this._yieldInlineTag(ctx, token);
  },
  _yieldStaticElement : function(parent, tag, context){
    var element = this._super(parent, tag, context);
    if(element instanceof Box){
      element.display = "inline-block";
    }
    return element;
  },
  _yieldText : function(ctx, text){
    if(!text.hasMetrics()){
      text.setMetrics(ctx.getParentFlow(), ctx.getInlineFontSize(), ctx.isBoldEnable());
    }
    switch(text._type){
    case "char":
    case "tcy":
      return text;
    case "word":
      return this._yieldWord(ctx, text);
    }
  },
  _createChildInlineTreeGenerator : function(ctx, tag){
    switch(tag.getName()){
    case "a":
      return new LinkGenerator(tag, this.context);
    default:
      break;
    }
  },
  _yieldInlineTag : function(ctx, tag){
    if(tag.isSingleTag()){
      ctx.inheritParentTag(tag);
      return tag;
    }
    // if inline level edge is defined,
    // get edge and set it to markup data because inline level does not create box.
    // this edge(in markup data) is evaluated at InlineEvaluator::evalTagCss.
    /*
      TODO: we should get/set edge in _createBox.
    var edge = tag.getBoxEdge(ctx.getParentFlow(), ctx.getInlineFontSize(), ctx.getMaxMeasure());
    if(edge){
      tag.edge = edge;
    }*/
    switch(tag.getName()){
    case "script":
      return Exceptions.IGNORE;

    case "style":
      ctx.addStyle(tag);
      return Exceptions.IGNORE;

    case "ruby":
      // assert metrics only once to avoid dup update by rollback
      if(typeof tag.fontSize === "undefined"){
	tag.fontSize = ctx.getInlineFontSize();
	tag.letterSpacing = ctx.letterSpacing;
      }
      this.generator = new RubyGenerator(tag);
      return this.generator.yield(ctx);

    default:
      this.generator = this._createChildInlineTreeGenerator(ctx, tag);
      return this.generator.yield(ctx);
    }
  },
  _yieldWord : function(ctx, word){
    var advance = word.getAdvance(ctx.getParentFlow(), ctx.letterSpacing);

    // if advance of this word is less than ctx.maxMeasure, just return.
    if(advance <= ctx.maxMeasure){
      word.setDevided(false);
      return word;
    }
    // if advance is lager than max_measure,
    // we must cut this word into some parts.
    var font_size = ctx.getInlineFontSize();
    var is_bold = ctx.isBoldEnable();
    var flow = ctx.getParentFlow();
    var part = word.cutMeasure(ctx.maxMeasure); // get sliced word
    part.setMetrics(flow, font_size, is_bold); // metrics for first half
    word.setMetrics(flow, font_size, is_bold); // metrics for second half
    return part;
  }
});

