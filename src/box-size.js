Nehan.BoxSize = (function(){
  /**
     @memberof Nehan
     @class BoxSize
     @classdesc physical box size 'width' and 'height'.
     @constructor
     @param width {int} - content width
     @param height {int} - content height
  */
  function BoxSize(width, height){
    this.width = width; // content width
    this.height = height; // content height
  }

  /**
   clone box size object with same values.

   @memberof Nehan.BoxSize
   @return {Nehan.BoxSize}
   */
  BoxSize.prototype.clone = function(){
    return new BoxSize(this.width, this.height);
  };
  /**
   @memberof Nehan.BoxSize
   @param flow {Nehan.BoxFlow}
   @param extent {int}
   */
  BoxSize.prototype.setExtent = function(flow, extent){
    this[flow.getPropExtent()] = extent;
  };
  /**
   @memberof Nehan.BoxSize
   @param flow {Nehan.BoxFlow}
   @param measure {int}
   */
  BoxSize.prototype.setMeasure = function(flow, measure){
    this[flow.getPropMeasure()] = measure;
  };
  /**
   @memberof Nehan.BoxSize
   @return {Object}
   */
  BoxSize.prototype.getCss = function(){
    var css = {};
    css.width = this.width + "px";
    css.height = this.height + "px";
    return css;
  };
  /**
   get content size of measure

   @memberof Nehan.BoxSize
   @param flow {Nehan.BoxFlow}
   @return {int}
   */
  BoxSize.prototype.getMeasure = function(flow){
    return this[flow.getPropMeasure()];
  };
  /**
   get content size of extent

   @memberof Nehan.BoxSize
   @param flow {Nehan.BoxFlow}
   @return {int}
   */
  BoxSize.prototype.getExtent = function(flow){
    return this[flow.getPropExtent()];
  };

  /**
   compare equality

   @memberof Nehan.BoxSize
   @param size {Nehan.BoxSize}
   @return {bool}
   */
  BoxSize.prototype.isEqualTo = function(size){
    return this.width === size.width && this.height === size.height;
  };

  return BoxSize;
})();
