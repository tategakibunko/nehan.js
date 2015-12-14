Nehan.CssTextEmphaParser = (function(){
  var __parse_shorthand = function(value){
    console.warn("sorry, shorthand of text-emphasis is not supported yet!");
    return {
      style:value
    };
  };

  var __parse_unit = function(css_prop, value){
    switch(css_prop.getName()){
    case "position": return __parse_position(value);
    default: return value; // style, color
    }
  };

  var __parse_position = function(value){
    var parts = Nehan.Utils.splitBySpace(value);
    switch(parts.length){
    case 0: return {hori:"over", vert:"right"};
    case 1: return {hori:parts[0], vert:"right"};
    default: return {hori:parts[0], vert:parts[1]};
    }
  };

  return {
    /**
     @memberof Nehan.CssTextEmphaParser
     @param css_prop {Nehan.CssProp}
     @param css_value {Object} - normalized but unformatted css value
     @return {Object} - css value
     */
    formatValue : function(css_prop, value){
      if(css_prop.hasAttr()){
	return Nehan.Obj.createOne(css_prop.getAttr(), __parse_unit(css_prop, value));
      }
      return __parse_shorthand(value);
    }
  };
})();
