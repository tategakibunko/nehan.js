var Box = (function(){
  function Box(size, parent, type){
    this._type = type || "div";
    this.childExtent = 0;
    this.size = size;
    this.childs = new BoxChild();
    this.css = {};
    this.parent = parent;
    this.charCount = 0;
  }

  Box.prototype = {
    getCss : function(){
      var css = this.css;
      Args.copy(css, this.size.getCss());
      if(this.edge){
	Args.copy(css, this.edge.getCss());
      }
      if(this.parent){
	Args.copy(css, this.parent.flow.getCss());
      }
      if(this.fontSize){
	css["font-size"] = this.fontSize + "px";
      }
      if(this.letterSpacing && !this.isTextVertical()){
	css["letter-spacing"] = this.letterSpacing + "px";
      }
      css.display = this.display || "block";
      return css;
    },
    getCharCount : function(){
      return this.charCount;
    },
    getClasses : function(){
      var classes = ["nehan-box"];
      if(this._type != "box"){
	classes.push(Css.addNehanPrefix(this._type));
      }
      return classes.concat(this.extraClasses || []);
    },
    getCssClasses : function(){
      return this.getClasses().join(" ");
    },
    getFirstChild : function(){
      return this.childs.getFirst();
    },
    getChilds : function(){
      return this.childs.get();
    },
    getChildExtent : function(){
      return this.childExtent;
    },
    getFlowName : function(){
      return this.flow.getName();
    },
    getFlipFlow : function(){
      return this.flow.getFlipFlow();
    },
    getRestContentExtent : function(){
      return this.getContentExtent() - this.getChildExtent();
    },
    getContentMeasure : function(flow){
      return this.size.getMeasure(flow || this.flow);
    },
    getContentExtent : function(flow){
      return this.size.getExtent(flow || this.flow);
    },
    getMaxTextMeasure : function(flow){
      var measure = this.getContentMeasure(flow || this.flow);
      var space = Layout.fontSize; // this is space for tail NG.

      // if marker or :first-letter(pseudo-element), tail space is zero.
      if(this._type === "li-marker" ||
	 this._type === ":first-letter"){
	return Math.max(space, measure);
      }
      return Math.max(space, measure - space);
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
    getBoxWidth : function(){
      var ret = this.size.width;
      if(this.edge){
	ret += this.edge.getWidth();
      }
      return ret;
    },
    getBoxHeight : function(){
      var ret = this.size.height;
      if(this.edge){
	ret += this.edge.getHeight();
      }
      return ret;
    },
    getBoxSize : function(){
      return new BoxSize(this.getBoxWidth(), this.getBoxHeight());
    },
    getBorder : function(){
      return this.edge? this.edge.border : null;
    },
    getRestSize : function(){
      var rest_measure = this.getContentMeasure();
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
      return this.edge? this.edge.getWidth() : 0;
    },
    getEdgeHeight : function(){
      return this.edge? this.edge.getHeight() : 0;
    },
    addClass : function(klass){
      var classes = this.extraClasses || [];
      classes.push(klass);
      this.extraClasses = classes;
    },
    addChild : function(child){
      this.childs.add(child);
      this.childExtent += child.getBoxExtent(this.flow);
      this.charCount += child.getCharCount();
    },
    addExtent : function(extent){
      this.size.addExtent(this.flow, extent);
    },
    addMeasure : function(measure){
      this.size.addMeasure(this.flow, measure);
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
    setContentExtent : function(flow, extent){
      this.size.setExtent(flow, extent);
    },
    setContentMeasure : function(flow, measure){
      this.size.setMeasure(flow, measure);
    },
    setEdgeStart : function(prop, value){
      if(this.edge){
	this.edge.setEdgeStart(prop, this.flow, value);
      }
    },
    setEdgeEnd : function(prop, value){
      if(this.edge){
	this.edge.setEdgeEnd(prop, this.flow, value);
      }
    },
    setEdgeBefore : function(prop, value){
      if(this.edge){
	this.edge.setEdgeBefore(prop, this.flow, value);
      }
    },
    setEdgeAfter : function(prop, value){
      if(this.edge){
	this.edge.setEdgeAfter(prop, this.flow, value);
      }
    },
    setEdge : function(edge){
      if(edge instanceof BoxEdge){
	this.edge = edge;
      } else if(edge._type){
	this.edge[edge._type] = edge;
      }
    },
    setEdgeBySub : function(edge){
      this.size.subEdge(edge);
      if(this.size.isValid()){
	this.setEdge(edge);
      }
    },
    subMeasure : function(measure){
      this.size.subMeasure(this.flow, measure);
    },
    splitMeasure : function(count){
      var measure = this.getContentMeasure();
      var div_size = Math.floor(measure / count);
      var ret = [];
      for(var i = 0; i < count; i++){
	ret.push(div_size);
      }
      return ret;
    },
    isEmptyChild : function(){
      return this.childs.getLength() === 0;
    },
    isTextVertical : function(){
      return this.flow.isTextVertical();
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
    mapFontSize : function(val){
      return UnitSize.mapFontSize(val, this.fontSize);
    },
    mapBoxSize : function(val){
      return UnitSize.mapBoxSize(val, this.fontSize, this.getContentMeasure());
    },
    parseEdgeSize : function(obj){
      return UnitSize.parseEdgeSize(obj, this.fontSize, this.getContentMeasure());
    },
    shortenBox : function(flow){
      var _flow = flow || this.flow;
      this.shortenMeasure(_flow);
      this.shortenExtent(_flow);
      return this;
    },
    shortenMeasure : function(flow){
      var _flow = flow || this.flow;
      var max_measure = this.getMaxChildMeasure(_flow);
      this.setContentMeasure(_flow, max_measure);
      return this;
    },
    shortenExtent : function(flow){
      var _flow = flow || this.flow;
      this.setContentExtent(_flow, this.getChildExtent());
      return this;
    }
  };

  return Box;
})();
