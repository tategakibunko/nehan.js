var SelectorContext = (function(){
  /**
     @memberof Nehan
     @class SelectorContext
     @classdesc context object that is passed to "onload" callback in constructor of {Nehan.StyleContext}.<br>
     * "onload" value is set by style definition(see example).<br>
     * unlike {@link Nehan.SelectorPropContext}, this context has all reference to css values associated with the selector key of "onload" argument in style.
     @constructor
     @extends {Nehan.SelectorPropContext}
     @param style {Nehan.StyleContext}
     @param cursor_context {Nehan.CursorContext}
     @example
     * Nehan.setStyle("body", {
     *   onload:function(selector_context){
     *      // do something
     *   }
     * });
  */
  function SelectorContext(style, cursor_context){
    SelectorPropContext.call(this, style, cursor_context);
  }
  Nehan.Class.extend(SelectorContext, SelectorPropContext);

  /**
     @memberof Nehan.SelectorContext
     @method isTextVertical
     @return {boolean}
  */
  SelectorContext.prototype.isTextVertical = function(){
    // this function called before initializing style objects in this._style.
    // so this._style.flow is not ready at this time, that is, we need to get the box-flow in manual.
    var parent_flow = this.getParentFlow();
    var flow_name = this.getCssAttr("flow", parent_flow.getName());
    var flow = Nehan.BoxFlows.getByName(flow_name);
    return (flow && flow.isTextVertical())? true : false;
  };

  /**
     @memberof Nehan.SelectorContext
     @method isTextHorizontal
     @return {boolean}
  */
  SelectorContext.prototype.isTextHorizontal = function(){
    return this.isTextVertical() === false;
  };

  /**
     @memberof Nehan.SelectorContext
     @method getCssAttr
     @param name {String}
     @param def_value {default_value} - [def_value] is returned if [name] not found.
  */
  SelectorContext.prototype.getCssAttr = function(name, def_value){
    return this._style.getCssAttr(name, def_value);
  };

  /**
     @memberof Nehan.SelectorContext
     @method setCssAttr
     @param name {String}
     @param value {css_value}
  */
  SelectorContext.prototype.setCssAttr = function(name, value){
    this._style.setCssAttr(name, value);
  };

  return SelectorContext;
})();

