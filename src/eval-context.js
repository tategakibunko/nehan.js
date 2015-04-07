var EvalContext = (function(){
  /**
     @memberof Nehan
     @class EvalContext
     @classdesc context object that is passed to "oncreate" callback.
     "oncreate" is called when document of target selector is converted into dom element.
     @constructor
     @param dom {HTMLElement}
     @param box {Nehan.Box}
  */
  function EvalContext(dom, box){
    this.dom = dom;
    this.box = box;
  }

  EvalContext.prototype = {
    /**
       @memberof Nehan.EvalContext
       @return {HTMLElement}
    */
    getElement : function(){
      return this.dom;
    },
    /**
       @memberof Nehan.EvalContext
       @return {int}
    */
    getRestMeasure : function(){
      return this.box.restMeasure || 0;
    },
    /**
       @memberof Nehan.EvalContext
       @return {int}
    */
    getRestExtent : function(){
      return this.box.resteExtent || 0;
    },
    /**
       @memberof Nehan.EvalContext
       @return {Nehan.Box}
    */
    getBox : function(){
      return this.box;
    },
    /**
       @memberof Nehan.EvalContext
       @return {Nehan.Box}
    */
    getParentBox : function(){
      return this.box.parent;
    },
    /**
       @memberof Nehan.EvalContext
       @return {Nehan.BoxSize}
    */
    getBoxSize : function(){
      return this.box.size;
    },
    /**
       @memberof Nehan.EvalContext
       @return {Nehan.BoxSize}
    */
    getParentBoxSize : function(){
      return this.box.parent.size;
    },
    /**
       @memberof Nehan.EvalContext
       @return {Nehan.StyleContext}
    */
    getStyleContext : function(){
      return this.box.style;
    },
    /**
       @memberof Nehan.EvalContext
       @return {Nehan.StyleContext}
    */
    getParentStyleContext : function(){
      return this.box.style.parent;
    },
    /**
       @memberof Nehan.EvalContext
       @return {Nehan.Tag}
    */
    getMarkup : function(){
      return this.getStyleContext().getMarkup();
    },
    /**
       @memberof Nehan.EvalContext
       @return {Nehan.Tag}
    */
    getParentMarkup : function(){
      return this.getParentStyleContext().getMarkup();
    },
    /**
       @memberof Nehan.EvalContext
       @return {int}
    */
    getChildCount : function(){
      return this.getStyleContext().getChildCount();
    },
    /**
       @memberof Nehan.EvalContext
       @return {int}
    */
    getParentChildCount : function(){
      return this.getParentStyleContext().getChildCount();
    },
    /**
       @memberof Nehan.EvalContext
       @return {int}
    */
    getChildIndex : function(){
      return this.getStyleContext().getChildIndex();
    },
    /**
       @memberof Nehan.EvalContext
       @return {int}
    */
    getChildIndexOfType : function(){
      return this.getStyleContext().getChildIndexOfType();
    },
    /**
       @memberof Nehan.EvalContext
       @return {bool}
    */
    isTextVertical : function(){
      return this.getStyleContext().isTextVertical();
    },
    /**
       @memberof Nehan.EvalContext
       @return {bool}
    */
    isTextHorizontal : function(){
      return this.getStyleContext().isTextHorizontal();
    },
    /**
       @memberof Nehan.EvalContext
       @return {bool}
    */
    isMarkupEmpty : function(){
      return this.getStyleContext().isMarkupEmpty();
    },
    /**
       @memberof Nehan.EvalContext
       @return {bool}
    */
    isFirstChild : function(){
      return this.getStyleContext().isFirstChild();
    },
    /**
       @memberof Nehan.EvalContext
       @return {bool}
    */
    isFirstOfType : function(){
      return this.getStyleContext().isFirstChild();
    },
    /**
       @memberof Nehan.EvalContext
       @return {bool}
    */
    isOnlyChild : function(){
      return this.getStyleContext().isFirstOfType();
    },
    /**
       @memberof Nehan.EvalContext
       @return {bool}
    */
    isOnlyOfType : function(){
      return this.getStyleContext().isOnlyOfType();
    },
    /**
       @memberof Nehan.EvalContext
       @return {bool}
    */
    isLastChild : function(){
      return this.getStyleContext().isLastChild();
    },
    /**
       @memberof Nehan.EvalContext
       @return {bool}
    */
    isLastOfType : function(){
      return this.getStyleContext().isLastOfType();
    }
  };

  return EvalContext;
})();
