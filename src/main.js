// export global interfaces
Nehan.version = "5.0.2";
Nehan.Class = Class;
Nehan.Env = Env;

// set engine args
Args.copy(Config, __engine_args.config || {});
Args.copy2(Layout, __engine_args.layout || {});
Selectors.setValues(Nehan.style || {}); // copy global style
Selectors.setValues(__engine_args.style || {}); // copy engine local style

// copy global single tags by regexp
LexingRule.addSingleTagAll(Nehan.__single_tags__);
LexingRule.addSingleTagRexAll(Nehan.__single_tags_rex__);

// export engine local interfaces
return {
  documentContext: DocumentContext,
  lexingRule : LexingRule,
  createPageStream : function(text){
    return new PageStream(text);
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
