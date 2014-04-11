var Ruby = (function(){
  function Ruby(rbs, rt){
    this._type = "ruby";
    this.rbs = rbs;
    this.rt = rt;
  }

  Ruby.prototype = {
    hasMetrics : function(){
      return (typeof this.advanceSize !== "undefined");
    },
    getCharCount : function(){
      return this.rbs? this.rbs.length : 0;
    },
    getAdvance : function(flow){
      return this.advanceSize;
    },
    getRbs : function(){
      return this.rbs;
    },
    getRtString : function(){
      return this.rt? this.rt.getContentRaw() : "";
    },
    getRtFontSize : function(){
      return this.rtFontSize;
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
      var offset = Math.floor((line.style.getFontSize() - this.getRtFontSize()) / 3);
      css["font-size"] = this.getRtFontSize() + "px";
      css["line-height"] = "1em";
      return css;
    },
    getCssVertRb : function(line){
      var css = {};
      css["float"] = "left";
      if(this.padding){
	Args.copy(css, this.padding.getCss());
      }
      return css;
    },
    getCssHoriRb : function(line){
      var css = {};
      if(this.padding){
	Args.copy(css, this.padding.getCss());
      }
      css["text-align"] = "center";
      return css;
    },
    setMetrics : function(flow, font, letter_spacing){
      this.rtFontSize = Layout.getRtFontSize(font.size);
      var advance_rbs = List.fold(this.rbs, 0, function(ret, rb){
	rb.setMetrics(flow, font);
	return ret + rb.getAdvance(flow, letter_spacing);
      });
      var advance_rt = this.rtFontSize * this.getRtString().length;
      this.advanceSize = advance_rbs;
      if(advance_rt > advance_rbs){
	var ctx_space = Math.ceil((advance_rt - advance_rbs) / 2);
	if(this.rbs.length > 0){
	  this.padding = new Padding();
	  this.padding.setStart(flow, ctx_space);
	  this.padding.setEnd(flow, ctx_space);
	}
	this.advanceSize += ctx_space + ctx_space;
      }
    }
  };

  return Ruby;
})();

