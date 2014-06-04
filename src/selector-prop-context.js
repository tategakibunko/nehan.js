var SelectorPropContext = (function(){
  function SelectorPropContext(style, layout_context){
    this._style = style;
    this._layoutContext = layout_context || null;
  }

  SelectorPropContext.prototype = {
    isTextVertical : function(){
      var parent_flow = this.getParentFlow();
      var flow_name = this.getCssAttr("flow", parent_flow.getName());
      var flow = BoxFlows.getByName(flow_name);
      return (flow && flow.isTextVertical())? true : false;
    },
    isTextHorizontal : function(){
      return this.isTextVertical() === false;
    },
    getParentStyle : function(){
      return this._style.parent;
    },
    getParentFlow : function(){
      var parent = this.getParentStyle();
      return parent? parent.flow : Layout.getStdBoxFlow();
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

  return SelectorPropContext;
})();

