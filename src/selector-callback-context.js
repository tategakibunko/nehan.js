// this context object is passed to "onload" callback.
// unlike selector-context, this context has reference to selector css,
// because 'onload' callback is called after loading selector css.
var SelectorCallbackContext = (function(){
  function SelectorCallbackContext(style, layout_context){
    SelectorContext.call(this, style, layout_context);
  }
  Class.extend(SelectorCallbackContext, SelectorContext);

  SelectorCallbackContext.prototype.getCssAttr = function(name, def_value){
    return this._style.getCssAttr(name, def_value);
  };

  SelectorCallbackContext.prototype.setCssAttr = function(name, value){
    this._style.selectorCss[name] = value;
  };

  return SelectorCallbackContext;
})();

