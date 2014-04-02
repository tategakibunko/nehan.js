Nehan.version = "4.0.11";

Args.copy(Env, __engine_args.env || {});
Args.copy(Layout, __engine_args.layout || {});
Args.copy(Config, __engine_args.config || {});

var __exports = {};

__exports.createPageStream = function(text, group_size){
  group_size = Math.max(1, group_size || 1);
  return (group_size === 1)? (new PageStream(text)) : (new PageGroupStream(text, group_size));
};
__exports.getStyle = function(selector_key){
  return Selectors.getValue(selector_key);
};
__exports.setStyle = function(selector_key, value){
  Selectors.setValue(selector_key, value);
  return this;
};
__exports.setStyles = function(values){
  for(var selector_key in values){
    Selectors.setValue(selector_key, values[selector_key]);
  }
  return this;
};

__exports.LayoutTest = LayoutTest;

return __exports;
