// set engine args
Args.copy(Config, __engine_args.config || {});
Args.copy2(Layout, __engine_args.layout || {});
Selectors.setValues(Nehan.style || {}); // copy global style
Selectors.setValues(__engine_args.style || {}); // copy engine local style

// register global single tags
List.iter(Nehan.__single_tag_names__, LexingRule.addSingleTagByName);
List.iter(Nehan.__single_tag_rexes__, LexingRule.addSingleTagByRex);

// export engine local interfaces
return {
  createPageStream : function(text){
    return new PageStream(text);
  },
  // create outline element of "<body>",
  // if multiple body exists, only first one is returned.
  // about callback argument, see 'src/section-tree-converter.js'.
  createOutlineElement : function(callbacks){
    return DocumentContext.createBodyOutlineElement(callbacks);
  },
  getAnchorPageNo : function(anchor_name){
    return DocumentContext.getAnchorPageNo(anchor_name);
  },
  // register engine local single tag by name
  addSingleTagByName : function(name){
    LexingRule.addSingleTagByName(name);
  },
  // register engine local single tag by rex
  addSingleTagByRex : function(rex){
    LexingRule.addSingleTagRex(name);
  },
  // set engine local style
  setStyle : function(selector_key, value){
    Selectors.setValue(selector_key, value);
    return this;
  },
  // set engine local styles
  setStyles : function(values){
    Selectors.setValues(values);
    return this;
  }
};
