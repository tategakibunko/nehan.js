var Layout = {
  // define root where content text starts from.
  // 'body' or 'html' or 'document' are enabled.
  // 
  // 1. 'document'
  //    <!doctype xxx> tag is included in content text.
  // 2. 'html'
  //    <head> and <html> are included in content text.
  // 3. 'body'
  //    <body> or content of body itself is included in content text.
  root:"document",
  direction:"vert", // or 'hori'
  boxFlow:{
    hori:"lr-tb", // used when direction is 'hori'. notice that rl-tb is not supported yet.
    vert:"tb-rl", // used when direction is 'vert'. "tb-lr" is also supported.
  },
  pagingDirection:{
    hori:"lr", // paging direction 'left to right'
    vert:"rl"  // paging direction 'right to left'
  },
  width: screen.width, // root width, used when style.body.width not defined.
  height: screen.height, // root height, used when style.body.height not defined.
  fontSize:16, // root fontSize, used when style.body["font-size"] not defined.
  minFontSize:12,
  maxFontSize:64,
  minTableCellSize:32, // if table-layout is set to 'auto', all sizes of cell are larger than this value.
  rubyRate:0.5, // used when Style.rt["font-size"] is not defined.
  boldRate:0.5, // used to calculate sketchy bold metrics in the environment with no canvas element.
  lineRate: 2.0, // in nehan.js, extent size of line is specified by [lineRate] * [max-font-size of current-line].
  vertWordSpaceRate: 0.25, // extra space rate for vertical word in vertical mode.

  // we need to specify these values(color,font-image-root) to display vertical font-images for browsers not supporting vert writing-mode.
  fontColor:"000000",
  linkColor:"0000FF",
  fontImgRoot:"http://nehan.googlecode.com/hg/char-img",

  // font name is required to be managed to calculate proper text-metrics.
  fontFamily:"'ヒラギノ明朝 Pro W3','Hiragino Mincho Pro','HiraMinProN-W3','IPA明朝','IPA Mincho', 'Meiryo','メイリオ','ＭＳ 明朝','MS Mincho', monospace",
  //fontFamily:"'Meiryo','メイリオ','Hiragino Kaku Gothic Pro','ヒラギノ角ゴ Pro W3','Osaka','ＭＳ Ｐゴシック', monospace",

  // font sizes defined by name
  fontSizeNames:{
    "xx-large":"33px",
    "x-large":"24px",
    "large":"18px",
    "medium":"16px",
    "small":"13px",
    "x-small":"10px",
    "xx-small":"8px",
    "larger":"1.2em",
    "smaller":"0.8em"
  },
  getMeasure : function(flow){
    return this[flow.getPropMeasure()];
  },
  getExtent : function(flow){
    return this[flow.getPropExtent()];
  },
  getPagingDirection : function(){
    return this.pagingDirection[this.direction];
  },
  getStdBoxFlow : function(){
    var flow_name = this.boxFlow[this.direction];
    return BoxFlows.getByName(flow_name);
  },
  getStdVertFlow : function(){
    return BoxFlows.getByName(this.boxFlow.vert);
  },
  getStdHoriFlow : function(){
    return BoxFlows.getByName(this.boxFlow.hori);
  },
  getRtFontSize : function(base_font_size){
    var rt = Style.rt || null;
    var rt_font_size = rt? rt["font-size"] : null;
    if(rt === null || rt_font_size === null){
      return Math.round(this.rubyRate * base_font_size);
    }
    return StyleContext.prototype._computeUnitSize.call(this, rt_font_size, base_font_size);
  },
  getPaletteFontColor : function(color){
    if(color.getValue().toLowerCase() !== this.fontColor.toLowerCase()){
      return color.getPaletteValue();
    }
    return this.fontColor;
  }
};

