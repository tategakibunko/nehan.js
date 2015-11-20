Nehan.TextGenerator = (function(){
  /**
   @memberof Nehan
   @class TextGenerator
   @classdesc inline level generator, output inline level block.
   @constructor
   @extends {Nehan.LayoutGenerator}
   @param context {Nehan.RenderingContext}
   */
  function TextGenerator(context){
    Nehan.LayoutGenerator.call(this, context);
  }
  Nehan.Class.extend(TextGenerator, Nehan.LayoutGenerator);

  TextGenerator.prototype._yield = function(){
    while(this.hasNext()){
      var element = this._getNext();
      try {
	this.context.addTextElement(element);
      } catch(e){
	console.warn(e);
	break;
      }
    }
    return this._createOutput();
  };

  TextGenerator.prototype._createOutput = function(){
    var line = this.context.createTextBlock();

    // call _onCreate callback for 'each' output
    this._onCreate(line);

    // call _onComplete callback for 'final' output
    if(!this.hasNext()){
      this._onComplete(line);
    }
    return line;
  };

  TextGenerator.prototype._getNext = function(){
    if(this.context.hasCache()){
      var cache = this.context.popCache();
      return cache;
    }

    // read next token
    var token = this.context.stream.get();
    if(token === null){
      return null;
    }

    // if white-space
    if(Nehan.Token.isWhiteSpace(token)){
      return this._getWhiteSpace(token);
    }

    return this._getText(token);
  };

  TextGenerator.prototype._getWhiteSpace = function(token){
    if(this.context.style.isPre()){
      return this._getWhiteSpacePre(token);
    }
    // skip continuous white-spaces.
    this.context.stream.skipUntil(Nehan.Token.isWhiteSpace);

    // first new-line and tab are treated as single half space.
    if(token.isNewLine() || token.isTabSpace()){
      Nehan.Char.call(token, " "); // update by half-space
    }
    // if white-space is not new-line, use first one.
    return this._getText(token);
  };

  TextGenerator.prototype._getWhiteSpacePre = function(token){
    if(Nehan.Token.isNewLine(token)){
      this.context.layoutContext.setLineBreak(true);
      return null;
    }
    return this._getText(token); // read as normal text
  };

  TextGenerator.prototype._getText = function(token){
    if(!token.hasMetrics()){
      this._setTextMetrics(token);
    }
    switch(token._type){
    case "char":
    case "tcy":
    case "ruby":
      return token;
    case "word":
      return this._getWord(token);
    }
    console.error("Nehan::TextGenerator, undefined token:", token);
    throw "Nehan::TextGenerator, undefined token";
  };

  TextGenerator.prototype._setTextMetrics = function(token){
    // if charactor token, set kerning before setting metrics.
    // because some additional space is added if kerning is enabled or not.
    if(Nehan.Config.kerning){
      if(token instanceof Nehan.Char && token.isKerningChar()){
	this._setTextSpacing(token);
      } else if(token instanceof Nehan.Word){
	this._setTextSpacing(token);
      }
    }
    token.setMetrics(this.context.style.flow, this.context.style.getFont());
  };

  TextGenerator.prototype._setTextSpacing = function(token){
    var next_token = this.context.stream.peek();
    var prev_text = this.context.layoutContext.getInlineLastElement();
    var next_text = next_token && Nehan.Token.isText(next_token)? next_token : null;
    Nehan.Spacing.add(token, prev_text, next_text);
  };

  TextGenerator.prototype._getWord = function(token){
    var rest_measure = this.context.layoutContext.getInlineRestMeasure();
    var advance = token.getAdvance(this.context.style.flow, this.context.style.letterSpacing || 0);
    
    // if there is enough space for this word, just return.
    if(advance <= rest_measure){
      token.setDivided(false);
      return token;
    }
    // at this point, this word is larger than rest space.
    // but if this word size is less than max_measure and 'word-berak' is not 'break-all',
    // just break line and show it at the head of next line.
    if(advance <= this.context.layoutContext.getInlineMaxMeasure() && !this.context.style.isWordBreakAll()){
      return token; // overflow and cached
    }
    // at this point, situations are
    // 1. advance is larger than rest_measure and 'word-break' is set to 'break-all'.
    // 2. or word itself is larger than max_measure.
    // in these case, we must cut this word into some parts.
    var part = token.cutMeasure(this.context.style.flow, this.context.style.getFont(), rest_measure); // get sliced word
    if(!token.isDivided()){
      return token;
    }
    if(token.data !== "" && token.bodySize > 0){
      this.context.stream.prev(); // re-parse this token because rest part is still exists.
    }
    part.bodySize = Math.min(rest_measure, part.bodySize); // sometimes overflows. more accurate logic is required in the future.
    return part;
  };

  TextGenerator.prototype._getMeasure = function(element){
    return element.getAdvance(this.context.style.flow, this.context.style.letterSpacing || 0);
  };

  return TextGenerator;
})();

