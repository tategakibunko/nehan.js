// set engine args
Args.copy(Config, __engine_args.config || {});
Args.copy2(Display, __engine_args.display || {});

Selectors.setValues(Nehan.globalStyle || {}); // set global style.
Selectors.setValues(__engine_args.style || {}); // set local style

// register global single tags
List.iter(Nehan.__single_tag_names__, LexingRule.addSingleTagByName);
List.iter(Nehan.__single_tag_rexes__, LexingRule.addSingleTagByRex);

/**
   @memberof Nehan
   @class
   @constructor
   @classdesc this is logical layout engine module, enclosing followings<br>
   * <ul>
   * <li>{@link Nehan.DocumentContext}</li>
   * <li>{@link Nehan.LexingRule}</li>
   * <li>{@link Nehan.Style}</li>
   * <li>{@link Nehan.Selectors}</li>
   * <li>{@link Nehan.Display}</li>
   * <li>{@link Nehan.Config}</li>
   * </ul>
   @param opt {Object}
   @param opt.documentContext {Nehan.DocumentContext}
   @param opt.lexingRule {Nehan.LexingRule}
   @param opt.selectors {Nehan.Selectors}
*/
function Engine(opt){
  this.documentContext = opt.documentContext;
  this.lexingRule = opt.lexingRule;
  this.selectors = opt.selectors;
}

Engine.prototype = {
  /**
     @memberof Nehan.Engine
     @param text {String} - html text
     @return {Nehan.PageStream}
  */
  createPageStream : function(text){
    return new PageStream(text);
  },
  /**<pre>
   * create outline element of "<body>",
   * if multiple body exists, only first one is returned.
   * about callback argument, see {@link Nehan.SectionTreeConverter}.
   *</pre>
     @memberof Nehan.Engine
     @param callbacks {Object} - see {@link Nehan.SectionTreeConverter}
   */
  createOutlineElement : function(callbacks){
    return this.documentContext.createBodyOutlineElement(callbacks);
  },
  /*
    get the page index where [anchor_name] is defined in from {@link Nehan.DocumentContext}.

    @memberof Nehan.Engine
    @param anchor_name {String}
  */
  getAnchorPageNo : function(anchor_name){
    return this.documentContext.getAnchorPageNo(anchor_name);
  },
  /**
     register engine local single tag by name.

     @memberof Nehan.Engine
     @param name {String}
  */
  addSingleTagByName : function(name){
    this.lexingRule.addSingleTagByName(name);
  },
  /**
     register engine local single tag by regexp object.

     @memberof Nehan.Engine
     @param rex {RegExp}
  */
  addSingleTagByRex : function(rex){
    this.lexingRule.addSingleTagRex(name);
  },
  /**
     set engine local style

     @memberof Nehan.Engine
     @example
     * engine.setStyle("p", {"font-size":"1.6em"});
  */
  setStyle : function(selector_key, value){
    this.selectors.setValue(selector_key, value);
    return this;
  },
  /**
     set engine local styles

     @memberof Nehan.Engine
     @example
     * engine.setStyles({
     *   "body":{"font-size":18},
     *   "a[href^=#]":{"background-color":"gold"}
     * });
  */
  setStyles : function(values){
    this.selectors.setValues(values);
    return this;
  }
};

return new Engine({
  documentContext:DocumentContext,
  lexingRule:LexingRule,
  selectors:Selectors
});
