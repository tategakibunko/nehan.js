;var Nehan;
if(!Nehan){
  Nehan = {};
}

// glocal style
Nehan.style = {};

// global single tags
Nehan.__single_tag_names__ = [];
Nehan.__single_tag_rexes__ = [];

Nehan.setStyle = function(selector_key, value){
  var entry = Nehan.style[selector_key] || {};
  for(var prop in value){
    entry[prop] = value[prop];
  }
  Nehan.style[selector_key] = entry;
};

Nehan.setStyles = function(values){
  for(var selector_key in values){
    Nehan.setStyle(selector_key, values[selector_key]);
  }
};

Nehan.addSingleTagByName = function(tag_name){
  Nehan.__single_tag_names__.push(tag_name);
};

Nehan.addSingleTagByRex = function(rex){
  Nehan.__single_tag_rexes__.push(rex);
};

// this function return the engine module(ends at nehan-setup-end.js),
// enclosing local variable(style, layout, config, document-context etc).
// so each module returned by this function has independent environment.
// this is usefull to show multiple layout(vertical and horizontal) in a single page.
Nehan.setup = function(engine_args){
var __engine_args = engine_args || {};
