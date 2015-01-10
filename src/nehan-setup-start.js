// current engine id
Nehan.engineId = 0;

// global style
Nehan.globalStyle = {};

// global single tags
Nehan.__single_tag_names__ = [];
Nehan.__single_tag_rexes__ = [];

Nehan.setStyle = function(selector_key, value){
  var entry = Nehan.globalStyle[selector_key] || {};
  for(var prop in value){
    entry[prop] = value[prop];
  }
  Nehan.globalStyle[selector_key] = entry;
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

/**
   return engine module object.

   @namespace Nehan
   @memberof Nehan
   @method setup
   @param engine_args {Object}
   @param engine_args.config {Nehan.Config} - system config
   @param engine_args.display {Nehan.Display} - standard page parameters
   @param engine_args.style {Nehan.Style} - engine local style
   @return {Object}
*/
// this function return the engine module(ends at nehan-setup-end.js),
// enclosing local environment(Style, Display, Config, DocumentContext etc).
// so each engine module has it's own environment.
// this is usefull to show multiple layout(vertical and horizontal) in a single page.
Nehan.setup = function(engine_args){
"use strict";
var __engine_args = engine_args || {};

// each time setup is called, engine id is incremented.
Nehan.engineId++;

// this function is closed by nehan-setup-end.js
