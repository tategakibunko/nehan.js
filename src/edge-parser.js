var EdgeParser = (function(){
  var parse_array = function(array){
    switch(array.length){
    case 1:
      var val = array[0];
      return {before:val, end:val, after:val, start:val};
    case 2:
      var before_after = array[0];
      var start_end = array[1];
      return {before:before_after, end:start_end, after:before_after, start:start_end};
    case 3:
      var before = array[0];
      var start_end = array[1];
      var after = array[2];
      return {before:before, end:start_end, after:after, start:start_end};
    case 4:
      var before = array[0];
      var end = array[1];
      var after = array[2];
      var start = array[3];
      return {before:before, end:end, after:after, start:start};
    default:
      return null;
    }
  };

  var normalize = function(src){
    return src.replace(/\s+/g, " ").replace(/;/g, "");
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
      return parse(src);
    }
  };
  return {
    parse : function(obj){
      return parse(obj);
    }
  };
})();
