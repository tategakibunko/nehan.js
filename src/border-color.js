Nehan.BorderColor = (function(){
  /**
     @memberof Nehan
     @class BorderColor
     @classdesc logical border color object
     @constructor
  */
  function BorderColor(){
  }

  /**
   @memberof Nehan.BorderColor
   @method clone
   @return {Nehan.BorderColor}
   */
  BorderColor.prototype.clone = function(){
    var border_color = new BorderColor();
    Nehan.List.iter(Nehan.Const.cssPhysicalBoxDirs, function(dir){
      if(this[dir]){
	border_color[dir] = this[dir];
      }
    }.bind(this));
    return border_color;
  };
  /**
   @memberof Nehan.BorderColor
   @method setColor
   @param flow {Nehan.BoxFlow}
   @param values {Object} - color values, object or array or string available.
   @param values.before {Nehan.Color}
   @param values.end {Nehan.Color}
   @param values.after {Nehan.Color}
   @param values.start {Nehan.Color}
   */
  BorderColor.prototype.setColor = function(flow, values){
    for(var logical_prop in values){
      this[flow.getProp(logical_prop)] = new Nehan.Color(values[logical_prop]);
    }
  };
  /**
   get css object of border color

   @memberof Nehan.BorderColor
   @method getCss
   */
  BorderColor.prototype.getCss = function(){
    var css = {};
    // set border-[top|right|bottom|left]-color
    Nehan.List.iter(Nehan.Const.cssPhysicalBoxDirs, function(dir){
      if(this[dir]){
	var prop = ["border", dir, "color"].join("-");
	var color = this[dir];
	css[prop] = color.getCssValue();
      }
    }.bind(this));
    return css;
  };

  return BorderColor;
})();
