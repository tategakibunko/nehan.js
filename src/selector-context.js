var SelectorContext = (function(){
  function SelectorContext(style, layout_context){
    this._style = style;
    this._layoutContext = layout_context || null;
  }

  SelectorContext.prototype = {
    getParentStyle : function(){
      return this._style.parent;
    },
    getMarkup : function(){
      return this._style.markup;
    },
    getRestMeasure : function(){
      return this._layoutContext? this._layoutContext.getInlineRestMeasure() : null;
    },
    getRestExtent : function(){
      return this._layoutContext? this._layoutContext.getBlockRestExtent() : null;
    },
    getChildIndex : function(){
      return this._style.getChildIndex();
    },
    getChildIndexOfType : function(){
      return this._style.getChildIndexOfType;
    }
  };

  return SelectorContext;
})();

