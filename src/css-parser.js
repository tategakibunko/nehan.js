/**
  @namespace Nehan.CssParser
*/
Nehan.CssParser = (function(){
  var __normalize_value = function(value){
    if(value instanceof Array){
      return value.map(__normalize_value);
    }
    if(typeof value === "function" || typeof value === "object"){
      return value;
    }
    if(typeof value === "number"){
      return value.toString();
    }
    return Nehan.Utils.normalizeCssValueStr(value);
  };

  return {
    normalizeValue : function(value){
      return __normalize_value(value);
    },
    /**
     @memberof Nehan.CssParser
     @param prop {String} - unformatted raw css property name
     @param value {Object|String|Number|Array} - unformatted raw css value
     @return {Nehan.CssEntry} - formatted css entry
     @example
     * var entry = CssParser.formatEntry("margin-start", "1em");
     * entry.getPropName(); => "margin"
     * entry.getPropAttr(); => "start"
     * entry.getValue(); => {start:"1em"}
    */
    formatEntry : function(prop, value){
      var fmt_prop = new Nehan.CssProp(prop);
      var norm_value = __normalize_value(value);
      switch(fmt_prop.getName()){
      case "oncreate":
      case "onload":
      case "onblock":
      case "ontext":
      case "online":
	return new Nehan.CssEntry(fmt_prop, norm_value);
      case "margin":
      case "padding":
      case "border-width":
      case "border-style":
      case "border-color":
	return new Nehan.CssEntry(fmt_prop, Nehan.CssEdgeParser.formatValue(fmt_prop, norm_value));
      case "border-radius":
	return new Nehan.CssEntry(fmt_prop, Nehan.CssBorderRadiusParser.formatValue(fmt_prop, norm_value));
      case "list-style":
	return new Nehan.CssEntry(fmt_prop, Nehan.CssListStyleParser.formatValue(fmt_prop, norm_value));
      default:
	return new Nehan.CssEntry(fmt_prop, norm_value);
      }
    }
  };
})();

