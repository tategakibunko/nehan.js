// set engine args
Args.copy(Config, __engine_args.config || {});
Args.copy2(Display, __engine_args.display || {});

Selectors.setValues(Nehan.globalStyle || {}); // set global style.
Selectors.setValues(__engine_args.style || {}); // set local style

// register global single tags
List.iter(Nehan.__single_tag_names__, LexingRule.addSingleTagByName);
List.iter(Nehan.__single_tag_rexes__, LexingRule.addSingleTagByRex);

/**
 * engine iterfaces enclosed by local engine environment like<br>
 * <ul>
 * <li>{@link Nehan.DocumentContext}</li>
 * <li>{@link Nehan.LexingRule}</li>
 * <li>{@link Nehan.Style}</li>
 * <li>{@link Nehan.Selectors}</li>
 * <li>{@link Nehan.Display}</li>
 * <li>{@link Nehan.Config}</li>
 * </ul>
   @namespace Nehan.Engine
*/
return {
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
    return DocumentContext.createBodyOutlineElement(callbacks);
  },
  /*
    get the page index where [anchor_name] is defined in from {@link Nehan.DocumentContext}.

    @memberof Nehan.Engine
    @param anchor_name {String}
  */
  getAnchorPageNo : function(anchor_name){
    return DocumentContext.getAnchorPageNo(anchor_name);
  },
  /**
     register engine local single tag by name.

     @memberof Nehan.Engine
     @param name {String}
  */
  addSingleTagByName : function(name){
    LexingRule.addSingleTagByName(name);
  },
  /**
     register engine local single tag by regexp object.

     @memberof Nehan.Engine
     @param rex {RegExp}
  */
  addSingleTagByRex : function(rex){
    LexingRule.addSingleTagRex(name);
  },
  /**
     set engine local style

     @memberof Nehan.Engine
     @example
     * engine.setStyle("p", {"font-size":"1.6em"});
  */
  setStyle : function(selector_key, value){
    Selectors.setValue(selector_key, value);
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
    Selectors.setValues(values);
    return this;
  }
};
