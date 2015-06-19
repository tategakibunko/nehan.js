var BorderColor = (function(){
  /**
     @memberof Nehan
     @class BorderColor
     @classdesc logical border color object
     @constructor
  */
  function BorderColor(){
  }

  BorderColor.prototype = {
    /**
       @memberof Nehan.BorderColor
       @method clone
       @return {Nehan.BorderColor}
    */
    clone : function(){
      var border_color = new BorderColor();
      Nehan.List.iter(Nehan.Const.cssBoxDirs, function(dir){
	if(this[dir]){
	  border_color[dir] = this[dir];
	}
      }.bind(this));
      return border_color;
    },
    /**
       @memberof Nehan.BorderColor
       @method setColor
       @param flow {Nehan.BoxFlow}
       @param value {Object} - color values, object or array or string available.
       @param value.before {Nehan.Color}
       @param value.end {Nehan.Color}
       @param value.after {Nehan.Color}
       @param value.start {Nehan.Color}
    */
    setColor : function(flow, value){
      var self = this;

      // first, set as it is(obj, array, string).
      BoxRect.setValue(this, flow, value);

      // second, map as color class.
      BoxRect.iter(this, function(dir, val){
	self[dir] = new Color(val);
      });
    },
    /**
       get css object of border color

       @memberof Nehan.BorderColor
       @method getCss
    */
    getCss : function(){
      var css = {};
      BoxRect.iter(this, function(dir, color){
	var prop = ["border", dir, "color"].join("-");
	css[prop] = color.getCssValue();
      });
      return css;
    }
  };

  return BorderColor;
})();
