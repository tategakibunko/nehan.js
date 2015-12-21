/**
 @namespace Nehan.Baseline
 */
Nehan.VerticalAlign = (function(){
  var __set_vert_baseline = function(flow, line){
    Nehan.List.iter(line.elements, function(element){
      var font_size = element.maxFontSize;
      var from_after = Math.floor((line.maxFontSize - font_size) / 2);
      if (from_after > 0){
	var edge = element.edge? element.edge.clone() : new Nehan.BoxEdge();
	edge.padding.setAfter(flow, from_after); // set offset to padding
	element.size.width = (line.maxExtent - from_after);
	
	// set edge to dynamic css, it has higher priority over static css(given by element.style.getCssInline)
	Nehan.Obj.copy(element.css, edge.getCss(flow));
      }
    });
  };

  var __set_hori_baseline = function(flow, line){
    Nehan.List.iter(line.elements, function(element){
      var font_size = element.maxFontSize;
      var from_before = line.maxExtent - element.maxExtent;
      //console.log("line.maxExtent:%d, line.maxFontSize:%d, element.extent:%d", line.maxExtent, line.maxFontSize, element.maxExtent);
      if (from_before > 0){
	var edge = element.edge? element.edge.clone() : new Nehan.BoxEdge();
	edge.padding.setBefore(flow, from_before); // set offset to padding

	// set edge to dynamic css, it has higher priority over static css(given by element.style.getCssInline)
	Nehan.Obj.copy(element.css, edge.getCss(flow));
      }
    });
  };

  return {
    /**
     @memberof Nehan.VerticalAlign
     @param flow {Nehan.BoxFlow}
     @param line {Nehan.Box} - target line(root line)
     */
    setMiddle : function(flow, line){
    },
    /**
     @memberof Nehan.VerticalAlign
     @param flow {Nehan.BoxFlow}
     @param line {Nehan.Box} - target line(root line)
     */
    setBefore : function(flow, line){
    },
    /**
     @memberof Nehan.VerticalAlign
     @param flow {Nehan.BoxFlow}
     @param line {Nehan.Box} - target line(root line)
     */
    setTextBefore : function(flow, line){
    },
    /**
     @memberof Nehan.VerticalAlign
     @param flow {Nehan.BoxFlow}
     @param line {Nehan.Box} - target line(root line)
     */
    setAfter : function(flow, line){
    },
    /**
     @memberof Nehan.VerticalAlign
     @param flow {Nehan.BoxFlow}
     @param line {Nehan.Box} - target line(root line)
     */
    setTextAfter : function(flow, line){
    },
    /**
     @memberof Nehan.VerticalAlign
     @param flow {Nehan.BoxFlow}
     @param line {Nehan.Box} - target line(root line)
     */
    setSub : function(flow, line){
    },
    /**
     @memberof Nehan.VerticalAlign
     @param flow {Nehan.BoxFlow}
     @param line {Nehan.Box} - target line(root line)
     */
    setSuper : function(flow, line){
    },
    /**
     @memberof Nehan.VerticalAlign
     @param flow {Nehan.BoxFlow}
     @param line {Nehan.Box} - target line(root line)
     @param percent {int} - percent of line-height
     */
    setPercent : function(flow, line, percent){
    },
    /**
     @memberof Nehan.VerticalAlign
     @param flow {Nehan.BoxFlow}
     @param line {Nehan.Box} - target line(root line)
     @param px {int}
     */
    setLength : function(flow, line, px){
    },
    /**
     @memberof Nehan.VerticalAlign
     @param flow {Nehan.BoxFlow}
     @param line {Nehan.Box} - target line(root line)
     */
    setBaseline : function(flow, line){
      if(flow.isTextVertical()){
	__set_vert_baseline(flow, line);
      } else {
	__set_hori_baseline(flow, line);
      }
    }
  };
})();

