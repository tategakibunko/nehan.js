// current engine id
Nehan.engineId = Nehan.engineId || 0;

// global style
Nehan.globalStyle = Nehan.globalStyle || {};

/**
   set global style. see example at setStyle of {@link Nehan.Engine}.

   @memberof Nehan
   @param selector_key {String}
   @param value {selector_value}
*/
Nehan.setStyle = function(selector_key, value){
  var entry = Nehan.globalStyle[selector_key] || {};
  for(var prop in value){
    entry[prop] = value[prop];
  }
  Nehan.globalStyle[selector_key] = entry;
};

/**
   set global styles. see example at setStyles of {@link Nehan.Engine}.

   @memberof Nehan
   @param values {Object}
 */
Nehan.setStyles = function(values){
  for(var selector_key in values){
    Nehan.setStyle(selector_key, values[selector_key]);
  }
};

/**
 * This function ends at nehan-setup-end.js(tail part of all source code),<br>
 * to enclose local environment(Style, Display, Config, DocumentContext etc).<br>
 * So each engine has it's own environment.<br>
 * This is usefull to show multiple layout(vertical and horizontal) in a single page.<br>
 * Note that Nehan.setup is alias name of Nehan.createEngine.
 
   @namespace Nehan
   @memberof Nehan
   @method createEngine
   @param engine_args {Object}
   @param engine_args.config {Nehan.Config} - system config
   @param engine_args.display {Nehan.Display} - standard page parameters
   @param engine_args.style {Nehan.Style} - engine local style
   @return {Nehan.Engine}
*/
Nehan.createEngine = Nehan.setup = function(engine_args){
"use strict";
var __engine_args = engine_args || {};

// each time setup is called, engine id is incremented.
Nehan.engineId++;

// this function is closed by nehan-setup-end.js
