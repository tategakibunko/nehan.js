var InlineTreeGenerator = BlockTreeGenerator.extend({
  init : function(context){
    this._super(context);
    this.cachedLine = null;
    this._prevStart = 0;
    this._retry = 0;
  },
  getParentPos : function(){
    return this.context.markup.pos;
  },
  hasNext : function(){
    if(this._terminate){
      return false;
    }
    if(this.cachedElement || this.cachedLine){
      return true;
    }
    return this._super();
  },
  // called when line box is fully filled.
  _onCompleteLine : function(line){
    line.setMaxExtent(this.context.getInlineMaxExtent());
    line.setMaxFontSize(this.context.getInlineMaxFontSize());
  },
  _onLastLine : function(line){
  },
  _isEnableElement : function(element){
    if(element instanceof Box){
      return element.getContentExtent() > 0 && element.getContentMeasure() > 0;
    }
    return true;
  },
  yield : function(parent){
    if(this.cachedLine){
      return this._yieldCachedLine(parent);
    }
    var line = this._createLine(parent);
    this.context.createInlineContext(line);
    return this._yieldInlinesTo(line);
  },
  _yieldCachedElement : function(parent){
    var ret = this.cachedElement;
    this.cachedElement = null;
    return ret;
  },
  _yieldCachedLine : function(parent){
    var line = this.cachedLine;
    var old_measure = line.parent.getContentMeasure();
    var cur_measure = parent.getContentMeasure();
    line.parent = parent;
    this.cachedLine = null;
    if(old_measure == cur_measure){
      return line;
    }
    // restart line context with new max-measure.
    this.context.restartInlineContext(parent.getContentMeasure());
    return this._yieldInlinesTo(line);
  },
  _yieldInlinesTo : function(parent){
    var end_after = false;
    var start_pos = this.context.getStreamPos();
    if(start_pos === this._prevStart){
      this._retry++;
      if(this._retry > Config.maxRollbackCount){
	var skip = this.context.getNextToken();
	// console.log("skip!:%o", skip);
	this._retry = 0;
      }
    } else {
      this._retry = 0;
      this._prevStart = start_pos;
    }
    while(true){
      var element = this._yieldInlineElement(parent);
      if(typeof element === "number"){ // exceptions
	if(element == Exceptions.IGNORE){
	  continue;
	} else {
	  this.context.setLineBreak();
	  if(element === Exceptions.FORCE_TERMINATE || element == Exceptions.SINGLE_RETRY){
	    this.context.pushBackToken();
	  }
	  break;
	}
      }

      try {
	this.context.addInlineElement(element);
	if(element.endAfter){
	  end_after = true;
	  break;
	}
      } catch(e){
	if(e === "OverflowInline"){
	  end_after = true;
	  this.cachedElement = this._isEnableElement(element)? element : null;
	}
	break;
      }

      // if devided word, line break and parse same token again.
      if(element instanceof Word && element.isDevided()){
	this.context.pushBackToken();
	break;
      }
    } // while(true)

    line = this.context.createLine();
    line.endAfter = end_after;
    this._onCompleteLine(line);

    if(this.context.isJustified()){
      this.cachedElement = null;
    }
    if(!this.hasNext()){
      this._onLastLine(line);
    }

    if(this.context.blockContext && this.context.getRestExtent() < line.getBoxExtent(parent.flow)){
      this.cachedLine = line;
      return Exceptions.BREAK;
    }
    return line;
  },
  _yieldInlineElement : function(line){
    if(this.cachedElement){
      return this._yieldCachedElement(line);
    }
    if(this.generator && this.generator.hasNext()){
      return this.generator.yield(line);
    }
    this.generator = null;
    var token = this.context.getInlineNextToken();
    return this._yieldInlineToken(line, token);
  },
  _yieldInlineToken : function(line, token){
    if(token === null){
      return Exceptions.BUFFER_END;
    }
    if(token instanceof Ruby){
      return token;
    }
    // CRLF
    if(Token.isChar(token) && token.isNewLineChar()){

      // if pre, treat CRLF as line break
      if(line.isPreLine()){
	return Exceptions.LINE_BREAK;
      }
      // others, just ignore
      return Exceptions.IGNORE;
    }
    if(Token.isText(token)){
      return this._yieldText(line, token);
    }
    var tag_name = token.getName();
    if(tag_name === "br"){
      return Exceptions.LINE_BREAK;
    }
    if(tag_name === "script"){
      this.context.addScript(token);
      return Exceptions.IGNORE;
    }
    if(tag_name === "style"){
      this.context.addStyle(token);
      return Exceptions.IGNORE;
    }
    if(tag_name === "first-letter"){
      this.context.inheritMarkup(token);
    }
    // if block element occured, force terminate generator
    if(token.isBlock()){
      this._terminate = true;
      return Exceptions.FORCE_TERMINATE;
    }
    // token is static size tag
    if(token.hasStaticSize()){
      return this._yieldStaticElement(line, token);
    }
    // token is inline-block tag
    if(token.isInlineBlock()){
      this.generator = this._createInlineBlockGenerator(token);
      return this.generator.yield(line);
    }
    if(token.isSingleTag()){
      return token;
    }
    this.generator = this._createChildInlineTreeGenerator(token);
    return this.generator.yield(line);
  },
  _yieldText : function(line, text){
    // always set metrics for first-line, because style of first-line tag changes whether it is first-line or not.
    if(this.context.getMarkupName() === "first-line" || !text.hasMetrics()){
      text.setMetrics(line.flow, line.fontSize, line.isTextBold(), line.isHeaderLine());
    }
    switch(text._type){
    case "char":
    case "tcy":
      return text;
    case "word":
      return this._yieldWord(line, text);
    }
  },
  _yieldWord : function(line, word){
    var advance = word.getAdvance(line.flow, line.letterSpacing || 0);
    //var max_measure = this.context.getInlineMaxMeasure() - line.fontSize;
    var max_measure = this.context.getInlineMaxMeasure();

    // if advance of this word is less than max-measure, just return.
    if(advance <= max_measure){
      word.setDevided(false);
      return word;
    }
    // if advance is lager than max_measure,
    // we must cut this word into some parts.
    var is_bold = line.isTextBold();
    var is_header = line.isHeaderLine();
    var part = word.cutMeasure(line.fontSize, max_measure); // get sliced word
    part.setMetrics(line.flow, line.fontSize, is_bold, is_header); // metrics for first half
    word.setMetrics(line.flow, line.fontSize, is_bold, is_header); // metrics for second half
    return part;
  }
});

