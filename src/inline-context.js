var InlineContext = (function(){
  function InlineContext(line, stream){
    this.line = line;
    this.stream = stream;
    this.lineStartPos = stream.getPos();
    this.textIndent = stream.isHead()? (line.textIndent || 0) : 0;
    this.maxFontSize = 0;
    this.maxExtent = 0;
    this.maxMeasure = line.getContentMeasure() - this.textIndent;
    this.lineMeasure = line.getContentMeasure();
    this.curMeasure = 0;
    this.charCount = 0;
    this.lineBreak = false;
    this.lastToken = null;
    this.prevText = null;
    this.lastText = null;
    this._justified = false;
  }

  InlineContext.prototype = {
    restart : function(measure){
      this.maxMeasure = measure - this.textIndent;
      this.lineMeasure = measure;
      this._justified = false;
    },
    isLineStartPos : function(element){
      var ptr = this.line;
      while(ptr.parent !== null){
	if(ptr.childMeasure > 0){
	  return false;
	}
	ptr = ptr.parent;
      }
      return true;
    },
    isJustified : function(){
      return this._justified;
    },
    addElement : function(element){
      var advance = this._getElementAdvance(element);
      if(!this._canContain(element, advance)){
	if(advance > 0 && this.isLineStartPos(element)){
	  throw "LayoutError";
	}
	throw "OverflowInline";
      }
      var font_size = this._getElementFontSize(element);
      if(font_size > this.maxFontSize){
	this.maxFontSize = font_size;
      }
      var extent = this._getElementExtent(element);
      if(extent > this.maxExtent){
	this.maxExtent = extent;
      }
      if(element.getCharCount){
	this.charCount += element.getCharCount();
      }
      if(advance > 0 && extent > 0){
	this._pushElement(element, advance);
      }
      if(advance > 0){
	this.curMeasure += advance;
      }
      if(this.curMeasure === this.maxMeasure){
	throw "FinishInline";
      }
    },
    setLineBreak : function(){
      this.lastText = null;
      this.lineBreak = true;
    },
    createLine : function(){
      if(this.curMeasure === 0){
	return this._createEmptyLine();
      }
      var tokens = this.line.getChildsNormal();
      var old_len = tokens.length;
      var self = this;

      // if overflow measure without line-break, try to justify.
      if(this._isOverWithoutLineBreak()){
	tokens = this._justify(tokens, this.lastToken);
	if(tokens.length !== old_len){
	  this._justified = true;
	  this.curMeasure = this.line.childMeasure = List.fold(tokens, 0, function(sum, token){
	    return sum + self._getElementAdvance(token);
	  });
	}
      }
      return this._createTextLine(tokens);
    },
    getNextToken : function(){
      var token = this.stream.get();

      // TODO:
      // skip head space before head word token.
      // example: &nbsp;&nbsp;aaa -> aaa

      this.lastToken = token;
      if(token && Token.isText(token)){
	this._setKerning(token);
      }
      return token;
    },
    getRestMeasure : function(){
      return this.line.getContentMeasure() - this.curMeasure;
    },
    getMaxMeasure : function(){
      return this.maxMeasure;
    },
    getMaxFontSize : function(){
      return this.maxFontSize;
    },
    getMaxExtent : function(){
      return this.maxExtent;
    },
    _getElementExtent : function(element){
      if(Token.isText(element)){
	if((Token.isChar(element) || Token.isTcy(element)) && this.line.textEmpha){
	  return this.line.textEmpha.getExtent(this.line.fontSize);
	}
	return this.line.fontSize;
      }
      if(element instanceof Ruby){
	return element.getExtent(this.line.fontSize);
      }
      return element.getBoxExtent(this.line.flow);
    },
    _getElementFontSize : function(element){
      return (element instanceof Box)? element.fontSize : this.line.fontSize;
    },
    _getElementAdvance : function(element){
      if(Token.isText(element)){
	return element.getAdvance(this.line.flow, this.line.letterSpacing || 0);
      }
      if(element instanceof Ruby){
	return element.getAdvance(this.line.flow);
      }
      return element.getBoxMeasure(this.line.flow);
    },
    _isJustifyElement : function(element){
      if(element instanceof Char){
	return true;
      }
      if(element instanceof Ruby && this.curMeasure > 0){
	return true;
      }
      return false;
    },
    _canContain : function(element, advance){
      // space for justify is required for justify target.
      if(this.line.isJustifyTarget()){
	return this.curMeasure + advance + this.line.fontSize <= this.maxMeasure;
      }
      return this.curMeasure + advance <= this.maxMeasure;
    },
    _isOverWithoutLineBreak : function(){
      //return !this.lineBreak && (this.lineTokens.length > 0);
      return !this.lineBreak && !this.line.isEmptyChild();
    },
    _isLineStart : function(){
      return this.stream.getPos() == this.lineStartPos;
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
    _pushElement : function(element, advance){
      var logical_float = element.logicalFloat || "";
      if(logical_float === "start"){
	element.forward = true;
      } else if(logical_float === "end"){
	element.backward = true;
      }
      this.line.addChildInline(element, advance);
    },
    _justify : function(tokens, last_token){
      var head_token = last_token;
      var tail_token = this.stream.findTextPrev();
      var backup_pos = this.stream.getPos();

      // head text of next line meets head-NG.
      if(head_token && Token.isChar(head_token) && head_token.isHeadNg()){
	tokens = this._justifyHead(tokens, head_token);
	if(this.stream.getPos() != backup_pos){ // some text is moved by head-NG.
	  tail_token = this.stream.findTextPrev(); // search tail_token from new stream position pointing to new head pos.
	  // if new head is single br, this must be included in current line, so skip it.
	  this.stream.skipIf(function(token){
	    return token && Token.isTag(token) && token.getName() === "br";
	  });
	}
      }
      // tail text of this line meets tail-NG.
      if(tail_token && head_token && tail_token.pos < head_token.pos && Token.isChar(tail_token) && tail_token.isTailNg()){
	tokens = this._justifyTail(tokens, tail_token);
      }
      return tokens;
    },
    // fix line that is started with wrong text.
    _justifyHead : function(tokens, head_token){
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
	return tokens;
      }
      // if one head NG, push it into current line.
      if(count === 1){
	tokens.push(head_token);
	this.stream.setPos(head_token.pos + 1);
	return tokens;
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
	return tokens;
      }
      // if normal pos is found, pop line until that pos.
      var ptr = head_token.pos;
      while(ptr > normal_pos){
	tokens.pop();
	ptr--;
      }
      // set stream position at the normal pos.
      this.stream.setPos(normal_pos);
      return tokens;
    },
    // fix line that is ended with wrong text.
    _justifyTail : function(tokens, tail_token){
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
	return tokens;
      }
      // if one tail NG, pop it(tail token is displayed in next line).
      if(count === 1){
	tokens.pop();
	this.stream.setPos(tail_token.pos);
	return tokens;
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
	return tokens;
      }
      // if normal pos is found, pop line until that pos.
      var ptr = tail_token.pos;
      while(ptr > normal_pos){
	tokens.pop();
	ptr--;
      }
      // set stream postion at the 'next' of normal pos.
      this.stream.setPos(normal_pos + 1);
      return tokens;
    },
    _createEmptyLine : function(){
      this.line.size = this.line.flow.getBoxSize(this.lineMeasure, this.line.fontSize);
      this.line.setInlineElements([], this.lineMeasure);
      return this.line;
    },
    _createTextLine : function(tokens){
      var ruby_extent = Math.floor(this.maxFontSize * (this.line.lineRate - 1));
      var max_text_extent = this.maxFontSize + ruby_extent;
      this.maxExtent = Math.max(this.maxExtent, max_text_extent);
      this.line.size = this.line.flow.getBoxSize(this.lineMeasure, this.maxExtent);
      this.line.charCount = this.charCount;
      this.line.setInlineElements(tokens, this.curMeasure);
      this.line.textIndent = this.textIndent;
      return this.line;
    }
  };

  return InlineContext;
})();

