Nehan.Word = (function(){

  var __cut_word = function(word, font, measure){
    for(var i = word.data.length - 1; i >= 1; i--){
      var head_part = word.data.substring(0, i);
      var part_measure = Math.ceil(Nehan.TextMetrics.getMeasure(font, head_part));
      //console.log("head_part:%s(%d) for %d", head_part, part_measure, measure);
      if(part_measure <= measure){
	var head_word = new Nehan.Word(head_part, true);
	head_word.bodySize = measure;
	return head_word;
      }
    }
    return word;
  };

  /**
     @memberof Nehan
     @class Word
     @classdesc abstraction of alphabetical phrase.
     @constructor
     @param word {String}
     @param divided {boolean} - true if word is divided by too long phrase and overflow inline.
  */
  function Word(word, divided){
    this.data = word;
    this._divided = divided || false;
  }

  /**
   @memberof Nehan.Word
   @return {bool}
   */
  Word.prototype.isHeadNg = function(){
    return false; // TODO
  };
  /**
   @memberof Nehan.Word
   @return {bool}
   */
  Word.prototype.isTailNg = function(){
    return false; // TODO
  };
  /**
   @memberof Nehan.Word
   @param {Nehan.BoxFlow}
   @return {string}
   */
  Word.prototype.getData = function(flow){
    return flow.isTextVertical()? this._getDataVert() : this._getDataHori();
  };

  Word.prototype._getDataVert = function(){
    // Convert HYPHEN MINUS(U+002D), HYPHEN(U+2010), FIGURE DASH(U+2012), EN DASH(U+2013) to NON-BREAKING HYPHEN(U+2011), but why?
    // Because HYPHEN-MINUS(\u002D) contains line-break.
    // For example, if you set word text including hyphen(like 'foo-hoo') into (200, 16) box,
    // and if you rotate this box for vertical writing, line-break by hyphenation will be executed,
    // because hyphenation is calculated by not 'measure' of (16, 200) = 200, but 'width' of (16, 200) = 16.
    // So line-break is occured(for most case).
    // To block this, property 'hyphens' is prepared in CSS, but it's not implemented in all browser(especially webkit).
    // So we convert them to \u2011, because \u2011 is declared as 'non-breaking-hyphens'.
    this.data = this.data.replace(/[\u002D\u2010\u2012\u2013]/g, "\u2011");

    // fix dash element
    if(Nehan.Env.client.isIE()){
      this.data = this.data.replace(/\u2014/g, "\uFF5C"); // EM DASH -> FULLWIDTH VERTICAL LINE
    } else {
      this.data = this.data.replace(/\u2015/g, "\u2014"); // HORIZONTAL BAR -> EM DASH
    }
    return this.data;
  };

  Word.prototype._getDataHori = function(){
    this.data = this.data.replace(/\u2015/g, "\u2014"); // HORIZONTAL BAR -> EM DASH
    return this.data;
  };

  /**
   @memberof Nehan.Word
   @param line {Nehan.Box}
   @return {Object}
   */
  Word.prototype.getCssHori = function(line){
    var css = {};
    css["padding-left"] = this.paddingStart + "px";
    css["padding-right"] = this.paddingEnd + "px";
    return css;
  };
  /**
   @memberof Nehan.Word
   @param line {Nehan.Box}
   @return {Object}
   */
  Word.prototype.getCssVertTrans = function(line){
    var css = {};
    var font_size = line.context.style.getFontSize();
    if(line.context.style.letterSpacing){
      css["letter-spacing"] = line.context.style.letterSpacing + "px";
    }
    css.width = font_size + "px";
    css.height = this.bodySize + "px";
    css["padding-top"] = this.paddingStart + "px";
    css["padding-bottom"] = this.paddingEnd + "px";
    return css;
  };
  /**
   @memberof Nehan.Word
   @param line {Nehan.Box}
   @return {Object}
   */
  Word.prototype.getCssVertTransBody = function(line){
    var css = {};
    return css;
  };
  /**
   @memberof Nehan.Word
   @param line {Nehan.Box}
   @return {Object}
   */
  Word.prototype.getCssVertTransBodyTrident = function(line){
    var css = {};
    css.width = line.context.style.getFontSize() + "px";
    css.height = this.bodySize + "px";
    css["transform-origin"] = "50% 50%";

    // force set line-height to measure(this.bodySize) before rotation,
    // and fix offset by translate after rotatation.
    css["line-height"] = this.bodySize + "px";
    var trans = Math.floor((this.bodySize - line.context.style.getFontSize()) / 2);
    if(trans > 0){
      css.transform = "rotate(90deg) translate(-" + trans + "px, 0)";
    }
    return css;
  };
  /**
   @memberof Nehan.Word
   @param line {Nehan.Box}
   @return {Object}
   */
  Word.prototype.getCssVertTransIE = function(line){
    var css = {}, font_size = line.context.style.getFontSize();
    css["css-float"] = "left";
    css["writing-mode"] = "tb-rl";
    css["letter-spacing"] = (line.context.style.letterSpacing || 0) + "px";
    css["padding-left"] = Math.round(font_size / 2) + "px";
    css["line-height"] = font_size + "px";
    return css;
  };
  /**
   @memberof Nehan.Word
   @return {int}
   */
  Word.prototype.getCharCount = function(){
    return 1; // word is count by 1 character.
  };
  /**
   @memberof Nehan.Word
   @param flow {Nehan.BoxFlow}
   @param letter_spacing {int}
   @return {int}
   */
  Word.prototype.getAdvance = function(flow, letter_spacing){
    var letter_spacing_size = (letter_spacing || 0) * this.getLetterCount();
    var padding_size = (this.paddingStart || 0) + (this.paddingEnd || 0);
    return this.bodySize + letter_spacing_size + padding_size;
  };
  /**
   @memberof Nehan.Word
   @return {boolean}
   */
  Word.prototype.hasMetrics = function(){
    return (typeof this.bodySize !== "undefined");
  };
  /**
   @memberof Nehan.Word
   @return {int}
   */
  Word.prototype.countUpper = function(){
    var count = 0;
    for(var i = 0; i < this.data.length; i++){
      if(/[A-Z]/.test(this.data.charAt(i))){
	count++;
      }
    }
    return count;
  };
  /**
   @memberof Nehan.Word
   @param flow {Nehan.BoxFlow}
   @param font {Nehan.Font}
   */
  Word.prototype.setMetrics = function(flow, font){
    this.paddingStart = Math.floor(font.size * (this.spaceRateStart || 0));
    this.paddingEnd = Math.floor(font.size * (this.spaceRateEnd || 0));
    this.bodySize = Nehan.TextMetrics.getMeasure(font, this.data);
  };
  /**
   @memberof Nehan.Word
   @return {int}
   */
  Word.prototype.getLetterCount = function(){
    return this.data.length;
  };
  /**
   @memberof Nehan.Word
   @param enable {boolean}
   */
  Word.prototype.setDivided = function(enable){
    this._divided = enable;
  };
  /**
   @memberof Nehan.Word
   @param enable {boolean}
   */
  Word.prototype.isDivided = function(){
    return this._divided;
  };
  /**
   devide word by [measure] size and return first half of word.

   @memberof Nehan.Word
   @param font_size {int}
   @param measure {int}
   @return {Nehan.Word}
   */
  Word.prototype.cutMeasure = function(flow, font, measure){
    var head_word = __cut_word(this, font, measure);
    var rest_str = this.data.slice(head_word.data.length);
    if(rest_str === ""){
      return this;
    }
    this.data = rest_str;
    this.setDivided(true);
    this.setMetrics(flow, font); // update bodySize
    return head_word;
  };
  
  return Word;
})();

