var Box = (function(){
  function Box(size, parent, opt){
    opt = opt || {};
    this._type = opt.type || "div";
    this.markup = opt.markup || null;
    this.position = opt.position || new BoxPosition("relative");
    this.parent = parent;
    this.size = size;
    this.childExtent = 0;
    this.childMeasure = 0;
    this.childs = new BoxChild();
    this.css = {};
    this.charCount = 0;
  }

  Box.prototype = {
    getMarkup : function(){
      return this.markup;
    },
    getCssBlock : function(){
      var css = this.css;
      Args.copy(css, this.size.getCss());
      Args.copy(css, this.position.getCss());
      if(this.font){
	Args.copy(css, this.font.getCss());
      }
      if(this.edge){
	Args.copy(css, this.edge.getCss());
      }
      if(this.parent){
	Args.copy(css, this.parent.flow.getCss());
      }
      if(this.color){
	Args.copy(css, this.color.getCss());
      }
      if(this.background){
	Args.copy(css, this.background.getCss(this.flow));
      }
      if(this.letterSpacing && !this.isTextVertical()){
	css["letter-spacing"] = this.letterSpacing + "px";
      }
      css.display = this.display;
      css.overflow = "hidden"; // to avoid margin collapsing

      if(this.zIndex){
	css["z-index"] = this.zIndex;
      }
      return css;
    },
    getCssInline : function(){
      var css = this.css;
      if(this.font){
	Args.copy(css, this.font.getCss());
      }
      if(this.color){
	Args.copy(css, this.color.getCss());
      }
      if(this.background){
	Args.copy(css, this.background.getCss());
      }
      // top level line need to follow parent blockflow.
      if(this.parent && this.parent.isBlock()){
	Args.copy(css, this.flow.getCss());
      }
      var start_offset = this.getStartOffset();
      if(start_offset > 0){
	this.edge = new Margin();
	this.edge.setStart(this.flow, start_offset);

	var cur_measure = this.getContentMeasure();
	this.size.setMeasure(this.flow, cur_measure - start_offset);
      }
      Args.copy(css, this.size.getCss());

      if(this.edge){
	Args.copy(css, this.edge.getCss());
      }
      if(this.isTextVertical()){
	css["line-height"] = "1em";
	if(Env.isIphoneFamily){
	  css["letter-spacing"] = "-0.001em";
	}
	if(typeof this.markup === "undefined" || !this.isRubyLine()){
	  css["margin-left"] = css["margin-right"] = "auto";
	  css["text-align"] = "center";
	}
      }
      return css;
    },
    getCssVertInlineBox : function(){
      var css = this.getCssBlock();
      css["float"] = "none";
      css["margin-left"] = css["margin-right"] = "auto";
      return css;
    },
    getCharCount : function(){
      return this.charCount;
    },
    // classes as array
    getClasses : function(){
      return this.isTextLine()? this._getClassesInline() : this._getClassesBlock();
    },
    // ["nehan-box", "nehan-header"] => "nehan-box nehan-header"
    getCssClasses : function(){
      return this.getClasses().join(" ");
    },
    _getClassesBlock : function(){
      var classes = ["nehan-box"];
      if(this._type != "box"){
	classes.push(Css.addNehanPrefix(this._type));
      }
      return classes.concat(this.extraClasses || []);
    },
    _getClassesInline : function(){
      var classes = ["nehan-text-line"];
      classes.push("nehan-text-line-" + (this.isTextVertical()? "vert" : "hori"));
      if(this.markup && this.markup.getName() !== "body"){
	classes.push("nehan-" + this.markup.getName());
      }
      return classes.concat(this.extraClasses || []);
    },
    getChilds : function(){
      return this.childs.get();
    },
    getChildExtent : function(){
      return this.childExtent;
    },
    getChildMeasure : function(){
      return this.childMeasure;
    },
    getFlowName : function(){
      return this.flow.getName();
    },
    getFlipFlow : function(){
      return this.flow.getFlipFlow();
    },
    getFontSize : function(){
      return this.font? this.font.size : Layout.fontSize;
    },
    getFontFamily : function(){
      return this.font? this.font.family : "monospace";
    },
    getTextMeasure : function(){
      return this.childMeasure;
    },
    getRestContentMeasure : function(){
      return this.getContentMeasure() - this.childMeasure;
    },
    getRestContentExtent : function(){
      return this.getContentExtent() - this.childExtent;
    },
    getContentMeasure : function(flow){
      return this.size.getMeasure(flow || this.flow);
    },
    getContentExtent : function(flow){
      return this.size.getExtent(flow || this.flow);
    },
    getMaxChildMeasure : function(flow){
      var _flow = flow || this.flow;
      var max_measure = 0;
      List.iter(this.getChilds(), function(child){
	var measure = child.getTextMeasure? child.getTextMeasure() : child.getContentMeasure(_flow);
	if(measure > max_measure){
	  max_measure = measure;
	}
      });
      return max_measure;
    },
    getContentWidth : function(){
      return this.size.width;
    },
    getContentHeight : function(){
      return this.size.height;
    },
    getBoxMeasure : function(flow){
      var flow2 = flow || this.flow;
      var ret = this.getContentMeasure(flow2);
      if(this.edge){
	ret += this.edge.getMeasureSize(flow2);
      }
      return ret;
    },
    getBoxExtent : function(flow){
      var flow2 = flow || this.flow;
      var ret = this.getContentExtent(flow2);
      if(this.edge){
	ret += this.edge.getExtentSize(flow2);
      }
      return ret;
    },
    getStartOffset : function(){
      var indent = this.textIndent || 0;
      switch(this.textAlign){
      case "start": return indent;
      case "end": return indent + this.getRestContentMeasure();
      case "center": return indent + Math.round(this.getRestContentMeasure() / 2);
      default: return indent;
      }
    },
    getRestSize : function(){
      var rest_measure = this.getRestContentMeasure();
      var rest_extent = this.getRestContentExtent();
      return this.flow.getBoxSize(rest_measure, rest_extent);
    },
    getFloatedWrapFlow : function(){
      return this.flow.getFloatedWrapFlow();
    },
    getParentFlow : function(){
      return this.parent? this.parent.flow : null;
    },
    getParallelFlow : function(){
      return this.flow.getParallelFlow();
    },
    getParallelFlipFlow : function(){
      return this.flow.getParallelFlipFlow();
    },
    getPropStart : function(){
      return this.flow.getPropStart();
    },
    getPropAfter : function(){
      return this.flow.getPropAfter();
    },
    getInflow : function(){
      return this.flow.inflow;
    },
    getBlockflow : function(){
      return this.flow.blockflow;
    },
    getBoxFlowBoxSize : function(measure, extent){
      return this.flow.getBoxSize(measure, extent);
    },
    getEdgeWidth : function(){
      if(this.sizing && !this.sizing.containEdgeSize()){
	return 0;
      }
      return this.edge? this.edge.getWidth() : 0;
    },
    getEdgeHeight : function(){
      if(this.sizing && !this.sizing.containEdgeSize()){
	return 0;
      }
      return this.edge? this.edge.getHeight() : 0;
    },
    getMarkupName : function(){
      return this.markup? this.markup.getName() : "";
    },
    addClass : function(klass){
      var classes = this.extraClasses || [];
      classes.push(klass);
      this.extraClasses = classes;
    },
    addChildBlock : function(child){
      this.childs.add(child);
      if(!child.isPositionAbsolute()){
	this.childExtent += child.getBoxExtent(this.flow);
      }
      this.charCount += child.getCharCount();
    },
    addParaChildBlock : function(child){
      this.childs.add(child);
      this.childExtent = Math.max(child.getBoxExtent(this.flow), this.childExtent);
      this.charCount += child.getCharCount();
    },
    setChildMeasure : function(measure){
      this.childMeasure = measure;
    },
    setInlineElements : function(elements, measure){
      this.childs.setNormal(elements);
      this.childMeasure = measure;
    },
    setCss : function(prop, value){
      this.css[prop] = value;
    },
    setType : function(type){
      this._type = type;
    },
    setId : function(id){
      this.id = id;
    },
    setParent : function(parent, inherit){
      var is_inherit = (typeof inherit != "undefined")? inherit : true;
      this.parent = parent;
      if(is_inherit){
	this.setFlow(parent.flow);
      }
    },
    setFlow : function(flow){
      if(flow.isValid()){
	this.flow = flow;
      }
    },
    setDisplay : function(display){
      this.display = display;
    },
    setContentExtent : function(flow, extent){
      this.size.setExtent(flow, extent);
    },
    setContentMeasure : function(flow, measure){
      this.size.setMeasure(flow, measure);
    },
    setEdge : function(edge){
      var sizing = this.sizing? this.sizing : BoxSizings.getByName("margin-box");
      var sub_edge = sizing.getSubEdge(edge);
      this.size.subEdge(sub_edge);
      if(this.size.isValid()){
	this.edge = edge;
      }
    },
    setMaxFontSize : function(max_font_size){
      this.maxFontSize = max_font_size;
      List.iter(this.getChilds(), function(element){
	if(element instanceof Box && element._type === "text-line"){
	  element.setMaxFontSize(max_font_size);
	}
      });
    },
    setMaxExtent : function(extent){
      this.maxExtent = extent;
      List.iter(this.getChilds(), function(element){
	if(element instanceof Box && element._type === "text-line"){
	  element.setMaxExtent(extent);
	}
      });
    },
    subMeasure : function(measure){
      this.size.subMeasure(this.flow, measure);
    },
    splitMeasure : function(count){
      var measure = this.getContentMeasure();
      var div_size = Math.round(measure / count);
      var ret = [];
      for(var i = 0; i < count; i++){
	ret.push(div_size);
      }
      return ret;
    },
    isBlock : function(){
      return !this.isTextLine();
    },
    isDisplayNone : function(){
      return this.display === "none";
    },
    isPositionAbsolute : function(){
      return this.position.isAbsolute();
    },
    isTextLine : function(){
      return this._type === "text-line";
    },
    isTextLineRoot : function(){
      return this.parent && this.parent.isBlock();
    },
    isInlineOfInline : function(){
      // when <p>aaaa<span>bbbb</span></p>,
      // <span>bbbb</span> is inline of inline.
      return this.parent && this.parent.isTextLine();
    },
    isRubyLine : function(){
      return this.isTextLine() && this.getMarkupName() === "ruby";
    },
    isLinkLine : function(){
      return this.isTextLine() && this.getMarkupName() === "a";
    },
    isPreLine : function(){
      return this.isTextLine() && this.markup && this.markup.getWhiteSpace() === "pre";
    },
    isJustifyTarget : function(){
      var name = this.getMarkupName();
      return (name !== "first-letter" &&
	      name !== "rt" &&
	      name !== "li-marker");
    },
    isTextVertical : function(){
      return this.flow.isTextVertical();
    },
    isTextHorizontal : function(){
      return this.flow.isTextHorizontal();
    },
    isValidSize : function(){
      return this.size.isValid();
    },
    canInclude : function(size){
      return this.size.canInclude(size);
    },
    clearEdge : function(){
      if(this.edge){
	this.edge.clear();
      }
    },
    clearBorderBefore : function(){
      if(this.edge){
	this.edge.clearBorderBefore(this.flow);
      }
    },
    clearBorderAfter : function(){
      if(this.edge){
	this.edge.clearBorderAfter(this.flow);
      }
    },
    shortenBox : function(flow){
      var _flow = flow || this.flow;
      this.shortenMeasure(_flow);
      this.shortenExtent(_flow);
      return this;
    },
    shortenMeasure : function(flow){
      flow = flow || this.flow;
      this.size.setMeasure(flow, this.childMeasure);
      return this;
    },
    shortenExtent : function(flow){
      flow = flow || this.flow;
      this.setContentExtent(flow, this.childExtent);
      return this;
    }
  };

  return Box;
})();
