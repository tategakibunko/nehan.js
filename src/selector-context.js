Nehan.SelectorContext = (function(){
  /**
   @memberof Nehan
   @class SelectorContext
   @param style {Nehan.Style}
   @param context {Nehan.RenderingContext}
   */
  function SelectorContext(style, context){
    this.style = style;
    this.layoutContext = context.layoutContext;
    this.documentContext = context.documentContext;
  }

  /**
   @memberof Nehan.SelectorContext
   @return {Nehan.Style}
   */
  SelectorContext.prototype.getParentStyle = function(){
    return this.style.parent;
  };

  /**
   @memberof Nehan.SelectorContext
   @return {Nehan.BoxFlow}
   */
  SelectorContext.prototype.getParentFlow = function(){
    var parent = this.getParentStyle();
    return parent? parent.flow : Nehan.Display.getStdBoxFlow();
  };

  /**
   @memberof Nehan.SelectorContext
   @return {Nehan.Tag}
   */
  SelectorContext.prototype.getMarkup = function(){
    return this.style.markup;
  };

  /**
   @memberof Nehan.SelectorContext
   @method getMarkupContent
   @return {String}
   */
  SelectorContext.prototype.getMarkupContent = function(){
    return this.getMarkup().getContent();
  };

  /**
   @memberof Nehan.SelectorContext
   @method getDocumentHeader
   @return {Nehan.DocumentHeader}
   */
  SelectorContext.prototype.getMarkupContent = function(){
    return this.getMarkup().getContent();
  };

  /**
   @memberof Nehan.SelectorContext
   @return {int}
   */
  SelectorContext.prototype.getRestMeasure = function(){
    return this.layoutContext? this.layoutContext.getInlineRestMeasure() : null;
  };

  /**
   @memberof Nehan.SelectorContext
   @return {int}
   */
  SelectorContext.prototype.getRestExtent = function(){
    return this.layoutContext? this.layoutContext.getBlockRestExtent() : null;
  };

  /**
   index number of nth-child

   @memberof Nehan.SelectorContext
   @return {int}
   */
  SelectorContext.prototype.getChildIndex = function(){
    return this.style.getChildIndex();
  };

  /**
   index number of nth-child-of-type

   @memberof Nehan.SelectorContext
   @return {int}
   */
  SelectorContext.prototype.getChildIndexOfType = function(){
    return this.style.getChildIndexOfType;
  };

  /**
   @memberof Nehan.SelectorContext
   @method getCssAttr
   @param name {String}
   @param def_value {default_value} - [def_value] is returned if [name] not found.
   */
  SelectorContext.prototype.getCssAttr = function(name, def_value){
    return this.style.getCssAttr(name, def_value);
  };

  /**
   @memberof Nehan.SelectorContext
   @return {bool}
   */
  SelectorContext.prototype.isFirstChild = function(){
    return this.style.isFirstChild();
  };

  /**
   @memberof Nehan.SelectorContext
   @return {bool}
   */
  SelectorContext.prototype.isFirstOfType = function(){
    return this.style.isFirstOfType();
  };

  /**
   @memberof Nehan.SelectorContext
   @return {bool}
   */
  SelectorContext.prototype.isLastChild = function(){
    return this.style.isLastChild();
  };

  /**
   @memberof Nehan.SelectorContext
   @return {bool}
   */
  SelectorContext.prototype.isLastOfType = function(){
    return this.style.isLastOfType();
  };

  /**
   @memberof Nehan.SelectorContext
   @return {bool}
   */
  SelectorContext.prototype.isOnlyChild = function(){
    return this.style.isOnlyChild();
  };

  /**
   @memberof Nehan.SelectorContext
   @return {bool}
   */
  SelectorContext.prototype.isOnlyOfType = function(){
    return this.style.isOnlyOfType();
  };

  /**
   @memberof Nehan.SelectorContext
   @return {bool}
   */
  SelectorContext.prototype.isMarkupEmpty = function(){
    return this.style.isMarkupEmpty();
  };

  /**
   @memberof Nehan.SelectorContext
   @method isTextVertical
   @return {boolean}
   */
  SelectorContext.prototype.isTextVertical = function(){
    // this function called before initializing style objects in this.style.
    // so this.style.flow is not ready at this time, that is, we need to get the box-flow in manual.
    var parent_flow = this.getParentFlow();
    var flow_name = this.getCssAttr("flow", parent_flow.getName());
    var flow = Nehan.BoxFlows.getByName(flow_name);
    return (flow && flow.isTextVertical())? true : false;
  };

  /**
   @memberof Nehan.SelectorContext
   @method isTextHorizontal
   @return {boolean}
   */
  SelectorContext.prototype.isTextHorizontal = function(){
    return this.isTextVertical() === false;
  };

  /**
   @memberof Nehan.SelectorContext
   @method setMarkupContent
   @param content {String}
   */
  SelectorContext.prototype.setMarkupContent = function(content){
    this.getMarkup().setContent(content);
  };

  /**
   @memberof Nehan.SelectorContext
   @method setCssAttr
   @param name {String}
   @param value {css_value}
   */
  SelectorContext.prototype.setCssAttr = function(name, value){
    this.style.setCssAttr(name, value);
  };

  return SelectorContext;
})();

