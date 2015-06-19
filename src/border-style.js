var BorderStyle = (function(){
  /**
     @memberof Nehan
     @class BorderStyle
     @classdesc logical border style object
     @constructor
  */
  function BorderStyle(){
  }

  BorderStyle.prototype = {
    /**
       @memberof Nehan.BorderStyle
       @method clone
       @return {Nehan.BorderStyle}
    */
    clone : function(){
      var style = new BorderStyle();
      Nehan.List.iter(Nehan.Const.cssBoxDirs, function(dir){
	if(this[dir]){
	  style[dir] = this[dir];
	}
      }.bind(this));
      return style;
    },
    /**
       @memberof Nehan.BorderStyle
       @method setStyle
       @param flow {Nehan.BoxFlow}
       @param value {Object} - logical style values for each logical direction
       @param value.before {string}
       @param value.end {string}
       @param value.after {string}
       @param value.start {string}
    */
    setStyle : function(flow, value){
      Nehan.BoxRect.setValue(this, flow, value);
    },
    /**
       get css object of logical border style
       @memberof Nehan.BorderStyle
       @return {Object}
    */
    getCss : function(){
      var css = {};
      Nehan.BoxRect.iter(this, function(dir, style){
	var prop = ["border", dir, "style"].join("-");
	css[prop] = style;
      });
      return css;
    }
  };

  return BorderStyle;
})();
