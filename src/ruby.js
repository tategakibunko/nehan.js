var Ruby = (function(){
  function Ruby(rbs, rt){
    this._type = "ruby";
    this.rbs = rbs;
    this.rt = rt;
    this.padding = new Padding();
  }

  Ruby.prototype = {
    hasMetrics : function(){
      return (typeof this.advanceSize != "undefined");
    },
    getAdvance : function(flow){
      return this.advanceSize;
    },
    getExtent : function(){
      return this.baseFontSize + this.rubyFontSize;
    },
    getRbs : function(){
      return this.rbs;
    },
    getRtString : function(){
      return this.rt? this.rt.getContent() : "";
    },
    getRbFontSize : function(){
      return this.baseFontSize;
    },
    getRtFontSize : function(){
      return this.rubyFontSize;
    },
    getCssRuby : function(line){
      var css = {};
      return css;
    },
    getCssRt : function(line){
      var css = {};
      if(line.isTextVertical()){
	css["float"] = "left";
      }
      return css;
    },
    getCssRb : function(line){
      var css = {};
      if(line.isTextVertical()){
	css["float"] = "left";
      }
      Args.copy(css, this.padding.getCss());
      return css;
    },
    setMetrics : function(flow, font_size, letter_spacing){
      this.baseFontSize = font_size;
      this.rubyFontSize = Layout.getRubyFontSize(font_size);
      var advance_rbs = List.fold(this.rbs, 0, function(ret, rb){
	rb.setMetrics(flow, font_size);
	return ret + rb.getAdvance(flow, letter_spacing);
      });
      var advance_rt = this.rubyFontSize * this.getRtString().length;
      this.advanceSize = advance_rbs;
      if(advance_rt > advance_rbs){
	var ctx_space = Math.ceil((advance_rt - advance_rbs) / 2);
	if(this.rbs.length > 0){
	  this.padding.setStart(flow, ctx_space);
	  this.padding.setEnd(flow, ctx_space);
	}
	this.advanceSize += ctx_space + ctx_space;
      }
    }
  };

  return Ruby;
})();

