var LogicalSize = (function(){
  function LogicalSize(measure, extent){
    this.measure = measure;
    this.extent = extent;
  }

  LogicalSize.prototype = {
    canInclude : function(size){
      return (size.measure <= this.measure && size.extent <= this.extent);
    },
    getWidth : function(flow){
      return this[flow.getPropWidth()];
    },
    getHeight : function(flow){
      return this[flow.getPropHeight()];
    },
    toBoxSize : function(flow){
      return new BoxSize(this.getWidth(flow), this.getHeight(flow));
    }
  };

  return LogicalSize;
})();
