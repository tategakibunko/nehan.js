var Box = (function(){
  function Box(size, style){
    this.size = size;
    this.style = style;
    this.css = {};
  }

  Box.prototype = {
    getCssVertInlineBox : function(){
      var css = this.getCssBlock();
      css["float"] = "none";
      css["margin-left"] = css["margin-right"] = "auto";
      return css;
    },
    getContentMeasure : function(flow){
      return this.size.getMeasure(flow || this.style.flow);
    },
    getContentExtent : function(flow){
      return this.size.getExtent(flow || this.style.flow);
    },
    getContentWidth : function(){
      return this.size.width;
    },
    getContentHeight : function(){
      return this.size.height;
    },
    getBoxMeasure : function(flow){
      flow = flow || this.style.flow;
      var ret = this.getContentMeasure(flow);
      if(this.edge){
	ret += this.edge.getMeasureSize(flow);
      }
      return ret;
    },
    getBoxExtent : function(flow){
      flow = flow || this.style.flow;
      var ret = this.getContentExtent(flow);
      if(this.edge){
	ret += this.edge.getExtentSize(flow);
      }
      return ret;
    },
    clearBorderBefore : function(){
      if(this.edge){
	this.edge.clearBorderBefore(this.style.flow);
      }
    },
    clearBorderAfter : function(){
      if(this.edge){
	this.edge.clearBorderAfter(this.style.flow);
      }
    },
    debug : function(title){
      console.log("[%s](m,e) = (%d,%d), (m+,e+) = (%d,%d)", title,
		  this.getContentMeasure(), this.getContentExtent(),
		  this.getBoxMeasure(), this.getBoxExtent());
    }
  };

  return Box;
})();
