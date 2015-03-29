var Box = (function(){
  /**
     @memberof Nehan
     @class Box
     @classdesc box abstraction with size and style context
     @constrctor
     @param {Nehan.BoxSize} box size
     @param {Nehan.StyleContext}
  */
  function Box(size, style, type){
    this.size = size;
    this.style = style;
    this.type = type || "block";
    this.css = {};
  }

  var __filter_text = function(elements){
    return List.fold(elements, [], function(ret, element){
      if(element instanceof Box){
	return ret.concat(__filter_text(element.elements || []));
      }
      return element? ret.concat(element) : ret;
    });
  };

  Box.prototype = {
    /**
       @memberof Nehan.Box
       @return {boolean}
    */
    isAnonymousLine : function(){
      return this.display === "inline" && this.style.isRootLine();
    },
    /**
       @memberof Nehan.Box
       @return {boolean}
    */
    isLine : function(){
      return this.type === "line-block";
    },
    /**
       @memberof Nehan.Box
       @return {boolean}
    */
    isTextBlock : function(){
      return this.type === "text-block";
    },
    /**
       @memberof Nehan.Box
       @return {boolean}
    */
    isRootBlock : function(){
      return this.isRootLine || false;
    },
    /**
       filter text object and concat it as string, mainly used for debugging.

       @memberof Nehan.Box
       @return {string}
    */
    toString : function(){
      var texts = __filter_text(this.elements || []);
      return List.fold(texts, "", function(ret, text){
	var str = (text instanceof Ruby)? text.getRbString() : (text.data || "");
	return ret + str;
      });
    },
    /**
       @memberof Nehan.Box
       @return {string}
    */
    getId : function(){
      return this.id || null;
    },
    /**
       @memberof Nehan.Box
       @return {Array.<string>}
    */
    getClassName : function(){
      return this.classes? this.classes.join(" ") : "";
    },
    /**
       @memberof Nehan.Box
       @return {string}
    */
    getContent : function(){
      return this.content || null;
    },
    /**
       @memberof Nehan.Box
       @return {Function}
    */
    getOnCreate : function(){
      // on create of anonymous line is already captured by parent element.
      if(this.isAnonymousLine()){
	return null;
      }
      return this.style.getCssAttr("oncreate");
    },
    /**
       @memberof Nehan.Box
       @return {Object}
    */
    getAttrs : function(){
      // attributes of anonymous line is already captured by parent element.
      if(this.isAnonymousLine()){
	return null;
      }
      return this.style.markup.attrs;
    },
    /**
       @memberof Nehan.Box
       @return {Object}
    */
    getBoxCss : function(){
      switch(this.display){
      case "block": return this.getCssBlock();
      case "inline": return this.getCssInline();
      case "inline-block": return this.getCssInlineBlock();
      }
    },
    /**
       @memberof Nehan.Box
       @return {Object}
    */
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
    /**
       @memberof Nehan.Box
       @return {Object}
    */
    getCssInline : function(){
      var css = this.isTextBlock()? this.style.getCssTextBlock() : this.style.getCssLineBlock();
      Args.copy(css, this.size.getCss(this.style.flow)); // layout size
      if(this.edge){
	Args.copy(css, this.edge.getCss());
      }
      Args.copy(css, this.css); // some dynamic values
      return css;
    },
    /**
       @memberof Nehan.Box
       @return {Object}
    */
    getCssInlineBlock : function(){
      var css = this.getCssBlock();
      if(!this.style.isFloated()){
	delete css["css-float"];
      }
      css.display = "inline-block";
      return css;
    },
    /**
       @memberof Nehan.Box
       @param flow {Nehan.BoxFlow}
       @return {int}
    */
    getContentMeasure : function(flow){
      flow = flow || this.style.flow;
      return this.size.getMeasure(flow);
    },
    /**
       @memberof Nehan.Box
       @param flow {Nehan.BoxFlow}
       @return {int}
    */
    getContentExtent : function(flow){
      flow = flow || this.style.flow;
      return this.size.getExtent(flow);
    },
    /**
       @memberof Nehan.Box
       @return {int}
    */
    getContentWidth : function(){
      return this.size.width;
    },
    /**
       @memberof Nehan.Box
       @return {int}
    */
    getContentHeight : function(){
      return this.size.height;
    },
    /**
       @memberof Nehan.Box
       @param flow {Nehan.BoxFlow}
       @return {int}
    */
    getEdgeMeasure : function(flow){
      flow = flow || this.style.flow;
      return this.edge? this.edge.getMeasure(flow) : 0;
    },
    /**
       @memberof Nehan.Box
       @param flow {Nehan.BoxFlow}
       @return {int}
    */
    getEdgeExtent : function(flow){
      flow = flow || this.style.flow;
      return this.edge? this.edge.getExtent(flow) : 0;
    },
    /**
       @memberof Nehan.Box
       @param flow {Nehan.BoxFlow}
       @return {int}
    */
    getLayoutMeasure : function(flow){
      flow = flow || this.style.flow;
      if(this.style.isPositionAbsolute()){
	return 0;
      }
      return this.getContentMeasure(flow) + this.getEdgeMeasure(flow);
    },
    /**
       @memberof Nehan.Box
       @param flow {Nehan.BoxFlow}
       @return {int}
    */
    getLayoutExtent : function(flow){
      flow = flow || this.style.flow;
      if(this.style.isPositionAbsolute()){
	return 0;
      }
      return this.getContentExtent(flow) + this.getEdgeExtent(flow);
    },
    /**
       @memberof Nehan.Box
    */
    clearBorderBefore : function(){
      if(this.edge){
	this.edge.clearBorderBefore(this.style.flow);
      }
    },
    /**
       @memberof Nehan.Box
    */
    clearBorderAfter : function(){
      if(this.edge){
	this.edge.clearBorderAfter(this.style.flow);
      }
    },
    /**
       @memberof Nehan.Box
       @param flow {Nehan.BoxFlow}
       @param extent {int}
    */
    resizeExtent : function(flow, extent){
      this.size.setExtent(flow, extent);
      return this;
    }
  };

  return Box;
})();
