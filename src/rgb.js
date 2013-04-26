var Rgb = (function(){
  // 256(8 * 8 * 4) color palette scales.
  var RG_PALETTE = [0, 36, 73, 109, 146, 182, 219, 255];
  var B_PALETTE = [0, 85, 170, 255];

  function Rgb(value){
    this.value = String(value);
    var red = parseInt(this.value.substring(0,2), 16);
    var green = parseInt(this.value.substring(2,4), 16);
    var blue = parseInt(this.value.substring(4,6), 16);

    // color values defined in nehan palette.
    // we use this value for img characters.
    var palette_red = this._findPalette(red, RG_PALETTE);
    var palette_green = this._findPalette(green, RG_PALETTE);
    var palette_blue = this._findPalette(blue, B_PALETTE);

    this.paletteValue = [
      this._makeHexStr(palette_red),
      this._makeHexStr(palette_green),
      this._makeHexStr(palette_blue)
    ].join("");
  }
  
  Rgb.prototype = {
    getColorValue : function(){
      return this.value;
    },
    getPaletteValue : function(){
      return this.paletteValue;
    },
    getPaletteValueLower : function(){
      return this.paletteValue.toLowerCase();
    },
    getPaletteValueUpper : function(){
      return this.paletteValue.toUpperCase();
    },
    _makeHexStr : function(ival){
      var str = ival.toString(16);
      if(str.length <= 1){
	return "0" + str;
      }
      return str;
    },
    _findPalette : function(ival, palette){
      if(List.exists(palette, Closure.eq(ival))){
	return ival;
      }
      return List.minobj(palette, function(pval){
	return Math.abs(pval - ival);
      });
    }
  };

  return Rgb;
})();
