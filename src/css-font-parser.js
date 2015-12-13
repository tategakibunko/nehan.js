Nehan.CssFontParser = (function(){
  var __create_font = function(str){
    throw "sorry, shorthand of css font is not supported yet, but in my opinion, it's too wired and sucks!";
  };

  var __parse_string = function(str){
    var font = {};
    var values = Nehan.Utils.splitBySpace(str);
    return __create_font(values);
  };

  var __parse_unit = function(value){
    return value;
  };

  var __parse_set = function(value){
    if(typeof value === "object" || typeof value === "function"){
      return value;
    }
    if(typeof value === "string"){
      return __parse_string(value);
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
