Nehan.BorderStyle = (function(){
  /**
     @memberof Nehan
     @class BorderStyle
     @classdesc logical border style object
     @constructor
  */
  function BorderStyle(){
  }

  /**
   @memberof Nehan.BorderStyle
   @method clone
   @return {Nehan.BorderStyle}
   */
  BorderStyle.prototype.clone = function(){
    var style = new BorderStyle();
    Nehan.List.iter(Nehan.Const.cssPhysicalBoxDirs, function(dir){
      if(this[dir]){
	style[dir] = this[dir];
      }
    }.bind(this));
    return style;
  };
  /**
   @memberof Nehan.BorderStyle
   @method setStyle
   @param flow {Nehan.BoxFlow}
   @param values {Object} - logical style values for each logical direction
   @param values.before {string}
   @param values.end {string}
   @param values.after {string}
   @param values.start {string}
   */
  BorderStyle.prototype.setStyle = function(flow, values){
    Nehan.BoxRect.setLogicalValues(this, flow, values);
  };
  /**
   get css object of logical border style
   @memberof Nehan.BorderStyle
   @return {Object}
   */
  BorderStyle.prototype.getCss = function(){
    var css = {};
    // set border-[top|right|bottom|left]-style
    Nehan.List.iter(Nehan.Const.cssPhysicalBoxDirs, function(dir){
      if(this[dir]){
	var prop = ["border", dir, "style"].join("-");
	var style = this[dir];
	css[prop] = style;
      }
    }.bind(this));
    return css;
  };

  return BorderStyle;
})();
