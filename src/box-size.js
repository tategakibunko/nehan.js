var BoxSize = (function(){
  function BoxSize(width, height, box_sizing){
    this.width = width;
    this.height = height;
    this.boxSizing = box_sizing || "content-box";
  }

  BoxSize.prototype = {
    clone : function(){
      return new BoxSize(this.width, this.height);
    },
    getCss : function(){
      var css = {};
      css.width = this.width + "px";
      css.height = this.height + "px";
      return css;
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
    }
  };

  return BoxSize;
})();
