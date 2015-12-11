/*
 1. basic reduction
 
 margin:"0" ->
   (margin, {}, Edge.parseAsSet("0")) ->
   (margin, {}, {before:0, end:0, after:0, start:0}) ->
   (margin, {before:0, end:0, after:0, start:0})

 margin:"0 1" ->
   (margin, {}, Edge.parseAsSet("0 1")) ->
   (margin, {}, {before:0, end:1, after:0, start:1}) ->
   (margin, {before:0, end:1, after:0, start:1})

 margin-after:"0" ->
   (margin, {}, {after:Edge.parseAsValue("0")}) ->
   (margin, {}, {after:0}) ->
   (margin, {after:0})

 border-before-start-radius:1 ->
   (border-radius, {}, {before-start:Radius2d.parseAsValue(1)}) ->
   (border-radius, {}, {before-start:[1,1]}) ->
   (border-radius, {before-start:[1,1]})

 border-before-start-radius:[1,2] ->
   (border-radius, {}, {before-start:Radius2d.parseAsValue([1,2])}) ->
   (border-radius, {}, {before-start:[1, 2]}) ->
   (border-radius, {before-start:[1, 2]})

 border-before-start-radius:"1/2" ->
   (border-radius, {}, {before-start:Radius2d.parseAsValue("1/2")}) ->
   (border-radius, {before-start:[1,2]})

 border-radius:1 ->
   (border-radius, {}, Radius2d.parseAsSet(1)) ->
   (border-radius, {}, {before-start:[1,1], before-end:[1,1], after-end:[1,1], after-start:[1,1]}) ->
   (border-radius, {before-start:[1,1], before-end:[1,1], after-end:[1,1], after-start:[1,1]})

 border-radius:"1/2" ->
   (border-radius, {}, Radius2d.parseAsSet("1/2")) ->
   (border-radius, {before-start:[1,2], before-end:[1,2], after-end:[1,2], after-start:[1,2]})

 border-radius:"1/2 3/4" ->
   border-radius:["1/2", "3/4"] ->
   border-radius:{before-start:[1,2], before-end:[3,4], after-end:[1,2], after-start:[3,4]}


 2. grammer

 type selector = (key, value)
 type value = atom | values
 type atom = int | string | float
 type values = (prop, value) list | value list
 type prop = normal_prop | part_prop

 3. func

 1. (prop, value) -> (normal_prop, value)
 2. (prop, value list) -> (prop, (prop, value) list)
*/

