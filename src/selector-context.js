Nehan.SelectorContext = (function(){
  /**
   @memberof Nehan
   @class SelectorContext
   @desc context object given to functional value of style.
   note that this object is created BEFORE target style is created.
   @param prop {String} - callee property name
   @param style {Nehan.Style}
   @param context {Nehan.RenderingContext}
   */
  function SelectorContext(prop, style, parent_context){
    this.prop = new Nehan.CssProp(prop);
    this.style = style;
    this.preloads = parent_context.preloads;
    this.layoutContext = parent_context.layoutContext;
    this.documentContext = parent_context.documentContext;
  }

  /**
   @memberof Nehan.SelectorContext
   @return {int}
   */
  SelectorContext.prototype.computeRemSize = function(em){
    var base_size = this.style.getRootFont().size;
    return Math.floor(base_size * em);
  };

  /**
   @memberof Nehan.SelectorContext
   @return {int}
   */
  SelectorContext.prototype.computeEmSize = function(em){
    var base_size = this.getParentStyle().getFont().size;
    return Math.floor(base_size * em);
  };

  /**
   @memberof Nehan.SelectorContext
   @return {int}
   */
  SelectorContext.prototype.computePercentMeasure = function(percent){
    var max_size = this.getParentStyle().contentMeasure;
    return Math.floor(max_size * percent / 100);
  };

  /**
   @memberof Nehan.SelectorContext
   @return {int}
   */
  SelectorContext.prototype.computePercentExtent = function(percent){
    var max_size = this.getParentStyle().contentExtent;
    return Math.floor(max_size * percent / 100);
  };

  /**
   @memberof Nehan.SelectorContext
   */
  SelectorContext.prototype.debug = function(){
    console.log("[markup]:%s(content:%s)", this.getMarkup().getSrc(), this.getMarkupContent().substring(0,10));
    console.log("[property]:%s", this.prop.getName());
    console.log("[box-flow]:%s", this.getFlow().toString());
    console.log("[cursor]:(cur extent = %d, rest extent = %d)", this.getCurExtent(), this.getRestExtent());
    console.log("[font]:%o(parent:%o, root:%o)", this.getFont(), this.getParentFont(), this.getRootFont());
    console.log("[font size]:%d(em size:%d)", this.getFont().size, this.getParentFont().size);
    console.log("[pseudo]:child index:%d(last = %o), type index:%d(last = %o)", this.getChildIndex(), this.isLastChild(), this.getChildIndexOfType(), this.isLastOfType());
  };

  /**
   @memberof Nehan.SelectorContext
   @description see {@link Nehan.Style}::find
   @param predicate {Function} - predicate test function, {Nehan.Style} -> {bool}
   @return {Nehan.Style}
   */
  SelectorContext.prototype.find = function(predicate){
    return this.style.find(predicate);
  };

  /**
   @memberof Nehan.SelectorContext
   @return {int}
   */
  SelectorContext.prototype.getCurExtent = function(){
    return this.layoutContext.getBlockCurExtent();
  };

  /**
   @memberof Nehan.SelectorContext
   @return {int}
   */
  SelectorContext.prototype.getRestExtent = function(){
    return this.layoutContext.getBlockRestExtent();
  };

  /**
   @memberof Nehan.SelectorContext
   @return {Nehan.BoxFlow}
   */
  SelectorContext.prototype.getFlow = function(){
    // avoid infinite recursion!
    if(this.prop.getName() === "flow"){
      return this.style.parent.getFlow();
    }
    return this.style.flow || this.style._loadFlow();
  };

  /**
   @memberof Nehan.SelectorContext
   @return {Nehan.Font}
   */
  SelectorContext.prototype.getFont = function(){
    // avoid infinite recursion!
    if(this.prop.getName() === "font"){
      console.warn("can't load font from font property itself.");
      return this.style.parent.getFont(); // use parent font
    }
    return this.style.font || this.style._loadFont({forceLoad:true});
  };

  /**
   @memberof Nehan.SelectorContext
   @return {Nehan.Font}
   */
  SelectorContext.prototype.getParentFont = function(){
    return this.style.getParentFont();
  };

  /**
   @memberof Nehan.SelectorContext
   @return {Nehan.Font}
   */
  SelectorContext.prototype.getRootFont = function(){
    return this.style.getRootFont();
  };

  /**
   @memberof Nehan.SelectorContext
   @return {Nehan.Style}
   */
  SelectorContext.prototype.getParentStyle = function(){
    return this.style.parent;
  };

  /**
   @memberof Nehan.SelectorContext
   @return {Nehan.BoxFlow}
   */
  SelectorContext.prototype.getParentFlow = function(){
    var parent = this.getParentStyle();
    return parent? parent.flow : Nehan.Display.getStdBoxFlow();
  };

  /**
   @memberof Nehan.SelectorContext
   @return {Nehan.Tag}
   */
  SelectorContext.prototype.getMarkup = function(){
    return this.style.markup;
  };

  /**
   @memberof Nehan.SelectorContext
   @method getMarkupContent
   @return {String}
   */
  SelectorContext.prototype.getMarkupContent = function(){
    return this.getMarkup().getContent();
  };

  /**
   @memberof Nehan.SelectorContext
   @method getDocumentHeader
   @return {Nehan.DocumentHeader}
   */
  SelectorContext.prototype.getMarkupContent = function(){
    return this.getMarkup().getContent();
  };

  /**
   @memberof Nehan.SelectorContext
   @return {int}
   */
  SelectorContext.prototype.getRestMeasure = function(){
    return this.layoutContext? this.layoutContext.getInlineRestMeasure() : null;
  };

  /**
   @memberof Nehan.SelectorContext
   @return {int}
   */
  SelectorContext.prototype.getRestExtent = function(){
    return this.layoutContext? this.layoutContext.getBlockRestExtent() : null;
  };

  /**
   index number of nth-child

   @memberof Nehan.SelectorContext
   @return {int}
   */
  SelectorContext.prototype.getChildIndex = function(){
    return this.style.getChildIndex();
  };

  /**
   index number of nth-child-of-type

   @memberof Nehan.SelectorContext
   @return {int}
   */
  SelectorContext.prototype.getChildIndexOfType = function(){
    return this.style.getChildIndexOfType();
  };

  /**
   @memberof Nehan.SelectorContext
   @param name {String}
   @param def_value {default_value} - [def_value] is returned if [name] not found.
   */
  SelectorContext.prototype.getCssAttr = function(name, def_value){
    return this.style.getCssAttr(name, def_value);
  };

  /**
   @memberof Nehan.SelectorContext
   @return {Nehan.Tag}
   */
  SelectorContext.prototype.getPreloadResource = function(){
    var markup = this.getMarkup();
    var res_id = markup.getData("preloadId");
    return this.preloads[res_id] || null;
  };

  /**
   @memberof Nehan.SelectorContext
   @return {bool}
   */
  SelectorContext.prototype.isFirstChild = function(){
    return this.style.isFirstChild();
  };

  /**
   @memberof Nehan.SelectorContext
   @return {bool}
   */
  SelectorContext.prototype.isFirstOfType = function(){
    return this.style.isFirstOfType();
  };

  /**
   @memberof Nehan.SelectorContext
   @return {bool}
   */
  SelectorContext.prototype.isLastChild = function(){
    return this.style.isLastChild();
  };

  /**
   @memberof Nehan.SelectorContext
   @return {bool}
   */
  SelectorContext.prototype.isLastOfType = function(){
    return this.style.isLastOfType();
  };

  /**
   @memberof Nehan.SelectorContext
   @return {bool}
   */
  SelectorContext.prototype.isOnlyChild = function(){
    return this.style.isOnlyChild();
  };

  /**
   @memberof Nehan.SelectorContext
   @return {bool}
   */
  SelectorContext.prototype.isOnlyOfType = function(){
    return this.style.isOnlyOfType();
  };

  /**
   @memberof Nehan.SelectorContext
   @return {bool}
   */
  SelectorContext.prototype.isMarkupEmpty = function(){
    return this.style.isMarkupEmpty();
  };

  /**
   @memberof Nehan.SelectorContext
   @method isTextVertical
   @return {boolean}
   */
  SelectorContext.prototype.isTextVertical = function(){
    return this.getFlow().isTextVertical();
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
   @method setMarkupContent
   @param content {String}
   @return {Nehan.SelectorContext}
   */
  SelectorContext.prototype.setMarkupContent = function(content){
    this.getMarkup().setContent(content);
    return this;
  };

  /**
   @memberof Nehan.SelectorContext
   @method setCssAttr
   @param name {String}
   @param value {css_value}
   @return {Nehan.SelectorContext}
   */
  SelectorContext.prototype.setCssAttr = function(name, value){
    this.style.setCssAttr(name, value);
    return this;
  };

  return SelectorContext;
})();

