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

  var normalize = function(src){
    return src.replace(/\s+/g, " ").replace(/\n/g, "").replace(/;/g, "");
  };
  
  var parse_string = function(str){
    str = normalize(str);
    if(str.indexOf(" ") < 0){
      return parse([str]);
    }
    return parse(str.split(" "));
  };

  var parse = function(obj){
    if(obj instanceof Array){
      return parse_array(obj);
    }
    switch(typeof obj){
    case "object": return obj;
    case "string": return parse_string(obj);
    case "number": return parse_array([obj]);
    default: return null;
    }
  };
  return {
    parse : function(obj){
      return parse(obj);
    }
  };
})();
