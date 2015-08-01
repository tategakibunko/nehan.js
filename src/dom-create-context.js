var DomCreateContext = (function(){
  /**
     @memberof Nehan
     @class DomCreateContext
     @classdesc context object that is passed to "oncreate" callback.
     "oncreate" is called when document of target selector is converted into dom element.
     @constructor
     @param dom {HTMLElement}
     @param box {Nehan.Box}
  */
  function DomCreateContext(dom, box){
    this.dom = dom;
    this.box = box;
  }

  /**
   @memberof Nehan.DomCreateContext
   @return {HTMLElement}
   */
  DomCreateContext.prototype.getElement = function(){
    return this.dom;
  };
  /**
   @memberof Nehan.DomCreateContext
   @return {int}
   */
  DomCreateContext.prototype.getRestMeasure = function(){
    return this.box.restMeasure || 0;
  };
  /**
   @memberof Nehan.DomCreateContext
   @return {int}
   */
  DomCreateContext.prototype.getRestExtent = function(){
    return this.box.resteExtent || 0;
  };
  /**
   @memberof Nehan.DomCreateContext
   @return {Nehan.Box}
   */
  DomCreateContext.prototype.getBox = function(){
    return this.box;
  };
  /**
   @memberof Nehan.DomCreateContext
   @return {Nehan.Box}
   */
  DomCreateContext.prototype.getParentBox = function(){
    return this.box.parent;
  };
  /**
   @memberof Nehan.DomCreateContext
   @return {Nehan.BoxSize}
   */
  DomCreateContext.prototype.getBoxSize = function(){
    return this.box.size;
  };
  /**
   @memberof Nehan.DomCreateContext
   @return {Nehan.BoxSize}
   */
  DomCreateContext.prototype.getParentBoxSize = function(){
    return this.box.parent.size;
  };
  /**
   @memberof Nehan.DomCreateContext
   @return {Nehan.StyleContext}
   */
  DomCreateContext.prototype.getStyleContext = function(){
    return this.box.style;
  };
  /**
   @memberof Nehan.DomCreateContext
   @return {Nehan.StyleContext}
   */
  DomCreateContext.prototype.getParentStyleContext = function(){
    return this.box.style.parent;
  };
  /**
   @memberof Nehan.DomCreateContext
   @return {Nehan.Tag}
   */
  DomCreateContext.prototype.getMarkup = function(){
    return this.getStyleContext().getMarkup();
  };
  /**
   @memberof Nehan.DomCreateContext
   @return {Nehan.Tag}
   */
  DomCreateContext.prototype.getParentMarkup = function(){
    return this.getParentStyleContext().getMarkup();
  };
  /**
   @memberof Nehan.DomCreateContext
   @return {int}
   */
  DomCreateContext.prototype.getChildCount = function(){
    return this.getStyleContext().getChildCount();
  };
  /**
   @memberof Nehan.DomCreateContext
   @return {int}
   */
  DomCreateContext.prototype.getParentChildCount = function(){
    return this.getParentStyleContext().getChildCount();
  };
  /**
   @memberof Nehan.DomCreateContext
   @return {int}
   */
  DomCreateContext.prototype.getChildIndex = function(){
    return this.getStyleContext().getChildIndex();
  };
  /**
   @memberof Nehan.DomCreateContext
   @return {int}
   */
  DomCreateContext.prototype.getChildIndexOfType = function(){
    return this.getStyleContext().getChildIndexOfType();
  };
  /**
   @memberof Nehan.DomCreateContext
   @return {bool}
   */
  DomCreateContext.prototype.isTextVertical = function(){
    return this.getStyleContext().isTextVertical();
  };
  /**
   @memberof Nehan.DomCreateContext
   @return {bool}
   */
  DomCreateContext.prototype.isTextHorizontal = function(){
    return this.getStyleContext().isTextHorizontal();
  };
  /**
   @memberof Nehan.DomCreateContext
   @return {bool}
   */
  DomCreateContext.prototype.isMarkupEmpty = function(){
    return this.getStyleContext().isMarkupEmpty();
  };
  /**
   @memberof Nehan.DomCreateContext
   @return {bool}
   */
  DomCreateContext.prototype.isFirstChild = function(){
    return this.getStyleContext().isFirstChild();
  };
  /**
   @memberof Nehan.DomCreateContext
   @return {bool}
   */
  DomCreateContext.prototype.isFirstOfType = function(){
    return this.getStyleContext().isFirstChild();
  };
  /**
   @memberof Nehan.DomCreateContext
   @return {bool}
   */
  DomCreateContext.prototype.isOnlyChild = function(){
    return this.getStyleContext().isFirstOfType();
  };
  /**
   @memberof Nehan.DomCreateContext
   @return {bool}
   */
  DomCreateContext.prototype.isOnlyOfType = function(){
    return this.getStyleContext().isOnlyOfType();
  };
  /**
   @memberof Nehan.DomCreateContext
   @return {bool}
   */
  DomCreateContext.prototype.isLastChild = function(){
    return this.getStyleContext().isLastChild();
  };
  /**
   @memberof Nehan.DomCreateContext
   @return {bool}
   */
  DomCreateContext.prototype.isLastOfType = function(){
    return this.getStyleContext().isLastOfType();
  };

  return DomCreateContext;
})();
