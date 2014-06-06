// this context object is passed to "onload" callback.
// unlike SelectorPropContext, this context has reference to all css values associated with the selector key.
var SelectorContext = (function(){
  function SelectorContext(style, layout_context){
    SelectorPropContext.call(this, style, layout_context);
  }
  Class.extend(SelectorContext, SelectorPropContext);

  // this function called before initializing style objects in this._style.
  // so this._style.flow is not ready at this time, that is, we need to get the 'flow' in manual.
  SelectorContext.prototype.isTextVertical = function(){
    var parent_flow = this.getParentFlow();
    var flow_name = this.getCssAttr("flow", parent_flow.getName());
    var flow = BoxFlows.getByName(flow_name);
    return (flow && flow.isTextVertical())? true : false;
  };

  SelectorContext.prototype.isTextHorizontal = function(){
    return this.isTextVertical() === false;
  };

  SelectorContext.prototype.getCssAttr = function(name, def_value){
    return this._style.getCssAttr(name, def_value);
  };

  SelectorContext.prototype.setCssAttr = function(name, value){
    this._style.setCssAttr(name, value);
  };

  return SelectorContext;
})();

