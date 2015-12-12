/**
  @namespace Nehan.CssParser
*/
Nehan.CssParser = (function(){
  var __normalize_value = function(value){
    if(typeof value === "function" || typeof value === "object"){
      return value;
    }
    return Nehan.Utils.trim(String(value))
      .replace(/\s+/, " ")
      .replace(/;/g, "")
      .replace(/\n/g, "");
  };

  return {
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
      switch(fmt_prop.getName()){
      case "oncreate":
      case "onload":
      case "onblock":
      case "ontext":
      case "online":
	return new Nehan.CssEntry(fmt_prop, value);
      case "margin":
      case "padding":
      case "border-width":
      case "border-style":
      case "border-color":
	return new Nehan.CssEntry(fmt_prop, Nehan.CssEdgeParser.formatValue(fmt_prop, value));
      case "border-radius":
	return new Nehan.CssEntry(fmt_prop, Nehan.CssCornerParser.formatValue(fmt_prop, value));
      default:
	return new Nehan.CssEntry(fmt_prop, __normalize_value(value));
      }
    }
  };
})();

