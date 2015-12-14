Nehan.CssListStyleParser = (function(){
  var __parse_shorthand = function(str){
    str = Nehan.Utils.trim(str).replace(/\s+/g, " ").replace(/;/g, "");
    var list_style = {};
    var values = Nehan.Utils.splitBySpace(str);
    var arg_len = values.length;
    if(arg_len >= 1){
      list_style.type = values[0];
    }
    if(arg_len >= 2){
      list_style.image = values[1];
    }
    if(arg_len >= 3){
      list_style.position = values[2];
    }
    return list_style;
  };

  var __parse_unit = function(value){
    return value;
  };

  var __parse_set = function(value){
    if(typeof value === "object" || typeof value === "function"){
      return value;
    }
    if(typeof value === "string"){
      return __parse_shorthand(value);
    }
    console.error("invalid list-style value:%o", value);
    throw "invalid list-style value";
  };

  return {
    /**
     @memberof Nehan.CssListStyleParser
     @param css_prop {Nehan.CssProp}
     @return {Object} - css value
     */
    formatValue: function(css_prop, value){
      if(css_prop.hasAttr()){
	return Nehan.Obj.createOne(css_prop.getAttr(), __parse_unit(value));
      }
      return __parse_set(value);
    }
  };
})();
