;var Nehan;
if(!Nehan){
  Nehan = {};
}

// glocal style
Nehan.style = {};

// global single tag names
Nehan.__single_tags__ = [];
Nehan.__single_tags_rex__ = [];

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

Nehan.addSingleTag = function(tag_name){
  Nehan.__single_tags__.push(tag_name);
};

Nehan.addSingleTagRex = function(rex){
  Nehan.__single_tags_rex__.push(rex);
};

// this function ends at the tail of this source.
Nehan.setup = function(engine_args){
var __engine_args = engine_args || {};
