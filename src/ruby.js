var Ruby = (function(){
  function Ruby(rbs, rt){
    this._type = "ruby";
    this.rbs = rbs;
    this.rt = rt;
  }

  Ruby.prototype = {
    hasMetrics : function(){
      return (typeof this.advanceSize != "undefined");
    },
    getAdvance : function(flow){
      return this.advanceSize;
    },
    getExtent : function(){
      return this.baseFontSize;
    },
    getFontSize : function(){
      return this.baseFontSize;
    },
    getRbs : function(){
      return this.rbs;
    },
    getRtFontSize : function(){
      return this.rubyFontSize;
    },
    getRtString : function(){
      return this.rt? this.rt.content : "";
    },
    getCss : function(ruby_line){
      var css = {};
      css.position = "absolute";
      css["font-size"] = this.rubyFontSize + "px";
      css[ruby_line.getPropStart()] = this.startPos + "px";
      css[ruby_line.getTextSide()] = this._getBaseLineOffset(ruby_line) + "px";
      return css;
    },
    setStartPos : function(start_pos){
      this.startPos = start_pos;
    },
    setMetrics : function(flow, font_size, letter_spacing){
      this.baseFontSize = font_size;
      this.rubyFontSize = Math.floor(font_size * Layout.rubyRate);
      var advance_rbs = List.fold(this.rbs, 0, function(ret, rb){
	rb.setMetrics(flow, font_size);
	return ret + rb.getAdvance(flow, letter_spacing);
      });
      var advance_rt = this.rubyFontSize * this.getRtString().length;
      this.advanceSize = advance_rbs;
      if(advance_rt > advance_rbs){
	var ctx_space = Math.ceil((advance_rt - advance_rbs) / 2);
	if(this.rbs.length > 0){
	  this.rbs[0].paddingStart = ctx_space;
	  this.rbs[this.rbs.length - 1].paddingEnd = ctx_space;
	}
	this.advanceSize += ctx_space + ctx_space;
      }
    },
    // calc baseline offset of this ruby,
    // bacause sometimes size of each ruby are different.
    _getBaseLineOffset : function(ruby_line){
      if(ruby_line.isTextVertical()){
	return this._getBaseLineOffsetVert(ruby_line);
      }
      return this._getBaseLineOffsetHori(ruby_line);
    },
    _getBaseLineOffsetVert : function(ruby_line){
      var line_space = ruby_line.getBodyLineContentExtent() - this.baseFontSize;
      var total_rate = 1.0 + ruby_line.lineRate;
      var offset = Math.floor(total_rate * Layout.rubyRate * line_space / 2);
      if(offset > 0){
	return -offset;
      }
      return 0;
    },
    _getBaseLineOffsetHori : function(ruby_line){
      var line_height = ruby_line.getContentExtent();
      var line_space = line_height - this.rubyFontSize;
      return -Math.floor(line_space / 2);
    }
  };

  return Ruby;
})();

