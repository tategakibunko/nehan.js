var BoxEdge = (function (){
  function BoxEdge(){
    this.padding = new Padding();
    this.margin = new Margin();
    this.border = new Border();
  }

  BoxEdge.prototype = {
    isEnable : function(){
      return this.padding.isEnable() || this.margin.isEnable() || this.border.isEnable();
    },
    clear : function(){
      this.padding.clear();
      this.margin.clear();
      this.border.clear();
    },
    getCss : function(){
      var css = {};
      Args.copy(css, this.padding.getCss());
      Args.copy(css, this.margin.getCss());
      Args.copy(css, this.border.getCss());
      return css;
    },
    getWidth : function(){
      var ret = 0;
      ret += this.padding.getWidth();
      ret += this.margin.getWidth();
      ret += this.border.getWidth();
      return ret;
    },
    getHeight : function(){
      var ret = 0;
      ret += this.padding.getHeight();
      ret += this.margin.getHeight();
      ret += this.border.getHeight();
      return ret;
    },
    getMeasureSize : function(flow){
      var ret = 0;
      ret += this.padding.getMeasureSize(flow);
      ret += this.margin.getMeasureSize(flow);
      ret += this.border.getMeasureSize(flow);
      return ret;
    },
    getExtentSize : function(flow){
      var ret = 0;
      ret += this.padding.getExtentSize(flow);
      ret += this.margin.getExtentSize(flow);
      ret += this.border.getExtentSize(flow);
      return ret;
    },
    setAll : function(prop, flow, value){
      this[prop].setAll(flow, value);
    },
    setSize : function(prop, flow, size){
      this[prop].setSize(flow, size);
    },
    setEdgeStart : function(prop, flow, value){
      this[prop].setStart(flow, value);
    },
    setEdgeEnd : function(prop, flow, value){
      this[prop].setEnd(flow, value);
    },
    setEdgeBefore : function(prop, flow, value){
      this[prop].setBefore(flow, value);
    },
    setEdgeAfter : function(prop, flow, value){
      this[prop].setAfter(flow, value);
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
