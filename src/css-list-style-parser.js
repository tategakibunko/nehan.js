Nehan.CssListStyleParser = (function(){
  var __parse_string = function(str){
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

  return {
    /**
     @memberof Nehan.CssListStyleParser
     @param css_prop {Nehan.CssProp}
     @return {Object} - css value
     */
    formatValue: function(css_prop, value){
      if(css_prop.hasAttr()){
	return Nehan.Obj.createOne(css_prop.getAttr(), this.parseUnit(value));
      }
      return this.parseSet(value);
    },
    parseUnit : function(value){
      return value;
    },
    parseSet: function(value){
      if(typeof value === "object"){
	return value;
      }
      return __parse_string(value);
    }
  };
})();
