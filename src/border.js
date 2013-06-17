var Border = Edge.extend({
  init : function(){
    this._super("border");
  },
  clearBefore : function(flow){
    this.setBefore(flow, 0);
    if(this.radius){
      this.radius.clearBefore(flow);
    }
  },
  clearAfter : function(flow){
    this.setAfter(flow, 0);
    if(this.radius){
      this.radius.clearAfter(flow);
    }
  },
  getDirProp : function(dir){
    return ["border", dir, "width"].join("-");
  },
  setRadius : function(flow, radius){
    this.radius = new BorderRadius();
    this.radius.setSize(flow, radius);
  },
  setColor : function(flow, color){
    this.color = new BorderColor();
    this.color.setColor(flow, color);
  },
  setStyle : function(flow, style){
    this.style = new BorderStyle();
    this.style.setStyle(flow, style);
  },
  getCss : function(){
    var css = this._super();
    if(this.radius){
      Args.copy(css, this.radius.getCss());
    }
    if(this.color){
      Args.copy(css, this.color.getCss());
    }
    if(this.style){
      Args.copy(css, this.style.getCss());
    }
    return css;
  }
});
