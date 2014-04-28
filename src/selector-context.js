var SelectorContext = (function(){
  function SelectorContext(style, layout_context){
    this._style = style;
    this._layoutContext = layout_context || null;
  }

  SelectorContext.prototype = {
    setMarkupContent : function(content){
      this._style.markup.content = content;
    },
    getParentStyle : function(){
      return this._style.parent;
    },
    getMarkupContent : function(){
      return this._style.getMarkupContent();
    },
    getMarkupAttr : function(name, def_value){
      return this._style.getMarkupAttr(name, def_value);
    },
    getMarkupDataset : function(name, def_value){
      return this._style.getMarkupDataset(name, def_value);
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

