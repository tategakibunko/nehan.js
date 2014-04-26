// more strict metrics using canvas
var TextMetrics = (function(){
  var canvas = document.createElement("canvas");
  canvas.style.width = Math.max(Layout.width, Layout.height) + "px";
  canvas.style.height = Layout.maxFontSize + "px";

  var context;
  if(canvas.getContext){
    context = canvas.getContext("2d");
    context.textAlign = "left";
  }

  return {
    isEnable : function(){
      return context && (typeof context.measureText !== "undefined");
    },
    getMetrics : function(font, text){
      context.font = font.toString(); // to get accurate metrics, font info is required.
      return context.measureText(text);
    },
    getMeasure : function(font, text){
      var metrics = this.getMetrics(font, text);
      return metrics.width;
    }
  };
})();

