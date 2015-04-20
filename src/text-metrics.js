/**
   utility module to get more strict metrics using canvas.

   @namespace Nehan.TextMetrics
*/
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
      return __canvas_context.measureText(text);
    },
    /**
       @memberof Nehan.TextMetrics
       @param font {Nehan.Font}
       @param text {String}
       @return {int}
    */
    getMeasure : function(font, text){
      var metrics = this.getMetrics(font, text);
      //var space = Math.floor(Display.vertWordSpaceRate * font.size);
      //var measure = metrics.width + space;
      //return measure;
      return metrics.width;
    }
  };
})();

