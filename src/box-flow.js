Nehan.BoxFlow = (function(){
  /**
     @memberof Nehan
     @class BoxFlow
     @classdesc abstract inline and block direction
     @constructor
     @param indir {string} - "lr" or "tb"("rl" not supported yet)
     @param blockdir {string} - "tb" or "lr" or "rl"
  */
  function BoxFlow(indir, blockdir){
    this.inflow = new Nehan.InlineFlow(indir);
    this.blockflow = new Nehan.BlockFlow(blockdir);
  }

  /**
   @memberof Nehan.BoxFlow
   @return {boolean}
   */
  BoxFlow.prototype.isTextLineFirst = function(){
    if(this.isTextVertical() && this.blockflow.isLeftToRight()){
      return true;
    }
    return false;
  };
  /**
   @memberof Nehan.BoxFlow
   @return {boolean}
   */
  BoxFlow.prototype.isBlockflowVertical = function(){
    return this.blockflow.isVertical();
  };
  /**
   @memberof Nehan.BoxFlow
   @return {boolean}
   */
  BoxFlow.prototype.isTextVertical = function(){
    return this.inflow.isVertical();
  };
  /**
   @memberof Nehan.BoxFlow
   @return {boolean}
   */
  BoxFlow.prototype.isTextHorizontal = function(){
    return this.inflow.isHorizontal();
  };
  /**
   @memberof Nehan.BoxFlow
   @return {boolean}
   */
  BoxFlow.prototype.isTextLeftToRight = function(){
    return this.inflow.isLeftToRight();
  };
  /**
   @memberof Nehan.BoxFlow
   @return {boolean}
   */
  BoxFlow.prototype.isTextRightToLeft = function(){
    return this.inflow.isRightToLeft();
  };
  /**
   @memberof Nehan.BoxFlow
   @return {boolean}
   */
  BoxFlow.prototype.isBlockLeftToRight = function(){
    return this.blockflow.isLeftToRight();
  };
  /**
   @memberof Nehan.BoxFlow
   @return {boolean}
   */
  BoxFlow.prototype.isBlockRightToLeft = function(){
    return this.blockflow.isRightToLeft();
  };
  /**
   @memberof Nehan.BoxFlow
   @return {Object}
   */
  BoxFlow.prototype.getCss = function(){
    var css = {};

    // notice that "float" property is converted into "cssFloat" in evaluation time.
    if(this.isTextVertical()){
      css["css-float"] = this.isBlockLeftToRight()? "left" : "right";
    } else {
      css["css-float"] = this.isTextLeftToRight()? "left" : "right";
    }
    return css;
  };
  /**
   @memberof Nehan.BoxFlow
   @return {string}
   @example
   * new BlockFlow("tb", "rl").getName(); // "tb-rl"
   * new BlockFlow("lr", "tb").getName(); // "lr-tb"
   */
  BoxFlow.prototype.getName = function(){
    return [this.inflow.dir, this.blockflow.dir].join("-");
  };
  /**
   get physical property name from logical property.
   @memberof Nehan.BoxFlow
   @param prop {string} - logical direction name
   @return {string}
   @example
   * new BlockFlow("tb", "rl").getProp("start"); // "top"
   * new BlockFlow("lr", "tb").getProp("end"); // "right"
   */
  BoxFlow.prototype.getProp = function(prop){
    switch(prop){
    case "start":
      return this.getPropStart();
    case "end":
      return this.getPropEnd();
    case "before":
      return this.getPropBefore();
    case "after":
      return this.getPropAfter();
    }
    console.error("BoxFlow::getProp, undefined property(%o)", prop);
    throw "BoxFlow::getProp, undefined property";
  };
  /**
   @memberof Nehan.BoxFlow
   @return {string}
   */
  BoxFlow.prototype.getPropStart = function(){
    return this.inflow.getPropStart();
  };
  /**
   @memberof Nehan.BoxFlow
   @return {string}
   */
  BoxFlow.prototype.getPropEnd = function(){
    return this.inflow.getPropEnd();
  };
  /**
   @memberof Nehan.BoxFlow
   @return {string}
   */
  BoxFlow.prototype.getPropBefore = function(){
    return this.blockflow.getPropBefore();
  };
  /**
   @memberof Nehan.BoxFlow
   @return {string}
   */
  BoxFlow.prototype.getPropAfter = function(){
    return this.blockflow.getPropAfter();
  };
  /**
   @memberof Nehan.BoxFlow
   @return {string}
   */
  BoxFlow.prototype.getPropExtent = function(){
    return this.isTextVertical()? "width" : "height";
  };
  /**
   @memberof Nehan.BoxFlow
   @return {string}
   */
  BoxFlow.prototype.getPropMeasure = function(){
    return this.isTextVertical()? "height" : "width";
  };
  /**
   @memberof Nehan.BoxFlow
   @return {string}
   */
  BoxFlow.prototype.getPropWidth = function(){
    return this.isTextVertical()? "extent" : "measure";
  };
  /**
   @memberof Nehan.BoxFlow
   @return {string}
   */
  BoxFlow.prototype.getPropHeight = function(){
    return this.isTextVertical()? "measure" : "extent";
  };
  /**
   get flipped box flow, but result depends on setting of Nehan.Config.boxFlowSet.

   @memberof Nehan.BoxFlow
   @return {Nehan.BoxFlow}
   @example
   * // if  Nehan.Config.boxFlowSet.hori = "lr-tb"
   * // and Nehan.Config.boxFlowSet.vert = "tb-rl"
   * new BlockFlow("tb", "rl").getFlipFlow(); // BoxFlow("lr", "tb")
   * new BlockFlow("lr", "tb").getFlipFlow(); // BoxFlow("tb", "rl")
   */
  BoxFlow.prototype.getFlipFlow = function(){
    return this.isTextVertical()? Nehan.Display.getStdHoriFlow() : Nehan.Display.getStdVertFlow();
  };
  /**
   get physical box size interpreted by this box flow.

   @memberof Nehan.BoxFlow
   @param measure {int}
   @param extent {int}
   @return {Nehan.BoxSize}
   @example
   * new BoxFlow("lr", "tb").getBoxSize(100, 200); // BoxSize(100, 200)
   * new BoxFlow("tb", "rl").getBoxSize(100, 200); // BoxSize(200, 100)
   * new BoxFlow("tb", "lr").getBoxSize(100, 200); // BoxSize(200, 100)
   */
  BoxFlow.prototype.getBoxSize = function(measure, extent){
    var size = new Nehan.BoxSize(0, 0);
    size[this.getPropMeasure()] = measure;
    size[this.getPropExtent()] = extent;
    return size;
  };

  return BoxFlow;
})();

