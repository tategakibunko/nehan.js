/**
 @namespace Nehan.CssBorderRadiusParser
 */
Nehan.CssBorderRadiusParser = (function(){
  // values:[a,b]
  // indecies: [0,1,0,1]
  // => [values[0], values[1], values[0], values[1]]
  // => [a, b, a, b]
  var __map_index = function(values, indecies){
    return indecies.map(function(index){
      return values[index];
    });
  };

  // values:[0] => [0,0]
  // values:[0,1] => [0,1]
  var __extend2 = function(values){
    var indecies = Nehan.Const.css2dIndex[Math.min(values.length, 2)] || [];
    return __map_index(values, indecies);
  };

  // values:[0] => [0,0,0,0],
  // values:[0,1] => [0,1,0,1]
  // values:[0,1,2] => [0,1,2,1]
  // values:[0,1,2,3] => [0,1,2,3]
  var __extend4 = function(values){
    var indecies = Nehan.Const.css4dIndex[Math.min(values.length, 4)] || [];
    return __map_index(values, indecies);
  };

  var __obj_of_array = function(ary){
    return Nehan.List.object(Nehan.Const.cssLogicalBoxCorners, ary);
  };

  var __parse_str = function(str){
    if(str === ""){
      return {};
    }
    var xy = Nehan.Utils.splitBy(str, "/");
    var values_2d = __extend2(xy);
    var values_2x4d = values_2d.map(function(x_or_y_str){
      var x_or_y = Nehan.Utils.splitBySpace(x_or_y_str);
      return __extend4(x_or_y);
    });
    var values = Nehan.List.zip(values_2x4d[0], values_2x4d[1]);
    return __obj_of_array(values);
  };

  // [1]           -> [[1,1], [1,1], [1,1], [1,1]]
  // [1,2]         -> [[1,1], [2,2], [1,1], [2,2]]
  // [[1],[2]]     -> [[1,2], [1,2], [1,2], [1,2]]
  // [[1,2],[3,4]] -> [[1,3], [2,4], [1,3], [2,4]]
  var __parse_array = function(ary){
    if(ary.length === 0){
      return {};
    }
    // array of array
    if(ary[0] instanceof Array){
      ary = ary.map(function(a){ return a.map(function(ax){ return ax.toString(); }); });
      var v2x4d = __extend2(ary.map(__extend4));
      return __obj_of_array(Nehan.List.zip(v2x4d[0], v2x4d[1]));
    }
    ary = ary.map(function(a){ return a.toString(); });
    return __obj_of_array(__extend4(ary.map(__extend2)));
  };

  var __normalize_value = function(value){
    if(typeof value === "string"){
      return Nehan.Utils.normalizeCssValueStr(value);
    }
    return value;
  };
  
  return {
    formatValue : function(css_prop, value){
      if(css_prop.hasAttr()){
	return Nehan.Obj.createOne(css_prop.getAttr(), this.parseUnit(value));
      }
      return this.parseSet(value);
    },
    parseUnit: function(value){
      value = __normalize_value(value);
      return __extend2(Nehan.Utils.splitBy(value, "/"));
    },
    parseSet: function(value){
      value = __normalize_value(value);
      if(value instanceof Array){
	return __parse_array(value);
      }
      if(typeof value === "object"){
	return value;
      }
      if(typeof value === "string"){
	return __parse_str(value);
      }
      console.error("invalid border-radius:%o", value);
      return {};
    }
  };
})();
