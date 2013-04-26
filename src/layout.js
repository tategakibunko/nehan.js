var Layout = {
  direction:"vert",
  hori:"lr-tb", // sorry, rl-tb is not supported yet.
  vert:"tb-rl", // or "tb-lr"
  width: 800,
  height: 580,
  fontSize:16,
  rubyRate:0.5,
  boldRate:0.2,
  listMarkSpacingRate:0.2,
  fontColor:"000000",
  linkColor:"0000FF",
  fontImgRoot:"http://nehan.googlecode.com/hg/char-img",
  lineRate: 2.0,
  alignedSpacingRate:0.5,
  listMarkerSpacingRate:0.5,

  createBox : function(size, parent, type){
    var box = new Box(size, parent, type);
    box.flow = parent.flow;
    box.lineRate = parent.lineRate;
    box.textAlign = parent.textAlign;
    box.fontSize = parent.fontSize;
    box.color = parent.color;
    return box;
  },
  createStdBox : function(type){
    var flow = this.getStdBoxFlow();
    var size = this.getStdPageSize();
    var box = new Box(size, null, type);
    box.flow = flow;
    box.lineRate = this.lineRate;
    box.textAlign = "start";
    box.fontSize = this.fontSize;
    box.color = this.fontColor;
    return box;
  },
  getStdPageSize : function(){
    return new BoxSize(this.width, this.height);
  },
  getStdBoxFlow : function(){
    var flow_name = this[this.direction];
    return BoxFlows.getByName(flow_name);
  },
  getStdVertFlow : function(){
    return BoxFlows.getByName(this.vert);
  },
  getStdHoriFlow : function(){
    return BoxFlows.getByName(this.hori);
  },
  getAlignedSpacingSize : function(){
    return Math.floor(this.fontSize * this.alignedSpacingRate);
  },
  getListMarkerSpacingSize : function(font_size){
    return Math.floor(font_size * this.listMarkerSpacingRate);
  },
  getVertBlockDir : function(){
    return this.vert.split("-")[1];
  },
  getHoriIndir : function(){
    return this.hori.split("-")[0];
  }
};
