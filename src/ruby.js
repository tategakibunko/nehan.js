Nehan.Ruby = (function(){
  /**
     @memberof Nehan
     @class Ruby
     @classdesc abstraction of ruby text.
     @constructor
     @param rbs {Array<Nehan.Char>} - characters of &lt;rb&gt; tag.
     @param rt {Nehan.Tag}
  */
  function Ruby(rbs, rt){
    this._type = "ruby";
    this.rbs = rbs;
    this.rt = rt;
  }

  /**
   @memberof Nehan.Ruby
   @return {boolean}
   */
  Ruby.prototype.hasMetrics = function(){
    return (typeof this.advanceSize !== "undefined");
  };
  /**
   @memberof Nehan.Ruby
   @return {int}
   */
  Ruby.prototype.getCharCount = function(){
    return this.rbs? this.rbs.length : 0;
  };
  /**
   @memberof Nehan.Ruby
   @return {int}
   */
  Ruby.prototype.getAdvance = function(flow){
    return this.advanceSize;
  };
  /**
   @memberof Nehan.Ruby
   @return {Array<Nehan.Char>}
   */
  Ruby.prototype.getRbs = function(){
    return this.rbs;
  };
  /**
   @memberof Nehan.Ruby
   @return {String}
   */
  Ruby.prototype.getRbString = function(){
    return this.rbs.map(function(rb){
      return rb.data || "";
    }).join("");
  };
  /**
   @memberof Nehan.Ruby
   @return {String}
   */
  Ruby.prototype.getRtString = function(){
    return this.rt? this.rt.getContent() : "";
  };
  /**
   @memberof Nehan.Ruby
   @return {int}
   */
  Ruby.prototype.getRtFontSize = function(){
    return this.rtFontSize;
  };
  /**
   @memberof Nehan.Ruby
   @param line {Nehan.Box}
   @return {Object}
   */
  Ruby.prototype.getCssVertRt = function(line){
    var css = {};
    css["css-float"] = "left";
    return css;
  };
  /**
   @memberof Nehan.Ruby
   @param line {Nehan.Box}
   @return {Object}
   */
  Ruby.prototype.getCssHoriRt = function(line){
    var css = {};
    var rt_font_size = this.getRtFontSize();
    var offset = Math.floor((line.context.style.getFontSize() - this.getRtFontSize()) / 3);
    css["font-size"] = rt_font_size + "px";
    css["line-height"] = rt_font_size + "px";
    return css;
  };
  /**
   @memberof Nehan.Ruby
   @param line {Nehan.Box}
   @return {Object}
   */
  Ruby.prototype.getCssVertRb = function(line){
    var css = {};
    css["css-float"] = "left";
    if(this.padding){
      Nehan.Args.copy(css, this.padding.getCss());
    }
    return css;
  };
  /**
   @memberof Nehan.Ruby
   @param line {Nehan.Box}
   @return {Object}
   */
  Ruby.prototype.getCssHoriRb = function(line){
    var css = {};
    if(this.padding){
      Nehan.Args.copy(css, this.padding.getCss());
    }
    css["text-align"] = "center";
    css["line-height"] = "1em";
    return css;
  };
  /**
   @memberof Nehan.Ruby
   @param flow {Nehan.BoxFlow}
   @param font {Nehan.Font}
   @param letter_spacing {int}
   */
  Ruby.prototype.setMetrics = function(flow, font, letter_spacing){
    this.rtFontSize = Nehan.Display.getRtFontSize(font.size);
    var advance_rbs = this.rbs.reduce(function(ret, rb){
      rb.setMetrics(flow, font);
      return ret + rb.getAdvance(flow, letter_spacing);
    }, 0);
    var advance_rt = this.rtFontSize * this.getRtString().length;
    this.advanceSize = advance_rbs;
    if(advance_rt > advance_rbs){
      var ctx_space = Math.ceil((advance_rt - advance_rbs) / 2);
      if(this.rbs.length > 0){
	this.padding = new Nehan.Padding();
	this.padding.setStart(flow, ctx_space);
	this.padding.setEnd(flow, ctx_space);
      }
      this.advanceSize += ctx_space + ctx_space;
    }
  };

  return Ruby;
})();

