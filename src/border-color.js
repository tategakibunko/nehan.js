var BorderColor = (function(){
  /**
     @memberof Nehan
     @class BorderColor
     @classdesc border color object
  */
  function BorderColor(){
  }

  BorderColor.prototype = {
    /**
       @memberof Nehan.BorderColor
       @method setColor
       @param flow {Nehan.Flow}
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
