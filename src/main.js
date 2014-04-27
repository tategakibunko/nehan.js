// export global interfaces
Nehan.version = "5.0.1";
Nehan.Class = Class;
Nehan.Env = Env;

// set engine args
Args.copy(Config, __engine_args.config || {});
Args.copy2(Layout, __engine_args.layout || {});
Selectors.setValues(Nehan.style || {});
Selectors.setValues(__engine_args.style || {});

// export engine local interfaces
return {
  documentContext: DocumentContext,
  createPageStream : function(text, group_size){
    group_size = Math.max(1, group_size || 1);
    return (group_size <= 1)? new PageStream(text) : new PageGroupStream(text, group_size);
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
