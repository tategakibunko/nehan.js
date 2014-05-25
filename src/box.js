var Box = (function(){
  function Box(size, style){
    this.size = size;
    this.style = style;
    this.css = {};
  }

  var __filter_text = function(elements){
    return List.fold(elements, [], function(ret, element){
      if(element instanceof Box){
	return ret.concat(__filter_text(element.elements || []));
      }
      return ret.concat(element);
    });
  };

  Box.prototype = {
    isAnonymousLine : function(){
      return this.display === "inline" && this.style.isRootLine();
    },
    toLineString : function(){
      var texts = __filter_text(this.elements || []);
      return List.fold(texts, "", function(ret, text){
	return ret + (text? (text.data || "") : "");
      });
    },
    getClassName : function(){
      return this.classes? this.classes.join(" ") : "";
    },
    getContent : function(){
      return this.content || null;
    },
    getOnCreate : function(){
      // on create of anonymous line is already captured by parent element.
      if(this.isAnonymousLine()){
	return null;
      }
      return this.style.getCssAttr("oncreate");
    },
    getAttrs : function(){
      // attributes of anonymous line is already captured by parent element.
      if(this.isAnonymousLine()){
	return null;
      }
      return this.style.markup.attrs;
    },
    getCssRoot : function(){
      switch(this.display){
      case "block": return this.getCssBlock();
      case "inline": return this.getCssInline();
      case "inline-block": return this.getCssInlineBlock();
      }
    },
    getCssBlock : function(){
      var css = {};
      Args.copy(css, this.style.getCssBlock()); // base style
      Args.copy(css, this.size.getCss(this.style.flow)); // content size
      if(this.edge){
	Args.copy(css, this.edge.getCss());
      }
      Args.copy(css, this.css); // some dynamic values
      return css;
    },
    getCssInline : function(){
      var css = {};
      Args.copy(css, this.style.getCssInline()); // base style
      Args.copy(css, this.size.getCss(this.style.flow)); // layout size
      if(this.edge){
	Args.copy(css, this.edge.getCss());
      }
      Args.copy(css, this.css); // some dynamic values
      return css;
    },
    getCssInlineBlock : function(){
      var css = this.getCssBlock();
      if(!this.style.isFloated()){
	delete css["css-float"];
      }
      css.display = "inline-block";
      return css;
    },
    getContentMeasure : function(flow){
      flow = flow || this.style.flow;
      return this.size.getMeasure(flow);
    },
    getContentExtent : function(flow){
      flow = flow || this.style.flow;
      return this.size.getExtent(flow);
    },
    getContentWidth : function(){
      return this.size.width;
    },
    getContentHeight : function(){
      return this.size.height;
    },
    getEdgeMeasure : function(flow){
      flow = flow || this.style.flow;
      return this.edge? this.edge.getMeasureSize(flow) : 0;
    },
    getEdgeExtent : function(flow){
      flow = flow || this.style.flow;
      return this.edge? this.edge.getExtentSize(flow) : 0;
    },
    getLayoutMeasure : function(flow){
      flow = flow || this.style.flow;
      if(this.style.isPositionAbsolute()){
	return 0;
      }
      return this.getContentMeasure(flow) + this.getEdgeMeasure(flow);
    },
    getLayoutExtent : function(flow){
      flow = flow || this.style.flow;
      if(this.style.isPositionAbsolute()){
	return 0;
      }
      return this.getContentExtent(flow) + this.getEdgeExtent(flow);
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
    resizeExtent : function(flow, extent){
      this.size.setExtent(flow, extent);
      return this;
    }
  };

  return Box;
})();
