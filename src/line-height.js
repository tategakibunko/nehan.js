/**
 @namespace Nehan.LineHeight
 */
Nehan.LineHeight = (function(){
  return {
    /**
     @memberof Nehan.Baseline
     @param flow {Nehan.BoxFlow}
     @param line {Nehan.Box} - target line object
     @param line_height {Number} - target line height(not px, rate only)
     */
    set : function(flow, line, line_height){
      var line_fix_size = (line.maxFontSize * line_height) - line.maxExtent;
      var half_leading = Math.round(line_fix_size / 2);
      if(line.elements.length > 0 && half_leading > 0){
	// notice that edge of line-root is already included in 'parent' block(with same markup).
	// so this edge is set to create proper line-height.
	line.edge = new Nehan.BoxEdge();
	line.edge.padding.setBefore(flow, half_leading);
	line.edge.padding.setAfter(flow, half_leading);
      }
    }
  };
})();
