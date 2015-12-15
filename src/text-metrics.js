/**
   utility module to get more strict metrics using canvas.

   @namespace Nehan.TextMetrics
*/
Nehan.TextMetrics = (function(){
  var __span = (function(){
    var span = document.createElement("span");
    Nehan.Obj.copy(span.style, {
      margin:0,
      padding:0,
      border:0,
      lineHeight:1,
      height:"auto",
      visibility:"hidden"
    });
    return span;
  })();

  return {
    /**
       @memberof Nehan.TextMetrics
       @param font {Nehan.Font}
       @param text {String}
       @return {Object} - {width:xxx, height:yyy}
    */
    getMetrics : function(font, text){
      var body = document.body;
      var style = __span.style;
      body.style.display = "block"; // must be visible
      style.font = font.getCssShorthand();
      __span.innerHTML = text;
      body.appendChild(__span);
      var rect = __span.getBoundingClientRect();
      var metrics = {
	width:Math.round(rect.right - rect.left),
	height:Math.round(rect.bottom - rect.top)
      };
      //var metrics = {width:__span.offsetWidth, height:__span.offsetHeight};
      body.removeChild(__span);
      //console.log("metrics(%s):(%d,%d)", text, metrics.width, metrics.height);
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

