Nehan.Box = (function(){
  /**
   @memberof Nehan
   @class Box
   @classdesc Box abstraction. Note that 'size' is treated as 'box-sizing:content-box' in evaluation phase.
   @constrctor
   @param args {Nehan.Object}
   @param args.size {Nehan.BoxSize}
   @param args.context {Nehan.RenderingContext}
   @param args.type {string}
   @param args.elements {Array.<Nehan.Box|Nehan.Tcy|Nehan.Char|Nehan.Word|Nehan.Ruby>}
   @param {Nehan.RenderingContext}
   */
  function Box(args){
    args = args || {};
    this._type = args.type || "block";
    this.size = args.size || new Nehan.BoxSize(0, 0);
    this.display = args.display || "block";
    this.context = args.context;
    this.css = args.css || {};
    this.content = (typeof args.content !== "undefined")? args.content : null;
    this.edge = args.edge || null;
    this.classes = args.classes || [];
    this.charCount = args.charCount || 0;
    this.breakAfter = args.breakAfter || false;
    this.elements = args.elements || [];
    this.pushed = args.pushed || false;
    this.pulled = args.pulled || false;
    this.elements.forEach(function(element){
      element.parent = this;
    }.bind(this));
  }

  var __filter_text = function(elements){
    return elements.reduce(function(ret, element){
      if(element instanceof Nehan.Box){
	return ret.concat(__filter_text(element.elements || []));
      }
      return element? ret.concat(element) : ret;
    }, []);
  };

  /**
   @memberof Nehan.Box
   @return {boolean}
   */
  Box.prototype.isLine = function(){
    return this._type === "line-block";
  };
  /**
   @memberof Nehan.Box
   @return {boolean}
   */
  Box.prototype.isResumableLine = function(max_measure){
    if(!this.isLine()){
      return false;
    }
    if(this.hasLineBreak){
      return false;
    }
    if(this.hyphenated){
      return false;
    }
    if(this.getCacheCount() === 0){
      return false;
    }
    if(this.context.layoutContext && this.context.layoutContext.getInlineMaxMeasure() === max_measure){
      return false;
    }
    return this.inlineMeasure < max_measure;
  };
  /**
   @memberof Nehan.Box
   @return {boolean}
   */
  Box.prototype.isVoid = function(){
    if(this.elements.length === 0){
      return true;
    }
    if(this.isInvalidSize()){
      return true;
    }
    return Nehan.List.forall(this.elements, function(element){
      return !element || (element instanceof Nehan.Box && element.isVoid());
    });
  };
  /**
   @memberof Nehan.Box
   @return {boolean}
   */
  Box.prototype.isTextBlock = function(){
    return this._type === "text-block";
  };
  /**
   @memberof Nehan.Box
   @return {boolean}
   */
  Box.prototype.isRubyText = function(){
    return this._type === "text-block" && this.context.getMarkupName() === "ruby";
  };
  /**
   @memberof Nehan.Box
   @return {boolean}
   */
  Box.prototype.isEmphaText = function(){
    return this._type === "line-block" && this.context.style.isTextEmphaEnable();
  };
  /**
   @memberof Nehan.Box
   @return {boolean}
   */
  Box.prototype.isDecoratedText = function(){
    return this.isRubyText() || this.isEmphaText();
  };
  /**
   @memberof Nehan.Box
   @return {boolean}
   */
  Box.prototype.isInvalidSize = function(){
    return (this.size.width <= 0 || this.size.height <= 0);
  };
  /**
   @memberof Nehan.Box
   @return {int}
   */
  Box.prototype.getFontSize = function(){
    return this.context.getFontSize();
  };
  /**
   @memberof Nehan.Box
   @return {int}
   */
  Box.prototype.getCacheCount = function(){
    return this.cacheCount || 0;
  };
  /**
   filter text objects.

   @memberof Nehan.Box
   @return {Array.<Nehan.Char | Nehan.Word | Nehan.Tcy | Nehan.Ruby>}
   */
  Box.prototype.getTextElements = function(){
    return __filter_text(this.elements || []);
  };
  /**
   filter text object and concat it as string, mainly used for debugging.

   @memberof Nehan.Box
   @param flow {Nehan.BoxFlow}
   @return {String}
   */
  Box.prototype.toString = function(flow){
    var texts = __filter_text(this.elements || []);
    flow = flow || this.getFlow();
    return texts.reduce(function(ret, text){
      return ret + text.toString(flow);
    }, "") || "<<empty>>";
  };
  /**
   @memberof Nehan.Box
   @return {Array.<string>}
   */
  Box.prototype.getDomClassName = function(){
    return this.classes? this.classes.map(Nehan.Css.addNehanPrefix).join(" ") : "";
  };
  /**
   @memberof Nehan.Box
   @return {string}
   */
  Box.prototype.getContent = function(){
    return this.content || null;
  };
  /**
   @memberof Nehan.Box
   @return {Function}
   */
  Box.prototype.getDomHook = function(){
    // default hook
    var oncreate = this.context.style.getCssAttr("oncreate") || null;

    // oncreate of text-block is already captured by parent line
    if(this.isTextBlock()){
      return this.context.style.getCssAttr("ontext") || null;
    }
    if(this.isLine()){
      return this.context.style.getCssAttr("online") || oncreate;
    }
    return this.context.style.getCssAttr("onblock") || oncreate;
  };
  /**
   @memberof Nehan.Box
   @return {Object}
   */
  Box.prototype.getAttrs = function(){
    // attributes of text-block is already captured by parent line
    if(this.isTextBlock()){
      return null;
    }
    return this.context.style.markup.attrs;
  };
  /**
   @memberof Nehan.Box
   @return {Object}
   */
  Box.prototype.getBoxCss = function(){
    switch(this.display){
    case "block": return this.getCssBlock();
    case "inline": return this.getCssInline();
    case "inline-block": return this.getCssInlineBlock();
    }
    console.error("undefined display:", this.display);
    //throw "Box::getBoxCss, undefined display";
    return {width:0, height:0, display:"none"};
  };
  /**
   @memberof Nehan.Box
   @return {Nehan.BoxFlow}
   */
  Box.prototype.getFlow = function(){
    return this.context.style.flow;
  };
  /**
   @memberof Nehan.Box
   @return {Object}
   */
  Box.prototype.getCssBlock = function(){
    return this.context.style.getCssBlock(this);
  };
  /**
   @memberof Nehan.Box
   @return {Object}
   */
  Box.prototype.getCssInline = function(){
    if(this.isTextBlock()){
      return this.context.style.getCssTextBlock(this);
    }
    return this.context.style.getCssLineBlock(this);
  };
  /**
   @memberof Nehan.Box
   @return {Object}
   */
  Box.prototype.getCssInlineBlock = function(){
    return this.context.style.getCssInlineBlock(this);
  };
  /**
   @memberof Nehan.Box
   @param line {Nehan.Box}
   @return {Object}
   */
  Box.prototype.getCssImage = function(line){
    return this.context.style.getCssImage(line, this);
  };
  /**
   @memberof Nehan.Box
   @param flow {Nehan.BoxFlow}
   @return {int}
   */
  Box.prototype.getContentMeasure = function(flow){
    flow = flow || this.context.style.flow;
    return this.size.getMeasure(flow);
  };
  /**
   @memberof Nehan.Box
   @param flow {Nehan.BoxFlow}
   @return {int}
   */
  Box.prototype.getContentExtent = function(flow){
    flow = flow || this.context.style.flow;
    return this.size.getExtent(flow);
  };
  /**
   @memberof Nehan.Box
   @return {int}
   */
  Box.prototype.getContentWidth = function(){
    return this.size.width;
  };
  /**
   @memberof Nehan.Box
   @return {int}
   */
  Box.prototype.getContentHeight = function(){
    return this.size.height;
  };
  /**
   @memberof Nehan.Box
   @param flow {Nehan.BoxFlow}
   @return {int}
   */
  Box.prototype.getEdgeMeasure = function(flow){
    flow = flow || this.context.style.flow;
    return this.edge? this.edge.getMeasure(flow) : 0;
  };
  /**
   @memberof Nehan.Box
   @param flow {Nehan.BoxFlow}
   @return {int}
   */
  Box.prototype.getEdgeExtent = function(flow){
    flow = flow || this.context.style.flow;
    return this.edge? this.edge.getExtent(flow) : 0;
  };
  /**
   @memberof Nehan.Box
   @param flow {Nehan.BoxFlow}
   @return {int}
   */
  Box.prototype.getLayoutMeasure = function(flow){
    flow = flow || this.context.style.flow;
    if(this.context.style.isPositionAbsolute()){
      return 0;
    }
    return this.getContentMeasure(flow) + this.getEdgeMeasure(flow);
  };
  /**
   @memberof Nehan.Box
   @param flow {Nehan.BoxFlow}
   @return {int}
   */
  Box.prototype.getLayoutExtent = function(flow){
    flow = flow || this.context.style.flow;
    if(this.context.style.isPositionAbsolute()){
      return 0;
    }
    return this.getContentExtent(flow) + this.getEdgeExtent(flow);
  };
  /**
   @memberof Nehan.Box
   @return {Nehan.Box}
   */
  Box.prototype.clearBorderBefore = function(){
    if(this.edge){
      this.edge.clearBorderBefore(this.context.style.flow);
    }
    return this;
  };
  /**
   @memberof Nehan.Box
   @return {Nehan.Box}
   */
  Box.prototype.clearBorderAfter = function(){
    if(this.edge){
      this.edge.clearBorderAfter(this.context.style.flow);
    }
    return this;
  };
  /**
   @memberof Nehan.Box
   @param flow {Nehan.BoxFlow}
   @param extent {int}
   @return {Nehan.Box}
   */
  Box.prototype.resizeExtent = function(flow, extent){
    this.size.setExtent(flow, extent);
    return this;
  };

  return Box;
})();
