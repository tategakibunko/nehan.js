// this context object is passed to "onload" callback.
// unlike SelectorPropContext, this context has reference to all css values associated with the selector key.
var SelectorContext = (function(){
  function SelectorContext(style, layout_context){
    SelectorPropContext.call(this, style, layout_context);
  }
  Class.extend(SelectorContext, SelectorPropContext);

  SelectorContext.prototype.getCssAttr = function(name, def_value){
    return this._style.getCssAttr(name, def_value);
  };

  SelectorContext.prototype.setCssAttr = function(name, value){
    this._style.setCssAttr(name, value);
  };

  return SelectorContext;
})();

