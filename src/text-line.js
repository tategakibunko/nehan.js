// this class is almost same as 'Box',
// but we isolate this class for performance reason.
var TextLine = (function(){
  function TextLine(size, parent){
    this.css = {};
    this._type = "text-line";
    this.size = size;
    this.parent = parent;
    this.fontSize = parent.fontSize;
    this.maxFontSize = parent.fontSize;
    this.maxExtent = parent.fontSize;
    this.color = parent.color;
    this.lineRate = parent.lineRate;
    this.textAlign = parent.textAlign;
    this.textMeasure = 0;
    this.flow = parent.flow;
    this.tokens = [];
  }

  TextLine.prototype = {
    // this function is called only from VerticalInlineEvaluator::evalRubyLabelLine,
    // and ruby is not justify target.
    canJustify : function(){
      return false;
    },
    isTextVertical : function(){
      return this.flow.isTextVertical();
    },
    setEdge : function(edge){
      this.edge = edge;
    },
    setEdgeBySub : function(edge){
    },
    setMaxFontSize : function(max_font_size){
      this.maxFontSize = max_font_size;
      List.iter(this.tokens, function(token){
	if(token instanceof TextLine){
	  token.setMaxFontSize(max_font_size);
	}
      });
    },
    setMaxExtent : function(extent){
      this.maxExtent = extent;
      List.iter(this.tokens, function(token){
	if(token instanceof TextLine){
	  token.setMaxExtent(extent);
	}
      });
    },
    addClass : function(klass){
      var classes = this.extraClasses || [];
      classes.push(klass);
      this.extraClasses = classes;
    },
    getCharCount : function(){
      return this.charCount;
    },
    getTextMeasure : function(){
      return this.textMeasure;
    },
    getTextRestMeasure : function(){
      return this.getContentMeasure() - this.textMeasure;
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
    getBoxMeasure : function(flow){
      var _flow = flow || this.flow;
      var ret = this.size.getMeasure(_flow);
      if(this.edge){
	ret += this.edge.getMeasureSize(_flow);
      }
      return ret;
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
      css["font-size"] = this.fontSize + "px";
      Args.copy(css, this.size.getCss());

      // top level line is displayed as block element,
      // so need to follow parental blockflow.
      if(this.parent instanceof Box){
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
