Nehan.Color = (function(){
  /**
   @memberof Nehan
   @class Color
   @classdesc abstraction for css 'color'.
   @param value {String}
   */
  function Color(value){
    this.setValue(value);
  }

  /**
   @memberof Nehan.Color
   @param value {String}
   */
  Color.prototype.setValue = function(value){
    this.value = value;
  };
  /**
   @memberof Nehan.Color
   @return {String}
   */
  Color.prototype.getValue = function(){
    return this.value;
  };
  /**
   @memberof Nehan.Color
   @return {String}
   */
  Color.prototype.getCssValue = function(){
    return this.value;
  };
  /**
   @memberof Nehan.Color
   @return {Object}
   */
  Color.prototype.getCss = function(){
    var css = {};
    css.color = this.getCssValue();
    return css;
  };

  return Color;
})();
