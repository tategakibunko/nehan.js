var Border = Edge.extend({
  init : function(){
    this._super("border");
    this.borderRadius = new BorderRadius();
  },
  setRadius : function(value){
    this.borderRadius.setAll(value);
  },
  setRadiusStartBefore : function(flow, hori, vert){
    this.borderRadius.setStartBefore(flow, hori, vert);
  },
  setRadiusStartAfter : function(flow, hori, vert){
    this.borderRadius.setStartAfter(flow, hori, vert);
  },
  setRadiusEndBefore : function(flow, hori, vert){
    this.borderRadius.setEndBefore(flow, hori, vert);
  },
  setRadiusEndAfter : function(flow, hori, vert){
    this.borderRadius.setEndAfter(flow, hori, vert);
  },
  clearBefore : function(flow){
    this.setBefore(flow, 0);
    this.borderRadius.clearBefore(flow);
  },
  clearAfter : function(flow){
    this.setAfter(flow, 0);
    this.borderRadius.clearAfter(flow);
  },
  getDirProp : function(dir){
    return ["border", dir, "width"].join("-");
  },
  setSize : function(flow, size){
    this._super(flow, size);
    if(size.radius){
      this.borderRadius.setSize(flow, size.radius);
    }
  },
  getCss : function(){
    var css = this._super();
    return Args.copy(css, this.borderRadius.getCss());
  }
});
