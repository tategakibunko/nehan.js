Nehan.BoxEdge = (function (){
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
    this.padding = opt.padding || new Nehan.Padding();
    this.border = opt.border || new Nehan.Border();
    this.margin = opt.margin || new Nehan.Margin();
  }

  /**
   @memberof Nehan.BoxEdge
   @return {Nehan.BoxEdge}
   */
  BoxEdge.prototype.clone = function(){
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
  BoxEdge.prototype.clear = function(){
    this.padding.clear();
    this.border.clear();
    this.margin.clear();
  },
  /**
   get css object
   @memberof Nehan.BoxEdge
   */
  BoxEdge.prototype.getCss = function(){
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
  BoxEdge.prototype.getWidth = function(){
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
  BoxEdge.prototype.getHeight = function(){
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
  BoxEdge.prototype.getMeasure = function(flow){
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
  BoxEdge.prototype.getExtent = function(flow){
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
  BoxEdge.prototype.getInnerMeasureSize = function(flow){
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
  BoxEdge.prototype.getInnerExtentSize = function(flow){
    var ret = 0;
    ret += this.padding.getExtent(flow);
    ret += this.border.getExtent(flow);
    return ret;
  },
  /**
   get start size amount in px.
   @memberof Nehan.BoxEdge
   @param flow {Nehan.BoxFlow}
   */
  BoxEdge.prototype.getStart= function(flow){
    var ret = 0;
    ret += this.padding.getStart(flow);
    ret += this.border.getStart(flow);
    ret += this.margin.getStart(flow);
    return ret;
  },
  /**
   get before size amount in px.
   @memberof Nehan.BoxEdge
   @param flow {Nehan.BoxFlow}
   */
  BoxEdge.prototype.getBefore = function(flow){
    var ret = 0;
    ret += this.padding.getBefore(flow);
    ret += this.border.getBefore(flow);
    ret += this.margin.getBefore(flow);
    return ret;
  },
  /**
   get before size amount in px.
   @memberof Nehan.BoxEdge
   @param flow {Nehan.BoxFlow}
   */
  BoxEdge.prototype.getInnerBefore = function(flow){
    var ret = 0;
    ret += this.padding.getBefore(flow);
    ret += this.border.getBefore(flow);
    return ret;
  },
  /**
   get after size amount in px.
   @memberof Nehan.BoxEdge
   @param flow {Nehan.BoxFlow}
   */
  BoxEdge.prototype.getAfter = function(flow){
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
  BoxEdge.prototype.setBorderRadius = function(flow, value){
    this.border.setRadius(flow, value);
  },
  /**
   @memberof Nehan.BoxEdge
   @param flow {Nehan.BoxFlow}
   */
  BoxEdge.prototype.setBorderColor = function(flow, value){
    this.border.setColor(flow, value);
  },
  /**
   @memberof Nehan.BoxEdge
   @param flow {Nehan.BoxFlow}
   */
  BoxEdge.prototype.setBorderStyle = function(flow, value){
    this.border.setStyle(flow, value);
  },
  /**
   @memberof Nehan.BoxEdge
   @param flow {Nehan.BoxFlow}
   @param required_size {Nehan.BoxFlow}
   */
  BoxEdge.prototype.cancelAfter = function(flow, required_size){
    var cancel_size = 0;
    // first, try to clear margin
    cancel_size += this.margin.getAfter(flow);
    this.margin.clearAfter(flow);
    if(cancel_size >= required_size){
      console.warn("cancel edge(margin):%d", cancel_size);
      return cancel_size;
    }
    // second, try to clear padding
    cancel_size += this.padding.getAfter(flow);
    this.padding.clearAfter(flow);
    if(cancel_size >= required_size){
      console.warn("cancel edge(margin/padding):%d", cancel_size);
      return cancel_size;
    }
    // finally, try to clear border
    cancel_size += this.border.getAfter(flow);
    this.border.clearAfter(flow);
    console.warn("cancel edge(margin/padding/border):%d", cancel_size);
    return cancel_size;
  };
  /**
   @memberof Nehan.BoxEdge
   @param flow {Nehan.BoxFlow}
   */
  BoxEdge.prototype.clearBefore = function(flow){
    this.padding.clearBefore(flow);
    this.border.clearBefore(flow);
    this.margin.clearBefore(flow);
  },
  /**
   @memberof Nehan.BoxEdge
   @param flow {Nehan.BoxFlow}
   */
  BoxEdge.prototype.clearAfter = function(flow){
    this.padding.clearAfter(flow);
    this.border.clearAfter(flow);
    this.margin.clearAfter(flow);
  },
  /**
   @memberof Nehan.BoxEdge
   @param flow {Nehan.BoxFlow}
   */
  BoxEdge.prototype.clearBorderStart = function(flow){
    this.border.clearStart(flow);
  },
  /**
   @memberof Nehan.BoxEdge
   @param flow {Nehan.BoxFlow}
   */
  BoxEdge.prototype.clearBorderBefore = function(flow){
    this.border.clearBefore(flow);
  },
  /**
   @memberof Nehan.BoxEdge
   @param flow {Nehan.BoxFlow}
   */
  BoxEdge.prototype.clearBorderAfter = function(flow){
    this.border.clearAfter(flow);
  };

  return BoxEdge;
})();
