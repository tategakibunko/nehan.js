var CornerParser = (function(){
  var parse_array = function(array){
    switch(array.length){
    case 1:
      return {"start-before":array[0], "end-before":array[0], "end-after":array[0], "start-after":array[0]};
    case 2:
      return {"start-before":array[0], "end-before":array[1], "end-after":array[0], "start-after":array[1]};
    case 3:
      return {"start-before":array[0], "end-before":array[1], "end-after":array[2], "start-after":array[1]};
    case 4:
      return {"start-before":array[0], "end-before":array[1], "end-after":array[2], "start-after":array[3]};
    default:
      return null;
    }
  };

  var normalize_oneliner = function(str){
    return Utils.trim(str)
      .replace(/\s+/g, " ")
      .replace(/\n/g, "")
      .replace(/;/g, "");
  };

  var parse_value_2d = function(str){
    str = str.normalize_oneliner(str);
    if(str.indexOf(" ") < 0){
      return [str, str];
    }
    return str.split(" ");
  };

  var parse_object = function(obj, def_value){
    return Args.merge({}, {
      "start-before":def_value,
      "end-before":def_value,
      "end-after":def_value,
      "start-after":def_value
    }, obj);
  };

  var parse_oneliner_dim = function(str){
    str = normalize_oneliner(str);
    if(str.indexOf(" ") < 0){
      return [str];
    }
    return str.split(" ").slice(0, 4);
  };

  var parse_oneliner = function(str){
    if(str.indexOf("/") < 0){
      return arguments.callee([str, str].join("/"));
    }
    var hv = str.split("/");
    var h_values = parse_oneliner_dim(hv[0]);
    var v_values = parse_oneliner_dim(hv[1]);
    return parse_array(List.zip(h_values, v_values));
  };

  var parse = function(obj, def_value){
    if(obj instanceof Array){
      return parse_array(obj);
    }
    switch(typeof obj){
    case "object": return parse_object(obj, def_value);
    case "string": return parse_oneliner(obj); // one-liner source
    case "number": return parse_array([[obj, obj]]);
    default: return null;
    }
  };

  var defaults = {
    "border-radius":[0, 0]
  };

  return {
    normalize : function(obj, prop){
      return parse(obj, defaults[prop] || [0, 0]);
    }
  };
})();
