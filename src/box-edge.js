var BoxEdge = (function (){
  function BoxEdge(opt){
    opt = opt || {};
    this.padding = opt.padding || new Padding();
    this.border = opt.border || new Border();
    this.margin = opt.margin || new Margin();
  }

  BoxEdge.prototype = {
    clone : function(){
      var edge = new BoxEdge();
      edge.padding = this.padding.clone();
      edge.border = this.border.clone();
      edge.margin = this.margin.clone();
      return edge;
    },
    clear : function(){
      this.padding.clear();
      this.border.clear();
      this.margin.clear();
    },
    getCss : function(){
      var css = {};
      Args.copy(css, this.padding.getCss());
      Args.copy(css, this.border.getCss());
      Args.copy(css, this.margin.getCss());
      return css;
    },
    getWidth : function(){
      var ret = 0;
      ret += this.padding.getWidth();
      ret += this.border.getWidth();
      ret += this.margin.getWidth();
      return ret;
    },
    getHeight : function(){
      var ret = 0;
      ret += this.padding.getHeight();
      ret += this.border.getHeight();
      ret += this.margin.getHeight();
      return ret;
    },
    getMeasure : function(flow){
      var ret = 0;
      ret += this.padding.getMeasure(flow);
      ret += this.border.getMeasure(flow);
      ret += this.margin.getMeasure(flow);
      return ret;
    },
    getExtent : function(flow){
      var ret = 0;
      ret += this.padding.getExtent(flow);
      ret += this.margin.getExtent(flow);
      ret += this.border.getExtent(flow);
      return ret;
    },
    getInnerMeasureSize : function(flow){
      var ret = 0;
      ret += this.padding.getMeasure(flow);
      ret += this.border.getMeasure(flow);
      return ret;
    },
    getInnerExtentSize : function(flow){
      var ret = 0;
      ret += this.padding.getExtent(flow);
      ret += this.border.getExtent(flow);
      return ret;
    },
    getBefore : function(flow){
      var ret = 0;
      ret += this.padding.getBefore(flow);
      ret += this.border.getBefore(flow);
      ret += this.margin.getBefore(flow);
      return ret;
    },
    getAfter : function(flow){
      var ret = 0;
      ret += this.padding.getAfter(flow);
      ret += this.border.getAfter(flow);
      ret += this.margin.getAfter(flow);
      return ret;
    },
    setAll : function(prop, flow, value){
      this[prop].setAll(flow, value);
    },
    setBorderRadius : function(flow, value){
      this.border.setRadius(flow, value);
    },
    setBorderColor : function(flow, value){
      this.border.setColor(flow, value);
    },
    setBorderStyle : function(flow, value){
      this.border.setStyle(flow, value);
    },
    clearBefore : function(flow){
      this.padding.clearBefore(flow);
      this.border.clearBefore(flow);
      this.margin.clearBefore(flow);
    },
    clearAfter : function(flow){
      this.padding.clearAfter(flow);
      this.border.clearAfter(flow);
      this.margin.clearAfter(flow);
    },
    clearBorderStart : function(flow){
      this.border.clearStart(flow);
    },
    clearBorderBefore : function(flow){
      this.border.clearBefore(flow);
    },
    clearBorderAfter : function(flow){
      this.border.clearAfter(flow);
    }
  };

  return BoxEdge;
})();
