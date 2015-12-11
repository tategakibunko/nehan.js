Nehan.EdgeParser = (function(){

  var __parse_edge_array = function(ary){
    switch(ary.length){
    case 0:  return {};
    case 1:  return {before:ary[0], end:ary[0], after:ary[0], start:ary[0]};
    case 2:  return {before:ary[0], end:ary[1], after:ary[0], start:ary[1]};
    case 3:  return {before:ary[0], end:ary[1], after:ary[2], start:ary[1]};
    default: return {before:ary[0], end:ary[1], after:ary[2], start:ary[3]};
    }
  };

  // margin-start => margin
  var __get_normal_prop = function(prop){
    return Nehan.Const.cssLogicalBoxDirs.reduce(function(result, dir){
      return result.replace("-" + dir, "");
    }, prop);
  };

  // margin-start => start
  var __get_direct_dir = function(prop){
    return Nehan.List.find(Nehan.Const.cssLogicalBoxDirs, function(dir){
      return prop.indexOf(dir) > 0;
    }) || "";
  };

  // ("start", "1em") => {start:"1em"}
  var __init_direct_dir = function(dir, value){
    var ret = {};
    ret[dir] = value;
    return ret;
  };

  return {
    // "margin-start" => "margin"
    // "margin" => "margin"
    formatProp : function(prop){
      return __get_normal_prop(prop);
    },
    // ("margin-start", "1em") => {start:"1em"}
    // ("margin", "1em") => {before:"1em", end:"1em", after:"1em", start:"1em"}
    formatValue : function(prop, value){
      var direct_dir = __get_direct_dir(prop);
      if(direct_dir){
	return __init_direct_dir(direct_dir, this.parseUnit(value));
      }
      return this.parseSet(value);
    },
    parseUnit: function(value){
      if(typeof value === "number"){
	return String(value);
      }
      if(typeof value === "string"){
	return value;
      }
      console.error("Edge::parseUnit, invalid value:%o", value);
      throw "EdgeParser::parseUnit(invalid format)";
    },
    parseSet: function(value){
      if(value instanceof Array){
	return __parse_edge_array(value);
      }
      if(typeof value === "object"){
	return value;
      }
      if(typeof value === "string"){
	value = String(value).replace(/^\s+/, "").replace(/\s+$/, "").replace(/\s+/g, " ");
	if(value === ""){
	  return {};
	}
	if(value.indexOf(" ") < 0){
	  return __parse_edge_array([value]);
	}
	return __parse_edge_array(value.split(" "));
      }
      console.error("Edge::parseSet, invalid value:%o", value);
      throw "EdgeParser::parseSet(invalid format)";
    }
  };
})();
