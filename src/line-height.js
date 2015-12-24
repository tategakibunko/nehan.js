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
      var base_font_size = line.getFontSize();
      var max_line_height = Math.floor(line.maxFontSize * line_height);
      var inline_fix_size = max_line_height - line.maxExtent;
      if(inline_fix_size === 0){
	return;
      }
      var line_fix_size = max_line_height - base_font_size;
      var half_leading = Math.floor(line_fix_size / 2);

      // notice that edge of line-root is already included in 'parent' block(with same markup).
      // so this edge is set to create proper line-height.
      line.edge = new Nehan.BoxEdge();

      // if there is some inline element that is larger than max-line-height,
      // set half-leading to after only.
      if(inline_fix_size < 0){
	// only one element(like img only line)
	if(line.elements.length <= 1){
	  return; // do nothing
	}
	if(Math.abs(inline_fix_size) >= base_font_size){
	  line.edge.padding.setAfter(flow, half_leading);
	  return;
	}
      }

      // if line is decorated by ruby or empha, extra size is already added to before line.
      // so padding is added to after only.
      if(line.isDecorated){
	line.edge.padding.setAfter(flow, inline_fix_size);
	return;
      }

      //var half_leading = Math.round(inline_fix_size / 2);
      if(half_leading > 0){
	line.edge.padding.setBefore(flow, half_leading);
	line.edge.padding.setAfter(flow, half_leading);
      }
    }
  };
})();
