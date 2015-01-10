var BoxFlow = (function(){
  /**
     @memberof Nehan
     @class BoxFlow
     @classdesc abstract inline and block direction
     @constructor
     @param indir {string} - "lr" or "tb"("rl" not supported yet)
     @param blockdir {string} - "tb" or "lr" or "rl"
  */
  function BoxFlow(indir, blockdir){
    this.inflow = new InlineFlow(indir);
    this.blockflow = new BlockFlow(blockdir);
  }

  BoxFlow.prototype = {
    /**
       @memberof Nehan.BoxFlow
       @return {boolean}
    */
    isTextLineFirst : function(){
      if(this.isTextVertical() && this.blockflow.isLeftToRight()){
	return true;
      }
      return false;
    },
    /**
       @memberof Nehan.BoxFlow
       @return {boolean}
    */
    isBlockflowVertical : function(){
      return this.blockflow.isVertical();
    },
    /**
       @memberof Nehan.BoxFlow
       @return {boolean}
    */
    isTextVertical : function(){
      return this.inflow.isVertical();
    },
    /**
       @memberof Nehan.BoxFlow
       @return {boolean}
    */
    isTextHorizontal : function(){
      return this.inflow.isHorizontal();
    },
    /**
       @memberof Nehan.BoxFlow
       @return {Object}
    */
    getCss : function(){
      var css = {};
      Args.copy(css, this.blockflow.getCss());
      return css;
    },
    /**
       @memberof Nehan.BoxFlow
       @return {string}
       @example
       * new BlockFlow("tb", "rl").getName(); // "tb-rl"
       * new BlockFlow("lr", "tb").getName(); // "lr-tb"
    */
    getName : function(){
      return [this.inflow.dir, this.blockflow.dir].join("-");
    },
    /**
       @memberof Nehan.BoxFlow
       @return {String}
       @example
       * new BlockFlow("tb", "rl").getTextHorizontalDir(); // "rl"
       * new BlockFlow("tb", "lr").getTextHorizontalDir(); // "lr"
       * new BlockFlow("lr", "tb").getTextHorizontalDir(); // "" (empty)
    */
    getTextHorizontalDir : function(){
      if(this.isTextHorizontal()){
	return this.inflow.dir;
      }
      return "";
    },
    /**
       get physical property name from logical property.
       @memberof Nehan.BoxFlow
       @param prop {string} - logical direction name
       @return {string}
       @example
       * new BlockFlow("tb", "rl").getProp("start"); // "top"
       * new BlockFlow("lr", "tb").getProp("end"); // "right"
    */
    getProp : function(prop){
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
    },
    /**
       @memberof Nehan.BoxFlow
       @return {string}
    */
    getPropStart : function(){
      return this.inflow.getPropStart();
    },
    /**
       @memberof Nehan.BoxFlow
       @return {string}
    */
    getPropEnd : function(){
      return this.inflow.getPropEnd();
    },
    /**
       @memberof Nehan.BoxFlow
       @return {string}
    */
    getPropBefore : function(){
      return this.blockflow.getPropBefore();
    },
    /**
       @memberof Nehan.BoxFlow
       @return {string}
    */
    getPropAfter : function(){
      return this.blockflow.getPropAfter();
    },
    /**
       @memberof Nehan.BoxFlow
       @return {string}
    */
    getPropExtent : function(){
      return this.isTextVertical()? "width" : "height";
    },
    /**
       @memberof Nehan.BoxFlow
       @return {string}
    */
    getPropMeasure : function(){
      return this.isTextVertical()? "height" : "width";
    },
    /**
       @memberof Nehan.BoxFlow
       @return {string}
    */
    getPropWidth : function(){
      return this.isTextVertical()? "extent" : "measure";
    },
    /**
       @memberof Nehan.BoxFlow
       @return {string}
    */
    getPropHeight : function(){
      return this.isTextVertical()? "measure" : "extent";
    },
    /**
       get flipped box flow, but result depends on setting of Display.boxFlow.

       @memberof Nehan.BoxFlow
       @return {Nehan.BoxFlow}
       @example
       * // if  Display.boxFlow.hori = "lr-tb"
       * // and Display.boxFlow.vert = "tb-rl"
       * new BlockFlow("tb", "rl").getFlipFlow(); // BoxFlow("lr", "tb")
       * new BlockFlow("lr", "tb").getFlipFlow(); // BoxFlow("tb", "rl")
    */
    getFlipFlow : function(){
      return this.isTextVertical()? Display.getStdHoriFlow() : Display.getStdVertFlow();
    },
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
    getBoxSize : function(measure, extent){
      var size = new BoxSize(0, 0);
      size[this.getPropMeasure()] = measure;
      size[this.getPropExtent()] = extent;
      return size;
    }
  };

  return BoxFlow;
})();

