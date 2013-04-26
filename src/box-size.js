var BoxSize = (function(){
  function BoxSize(width, height){
    this.width = width;
    this.height = height;
  }

  BoxSize.prototype = {
    isValid : function(){
      return this.width > 0 && this.height > 0;
    },
    canInclude : function(size){
      return (size.width <= this.width && size.height <= this.height);
    },
    getCss : function(){
      var css = {};
      css.width = this.width + "px";
      css.height = this.height + "px";
      return css;
    },
    getWhSlope : function(){
      return this.height / this.width;
    },
    getHwSlope : function(){
      return this.width / this.height;
    },
    getMeasure : function(flow){
      return this[flow.getPropMeasure()];
    },
    getExtent : function(flow){
      return this[flow.getPropExtent()];
    },
    setExtent : function(flow, extent){
      this[flow.getPropExtent()] = extent;
    },
    setMeasure : function(flow, measure){
      this[flow.getPropMeasure()] = measure;
    },
    subEdge : function(edge){
      var dw = edge.getWidth();
      var dh = edge.getHeight();
      this.width = Math.max(0, this.width - dw);
      this.height = Math.max(0, this.height - dh);
    },
    subMeasure : function(flow, measure){
      var prop = flow.getPropMeasure();
      this[prop] = Math.max(0, this[prop] - measure);
    },
    addMeasure : function(flow, measure){
      this[flow.getPropMeasure()] += measure;
    },
    addExtent : function(flow, extent){
      this[flow.getPropExtent()] += extent;
    },
    percentFrom : function(target_size){
      return Math.floor(100 * this.width / target_size.width);
    },
    resizeWithin : function(flow, rest_size){
      var rest_measure = rest_size.getMeasure(flow);
      var rest_extent = rest_size.getExtent(flow);
      var box_measure = this.getMeasure(flow);
      var box_extent = this.getExtent(flow);
      if(box_extent > rest_extent){
	// box_measure : box_extent = ? : rest_extent
	box_measure = box_measure * rest_extent / box_extent;
	box_extent = rest_extent;
      }
      if(box_measure > rest_measure){
	var slope = box_extent / box_measure; // extent per measure
	var m_over = box_measure - rest_measure;
	box_extent = Math.floor(box_extent - slope * m_over);
	box_measure = rest_measure;
      }
      return flow.getBoxSize(box_measure, box_extent);
    },
    toLogicalSize : function(flow){
      return new LogicalSize(this.getMeasure(flow), this.getExtent(flow));
    }
  };

  return BoxSize;
})();
