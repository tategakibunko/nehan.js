var Layout = {
  root:"document", // 'body' or 'html' or 'document'
  direction:"vert",
  hori:"lr-tb", // sorry, rl-tb is not supported yet.
  vert:"tb-rl", // or "tb-lr"
  width: 800,
  height: 580,
  fontSize:16,
  maxFontSize:64,
  rubyRate:0.5, // used when Style.rt["font-size"] not defined.
  boldRate:0.5,
  lineRate: 2.0, // in nehan.js, extent size of line is specified by [lineRate] * [largest font_size of currentline].
  listMarkerSpacingRate:0.4, // spacing size of list item(<LI>) marker.

  // we need to specify these values(color,font-image-root) to display vertical font-images for browsers not supporting vert writing-mode.
  fontColor:"000000",
  linkColor:"0000FF",
  fontImgRoot:"http://nehan.googlecode.com/hg/char-img",

  // these font-fmailies are needed to calculate proper text-metrics.
  vertFontFamily:"'ヒラギノ明朝 Pro W3','Hiragino Mincho Pro','HiraMinProN-W3','IPA明朝','IPA Mincho', 'Meiryo','メイリオ','ＭＳ 明朝','MS Mincho', monospace",
  horiFontFamily:"'Meiryo','メイリオ','Hiragino Kaku Gothic Pro','ヒラギノ角ゴ Pro W3','Osaka','ＭＳ Ｐゴシック', monospace",
  markerFontFamily:"'Meiryo','メイリオ','Hiragino Kaku Gothic Pro','ヒラギノ角ゴ Pro W3','Osaka','ＭＳ Ｐゴシック', monospace",
  fontSizeAbs:{
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
  createRootBox : function(size){
    var box = new Box(size, null, {
      type:"body"
    });

    // set root box properties.
    box.font = this.getStdFont();
    box.flow = this.getStdBoxFlow();
    box.lineRate = this.lineRate;
    box.textAlign = "start";
    box.letterSpacing = 0;
    return box;
  },
  createBox : function(size, parent, opt){
    var box = new Box(size, parent, opt);

    // inherit parent box properties.
    box.flow = parent.flow;
    box.lineRate = parent.lineRate;
    box.textAlign = parent.textAlign;
    box.font = new Font(parent.font);
    box.color = parent.color;
    box.letterSpacing = parent.letterSpacing;
    return box;
  },
  getStdPageSize : function(){
    return new BoxSize(this.width, this.height);
  },
  getStdMeasure : function(){
    var flow = this.getStdBoxFlow();
    return this[flow.getPropMeasure()];
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
  getStdFont : function(){
    var font = new Font();
    font.family = (this.direction === "vert")? this.vertFontFamily : this.horiFontFamily;
    return font;
  },
  getListMarkerSpacingSize : function(font_size){
    font_size = font_size || this.fontSize;
    return Math.round(font_size * this.listMarkerSpacingRate);
  },
  getVertBlockDir : function(){
    return this.vert.split("-")[1];
  },
  getHoriIndir : function(){
    return this.hori.split("-")[0];
  },
  getRubyFontSize : function(base_font_size){
    var rt = Style.rt || null;
    var rt_font_size = rt? rt["font-size"] : null;
    if(rt === null || rt_font_size === null){
      return Math.round(this.rubyRate * base_font_size);
    }
    return UnitSize.getUnitSize(rt_font_size, base_font_size);
  },
  getPaletteFontColor : function(color){
    if(color.getValue().toLowerCase() !== this.fontColor.toLowerCase()){
      return color.getPaletteValue();
    }
    return this.fontColor;
  }
};
