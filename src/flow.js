var Flow = Class.extend({
  init : function(dir){
    this.dir = dir;
  },
  isValid : function(){
    return (this.dir === "lr" || this.dir === "rl" || this.dir === "tb");
  },
  isHorizontal : function(){
    return (this.dir === "lr" || this.dir === "rl");
  },
  isVertical : function(){
    return (this.dir === "tb");
  },
  isLeftToRight : function(){
    return this.dir === "lr";
  },
  isRightToLeft : function(){
    return this.dir === "rl";
  },
  reverse : function(){
    switch(this.dir){
    case "lr": return "rl";
    case "rl": return "lr";
    case "tb": return "tb"; // bottom to top not exits(maybe).
    default: return "";
    }
  }
});
