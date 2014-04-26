// export global interfaces
Nehan.version = "5.0.1";
Nehan.Class = Class;
Nehan.Env = Env;

// set engine args
Args.copy(Config, __engine_args.config || {});
Args.copy(Layout, __engine_args.layout || {});

// export engine local interfaces
return {
  documentContext: DocumentContext,
  createPageStream : function(text, group_size){
    group_size = Math.max(1, group_size || 1);
    return (group_size <= 1)? new PageStream(text) : new PageGroupStream(text, group_size);
  },
  setStyle : function(selector_key, value){
    Selectors.setValue(selector_key, value);
    return this;
  },
  setStyles : function(values){
    for(var selector_key in values){
      Selectors.setValue(selector_key, values[selector_key]);
    }
    return this;
  }
};
