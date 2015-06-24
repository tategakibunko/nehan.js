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

  DomCreateContext.prototype = {
    /**
       @memberof Nehan.DomCreateContext
       @return {HTMLElement}
    */
    getElement : function(){
      return this.dom;
    },
    /**
       @memberof Nehan.DomCreateContext
       @return {int}
    */
    getRestMeasure : function(){
      return this.box.restMeasure || 0;
    },
    /**
       @memberof Nehan.DomCreateContext
       @return {int}
    */
    getRestExtent : function(){
      return this.box.resteExtent || 0;
    },
    /**
       @memberof Nehan.DomCreateContext
       @return {Nehan.Box}
    */
    getBox : function(){
      return this.box;
    },
    /**
       @memberof Nehan.DomCreateContext
       @return {Nehan.Box}
    */
    getParentBox : function(){
      return this.box.parent;
    },
    /**
       @memberof Nehan.DomCreateContext
       @return {Nehan.BoxSize}
    */
    getBoxSize : function(){
      return this.box.size;
    },
    /**
       @memberof Nehan.DomCreateContext
       @return {Nehan.BoxSize}
    */
    getParentBoxSize : function(){
      return this.box.parent.size;
    },
    /**
       @memberof Nehan.DomCreateContext
       @return {Nehan.StyleContext}
    */
    getStyleContext : function(){
      return this.box.style;
    },
    /**
       @memberof Nehan.DomCreateContext
       @return {Nehan.StyleContext}
    */
    getParentStyleContext : function(){
      return this.box.style.parent;
    },
    /**
       @memberof Nehan.DomCreateContext
       @return {Nehan.Tag}
    */
    getMarkup : function(){
      return this.getStyleContext().getMarkup();
    },
    /**
       @memberof Nehan.DomCreateContext
       @return {Nehan.Tag}
    */
    getParentMarkup : function(){
      return this.getParentStyleContext().getMarkup();
    },
    /**
       @memberof Nehan.DomCreateContext
       @return {int}
    */
    getChildCount : function(){
      return this.getStyleContext().getChildCount();
    },
    /**
       @memberof Nehan.DomCreateContext
       @return {int}
    */
    getParentChildCount : function(){
      return this.getParentStyleContext().getChildCount();
    },
    /**
       @memberof Nehan.DomCreateContext
       @return {int}
    */
    getChildIndex : function(){
      return this.getStyleContext().getChildIndex();
    },
    /**
       @memberof Nehan.DomCreateContext
       @return {int}
    */
    getChildIndexOfType : function(){
      return this.getStyleContext().getChildIndexOfType();
    },
    /**
       @memberof Nehan.DomCreateContext
       @return {bool}
    */
    isTextVertical : function(){
      return this.getStyleContext().isTextVertical();
    },
    /**
       @memberof Nehan.DomCreateContext
       @return {bool}
    */
    isTextHorizontal : function(){
      return this.getStyleContext().isTextHorizontal();
    },
    /**
       @memberof Nehan.DomCreateContext
       @return {bool}
    */
    isMarkupEmpty : function(){
      return this.getStyleContext().isMarkupEmpty();
    },
    /**
       @memberof Nehan.DomCreateContext
       @return {bool}
    */
    isFirstChild : function(){
      return this.getStyleContext().isFirstChild();
    },
    /**
       @memberof Nehan.DomCreateContext
       @return {bool}
    */
    isFirstOfType : function(){
      return this.getStyleContext().isFirstChild();
    },
    /**
       @memberof Nehan.DomCreateContext
       @return {bool}
    */
    isOnlyChild : function(){
      return this.getStyleContext().isFirstOfType();
    },
    /**
       @memberof Nehan.DomCreateContext
       @return {bool}
    */
    isOnlyOfType : function(){
      return this.getStyleContext().isOnlyOfType();
    },
    /**
       @memberof Nehan.DomCreateContext
       @return {bool}
    */
    isLastChild : function(){
      return this.getStyleContext().isLastChild();
    },
    /**
       @memberof Nehan.DomCreateContext
       @return {bool}
    */
    isLastOfType : function(){
      return this.getStyleContext().isLastOfType();
    }
  };

  return DomCreateContext;
})();
