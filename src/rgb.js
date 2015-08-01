Nehan.Rgb = (function(){
  /**
     @memberof Nehan
     @class Rgb
     @classdesc abstraction of RGB color value.
     @constructor
     @param value {String}
  */
  function Rgb(value){
    this.value = String(value);
    this.red = parseInt(this.value.substring(0,2), 16);
    this.green = parseInt(this.value.substring(2,4), 16);
    this.blue = parseInt(this.value.substring(4,6), 16);
  }
  
  /**
   @memberof Nehan.Rgb
   @return {String}
   */
  Rgb.prototype.getRed = function(){
    return this.red;
  };
  /**
   @memberof Nehan.Rgb
   @return {String}
   */
  Rgb.prototype.getGreen = function(){
    return this.green;
  };
  /**
   @memberof Nehan.Rgb
   @return {String}
   */
  Rgb.prototype.getBlue = function(){
    return this.blue;
  };
  /**
   @memberof Nehan.Rgb
   @return {String}
   */
  Rgb.prototype.getColorValue = function(){
    return this.value;
  };

  return Rgb;
})();
