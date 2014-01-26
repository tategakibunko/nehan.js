var Word = (function(){
  function Word(word, devided){
    this.data = word;
    this._type = "word";
    this._devided = devided || false;
  }

  Word.prototype = {
    getCssVertTrans : function(line){
      var css = {};
      css["letter-spacing"] = line.letterSpacing + "px";
      css.width = line.getFontSize() + "px";
      css.height = this.bodySize + "px";
      css["margin-left"] = "auto";
      css["margin-right"] = "auto";
      return css;
    },
    getCssVertTransBody : function(line){
      var css = {};
      css["font-family"] = line.getFontFamily();
      return css;
    },
    // set line-height to word body size before rotation,
    // and fix offset by translate after rotatation.
    getCssVertTransBodyTrident : function(line){
      var css = {};
      var trans = Math.floor((this.bodySize - line.getFontSize()) / 2);
      css["font-family"] = line.getFontFamily();
      css.width = line.getFontSize() + "px";
      css.height = this.bodySize + "px";
      css["line-height"] = this.bodySize + "px";
      css["transform-origin"] = "50% 50%";
      css["transform"] = "rotate(90deg) translate(-" + trans + "px, 0)";
      return css;
    },
    getCssVertTransIE : function(line){
      var css = {}, font_size = line.getFontSize();
      css["float"] = "left";
      css["writing-mode"] = "tb-rl";
      css["letter-spacing"] = line.letterSpacing + "px";
      css["padding-left"] = Math.round(font_size / 2) + "px";
      css["line-height"] = font_size + "px";
      return css;
    },
    getCharCount : function(){
      return 1; // word is count by 1 character.
    },
    getAdvance : function(flow, letter_spacing){
      return this.bodySize + letter_spacing * this.getLetterCount();
    },
    hasMetrics : function(){
      return (typeof this.bodySize !== "undefined");
    },
    countUpper : function(){
      var count = 0;
      for(var i = 0; i < this.data.length; i++){
	if(/[A-Z]/.test(this.data.charAt(i))){
	  count++;
	}
      }
      return count;
    },
    setMetrics : function(flow, font){
      if(Config.useStrictWordMetrics && TextMetrics.isEnable()){
	this.bodySize = TextMetrics.getMeasure(font, this.data);
	return;
      }
      this.bodySize = Math.round(this.data.length * font.size * 0.5);
      if(font.isBold()){
	this.bodySize += Math.round(Layout.boldRate * this.bodySize);
      }
    },
    getLetterCount : function(){
      return this.data.length;
    },
    setDevided : function(enable){
      this._devided = enable;
    },
    isDevided : function(){
      return this._devided;
    },
    // devide word by measure size and return first half of word.
    cutMeasure : function(font_size, measure){
      var half_size = Math.round(font_size / 2);
      var this_half_count = Math.round(this.bodySize / half_size);
      var measure_half_count = Math.round(measure / half_size);
      if(this_half_count <= measure_half_count){
	return this;
      }
      var str_part = this.data.substring(0, measure_half_count);
      var word_part = new Word(str_part, true);
      this.data = this.data.slice(measure_half_count);
      this.setDevided(true);
      return word_part;
    }
  };
  
  return Word;
})();

