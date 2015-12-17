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
    this._setup(this.value);
  }

  Rgb.prototype._setup = function(value){
    switch(value.length){
    case 3:
      var r = this.value.substring(0,1);
      var g = this.value.substring(1,2);
      var b = this.value.substring(2,3);
      this.red = parseInt(r + r, 16);
      this.green = parseInt(g + g, 16);
      this.blue = parseInt(b + b, 16);
      this.value = r + r + g + g + b + b;
      break;
    case 6:
      this.red = parseInt(this.value.substring(0,2), 16);
      this.green = parseInt(this.value.substring(2,4), 16);
      this.blue = parseInt(this.value.substring(4,6), 16);
      break;
    default:
      console.error("Nehan.Rgb invalid color value:%o", value);
      throw "Nehan.Rgb: inlivad color value";
    }
  };
  
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
