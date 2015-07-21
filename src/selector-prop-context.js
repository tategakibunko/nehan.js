var SelectorPropContext = (function(){
  /**
     @memberof Nehan
     @class SelectorPropContext
     @classdesc selector context for functional value of style. see example.
     @constructor
     @param style {Nehan.StyleContext}
     @param cursor_context {Nehan.LayoutContext}
     @example
     * Nehan.setStyle("body", {
     *   // selector prop context is at callback of functional css value!
     *   width:function(selector_prop_context){
     *     return 500;
     *   }
     * });
  */
  function SelectorPropContext(style, cursor_context){
    this._style = style;
    this._cursorContext = cursor_context || null;
  }

  SelectorPropContext.prototype = {
    /**
       @memberof Nehan.SelectorPropContext
       @return {Nehan.StyleContext}
    */
    getParentStyleContext : function(){
      return this._style.parent;
    },
    /**
       @memberof Nehan.SelectorPropContext
       @return {Nehan.BoxFlow}
    */
    getParentFlow : function(){
      var parent = this.getParentStyleContext();
      return parent? parent.flow : Nehan.Display.getStdBoxFlow();
    },
    /**
       @memberof Nehan.SelectorPropContext
       @return {Nehan.Tag}
    */
    getMarkup : function(){
      return this._style.markup;
    },
    /**
     @memberof Nehan.SelectorPropContext
     @method getMarkupContent
     @return {String}
     */
    getMarkupContent : function(){
      return this.getMarkup().getContent();
    },
    /**
     @memberof Nehan.SelectorPropContext
     @method setMarkupContent
     @param content {String}
     */
    setMarkupContent : function(content){
      this.getMarkup().setContent(content);
    },
    /**
       @memberof Nehan.SelectorPropContext
       @return {int}
    */
    getRestMeasure : function(){
      return this._cursorContext? this._cursorContext.getInlineRestMeasure() : null;
    },
    /**
       @memberof Nehan.SelectorPropContext
       @return {int}
    */
    getRestExtent : function(){
      return this._cursorContext? this._cursorContext.getBlockRestExtent() : null;
    },
    /**
       index number of nth-child

       @memberof Nehan.SelectorPropContext
       @return {int}
    */
    getChildIndex : function(){
      return this._style.getChildIndex();
    },
    /**
       index number of nth-child-of-type

       @memberof Nehan.SelectorPropContext
       @return {int}
    */
    getChildIndexOfType : function(){
      return this._style.getChildIndexOfType;
    },
    /**
       @memberof Nehan.SelectorPropContext
       @return {bool}
    */
    isFirstChild : function(){
      return this._style.isFirstChild();
    },
    /**
       @memberof Nehan.SelectorPropContext
       @return {bool}
    */
    isFirstOfType : function(){
      return this._style.isFirstOfType();
    },
    /**
       @memberof Nehan.SelectorPropContext
       @return {bool}
    */
    isLastChild : function(){
      return this._style.isLastChild();
    },
    /**
       @memberof Nehan.SelectorPropContext
       @return {bool}
    */
    isLastOfType : function(){
      return this._style.isLastOfType();
    },
    /**
       @memberof Nehan.SelectorPropContext
       @return {bool}
    */
    isOnlyChild : function(){
      return this._style.isOnlyChild();
    },
    /**
       @memberof Nehan.SelectorPropContext
       @return {bool}
    */
    isOnlyOfType : function(){
      return this._style.isOnlyOfType();
    },
    /**
       @memberof Nehan.SelectorPropContext
       @return {bool}
    */
    isMarkupEmpty : function(){
      return this._style.isMarkupEmpty();
    }
  };

  return SelectorPropContext;
})();

