/**
 @namespace Nehan.Baseline
 */
Nehan.Baseline = (function(){
  var __set_vert_baseline = function(flow, root_line, baseline){
    Nehan.List.iter(root_line.elements, function(element){
      var font_size = element.maxFontSize;
      var from_after = Math.floor((root_line.maxFontSize - font_size) / 2);
      if (from_after > 0){
	var edge = element.edge || null;
	edge = edge? edge.clone() : new Nehan.BoxEdge();
	edge.padding.setAfter(flow, from_after); // set offset to padding
	element.size.width = (root_line.maxExtent - from_after);
	
	// set edge to dynamic css, it has higher priority over static css(given by element.style.getCssInline)
	Nehan.Args.copy(element.css, edge.getCss(flow));
      }
    });
  };

  var __set_hori_baseline = function(flow, root_line, baseline){
    Nehan.List.iter(root_line.elements, function(element){
      var font_size = element.maxFontSize;
      var from_after = root_line.maxExtent - element.maxExtent;
      if (from_after > 0){
	var edge = element.edge || null;
	edge = edge? edge.clone() : new Nehan.BoxEdge();
	edge.padding.setBefore(flow, from_after); // set offset to padding
	//element.size.width = (root_line.maxExtent - from_after);
	
	// set edge to dynamic css, it has higher priority over static css(given by element.style.getCssInline)
	Nehan.Args.copy(element.css, edge.getCss(flow));
      }
    });
  };

  return {
    // argument 'baseline' is not used yet.
    // baseline: central | alphabetic
    // ----------------------------------------------------------------
    // In nehan.js, 'central' is used when vertical writing mode.
    // see http://dev.w3.org/csswg/css-writing-modes-3/#text-baselines
    /**
     @memberof Nehan.Baseline
     @param line {Nehan.Box} - target line object.
     @param baseline {String} - 'central' or 'alphabetic'.
     */
    set : function(line, baseline){
      var flow = line.context.getFlow();
      if(line.context.isTextVertical()){
	__set_vert_baseline(flow, line, baseline);
      } else {
	__set_hori_baseline(flow, line, baseline);
      }
    }
  };
})();
