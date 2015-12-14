Nehan.CssFontParser = (function(){
  var __parse_size_and_height = function(value){
    var css = {};
    var parts = Nehan.Utils.splitBy(value, "/");
    switch(parts.length){
    case 1:
      css["size"] = parts[0];
      break;
    case 2:
      css["size"] = parts[0];
      css["line-height"] = parts[1];
      break;
    }
    return css;
  };

  // [font-style] [font-variant] [font-weight] [font-size]/[line-height] [font-family];
  /*
   font: 14px Georgia, serif;
   font: 14px/1.4 Georgia, serif;
   font: italic lighter 14px/1.4 Georgia, serif;
   font: italic small-caps lighter 14px/1.4 Georgia, serif;
  */
  var __parse_shorthand = function(str){
    var font = {};
    Nehan.Utils.splitBySpace(str).forEach(function(value, index){
      if(value.indexOf("/") >= 0){
	Nehan.Obj.copy(font, __parse_size_and_height(value));
	return;
      }
      switch(value){
      case "normal": break; // (style, variant, weight)
      case "inherit": break; // (style, variant, weight)
      case "initial": break; // (style, variant, weight)
      case "italic":
      case "oblique":
	font.style = value;
	break;
      case "small-caps":
	font.variant = value;
	break;
      case "bold":
      case "bolder":
      case "lighter":
	font.weight = value;
	break;
      case "caption":
      case "icon":
      case "menu":
      case "message-box":
      case "small-caption":
      case "status-bar":
	break; // ignore
      default: // <font-family> or <number:font-weight>
	// weight is already define, or [px, pt, em, rem, %] are included.
	if(!font.size && (value.indexOf("px") >= 0 || value.indexOf("pt") >= 0 || value.indexOf("em") >= 0 || value.indexOf("%") >= 0)){
	  font.size = value;
	} else if(Nehan.Utils.isNumber(value)){
	  font.weight = value;
	} else {
	  font.family = value;
	}
	break;
      }
    });
    return font;
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
    console.error("invalid font value:%o", value);
    throw "invalid font value";
  };

  return {
    /**
     @memberof Nehan.CssFontParser
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
