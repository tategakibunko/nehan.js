var InlineFlow = Flow.extend({
  init : function(dir){
    this._super(dir);
  },
  getPropStart : function(){
    switch(this.dir){
    case "lr": return "left";
    case "rl": return "right";
    case "tb": return "top";
    default: return "";
    }
  },
  getPropEnd : function(){
    switch(this.dir){
    case "lr": return "right";
    case "rl": return "left";
    case "tb": return "bottom";
    default: return "";
    }
  }
});
