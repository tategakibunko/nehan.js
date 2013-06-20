var EdgeParser = (function(){
  var parse_array = function(array){
    switch(array.length){
    case 1:
      return {before:array[0], end:array[0], after:array[0], start:array[0]};
    case 2:
      return {before:array[0], end:array[1], after:array[0], start:array[1]};
    case 3:
      return {before:array[0], end:array[1], after:array[2], start:array[1]};
    case 4:
      return {before:array[0], end:array[1], after:array[2], start:array[3]};
    default:
      return null;
    }
  };

  var parse_object = function(obj, def_value){
    return Args.merge({}, {
      before:def_value,
      end:def_value,
      after:def_value,
      start:def_value
    }, obj);
  };

  var parse_oneliner = function(str){
    str = str.replace(/\s+/g, " ").replace(/\n/g, "").replace(/;/g, "");
    if(str.indexOf(" ") < 0){
      return parse([str]);
    }
    return parse_array(str.split(" "));
  };

  var parse = function(obj, def_value){
    if(obj instanceof Array){
      return parse_array(obj);
    }
    switch(typeof obj){
    case "object": return parse_object(obj, def_value);
    case "string": return parse_oneliner(obj); // one-liner source
    case "number": return parse_array([obj]);
    default: return null;
    }
  };

  var defaults = {
    "border-width":0,
    "margin":0,
    "padding":0,
    "border-radius":0,
    "border-style":"none",
    "border-color":"black"
  };

  return {
    normalize : function(obj, prop){
      return parse(obj, defaults[prop] || 0);
    }
  };
})();
