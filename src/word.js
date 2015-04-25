var Word = (function(){

  var __cut_word_by_metrics = function(word, font, measure){
    for(var i = word.data.length - 1; i >= 1; i--){
      var head_part = word.data.substring(0, i);
      var part_measure = Math.ceil(TextMetrics.getMeasure(font, head_part));
      //console.log("head_part:%s(%d) for %d", head_part, part_measure, measure);
      if(part_measure <= measure){
	var head_word = new Word(head_part, true);
	head_word.bodySize = measure;
	return head_word;
      }
    }
    return word;
  };

  var __cut_word_rough = function(word, font, measure){
    var half_size = Math.round(font.size / 2);
    var head_count = Math.round(measure / half_size);
    var head_word = new Word(word.data.substring(0, head_count), true);
    head_word.bodySize = measure;
    return head_word
  };

  var __cut_word = function(word, font, measure){
    if(TextMetrics.isEnable()){
      return __cut_word_by_metrics(word, font, measure);
    }
    return __cut_word_rough(word, font, measure);
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
    this._type = "word";
    this._divided = divided || false;
  }

  Word.prototype = {
    /**
       @memberof Nehan.Word
       @return {bool}
    */
    isHeadNg: function(){
      return false; // TODO
    },
    /**
       @memberof Nehan.Word
       @return {bool}
    */
    isTailNg: function(){
      return false; // TODO
    },
    /**
       @memberof Nehan.Word
       @return {string}
     */
    getData : function(){
      return this.data;
    },
    /**
       @memberof Nehan.Word
       @param line {Nehan.Box}
       @return {Object}
    */
    getCssVertTrans : function(line){
      var css = {};
      if(line.style.letterSpacing){
	css["letter-spacing"] = line.style.letterSpacing + "px";
      }
      css.width = line.style.getFontSize() + "px";
      css.height = this.bodySize + "px";
      return css;
    },
    /**
       @memberof Nehan.Word
       @param line {Nehan.Box}
       @return {Object}
    */
    getCssVertTransBody : function(line){
      var css = {};
      return css;
    },
    /**
       @memberof Nehan.Word
       @param line {Nehan.Box}
       @return {Object}
    */
    getCssVertTransBodyTrident : function(line){
      var css = {};
      css.width = line.style.getFontSize() + "px";
      css.height = this.bodySize + "px";
      css["transform-origin"] = "50% 50%";

      // force set line-height to measure(this.bodySize) before rotation,
      // and fix offset by translate after rotatation.
      css["line-height"] = this.bodySize + "px";
      var trans = Math.floor((this.bodySize - line.style.getFontSize()) / 2);
      if(trans > 0){
	css.transform = "rotate(90deg) translate(-" + trans + "px, 0)";
      }
      return css;
    },
    /**
       @memberof Nehan.Word
       @param line {Nehan.Box}
       @return {Object}
    */
    getCssVertTransIE : function(line){
      var css = {}, font_size = line.style.getFontSize();
      css["css-float"] = "left";
      css["writing-mode"] = "tb-rl";
      css["letter-spacing"] = (line.style.letterSpacing || 0) + "px";
      css["padding-left"] = Math.round(font_size / 2) + "px";
      css["line-height"] = font_size + "px";
      return css;
    },
    /**
       @memberof Nehan.Word
       @return {int}
    */
    getCharCount : function(){
      return 1; // word is count by 1 character.
    },
    /**
       @memberof Nehan.Word
       @param flow {Nehan.BoxFlow}
       @param letter_spacing {int}
       @return {int}
    */
    getAdvance : function(flow, letter_spacing){
      return Math.floor(this.bodySize + (letter_spacing || 0) * this.getLetterCount());
    },
    /**
       @memberof Nehan.Word
       @return {boolean}
    */
    hasMetrics : function(){
      return (typeof this.bodySize !== "undefined");
    },
    /**
       @memberof Nehan.Word
       @return {int}
    */
    countUpper : function(){
      var count = 0;
      for(var i = 0; i < this.data.length; i++){
	if(/[A-Z]/.test(this.data.charAt(i))){
	  count++;
	}
      }
      return count;
    },
    /**
       @memberof Nehan.Word
       @param flow {Nehan.BoxFlow}
       @param font {Nehan.Font}
    */
    setMetrics : function(flow, font){
      var rough_measure = Math.ceil(this.data.length * font.size * 0.5);
      if(Config.useStrictWordMetrics && TextMetrics.isEnable()){
	var text_measure = Math.ceil(TextMetrics.getMeasure(font, this.data));
	//console.log("[%s]:%d(rough = %d)", this.data, text_measure, rough_measure);
	this.bodySize = Math.max(text_measure, rough_measure); // use longer one
	return;
      }
      this.bodySize = rough_measure;
      if(font.isBold()){
	this.bodySize += Math.floor(Display.boldRate * this.bodySize);
      }
    },
    /**
       @memberof Nehan.Word
       @return {int}
    */
    getLetterCount : function(){
      return this.data.length;
    },
    /**
       @memberof Nehan.Word
       @param enable {boolean}
    */
    setDivided : function(enable){
      this._divided = enable;
    },
    /**
       @memberof Nehan.Word
       @param enable {boolean}
    */
    isDivided : function(){
      return this._divided;
    },
    /**
       devide word by [measure] size and return first half of word.

       @memberof Nehan.Word
       @param font_size {int}
       @param measure {int}
       @return {Nehan.Word}
    */
    cutMeasure : function(flow, font, measure){
      var head_word = __cut_word(this, font, measure);
      var rest_str = this.data.slice(head_word.data.length);
      if(rest_str === ""){
	return this;
      }
      this.data = rest_str;
      this.setDivided(true);
      this.setMetrics(flow, font); // update bodySize
      return head_word;
    }
  };
  
  return Word;
})();

