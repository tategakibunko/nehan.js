var BlockFlow = Flow.extend({
  init : function(dir, multicol){
    this._super(dir);
    this.multicol = multicol || false;
  },
  flip : function(){
    switch(this.dir){
    case "lr": case "rl": return "tb";
    case "tb": return Layout.getVertBlockdir();
    default: return "";
    }
  },
  getCss : function(){
    var css = {};
    if(this.isHorizontal()){
      css["float"] = (this.dir === "lr")? "left" : "right";
    } else if(this.isVertical() && this.multicol){
      css["float"] = (Layout.getHoriIndir() === "lr")? "left" : "right";
    }
    return css;
  },
  getPropBefore : function(){
    switch(this.dir){
    case "lr": return "left";
    case "rl": return "right";
    case "tb": return "top";
    default: return "";
    }
  },
  getPropAfter : function(){
    switch(this.dir){
    case "lr": return "right";
    case "rl": return "left";
    case "tb": return "bottom";
    default: return "";
    }
  }
});
