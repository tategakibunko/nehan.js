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

  var format = function(prop, value){
    if(typeof value === "object"){
      return value;
    }
    value = normalize(value);
    switch(prop){
    case "padding":
    case "margin":
    case "border-width":
    case "border-color":
    case "border-style":
      return parse_edge_4d(value);

    case "border-radius":
      return parse_corner_4d(value);

    case "border-before-start-radius":
    case "border-top-left-radius":
      return parse_corder_2d(value);

    case "border-before-end-radius":
    case "border-top-right-radius":
      return parse_corder_2d(value);

    case "padding-start":
    case "margin-start":
    case "border-start-width":
    case "border-start-color":
    case "border-start-style":
    case "padding-left":
    case "margin-left":
    case "border-left-width":
    case "border-left-color":
    case "border-left-style":
      return {start:value};

    case "padding-end":
    case "margin-end":
    case "border-end-width":
    case "border-end-color":
    case "border-end-style":
    case "padding-right":
    case "margin-right":
    case "border-right-width":
    case "border-right-color":
    case "border-right-style":
      return {end:value}

    case "padding-before":
    case "margin-before":
    case "border-before-width":
    case "border-before-color":
    case "border-before-style":
    case "padding-top":
    case "margin-top":
    case "border-top-width":
    case "border-top-color":
    case "border-top-style":
      return {before:value}

    case "padding-after":
    case "margin-after":
    case "border-after-width":
    case "border-after-color":
    case "border-after-style":
    case "padding-bottom":
    case "margin-bottom":
    case "border-bottom-width":
    case "border-bottom-color":
    case "border-bottom-style":
      return {after:value}

    case "border":
      return parse_border_abbr(value);

    case "list-style":
      return parse_list_style_abbr(value);

    case "font":
      return parse_font_abbr(value);

    case "background":
      return parse_background_abbr(value);

    default: return value;
    }
  };

  return {
    format : function(prop, value){
      try {
	return format(prop, value);
      } catch(e){
	//console.log(e);
	return {};
      }
    }
  };
})();

