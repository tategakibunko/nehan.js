var BorderStyle = (function(){
  function BorderStyle(){
  }

  BorderStyle.prototype = {
    setStyle : function(flow, value){
      BoxRect.setValue(this, flow, value);
    },
    getCss : function(){
      var css = {};
      BoxRect.iter(this, function(dir, style){
	var prop = ["border", dir, "style"].join("-");
	css[prop] = style;
      });
      return css;
    }
  };

  return BorderStyle;
})();
