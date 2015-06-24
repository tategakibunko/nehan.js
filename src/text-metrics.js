/**
   utility module to get more strict metrics using canvas.

   @namespace Nehan.TextMetrics
*/
Nehan.TextMetrics = (function(){
  var __canvas = document.createElement("canvas");
  __canvas.style.width = Math.max(Nehan.Display.width, Nehan.Display.height) + "px";
  __canvas.style.height = Nehan.Display.maxFontSize + "px";

  var __canvas_context;
  if(__canvas.getContext){
    __canvas_context = __canvas.getContext("2d");
    __canvas_context.textAlign = "left";
  }

  return {
    /**
       check if client browser is supported.

       @memberof Nehan.TextMetrics
       @return {boolean}
    */
    isEnable : function(){
      return __canvas_context && (typeof __canvas_context.measureText !== "undefined");
    },
    /**
       @memberof Nehan.TextMetrics
       @param font {Nehan.Font}
       @param text {String}
       @return {Object} - {width:xxx, height:yyy}
    */
    getMetrics : function(font, text){
      __canvas_context.font = font.toString(); // to get accurate metrics, font info is required.
      // caution: this metrics is not always correct(especially webkit), but firefox is well done.
      var metrics = __canvas_context.measureText(text);
      return metrics;
    },
    /**
       @memberof Nehan.TextMetrics
       @param font {Nehan.Font}
       @param text {String}
       @return {int}
    */
    getMeasure : function(font, text){
      var metrics = this.getMetrics(font, text);
      //console.log("[%s] - %f", text, metrics.width);
      return metrics.width;
    }
  };
})();

