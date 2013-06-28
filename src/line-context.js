var LineContext = (function(){
  function LineContext(parent, stream, context){
    this.parent = parent;
    this.stream = stream;
    this.context = context;
    this.isRubyLine = parent._type === "ruby-line";
    this.lineStartPos = this.stream.getPos();
    this.lineRate = parent.lineRate;
    this.letterSpacing = parent.letterSpacing || 0;
    this.textIndent = stream.isHead()? (parent.textIndent || 0) : 0;
    this.maxFontSize = parent.fontSize;
    this.maxExtent = 0;
    this.maxMeasure = parent.getContentMeasure() - this.textIndent;
    this.curMeasure = 0;
    this.restMeasure = this.maxMeasure;
    this.restExtent = parent.getRestContentExtent();
    this.lineMeasure = parent.getContentMeasure() - this.textIndent;
    this.rubyLineRate = Math.max(0, this.lineRate - 1);
    this.rubyLineExtent = this.isRubyLine? 0 : Math.floor(parent.fontSize * this.rubyLineRate);
    this.bodyTokens = [];
    this.rubyTokens = [];
    this.emphaChars = [];
    this.lineBreak = false;
    this.charCount = 0;
    this.lastToken = null;
    this.prevText = null;
    this.lastText = null;
  }

  LineContext.prototype = {
    getRestBox : function(){
      var parent_flow = this.parent.flow;
      var measure = this.restMeasure;
      var extent = this.parent.getContentExtent();
      var size = parent_flow.getBoxSize(measure, extent);
      var box = new Box(size, this.parent);
      box.flow = this.parent.flow;
      return box;
    },
    canContainBasicLine : function(){
      return this.restExtent >= Math.floor(this.parent.fontSize * this.lineRate);
    },
    canContainExtent : function(extent){
      return this.restExtent >= extent;
    },
    canContainAdvance : function(element, advance){
      if(element instanceof Box || !this.parent.canJustify()){
	return this.restMeasure >= advance;
      }
      if(element instanceof Word || element instanceof Tcy){
	return this.restMeasure >= advance;
      }
      // justify target need space for tail fix.
      return this.restMeasure - this.parent.fontSize >= advance;
    },
    canContain : function(element, advance, extent){
      return this.canContainAdvance(element, advance) && this.canContainExtent(extent);
    },
    isPreLine : function(){
      return this.parent._type === "pre";
    },
    isEmptySpace : function(){
      return this.restMeasure <= 0;
    },
    isBoldEnable : function(){
      return this.context.isBoldEnable();
    },
    isEmptyText : function(){
      return this.bodyTokens.length === 0;
    },
    isInlineTagEmpty : function(){
      return this.context.getInlineTagDepth() <= 0;
    },
    isOverWithoutLineBreak : function(){
      return !this.lineBreak && (this.bodyTokens.length > 0);
    },
    isLineStart : function(){
      return this.stream.pos == this.lineStartPos;
    },
    isFirstLine : function(){
      return this.lineStartPos === 0;
    },
    pushTag : function(tag){
      this.context.pushInlineTag(tag, this.parent);
    },
    pushBackToken : function(){
      this.stream.prev();
    },
    popFirstLine : function(){
      var tag = this.context.popInlineTagByName(":first-line");
      if(tag){
	this.addElement(tag.getCloseTag(), {
	  advance:0,
	  extent:0,
	  fontSize:0
	});
      }
    },
    popTagByName : function(name){
      this.context.popInlineTagByName(name);
    },
    findFirstText : function(){
      return this.stream.findTextNext(this.lineStartPos);
    },
    skipToken : function(){
      this.stream.next();
    },
    getNextToken : function(){
      var is_line_start = this.isLineStart();
      var token = this.stream.get();

      // skip head half space if 1 and 2.
      // 1. first token of line is a half space.
      // 2. next text token is a word.
      if(token && is_line_start && Token.isChar(token) && token.isHalfSpaceChar()){
	var next = this.findFirstText();
	if(next && Token.isWord(next)){
	  token = this.stream.get();
	}
      }
      this.lastToken = token;

      if(token && Token.isText(token)){
	this._setKerning(token);
      }

      return token;
    },
    getTextTokenLength : function(){
      return this.bodyTokens.length;
    },
    getInlineFontSize : function(){
      return this.context.getInlineFontSize(this.parent);
    },
    getRestMeasure : function(){
      return this.parent.getContentMeasure() - this.curMeasure;
    },
    getMaxMeasure : function(){
      return this.maxMeasure;
    },
    getParentFlow : function(){
      return this.parent.flow;
    },
    addStyle : function(tag){
      this.context.addStyle(tag);
    },
    addElement : function(element, opt){
      if(opt.fontSize > this.maxFontSize){
	this._setMaxFontSize(opt.fontSize);
      }
      if(opt.extent > this.maxExtent){
	this._setMaxExtent(opt.extent);
      }
      if(element instanceof Ruby){
	this._addRuby(element);
      } else if(Token.isTag(element)){
	this._addTag(element);
      } else if (element._type === "inline-block"){
	this._addInlineBlock(element);
      } else {
	this._addText(element);
      }
      if(opt.advance > 0){
	this._addAdvance(opt.advance);
      }
    },
    setAnchor : function(anchor_name){
      this.context.setAnchor(anchor_name);
    },
    setLineBreak : function(){
      this.lastText = null;
      this.lineBreak = true;
    },
    createInlineRoot : function(){
      return this.context.createInlineRoot();
    },
    createLine : function(){
      // if first-line, deactivate first line tag.
      if(this.isFirstLine()){
	this.popFirstLine();
      }
      // if overflow measure without line-break, try to justify.
      if(this.isOverWithoutLineBreak() && this.parent.canJustify()){
	this.justify(this.lastToken);
      }
      var text_line = this._createTextLine();
      if(this.isRubyLine || this.lineRate <= 1.0){
	return text_line;
      }
      var ruby_line = this._createRubyLine(text_line);
      return this._createLineBox(text_line, ruby_line);
    },
    justify : function(last_token){
      var head_token = last_token;
      var tail_token = this.stream.findTextPrev();
      var backup_pos = this.stream.getPos();
      
      // head text of next line meets head-NG.
      if(head_token && Token.isChar(head_token) && head_token.isHeadNg()){
	this.bodyTokens = this._justifyHead(head_token);
	if(this.stream.getPos() != backup_pos){ // some text is moved by head-NG.
	  tail_token = this.stream.findTextPrev(); // search tail_token from new stream position pointing to new head pos.
	  // if new head is single br, this must be included in current line, so skip it.
	  this.stream.skipIf(function(token){
	    return token && Token.isTag(token) && token.getName() === "br";
	  });
	}
      }
      // tail text of this line meets tail-NG.
      if(tail_token && Token.isChar(tail_token) && tail_token.isTailNg()){
	this.bodyTokens = this._justifyTail(tail_token);
      }
    },
    _addAdvance : function(advance){
      this.curMeasure += advance;
      this.restMeasure -= advance;
    },
    _setMaxExtent : function(extent){
      this.maxExtent = extent;
    },
    _setMaxFontSize : function(max_font_size){
      this.maxFontSize = max_font_size;
      if(!this.isRubyLine){
	this.rubyLineExtent = Math.floor(max_font_size * this.rubyLineRate);
      }
    },
    _setKerning : function(token){
      this.prevText = this.lastText;
      this.lastText = token;
      if(Token.isChar(token)){
	if(token.isKakkoStart()){
	  this._setKerningStart(token, this.prevText);
	} else if(token.isKakkoEnd() || token.isKutenTouten()){
	  var next_text = this.stream.findTextNext(token.pos);
	  this._setKerningEnd(token, next_text);
	}
      }
    },
    _setKerningStart : function(cur_char, prev_text){
      var space_rate = this._getTextSpaceStart(cur_char, prev_text);
      if(space_rate > 0){
	cur_char.spaceRateStart = space_rate;
      }
    },
    _setKerningEnd : function(cur_char, next_text){
      var space_rate = this._getTextSpaceEnd(cur_char, next_text);
      if(space_rate > 0){
	cur_char.spaceRateEnd = space_rate;
      }
    },
    _getTextSpaceStart : function(cur_char, prev_text){
      if(prev_text === null){
	return 0.5;
      }
      if(Token.isChar(prev_text) && prev_text.isKakkoStart()){
	return 0;
      }
      return 0.5;
    },
    _getTextSpaceEnd : function(cur_char, next_text){
      if(next_text === null){
	return 0.5;
      }
      if(Token.isChar(next_text) && (next_text.isKakkoEnd() || next_text.isKutenTouten())){
	return 0;
      }
      return 0.5;
    },
    _addRuby : function(element){
      this.bodyTokens = this.bodyTokens.concat(element.getRbs());
      this.rubyTokens.push(element);
    },
    _addTag : function(element){
      this.bodyTokens.push(element);
    },
    _addInlineBlock : function(element){
      this.bodyTokens.push(element);
    },
    _addEmpha : function(empha, element){
      var mark = empha.getCssAttr("empha-mark") || "&#x2022;";
      this.emphaChars.push(new EmphaChar({
	data:mark,
	parent:element,
	startPos:this.curMeasure
      }));
    },
    _addText : function(element){
      // text element
      this.bodyTokens.push(element);

      // count up char count of line
      this.charCount += element.getCharCount();

      // check empha tag is open.
      var empha = this.context.findInlineTag(function(tag){ return tag.isEmphaTag(); });

      // if emphasis tag is open, add emphasis-char to ruby line.
      if(empha){
	this._addEmpha(empha, element);
      }
    },
    // fix line that is started with wrong text.
    _justifyHead : function(head_token){
      var count = 0;
      this.stream.iterWhile(head_token.pos, function(pos, token){
	if(Token.isChar(token) && token.isHeadNg()){
	  count++;
	  return true; // continue
	}
	return false;
      });
      // no head NG, just return texts as they are.
      if(count <= 0){
	return this.bodyTokens;
      }
      // if one head NG, push it into current line.
      if(count === 1){
	this.bodyTokens.push(head_token);
	this.stream.setPos(head_token.pos + 1);
	return this.bodyTokens;
      }
      // if more than two head NG, find non NG text from tail, and cut the line at the pos.
      var normal_pos = -1;
      this.stream.revIterWhile(head_token.pos, function(pos, token){
	if(pos <= this.lineStartPos){
	  return false; // break (error)
	}
	if(Token.isChar(token) && !token.isHeadNg()){
	  normal_pos = pos; // non head NG text is found
	  return false; // break (success)
	}
	return true; // continue
      });
      // if no proper pos is found in current line, give up justifying.
      if(normal_pos < 0){
	return this.bodyTokens;
      }
      // if normal pos is found, pop line until that pos.
      var ptr = head_token.pos;
      while(ptr > normal_pos){
	this.bodyTokens.pop();
	ptr--;
      }
      // set stream position at the normal pos.
      this.stream.setPos(normal_pos);
      return this.bodyTokens;
    },
    // fix line that is ended with wrong text.
    _justifyTail : function(tail_token){
      var count = 0;
      this.stream.revIterWhile(tail_token.pos, function(pos, token){
	if(Token.isChar(token) && token.isTailNg()){
	  count++;
	  return true;
	}
	return false;
      });
      // no tail NG, just return texts as they are.
      if(count <= 0){
	return this.bodyTokens;
      }
      // if one tail NG, pop it(tail token is displayed in next line).
      if(count === 1){
	this.bodyTokens.pop();
	this.stream.setPos(tail_token.pos);
	return this.bodyTokens;
      }
      // if more than two tail NG, find non NG text from tail, and cut the line at the pos.
      var normal_pos = -1;
      this.stream.revIterWhile(tail_token.pos, function(pos, token){
	if(pos <= this.lineStartPos){
	  return false; // break (error)
	}
	if(Token.isChar(token) && !token.isTailNg()){
	  normal_pos = pos; // non tail NG text is found.
	  return false; // break (success)
	}
	return true; // continue
      });
      // if no proper pos is found in current line, give up justifying.
      if(normal_pos < 0){
	return this.bodyTokens;
      }
      // if normal pos is found, pop line until that pos.
      var ptr = tail_token.pos;
      while(ptr > normal_pos){
	this.bodyTokens.pop();
	ptr--;
      }
      // set stream postion at the 'next' of normal pos.
      this.stream.setPos(normal_pos + 1);
      return this.bodyTokens;
    },
    _createTextLine : function(){
      var size = this.parent.flow.getBoxSize(this.lineMeasure, this.maxExtent);
      return new TextLine({
	type:"text-line",
	parent:this.parent,
	size:size,
	charCount:this.charCount,
	fontSize:this.parent.fontSize,
	color:this.parent.color,
	tokens:this.bodyTokens,
	textMeasure:this.curMeasure,
	textIndent:this.textIndent,
	letterSpacing:this.letterSpacing,
	lineRate:1.0
      });
    },
    _createRubyLine : function(text_line){
      var size = this.parent.flow.getBoxSize(this.lineMeasure, this.rubyLineExtent);
      return new TextLine({
	type:"ruby-line",
	parent:this.parent,
	size:size,
	charCount:0,
	fontSize:this.parent.fontSize,
	color:this.parent.color,
	tokens:this.rubyTokens,
	emphaChars:this.emphaChars,
	textMeasure:this.curMeasure,
	textIndent:this.textIndent,
	letterSpacing:this.letterSpacing,
	lineRate:this.rubyLineRate,
	bodyLine:text_line
      });
    },
    _createLineBox : function(text_line, ruby_line){
      return new LineBox({
	measure:this.lineMeasure,
	extent:(this.maxExtent + this.rubyLineExtent),
	parent:this.parent,
	rubyLine:ruby_line,
	textLine:text_line
      });
    }
  };

  return LineContext;
})();

