Nehan.DomCreateContext = (function(){
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
   @return {Nehan.Style}
   */
  DomCreateContext.prototype.getStyle = function(){
    return this.box.style;
  };
  /**
   @memberof Nehan.DomCreateContext
   @return {Nehan.Style}
   */
  DomCreateContext.prototype.getParentStyle = function(){
    return this.box.style.parent;
  };
  /**
   @memberof Nehan.DomCreateContext
   @return {Nehan.Tag}
   */
  DomCreateContext.prototype.getMarkup = function(){
    return this.getStyle().getMarkup();
  };
  /**
   @memberof Nehan.DomCreateContext
   @return {Nehan.Tag}
   */
  DomCreateContext.prototype.getParentMarkup = function(){
    return this.getParentStyle().getMarkup();
  };
  /**
   @memberof Nehan.DomCreateContext
   @return {int}
   */
  DomCreateContext.prototype.getChildCount = function(){
    return this.getStyle().getChildCount();
  };
  /**
   @memberof Nehan.DomCreateContext
   @return {int}
   */
  DomCreateContext.prototype.getParentChildCount = function(){
    return this.getParentStyle().getChildCount();
  };
  /**
   @memberof Nehan.DomCreateContext
   @return {int}
   */
  DomCreateContext.prototype.getChildIndex = function(){
    return this.getStyle().getChildIndex();
  };
  /**
   @memberof Nehan.DomCreateContext
   @return {int}
   */
  DomCreateContext.prototype.getChildIndexOfType = function(){
    return this.getStyle().getChildIndexOfType();
  };
  /**
   @memberof Nehan.DomCreateContext
   @return {bool}
   */
  DomCreateContext.prototype.isTextVertical = function(){
    return this.getStyle().isTextVertical();
  };
  /**
   @memberof Nehan.DomCreateContext
   @return {bool}
   */
  DomCreateContext.prototype.isTextHorizontal = function(){
    return this.getStyle().isTextHorizontal();
  };
  /**
   @memberof Nehan.DomCreateContext
   @return {bool}
   */
  DomCreateContext.prototype.isMarkupEmpty = function(){
    return this.getStyle().isMarkupEmpty();
  };
  /**
   @memberof Nehan.DomCreateContext
   @return {bool}
   */
  DomCreateContext.prototype.isFirstChild = function(){
    return this.getStyle().isFirstChild();
  };
  /**
   @memberof Nehan.DomCreateContext
   @return {bool}
   */
  DomCreateContext.prototype.isFirstOfType = function(){
    return this.getStyle().isFirstChild();
  };
  /**
   @memberof Nehan.DomCreateContext
   @return {bool}
   */
  DomCreateContext.prototype.isOnlyChild = function(){
    return this.getStyle().isFirstOfType();
  };
  /**
   @memberof Nehan.DomCreateContext
   @return {bool}
   */
  DomCreateContext.prototype.isOnlyOfType = function(){
    return this.getStyle().isOnlyOfType();
  };
  /**
   @memberof Nehan.DomCreateContext
   @return {bool}
   */
  DomCreateContext.prototype.isLastChild = function(){
    return this.getStyle().isLastChild();
  };
  /**
   @memberof Nehan.DomCreateContext
   @return {bool}
   */
  DomCreateContext.prototype.isLastOfType = function(){
    return this.getStyle().isLastOfType();
  };

  return DomCreateContext;
})();
