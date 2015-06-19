var InlineFlow = (function(){
  /**
     @memberof Nehan
     @class InlineFlow
     @classdesc flow abstraction at inline level.
     @constructor
     @extends {Nehan.Flow}
     @param dir {String} - "lr" or "rl"(but not supported) or "tb"
   */
  function InlineFlow(dir){
    Nehan.Flow.call(this, dir);
  }
  Nehan.Class.extend(InlineFlow, Nehan.Flow);

  /**
     @memberof Nehan.InlineFlow
     @return {String}
     @example
     * new InlineFlow("lr").getPropStart(); // "left"
     * new InlineFlow("rl").getPropStart(); // "right"
     * new InlineFlow("tb").getPropStart(); // "top"
  */
  InlineFlow.prototype.getPropStart = function(){
    switch(this.dir){
    case "lr": return "left";
    case "rl": return "right";
    case "tb": return "top";
    default: return "";
    }
  };

  /**
     @memberof Nehan.InlineFlow
     @return {String}
     @example
     * new InlineFlow("lr").getPropEnd(); // "right"
     * new InlineFlow("rl").getPropEnd(); // "left"
     * new InlineFlow("tb").getPropEnd(); // "bottom"
  */
  InlineFlow.prototype.getPropEnd = function(){
    switch(this.dir){
    case "lr": return "right";
    case "rl": return "left";
    case "tb": return "bottom";
    default: return "";
    }
  };

  return InlineFlow;
})();

