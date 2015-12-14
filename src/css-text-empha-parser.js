/**
 @namespace Nehan.CssTextEmphaParser
 */
Nehan.CssTextEmphaParser = (function(){
  // <'text-emphasis-style'> || <'text-emphasis-color'>
  var __parse_shorthand = function(value){
    if(value === "none"){
      return {};
    }
    var css = {}, styles = [];
    Nehan.Utils.splitBySpace(value).forEach(function(ident){
      switch(ident){
      case "filled":
      case "open":
	styles.unshift(ident);
	break;
      case "dot":
      case "circle":
      case "double-circle":
      case "triangle":
      case "sesame":
	styles.push(ident);
	break;
      default:
	if(/'.*'/.test(ident)){
	  styles = [ident]; // overwrite
	} else {
	  css.color = ident;
	}
      }
    });
    css.style = styles.join(" ");
    return css;
  };

  var __parse_position = function(value){
    var parts = Nehan.Utils.splitBySpace(value);
    switch(parts.length){
    case 0: return {hori:"over", vert:"right"};
    case 1: return {hori:parts[0], vert:"right"};
    default: return {hori:parts[0], vert:parts[1]};
    }
  };

  var __parse_unit = function(css_prop, value){
    switch(css_prop.getAttr()){
    case "position": return __parse_position(value);
    default: return value; // style, color
    }
  };

  var __parse_set = function(value){
    if(typeof value === "object"){
      return value;
    }
    if(typeof value === "string"){
      return __parse_shorthand(value);
    }
    console.error("invalid format(text-emphasis):", value);
    throw "invalid format(text-emphasis)";
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
      return __parse_set(value);
    }
  };
})();
