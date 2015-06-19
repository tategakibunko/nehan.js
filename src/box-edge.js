var BoxEdge = (function (){
  /**
     @memberof Nehan
     @class BoxEdge
     @classdesc edges object set(padding, border, margin)
     @constructor
     @param opt {Object} - optional argument
     @param opt.padding {Nehan.Padding} - initial padding
     @param opt.border {Nehan.Border} - initial border
     @param opt.margin {Nehan.Margin} - initial margin
  */
  function BoxEdge(opt){
    opt = opt || {};
    this.padding = opt.padding || new Padding();
    this.border = opt.border || new Border();
    this.margin = opt.margin || new Margin();
  }

  BoxEdge.prototype = {
    /**
       @memberof Nehan.BoxEdge
       @return {Nehan.BoxEdge}
    */
    clone : function(){
      var edge = new BoxEdge();
      edge.padding = this.padding.clone();
      edge.border = this.border.clone();
      edge.margin = this.margin.clone();
      return edge;
    },
    /**
       clear all edge values
       @memberof Nehan.BoxEdge
    */
    clear : function(){
      this.padding.clear();
      this.border.clear();
      this.margin.clear();
    },
    /**
       get css object
       @memberof Nehan.BoxEdge
    */
    getCss : function(){
      var css = {};
      Nehan.Args.copy(css, this.padding.getCss());
      Nehan.Args.copy(css, this.border.getCss());
      Nehan.Args.copy(css, this.margin.getCss());
      return css;
    },
    /**
       get size of physical width amount size in px.
       @memberof Nehan.BoxEdge
     */
    getWidth : function(){
      var ret = 0;
      ret += this.padding.getWidth();
      ret += this.border.getWidth();
      ret += this.margin.getWidth();
      return ret;
    },
    /**
       get size of physical height amount size in px.
       @memberof Nehan.BoxEdge
     */
    getHeight : function(){
      var ret = 0;
      ret += this.padding.getHeight();
      ret += this.border.getHeight();
      ret += this.margin.getHeight();
      return ret;
    },
    /**
       get size of measure in px.
       @memberof Nehan.BoxEdge
       @param flow {Nehan.BoxFlow}
     */
    getMeasure : function(flow){
      var ret = 0;
      ret += this.padding.getMeasure(flow);
      ret += this.border.getMeasure(flow);
      ret += this.margin.getMeasure(flow);
      return ret;
    },
    /**
       get size of extent in px.
       @memberof Nehan.BoxEdge
       @param flow {Nehan.BoxFlow}
     */
    getExtent : function(flow){
      var ret = 0;
      ret += this.padding.getExtent(flow);
      ret += this.margin.getExtent(flow);
      ret += this.border.getExtent(flow);
      return ret;
    },
    /**
       get size of measure size in px without margin.
       @memberof Nehan.BoxEdge
       @param flow {Nehan.BoxFlow}
     */
    getInnerMeasureSize : function(flow){
      var ret = 0;
      ret += this.padding.getMeasure(flow);
      ret += this.border.getMeasure(flow);
      return ret;
    },
    /**
       get size of extent size in px without margin.
       @memberof Nehan.BoxEdge
       @param flow {Nehan.BoxFlow}
     */
    getInnerExtentSize : function(flow){
      var ret = 0;
      ret += this.padding.getExtent(flow);
      ret += this.border.getExtent(flow);
      return ret;
    },
    /**
       get before size amount in px.
       @memberof Nehan.BoxEdge
       @param flow {Nehan.BoxFlow}
     */
    getBefore : function(flow){
      var ret = 0;
      ret += this.padding.getBefore(flow);
      ret += this.border.getBefore(flow);
      ret += this.margin.getBefore(flow);
      return ret;
    },
    /**
       get after size amount in px.
       @memberof Nehan.BoxEdge
       @param flow {Nehan.BoxFlow}
     */
    getAfter : function(flow){
      var ret = 0;
      ret += this.padding.getAfter(flow);
      ret += this.border.getAfter(flow);
      ret += this.margin.getAfter(flow);
      return ret;
    },
    /**
       @memberof Nehan.BoxEdge
       @param flow {Nehan.BoxFlow}
     */
    setBorderRadius : function(flow, value){
      this.border.setRadius(flow, value);
    },
    /**
       @memberof Nehan.BoxEdge
       @param flow {Nehan.BoxFlow}
     */
    setBorderColor : function(flow, value){
      this.border.setColor(flow, value);
    },
    /**
       @memberof Nehan.BoxEdge
       @param flow {Nehan.BoxFlow}
     */
    setBorderStyle : function(flow, value){
      this.border.setStyle(flow, value);
    },
    /**
       @memberof Nehan.BoxEdge
       @param flow {Nehan.BoxFlow}
     */
    clearBefore : function(flow){
      this.padding.clearBefore(flow);
      this.border.clearBefore(flow);
      this.margin.clearBefore(flow);
    },
    /**
       @memberof Nehan.BoxEdge
       @param flow {Nehan.BoxFlow}
     */
    clearAfter : function(flow){
      this.padding.clearAfter(flow);
      this.border.clearAfter(flow);
      this.margin.clearAfter(flow);
    },
    /**
       @memberof Nehan.BoxEdge
       @param flow {Nehan.BoxFlow}
     */
    clearBorderStart : function(flow){
      this.border.clearStart(flow);
    },
    /**
       @memberof Nehan.BoxEdge
       @param flow {Nehan.BoxFlow}
     */
    clearBorderBefore : function(flow){
      this.border.clearBefore(flow);
    },
    /**
       @memberof Nehan.BoxEdge
       @param flow {Nehan.BoxFlow}
     */
    clearBorderAfter : function(flow){
      this.border.clearAfter(flow);
    }
  };

  return BoxEdge;
})();
