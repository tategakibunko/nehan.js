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
      css.width = line.fontSize + "px";
      css.height = this.bodySize + "px";
      css["margin-left"] = css["margin-right"] = "auto";
      return css;
    },
    getCssVertTransIE : function(line){
      var css = {};
      css["float"] = "left";
      css["writing-mode"] = "tb-rl";
      css["letter-spacing"] = line.letterSpacing + "px";
      css["padding-left"] = Math.round(line.fontSize / 2) + "px";
      css["line-height"] = line.fontSize + "px";
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
    setMetricsHeader : function(flow, font_size, is_bold){
      var upper_len = this.countUpper();
      var lower_len = this.data.length - upper_len;
      this.bodySize = Math.round(lower_len * font_size * 0.5);
      this.bodySize += Math.round(upper_len * font_size * Layout.upperCaseRate);
      if(is_bold){
	this.bodySize += Math.round(Layout.boldRate * this.bodySize);
      }
    },
    setMetrics : function(flow, font_size, is_bold, is_header){
      if(is_header && /[A-Z]/.test(this.data)){
	this.setMetricsHeader(flow, font_size, is_bold);
	return;
      }
      this.bodySize = Math.round(this.data.length * font_size * 0.5);
      if(is_bold){
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

