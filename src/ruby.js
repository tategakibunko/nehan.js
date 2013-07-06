var Ruby = (function(){
  function Ruby(rbs, rt){
    this._type = "ruby";
    this.rbs = rbs;
    this.rt = rt;
    this.padding = new Padding();
  }

  Ruby.prototype = {
    hasMetrics : function(){
      return (typeof this.advanceSize !== "undefined");
    },
    getAdvance : function(flow){
      return this.advanceSize;
    },
    getExtent : function(font_size){
      return 3 * this.rubyFontSize + font_size;
    },
    getRbs : function(){
      return this.rbs;
    },
    getRtString : function(){
      return this.rt? this.rt.getContent() : "";
    },
    getRtFontSize : function(){
      return this.rubyFontSize;
    },
    getCssVertRuby : function(line){
      var css = {};
      css["margin-left"] = Math.floor((line.maxExtent - line.fontSize) / 2) + "px";
      css[line.flow.getPropExtent()] = this.getExtent(line.fontSize) + "px";
      css[line.flow.getPropMeasure()] = this.getAdvance() + "px";
      return css;
    },
    getCssHoriRuby : function(line){
      var css = {};
      css.display = "inline-block";
      return css;
    },
    getCssVertRt : function(line){
      var css = {};
      css["float"] = "left";
      return css;
    },
    getCssHoriRt : function(line){
      var css = {};
      css["font-size"] = css["line-height"] = this.getRtFontSize() + "px";
      css["vertical-align"] = "bottom";
      return css;
    },
    getCssVertRb : function(line){
      var css = {};
      css["float"] = "left";
      Args.copy(css, this.padding.getCss());
      return css;
    },
    getCssHoriRb : function(line){
      var css = {};
      Args.copy(css, this.padding.getCss());
      return css;
    },
    setMetrics : function(flow, font_size, letter_spacing){
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

