// this class is almost same as 'Box',
// but we isolate this class for performance reason.
var TextLine = (function(){
  function TextLine(opt){
    this.css = {};
    this._type = opt.type || "text-line";
    this.size = opt.size;
    this.fontSize = opt.fontSize;
    this.color = opt.color;
    this.parent = opt.parent;
    this.textMeasure = opt.textMeasure;
    this.textIndent = opt.textIndent;
    this.tokens = opt.tokens;
    this.emphaChars = opt.emphaChars || null;
    this.lineRate = opt.lineRate || 1.0;
    this.bodyLine = opt.bodyLine || null;
    this.charCount = opt.charCount || 0;
    this.letterSpacing = opt.letterSpacing || 0;

    // inherit parent properties
    this.textAlign = this.parent.textAlign;
    this.flow = this.parent.flow;
  }

  TextLine.prototype = {
    isTextVertical : function(){
      return this.flow.isTextVertical();
    },
    isTextLine : function(){
      return this._type === "text-line";
    },
    isRubyLine : function(){
      return this._type === "ruby-line";
    },
    setEdge : function(edge){
      this.edge = edge;
    },
    getCharCount : function(){
      return this.charCount;
    },
    getTextMeasure : function(){
      return this.textMeasure;
    },
    getTextRestMeasure : function(){
      return this.getMaxTextMeasure() - this.textMeasure;
    },
    getMaxTextMeasure : function(){
      return Box.prototype.getMaxTextMeasure.call(this);
    },
    getContentMeasure : function(flow){
      return this.size.getMeasure(flow || this.flow);
    },
    getContentExtent : function(flow){
      return this.size.getExtent(flow || this.flow);
    },
    getRestContentExtent : function(flow){
      return this.getContentExtent(flow || this.flow);
    },
    getBodyLineContentExtent : function(){
      return this.bodyLine.getContentExtent();
    },
    getBoxExtent : function(flow){
      var _flow = flow || this.flow;
      var ret = this.size.getExtent(_flow);
      if(this.edge){
	ret += this.edge.getExtentSize(_flow);
      }
      return ret;
    },
    getTextSide : function(){
      return this.flow.getTextSide();
    },
    getPropStart : function(){
      return this.flow.getPropStart();
    },
    getPropAfter : function(){
      return this.flow.getPropAfter();
    },
    getPropBefore : function(){
      return this.flow.getPropBefore();
    },
    getStartOffset : function(){
      switch(this.textAlign){
      case "start": return this.textIndent;
      case "end": return this.textIndent + this.getTextRestMeasure();
      case "center": return this.textIndent + Math.floor(this.getTextRestMeasure() / 2);
      default: return this.textIndent;
      }
    },
    getCss : function(){
      var css = this.css;
      Args.copy(css, this.size.getCss());
      if(this.parent){
	Args.copy(css, this.flow.getCss());
      }
      var start_offset = this.getStartOffset();
      if(start_offset){
	this.edge = new Margin();
	this.edge.setStart(this.flow, start_offset);
      }
      if(this.edge){
	Args.copy(css, this.edge.getCss());
      }
      if(this.isTextVertical()){
	if(Env.isIphoneFamily){
	  css["letter-spacing"] = "-0.001em";
	}
      }
      if(this._type === "ruby-line"){
	if(this.flow.isTextHorizontal()){
	  css["line-height"] = this.getContentExtent() + "px";
	}
      }
      return css;
    },
    getCssClasses : function(){
      return this.getClasses().join(" ");
    },
    getClasses : function(){
      return [
	["nehan", this._type].join("-"),
	["nehan", this._type, (this.isTextVertical()? "vert" : "hori")].join("-")
      ];
    },
    getTextHorizontalDir : function(){
      return this.flow.getTextHorizontalDir();
    },
    shortenMeasure : function(){
      this.size.setMeasure(this.flow, this.textMeasure);
    }
  };

  return TextLine;
})();
