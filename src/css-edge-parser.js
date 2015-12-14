/**
 @namespace Nehan.CssEdgeParser
 */
Nehan.CssEdgeParser = (function(){
  var __parse_edge_array = function(ary){
    switch(ary.length){
    case 0:  return {};
    case 1:  return {before:ary[0], end:ary[0], after:ary[0], start:ary[0]};
    case 2:  return {before:ary[0], end:ary[1], after:ary[0], start:ary[1]};
    case 3:  return {before:ary[0], end:ary[1], after:ary[2], start:ary[1]};
    default: return {before:ary[0], end:ary[1], after:ary[2], start:ary[3]};
    }
  };

  var __parse_unit = function(value){
    if(typeof value === "number"){
      return String(value);
    }
    if(typeof value === "string"){
      return value;
    }
    if(typeof value === "function"){
      return value;
    }
    console.error("invalid edge value unit:%o", value);
    throw "invalid edge format";
  };

  var __parse_set = function(value){
    if(value instanceof Array){
      return __parse_edge_array(value);
    }
    if(typeof value === "object"){
      return value;
    }
    if(typeof value === "function"){
      return value;
    }
    if(typeof value === "number"){
      return __parse_set(value.toString());
    }
    if(typeof value === "string"){
      if(value === "" || value === " "){
	return {};
      }
      return __parse_edge_array(Nehan.Utils.splitBySpace(value));
    }
    console.error("invalid edge value shorthand:%o", value);
    throw "invalid edge format";
  };

  return {
    /**
     @memberof Nehan.CssEdgeParser
     @param css_prop {Nehan.CssProp}
     @param css_value {Object} - normalized but unformatted css value
     @return {Object} - css value
     */
    formatValue : function(css_prop, value){
      // ("margin-start", "1em") => {start:"1em"}
      if(css_prop.hasAttr()){
	return Nehan.Obj.createOne(css_prop.getAttr(), __parse_unit(value));
      }
      return __parse_set(value);
    }
  };
})();
