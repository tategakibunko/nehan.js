/*
  supported css properties
  ==============================

  background-color
  background-image
  background-repeat
  background-position
  border
  border-color
  border-radius
  border-style
  border-width
  box-sizing
  color
  display
  font-family
  font-size
  font-style
  font-weight
  float
  flow(nehan sepcial property)
  line-rate(nehan special property)
  list-style
  list-style-image
  list-style-position
  list-style-type
  margin
  padding
  text-align
  text-combine(horizontal only)
  text-emphasis-style
  white-space
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
    return zip_obj(props, values_4d);
  };

  var make_corner_4d = function(values){
    var props = Const.cssBoxCornersLogical; // len = 4
    var values_4d = make_values_4d(values); // len = 4
    return zip_obj(props, values_4d);
  };

  var parse_edge_4d = function(value){
    return make_edge_4d(split_space(value));
  };

  var parse_corner_2d = function(value){
    return make_values_2d(split_space(value));
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
      ret.push({"border-width":parse_edge_4d(values[0])});
    }
    if(arg_len >= 2){
      ret.push({"border-style":parse_edge_4d(values[1])});
    }
    if(arg_len >= 3){
      ret.push({"border-color":parse_edge_4d(values[2])});
    }
    return ret;
  };

  var parse_list_style_abbr = function(value){
    var ret = [];
    var values = split_space(value);
    var arg_len = values.length;
    if(arg_len >= 1){
      ret.push({"list-style-type":parse_edge_4d(values[0])});
    }
    if(arg_len >= 2){
      ret.push({"list-style-image":parse_edge_4d(values[1])});
    }
    if(arg_len >= 3){
      ret.push({"list-style-position":parse_edge_4d(values[2])});
    }
    return ret;
  };

  var parse_font_abbr = function(value){
    return {}; // TODO
  };

  var parse_background_abbr = function(value){
    return {}; // TODO
  };

  var parse_background_pos = function(value){
    var values = split_space(value);
    var arg_len = values.length;
    if(arg_len === 1){ // 1
      return {
	inline:{pos:values[0], offset:0},
	block:{pos:"center", offset:0}
      };
    } else if(2 <= arg_len && arg_len < 4){ // 2, 3
      return {
	inline:{pos:values[0], offset:0},
	block:{pos:values[1], offset:0}
      };
    } else if(arg_len >= 4){ // 4 ...
      return {
	inline:{pos:values[0], offset:values[1]},
	block:{pos:values[2], offset:values[3]}
      };
    }
    return null;
  };

  var parse_background_repeat = function(value){
    var values = split_space(value);
    var arg_len = values.length;
    if(arg_len === 1){
      return {inline:values[0], block:values[0]};
    } else if(arg_len >= 2){
      return {inline:values[0], block:values[1]};
    }
    return null;
  };

  var format = function(prop, value){
    switch(typeof value){
    case "function": case "object": case "boolean":
      return value;
    }
    value = normalize(value); // number, string
    switch(prop){
    case "background":
      return parse_background_abbr(value);
    case "background-position":
      return parse_background_pos(value);
    case "background-repeat":
      return parse_background_repeat(value);
    case "border":
      return parse_border_abbr(value);
    case "border-color":
      return parse_edge_4d(value);
    case "border-radius":
      return parse_corner_4d(value);
    case "border-style":
      return parse_edge_4d(value);
    case "border-width":
      return parse_edge_4d(value);
    case "font":
      return parse_font_abbr(value);
    case "list-style":
      return parse_list_style_abbr(value);
    case "margin":
      return parse_edge_4d(value);
    case "padding":
      return parse_edge_4d(value);
    default: return value;
    }
  };

  return {
    format : function(prop, value){
      try {
	return format(prop, value);
      } catch(e){
	return {};
      }
    }
  };
})();

