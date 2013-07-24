var InlineTreeGenerator = ElementGenerator.extend({
  init : function(markup, stream, context){
    this.markup = markup;
    this.stream = stream;
    this.context = context;
    this._terminate = false;
    this.generator = null;
    this.lineNo = 0;
  },
  hasNext : function(){
    if(this._terminate){
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
  commit : function(){
    this.lineNo++;
    if(this.generator && this.generator.hasNext() === false){
      this.generator = null;
    }
  },
  // this rollback is called from parent generator when layout overflows by 'block level'.
  rollback : function(){
    var rollback_pos = this.stream.getBackupPos();
    this.stream.rollback();
    if(this.generator){
      var cgen_pos = this.generator.getParentPos();
      var cgen_line_no = this.generator.getParentLineNo();
      if(rollback_pos < cgen_pos){
	this.generator = null;
      } else if(cgen_pos + 1 == rollback_pos && cgen_line_no == this.lineNo){
	// still un-yielded child-gen,
	// or child-gen that is previous of backupPos and line no of child-gen is equal to backupPos token.
	this.generator.rollback();
      }
    }
  },
  _getLineSize : function(parent){
    var measure = parent.getContentMeasure();
    var extent = parent.getContentExtent();
    return parent.flow.getBoxSize(measure, extent);
  },
  _createLine  : function(parent){
    var size = this._getLineSize(parent);
    var line = Layout.createTextLine(size, parent);
    line.markup = this.markup;
    line.lineNo = this.lineNo;
    return line;
  },
  yield : function(parent){
    var line = this._createLine(parent);
    return this._yieldInlinesTo(line);
  },
  _yieldInlinesTo : function(line){
    var ctx = new InlineTreeContext(line, this.markup, this.stream, this.context);

    this.backup();
    while(true){
      var element = this._yieldElement(ctx);
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
	  if(element instanceof Box || element instanceof Ruby){
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
    this._onCompleteTree(ctx, line);
    return line;
  },
  _onCompleteTree : function(ctx, line){
    line.setMaxExtent(ctx.getMaxExtent());
    line.setMaxFontSize(ctx.getMaxFontSize());
  },
  _yieldElement : function(ctx){
    if(this.generator && this.generator.hasNext()){
      return this.generator.yield(ctx.line);
    }
    //this.generator = null;
    var token = ctx.getNextToken();
    return this._yieldToken(ctx, token);
  },
  _yieldToken : function(ctx, token){
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
    // if block element, break line and force terminate generator
    if(token.isBlock()){
      ctx.pushBackToken(); // push back this token(this block is handled by parent generator).
      this._terminate = true; // force terminate
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
      this.generator = this._createChildInlineTreeGenerator(ctx, tag);
      this.generator.startPos = this.stream.pos - 1;
      return this.generator.yield(ctx.line);
    }
  },
  _createChildInlineTreeGenerator : function(ctx, tag){
    switch(tag.getName()){
    case "ruby":
      return new RubyGenerator(tag, this.context, this.lineNo);
    case "a":
      return new LinkGenerator(tag, this.context, this.lineNo);
    case "first-line":
      return new FirstLineGenerator(tag, this.context, this.lineNo);
    default:
      return new ChildInlineTreeGenerator(tag, this.context, this.lineNo);
    }
  }
});

