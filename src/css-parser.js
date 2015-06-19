/**
<pre>
  there are css properties that are required to calculate accurate paged-layout,
  and we call them 'managed css properties'.

  managed css properties
  ======================
  after(nehan.js local property, same as 'bottom' if lr-tb)
  before(nehan.js local property, same as 'top' if lr-tb)
  border
  border-width
  border-radius(rounded corner after/before is cleared if page is divided into multiple pages)
  box-sizing
  break-after
  break-before
  color(required to switch charactor image src for some client)
  display
  end(nehan.js local property, same as 'right' if lr-tb)
  extent(nehan.js local property)
  float
  flow(nehan.js local property)
  font
  font-size
  font-family(required to get accurate text-metrics especially latin words)
  height
  letter-spacing
  line-rate(nehan.js local property)
  list-style
  list-style-image
  list-style-position
  list-style-type
  margin
  measure(nehan.js local property)
  padding
  position
  start(nehan.js local property, same as 'left' if lr-tb)
  text-align
  text-combine
  text-emphasis-style
  white-space
  width</pre>

  @namespace Nehan.CssParser
*/
var CssParser = (function(){
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
    Nehan.List.iteri(props, function(i, prop){ ret[prop] = values[i]; });
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
    return Nehan.List.map(map, function(index){ return values[index]; });
  };

  // values:[0] => [0,0]
  // values:[0,1] => [0,1]
  var __make_values_2d = function(values){
    var map = __get_map_2d(values.length);
    return __make_values_by_map(values, map);
  };

  // values:[0] => [0,0,0,0],
  // values:[0,1] => [0, 1, 0, 1]
  // values:[0,2,3] => [0,1,2,1]
  // values:[0,1,2,3] => [0,1,2,3]
  var __make_values_4d = function(values){
    var map = __get_map_4d(values.length);
    return __make_values_by_map(values, map);
  };

  var __make_edge_4d = function(values){
    var props = Nehan.Const.cssBoxDirsLogical; // len = 4
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
    var values_4d_2d = Nehan.List.map(values_2d, function(val){
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
  var __format_prop = function(prop){
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
      return __format_prop(prop);
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
      return __format_value(prop, value);
    }
  };
})();

