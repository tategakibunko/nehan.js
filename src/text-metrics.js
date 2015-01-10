// more strict metrics using canvas
var TextMetrics = (function(){
  var __canvas = document.createElement("canvas");
  __canvas.style.width = Math.max(Display.width, Display.height) + "px";
  __canvas.style.height = Display.maxFontSize + "px";

  var __canvas_context;
  if(__canvas.getContext){
    __canvas_context = __canvas.getContext("2d");
    __canvas_context.textAlign = "left";
  }

  return {
    isEnable : function(){
      return __canvas_context && (typeof __canvas_context.measureText !== "undefined");
    },
    getMetrics : function(font, text){
      __canvas_context.font = font.toString(); // to get accurate metrics, font info is required.
      return __canvas_context.measureText(text);
    },
    getMeasure : function(font, text){
      var metrics = this.getMetrics(font, text);
      var space = Math.floor(Display.vertWordSpaceRate * font.size);
      return metrics.width + space;
    }
  };
})();

