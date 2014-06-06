// this context object is passed to "onload" callback.
// unlike SelectorPropContext, this context has reference to all css values associated with the selector key.
var SelectorContext = (function(){
  function SelectorContext(style, layout_context){
    SelectorPropContext.call(this, style, layout_context);
  }
  Class.extend(SelectorContext, SelectorPropContext);

  SelectorContext.prototype.getCssAttr = function(name, def_value){
    // TODO: define public interface to StyleContext
    return this._style.getCssAttr(name, def_value);
  };

  SelectorContext.prototype.setCssAttr = function(name, value){
    // TODO: define public interface to StyleContext
    this._style.managedCss.add(name, value);
  };

  return SelectorContext;
})();

