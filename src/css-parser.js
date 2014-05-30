/*
  there are css properties that are required to calculate accurate paged-layout,
  and we call them 'managed css properties'.

  managed css properties
  ======================
  after(nehan.js local property, same as 'bottom' if lr-tb)
  before(nehan.js local property, same as 'top' if lr-tb)
  border
  border-width
  border-radius(rounded corner after/before is cleared if page is devided into multiple pages)
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
  width
*/
var CssParser = (function(){
  var normalize = function(value){
    return Utils.trim(String(value))
      .replace(/;/g, "")
      .replace(/\n/g, "");
  };

  var split_space = function(value){
    return (value.indexOf(" ") < 0)? [value] : value.split(/\s+/);
  };

  var split_slash = function(value){
    return (value.indexOf("/") < 0)? [value] : value.split("/");
  };

  // props: [a,b,c]
  // values:[1,2,3]
  // => {a:1, b:2, c:3}
  var zip_obj = function(props, values){
    var ret = {};
    if(props.length !== values.length){
      throw "invalid args:zip_obj";
    }
    List.iteri(props, function(i, prop){ ret[prop] = values[i]; });
    return ret;
  };

  var get_map_2d = function(len){
    return Const.css2dIndex[Math.min(len, 2)] || [];
  };

  var get_map_4d = function(len){
    return Const.css4dIndex[Math.min(len, 4)] || [];
  };

  // values:[a,b]
  // map: [0,1,0,1]
  // => [values[0], values[1], values[0], values[1]]
  // => [a, b, a, b]
  var make_values_by_map = function(values, map){
    return List.map(map, function(index){ return values[index]; });
  };

  // values:[0] => [0,0]
  // values:[0,1] => [0,1]
  var make_values_2d = function(values){
    var map = get_map_2d(values.length);
    return make_values_by_map(values, map);
  };

  // values:[0] => [0,0,0,0],
  // values:[0,1] => [0, 1, 0, 1]
  // values:[0,2,3] => [0,1,2,1]
  // values:[0,1,2,3] => [0,1,2,3]
  var make_values_4d = function(values){
    var map = get_map_4d(values.length);
    return make_values_by_map(values, map);
  };

  var make_edge_4d = function(values){
    var props = Const.cssBoxDirsLogical; // len = 4
    var values_4d = make_values_4d(values); // len = 4
    return List.zipObj(props, values_4d);
  };

  var make_corner_4d = function(values){
    var props = Const.cssBoxCornersLogical; // len = 4
    var values_4d = make_values_4d(values); // len = 4
    return zip_obj(props, values_4d);
  };

  var parse_4d = function(value){
    return make_edge_4d(split_space(value));
  };

  var parse_corner_4d = function(value){
    var values_2d = make_values_2d(split_slash(value));
    var values_4d_2d = List.map(values_2d, function(val){
      return make_values_4d(split_space(val));
    });
    var values = List.zip(values_4d_2d[0], values_4d_2d[1]);
    return make_corner_4d(values);
  };

  var parse_border_abbr = function(value){
    var ret = [];
    var values = split_space(value);
    var arg_len = values.length;
    if(arg_len >= 1){
      ret.push({"border-width":parse_4d(values[0])});
    }
    return ret;
  };

  var parse_list_style_abbr = function(value){
    var ret = [];
    var values = split_space(value);
    var arg_len = values.length;
    if(arg_len >= 1){
      ret.push({"list-style-type":parse_4d(values[0])});
    }
    if(arg_len >= 2){
      ret.push({"list-style-image":parse_4d(values[1])});
    }
    if(arg_len >= 3){
      ret.push({"list-style-position":parse_4d(values[2])});
    }
    return ret;
  };

  var parse_font_abbr = function(value){
    return {}; // TODO
  };

  var parse_background_abbr = function(value){
    return {}; // TODO
  };

  var format_prop = function(prop){
    // subdivided property is formated as unified value,
    // so property is renamed to unified one.
    if(prop.indexOf("margin-") >= 0 ||
       prop.indexOf("padding-") >= 0 ||
       prop.indexOf("border-width-") >= 0){
      return prop.split("-")[0];
    }
    return prop;
  };

  var format_value = function(prop, value){
    switch(typeof value){
    case "function": case "object": case "boolean":
      return value;
    }
    value = normalize(value); // number, string
    switch(prop){
    case "border":
      return parse_border_abbr(value);
    case "border-width":
      return parse_4d(value);
    case "border-radius":
      return parse_corner_4d(value);
    case "border-color":
      return parse_4d(value);
    case "border-style":
      return parse_4d(value);
    case "font":
      return parse_font_abbr(value);
    case "list-style":
      return parse_list_style_abbr(value);
    case "margin":
      return parse_4d(value);
    case "padding":
      return parse_4d(value);

    // subdivided properties
    case "margin-before": case "padding-before": case "border-width-before":
      return {before:value, end:0, after:0, start:0};
    case "margin-end": case "padding-end": case "border-width-end":
      return {before:0, end:value, after:0, start:0};
    case "margin-after": case "padding-after": case "border-width-after":
      return {before:0, end:0, after:value, start:0};
    case "margin-start": case "padding-start": case "border-width-start":
      return {before:0, end:0, after:0, start:value};

    // unmanaged properties is treated as it is.
    default: return value;
    }
  };

  return {
    format : function(prop, value){
      var prop = format_prop(prop);
      var value = format_value(prop, value);
      return {prop:prop, value:value};
    }
  };
})();

