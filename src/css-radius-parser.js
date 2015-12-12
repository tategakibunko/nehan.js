/*
 border-before-start-radius:1 ->
   (border-radius, {}, {before-start:Radius2d.parseAsValue(1)}) ->
   (border-radius, {}, {before-start:[1,1]}) ->
   (border-radius, {before-start:[1,1]})

 border-before-start-radius:[1,2] ->
   (border-radius, {}, {before-start:Radius2d.parseAsValue([1,2])}) ->
   (border-radius, {}, {before-start:[1, 2]}) ->
   (border-radius, {before-start:[1, 2]})

 border-before-start-radius:"1/2" ->
   (border-radius, {}, {before-start:Radius2d.parseAsValue("1/2")}) ->
   (border-radius, {before-start:[1,2]})

 border-radius:1 ->
   (border-radius, {}, Radius2d.parseAsSet(1)) ->
   (border-radius, {}, {before-start:[1,1], before-end:[1,1], after-end:[1,1], after-start:[1,1]}) ->
   (border-radius, {before-start:[1,1], before-end:[1,1], after-end:[1,1], after-start:[1,1]})

 border-radius:"1/2" ->
   (border-radius, {}, Radius2d.parseAsSet("1/2")) ->
   (border-radius, {before-start:[1,2], before-end:[1,2], after-end:[1,2], after-start:[1,2]})

 border-radius:"1/2 3/4" ->
   border-radius:["1/2", "3/4"] ->
   border-radius:{before-start:[1,2], before-end:[3,4], after-end:[1,2], after-start:[3,4]}
*/
/**
 @namespace Nehan.CssRadiusParser
 */
Nehan.CssRadiusParser = (function(){
  var __split_slash = function(value){
    return (value.indexOf("/") < 0)? [value] : value.split("/");
  };

  var __get_map_2d = function(len){
    return Nehan.Const.css2dIndex[Math.min(len, 2)] || [];
  };

  var __get_map_4d = function(len){
    return Nehan.Const.css4dIndex[Math.min(len, 4)] || [];
  };

  // props: [a,b,c]
  // values:[1,2,3]
  // => {a:1, b:2, c:3}
  var __zip_obj = function(props, values){
    var ret = {};
    if(props.length !== values.length){
      throw "invalid args:__zip_obj";
    }
    Nehan.List.iter(props, function(prop, i){
      ret[prop] = values[i];
    });
    return ret;
  };

  // values:[a,b]
  // map: [0,1,0,1]
  // => [values[0], values[1], values[0], values[1]]
  // => [a, b, a, b]
  var __make_values_by_map = function(values, map){
    return map.map(function(index){
      return values[index];
    });
  };

  // values:[0] => [0,0]
  // values:[0,1] => [0,1]
  var __make_values_2d = function(values){
    var map = __get_map_2d(values.length);
    return __make_values_by_map(values, map);
  };

  // values:[0] => [0,0,0,0],
  // values:[0,1] => [0,1,0,1]
  // values:[0,1,2] => [0,1,2,1]
  // values:[0,1,2,3] => [0,1,2,3]
  var __make_values_4d = function(values){
    var map = __get_map_4d(values.length);
    return __make_values_by_map(values, map);
  };

  var __make_corner_4d = function(values){
    var props = Nehan.Const.cssLogicalBoxCorners; // len = 4
    var values_4d = __make_values_4d(values); // len = 4
    return __zip_obj(props, values_4d);
  };

  var __parse_corner_4d = function(value){
    var values_2d = __make_values_2d(__split_slash(value));
    var values_4d_2d = values_2d.map(function(val){
      return __make_values_4d(Nehan.Utils.splitSpace(val));
    });
    var values = Nehan.List.zip(values_4d_2d[0], values_4d_2d[1]);
    return __make_corner_4d(values);
  };

  return {
    formatValue : function(css_prop, value){
      var direct_corner = css_prop.getAttr();
      if(direct_corner){
	return Nehan.Obj.createOne(direct_corner, this.parseUnit(value));
      }
      return this.parseSet(value);
    },
    parseUnit: function(value){
      return __make_values_2d(__split_slash(value));
    },
    parseSet: function(value){
      return __parse_corner_4d(value);
    }
  };
})();
