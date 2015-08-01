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
    this.value = Nehan.Colors.get(value);
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
   @example
   * new Color("transparent").getCssValue(); // "transparent"
   * new Color("ff0022").getCssValue(); // "#ff0022"
   * new Color("red").getCssValue(); // "#ff0000"
   */
  Color.prototype.getCssValue = function(){
    return (this.value === "transparent")? this.value : "#" + this.value;
  };
  /**
   @memberof Nehan.Color
   @return {Nehan.Rgb}
   */
  Color.prototype.getRgb = function(){
    return new Nehan.Rgb(this.value);
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
