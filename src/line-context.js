var LineContext = (function(){
  function LineContext(line, stream, context){
    this.line = line;
    this.stream = stream;
    this.context = context;
    this.markup = this.context.getCurInlineTag() || null;
    this.lineStartPos = this.stream.getPos();
    this.textIndent = stream.isHead()? (line.textIndent || 0) : 0;
    this.maxFontSize = line.fontSize;
    this.maxExtent = 0;
    this.maxMeasure = line.getContentMeasure() - this.textIndent;
    this.curMeasure = 0;
    this.restMeasure = this.maxMeasure;
    this.restExtent = line.getRestContentExtent();
    this.lineMeasure = line.getContentMeasure() - this.textIndent;
    this.lineTokens = [];
    this.lineBreak = false;
    this.charCount = 0;
    this.lastToken = null;
    this.prevText = null;
    this.lastText = null;
  }

  LineContext.prototype = {
    getElementExtent : function(element){
      if(Token.isText(element)){
	return element.fontSize;
      }
      if(element instanceof Ruby){
	return element.getExtent();
      }
      return element.getBoxExtent(this.getLineFlow());
    },
    getElementFontSize : function(element){
      if(Token.isText(element)){
	return element.fontSize;
      }
      if(element instanceof Ruby){
	return element.getRbFontSize();
      }
      return element.fontSize || 0;
    },
    getElementAdvance : function(element){
      if(Token.isText(element)){
	return element.getAdvance(this.getLineFlow(), this.getLetterSpacing());
      }
      if(element instanceof Ruby){
	return element.getAdvance(this.getLineFlow());
      }
      return element.getBoxMeasure(this.getLineFlow());
    },
    getFontSize : function(){
      return this.line.fontSize;
    },
    getMaxFontSize : function(){
      return this.maxFontSize;
    },
    getMaxExtent : function(){
      return this.maxExtent;
    },
    getLineFlow : function(){
      return this.line.flow;
    },
    getLetterSpacing : function(){
      return this.line.letterSpacing || 0;
    },
    canContainBasicLine : function(){
      return this.restExtent >= Math.floor(this.line.fontSize * this.line.lineRate);
    },
    canContainExtent : function(extent){
      return this.restExtent >= extent;
    },
    canContainAdvance : function(element, advance){
      if(element instanceof Box ||
	 element instanceof Word ||
	 element instanceof Tcy ||
	 this.line.isRubyTextLine()){
	return this.restMeasure >= advance;
      }
      
      // justify target need space for tail fix.
      return this.restMeasure - this.line.fontSize >= advance;
    },
    canContain : function(element, advance, extent){
      return this.canContainAdvance(element, advance) && this.canContainExtent(extent);
    },
    isPreLine : function(){
      return this.line._type === "pre";
    },
    isEmptySpace : function(){
      return this.restMeasure <= 0;
    },
    isBoldEnable : function(){
      return this.context.isBoldEnable();
    },
    isEmptyText : function(){
      return this.lineTokens.length === 0;
    },
    isInlineTagEmpty : function(){
      return this.context.getInlineTagDepth() <= 0;
    },
    isOverWithoutLineBreak : function(){
      return !this.lineBreak && (this.lineTokens.length > 0);
    },
    isLineStart : function(){
      return this.stream.pos == this.lineStartPos;
    },
    isFirstLine : function(){
      return this.lineStartPos === 0;
    },
    pushTag : function(tag){
      this.context.pushInlineTag(tag, this.line);
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
      return this.lineTokens.length;
    },
    getRestMeasure : function(){
      return this.line.getContentMeasure() - this.curMeasure;
    },
    getMaxMeasure : function(){
      return this.maxMeasure;
    },
    addStyle : function(tag){
      this.context.addStyle(tag);
    },
    addElement : function(element){
      var advance = this.getElementAdvance(element);
      var extent = this.getElementExtent(element);
      if(!this.canContain(element, advance, extent)){
	throw "OverflowInline";
      }

      var font_size = this.getElementFontSize(element);
      if(font_size > this.maxFontSize){
	this._setMaxFontSize(font_size);
      }
      if(extent > this.maxExtent){
	this._setMaxExtent(extent);
      }
      if(Token.isTag(element)){
	this._addTag(element);
      } else if(element instanceof Ruby){
	this._addRuby(element);
      } else if (element instanceof Box){
	if (element._type === "inline-block"){
	  this._addInlineBlock(element);
	} else if(element._type === "text-line"){	
	  this._addTextLine(element);
	} else {
	  throw "undefined inline element found";
	}
      } else {
	this._addText(element);
      }
      if(advance > 0){
	this._addAdvance(advance);
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
      if(this.isOverWithoutLineBreak()){
	this.justify(this.lastToken);
      }
      return this._createTextLine();
    },
    justify : function(last_token){
      var head_token = last_token;
      var tail_token = this.stream.findTextPrev();
      var backup_pos = this.stream.getPos();
      
      // head text of next line meets head-NG.
      if(head_token && Token.isChar(head_token) && head_token.isHeadNg()){
	this.lineTokens = this._justifyHead(head_token);
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
	this.lineTokens = this._justifyTail(tail_token);
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
      this.lineTokens.push(element);
    },
    _addTag : function(element){
      this.lineTokens.push(element);
    },
    _addInlineBlock : function(element){
      this.lineTokens.push(element);
    },
    _addTextLine : function(element){
      this.lineTokens.push(element);
      this.charCount += element.getCharCount();
    },
    _addText : function(element){
      // text element
      this.lineTokens.push(element);

      // count up char count of line
      this.charCount += element.getCharCount();

      // check empha tag is open.
      var empha = this.context.getCurEmpha();
      if(empha){
	element.setEmpha(empha);
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
	return this.lineTokens;
      }
      // if one head NG, push it into current line.
      if(count === 1){
	this.lineTokens.push(head_token);
	this.stream.setPos(head_token.pos + 1);
	return this.lineTokens;
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
	return this.lineTokens;
      }
      // if normal pos is found, pop line until that pos.
      var ptr = head_token.pos;
      while(ptr > normal_pos){
	this.lineTokens.pop();
	ptr--;
      }
      // set stream position at the normal pos.
      this.stream.setPos(normal_pos);
      return this.lineTokens;
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
	return this.lineTokens;
      }
      // if one tail NG, pop it(tail token is displayed in next line).
      if(count === 1){
	this.lineTokens.pop();
	this.stream.setPos(tail_token.pos);
	return this.lineTokens;
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
	return this.lineTokens;
      }
      // if normal pos is found, pop line until that pos.
      var ptr = tail_token.pos;
      while(ptr > normal_pos){
	this.lineTokens.pop();
	ptr--;
      }
      // set stream postion at the 'next' of normal pos.
      this.stream.setPos(normal_pos + 1);
      return this.lineTokens;
    },
    _createTextLine : function(){
      var ruby_extent = Math.floor(this.maxFontSize * (this.line.lineRate - 1));
      var max_text_extent = this.maxFontSize + ruby_extent;
      this.maxExtent = Math.max(this.maxExtent, max_text_extent);
      this.line.size = this.line.flow.getBoxSize(this.lineMeasure, this.maxExtent);
      this.line.charCount = this.charCount;
      this.line.childs.normal = this.lineTokens;
      this.line.childMeasure = this.curMeasure;
      //this.line.tokens = this.lineTokens;
      //this.line.textMeasure = this.curMeasure;
      this.line.textIndent = this.textIndent;
      return this.line;
    }
  };

  return LineContext;
})();