/**
  @namespace Nehan.CssParser
*/
Nehan.CssParser = (function(){
  var __normalize = function(value){
    return Nehan.Utils.trim(String(value))
      .replace(/;/g, "")
      .replace(/\n/g, "");
  };

  var __split_space = function(value){
    return (value.indexOf(" ") < 0)? [value] : value.split(/\s+/);
  };

  var __split_slash = function(value){
    return (value.indexOf("/") < 0)? [value] : value.split("/");
  };

  // props: [a,b,c]
  // values:[1,2,3]
  // => {a:1, b:2, c:3}
  var __zip_obj = function(props, values){
    var ret = {};
    if(props.length !== values.length){
      throw "invalid args:__zip_obj";
    }
    Nehan.List.iter(props, function(prop, i){
      ret[prop] = values[i];
    });
    return ret;
  };

  var __get_map_2d = function(len){
    return Nehan.Const.css2dIndex[Math.min(len, 2)] || [];
  };

  var __get_map_4d = function(len){
    return Nehan.Const.css4dIndex[Math.min(len, 4)] || [];
  };

  // values:[a,b]
  // map: [0,1,0,1]
  // => [values[0], values[1], values[0], values[1]]
  // => [a, b, a, b]
  var __make_values_by_map = function(values, map){
    return map.map(function(index){
      return values[index];
    });
  };

  // values:[0] => [0,0]
  // values:[0,1] => [0,1]
  var __make_values_2d = function(values){
    var map = __get_map_2d(values.length);
    return __make_values_by_map(values, map);
  };

  // values:[0] => [0,0,0,0],
  // values:[0,1] => [0,1,0,1]
  // values:[0,1,2] => [0,1,2,1]
  // values:[0,1,2,3] => [0,1,2,3]
  var __make_values_4d = function(values){
    var map = __get_map_4d(values.length);
    return __make_values_by_map(values, map);
  };

  var __make_edge_4d = function(values){
    var props = Nehan.Const.cssLogicalBoxDirs; // len = 4
    var values_4d = __make_values_4d(values); // len = 4
    return Nehan.List.zipObj(props, values_4d);
  };

  var __make_corner_4d = function(values){
    var props = Nehan.Const.cssBoxCornersLogical; // len = 4
    var values_4d = __make_values_4d(values); // len = 4
    return __zip_obj(props, values_4d);
  };

  var __parse_4d = function(value){
    return __make_edge_4d(__split_space(value));
  };

  var __parse_corner_4d = function(value){
    var values_2d = __make_values_2d(__split_slash(value));
    var values_4d_2d = values_2d.map(function(val){
      return __make_values_4d(__split_space(val));
    });
    var values = Nehan.List.zip(values_4d_2d[0], values_4d_2d[1]);
    return __make_corner_4d(values);
  };

  var __parse_border_abbr = function(value){
    var ret = [];
    var values = __split_space(value);
    var arg_len = values.length;
    if(arg_len >= 1){
      ret.push({"border-width":__parse_4d(values[0])});
    }
    return ret;
  };

  var __parse_list_style_abbr = function(value){
    var ret = [];
    var values = __split_space(value);
    var arg_len = values.length;
    if(arg_len >= 1){
      ret.push({"list-style-type":__parse_4d(values[0])});
    }
    if(arg_len >= 2){
      ret.push({"list-style-image":__parse_4d(values[1])});
    }
    if(arg_len >= 3){
      ret.push({"list-style-position":__parse_4d(values[2])});
    }
    return ret;
  };

  var __parse_font_abbr = function(value){
    return {}; // TODO
  };

  var __parse_background_abbr = function(value){
    return {}; // TODO
  };

  // all subdivided properties are evaluated as unified value.
  // for example, 'margin-before:1em' => 'margin:1em 0 0 0'.
  // so subdivided properties must be renamed to unified property('margin-before' => 'margin').
  var __normalize_prop = function(prop){
    prop = Nehan.Utils.camelToChain(prop);
    if(prop.indexOf("margin-") >= 0 || prop.indexOf("padding-") >= 0 || prop.indexOf("border-width-") >= 0){
      return prop.split("-")[0];
    }
    return prop;
  };

  var __format_value = function(prop, value){
    switch(typeof value){
    case "function": case "object": case "boolean":
      return value;
    }
    value = __normalize(value); // number, string
    switch(prop){
      /* TODO: border abbr
    case "border":
      return __parse_border_abbr(value);
      */
    case "border-width":
      return __parse_4d(value);
    case "border-radius":
      return __parse_corner_4d(value);
    case "border-color":
      return __parse_4d(value);
    case "border-style":
      return __parse_4d(value);

      /* TODO: font abbr
    case "font":
      return __parse_font_abbr(value);
      */

      /* TODO: list-style abbr
    case "list-style":
      return __parse_list_style_abbr(value);
      */
    case "margin":
      return __parse_4d(value);
    case "padding":
      return __parse_4d(value);

    // subdivided properties
    case "margin-before": case "padding-before": case "border-width-before":
      return {before:value};
    case "margin-end": case "padding-end": case "border-width-end":
      return {end:value};
    case "margin-after": case "padding-after": case "border-width-after":
      return {after:value};
    case "margin-start": case "padding-start": case "border-width-start":
      return {start:value};      

    // unmanaged properties is treated as it is.
    default: return value;
    }
  };

  return {
    /**
       @memberof Nehan.CssParser
       @param prop {String} - css property name
       @return {String} normalized property name
       @example
       * CssParser.formatProp("margin-start"); // => "margin"
    */
    formatProp : function(prop){
      return __normalize_prop(prop);
    },
    /**
       @memberof Nehan.CssParser
       @param prop {String} - css property name
       @param value - css value
       @return {Object|int|string|boolean|function}
       @example
       * CssParser.formatValue("margin-start", "1em"); // => {start:"1em"}
       * CssParser.formatValue("margin", "1em 1em 0 0"); // => {before:"1em", end:"1em", after:0, start:0}
    */
    formatValue : function(prop, value){
      return __format_value(Nehan.Utils.camelToChain(prop), value);
    }
  };
})();

