var BlockFlow = (function(){
  function BlockFlow(dir){
    Flow.call(this, dir);
  }

  Class.extend(BlockFlow, Flow);

  BlockFlow.prototype.flip = function(){
    switch(this.dir){
    case "lr": case "rl": return "tb";
    case "tb": return Layout.getVertBlockdir();
    default: return "";
    }
  };

  // notice that "float" property is converted into "cssFloat" in evaluation time.
  BlockFlow.prototype.getCss = function(){
    var css = {};
    if(this.isHorizontal()){
      css["css-float"] = (this.dir === "lr")? "left" : "right";
    } else if(this.isVertical()){
      css["css-float"] = (this.dir === "lr")? "left" : "right";
    }
    return css;
  };

  BlockFlow.prototype.getPropBefore = function(){
    switch(this.dir){
    case "lr": return "left";
    case "rl": return "right";
    case "tb": return "top";
    default: return "";
    }
  };

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

