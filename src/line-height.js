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
      if(line.elements.length === 0){
	return;
      }
      var line_fix_size = (line.maxFontSize * line_height) - line.maxExtent;
      if(line_fix_size <= 0){
	return;
      }
      // notice that edge of line-root is already included in 'parent' block(with same markup).
      // so this edge is set to create proper line-height.
      line.edge = new Nehan.BoxEdge();

      // if line is decorated by ruby or empha, extra size is already added to before line.
      // so padding is added to after only.
      if(line.isDecorated){
	line.edge.padding.setAfter(flow, Math.round(line_fix_size));
	return;
      }

      var half_leading = Math.round(line_fix_size / 2);
      if(half_leading > 0){
	line.edge.padding.setBefore(flow, half_leading);
	line.edge.padding.setAfter(flow, half_leading);
      }
    }
  };
})();
