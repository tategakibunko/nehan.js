// export global interfaces
Nehan.version = "5.0.2";
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
