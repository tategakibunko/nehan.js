var Tcy = (function(){
  function Tcy(tcy){
    this.data = tcy;
    this._type = "tcy";
  }

  Tcy.prototype = {
    getCharCount : function(){
      return 1;
    },
    getAdvance : function(flow, letter_spacing){
      return this.bodySize + letter_spacing;
    },
    hasMetrics : function(){
      return (typeof this.bodySize != "undefined");
    },
    setMetrics : function(flow, font){
      this.bodySize = font.size;
    }
  };

  return Tcy;
})();

