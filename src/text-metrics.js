// more strict metrics using canvas
var TextMetrics = (function(){
  var canvas = document.createElement("canvas");
  canvas.style.width = Layout.width + "px";
  canvas.style.height = Layout.maxFontSize + "px";

  var context = null;
  if(canvas.getContext && canvas.measureText){
    context = canvas.getContext("2d");
    context.textAlign = "left";
  }
  return {
    isEnable : function(){
      return context !== null;
    },
    getMetrics : function(font, text){
      context.font = font;
      return context.measureText(text);
    },
    getMeasure : function(font, text, flow){
      flow = flow || BoxFlows.getByName("tb-rl");
      var metrics = this.getMetrics(font, text);
      return metrics[flow.getPropMeasure()];
    }
  };
})();

