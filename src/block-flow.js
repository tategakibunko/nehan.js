var BlockFlow = (function(){
  /**
     @memberof Nehan
     @class BlockFlow
     @classdesc flow direction of block
     @constructor
     @param dir {string} - "lr" or "rl" or "tb"
     @extends Nehan.Flow
     @example
     * var bf = new BlockFlow("tb");
  */
  function BlockFlow(dir){
    Flow.call(this, dir);
  }

  Class.extend(BlockFlow, Flow);

  /**
     get flipped block direction. If direction is "tb", nothing happend.

     @memberof Nehan.BlockFlow
     @method flip
     @return {string} fliped block direction
     @example
     * new BlockFlow("tb").flip(); // => "tb" (nothing happened)
     * new BlockFlow("lr").flip(); // => "rl"
     * new BlockFlow("rl").flip(); // => "lr"
  */
  BlockFlow.prototype.flip = function(){
    switch(this.dir){
    case "lr": case "rl": return "tb";
    case "tb": return Layout.getVertBlockdir();
    default: return "";
    }
  };

  /**
     get css object

     @memberof Nehan.BlockFlow
     @method getCss
     @return {Object}
  */
  BlockFlow.prototype.getCss = function(){
    var css = {};
    if(this.isHorizontal()){
      // notice that "float" property is converted into "cssFloat" in evaluation time.
      css["css-float"] = (this.dir === "lr")? "left" : "right";
    }
    return css;
  };

  /**
     get physical directional property of logical before.

     @memberof Nehan.BlockFlow
     @method getPropBefore
     @return {string}
     @example
     * new BlockFlow("tb").getPropBefore(); // => "top"
     * new BlockFlow("lr").getPropBefore(); // => "left"
     * new BlockFlow("rl").getPropBefore(); // => "right"
  */
  BlockFlow.prototype.getPropBefore = function(){
    switch(this.dir){
    case "lr": return "left";
    case "rl": return "right";
    case "tb": return "top";
    default: return "";
    }
  };

  /**
     get physical directional property of logical before.

     @memberof Nehan.BlockFlow
     @method getPropBefore
     @return {string}
     @example
     * new BlockFlow("tb").getPropAfter(); // => "bottom"
     * new BlockFlow("lr").getPropAfter(); // => "right"
     * new BlockFlow("rl").getPropAfter(); // => "left"
  */
  BlockFlow.prototype.getPropAfter = function(){
    switch(this.dir){
    case "lr": return "right";
    case "rl": return "left";
    case "tb": return "bottom";
    default: return "";
    }
  };

  return BlockFlow;
})();

